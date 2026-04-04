# OnePay Payment Integration -- Deep Edge-Case Review

**Reviewer**: code-reviewer | **Date**: 2026-04-04 | **Pass**: 2 (production-readiness)

## Edge-Case Verdicts

| # | Scenario | Verdict | Detail |
|---|----------|---------|--------|
| **Payment Flow** | | | |
| 1 | Double-click submit | **FAIL** | `submitting` flag is client-only state. Fast double-click fires two `submitCheckout` server actions concurrently. Both INSERT succeed with different booking codes, user gets two bookings but only one payment URL. **Fix**: Add DB unique constraint on `(tourSlug, customerEmail, departureDate)` with short TTL window, OR return early in server action if a `processing` booking already exists for same customer+tour+date within last 60s. |
| 2 | Browser back after payment | **PASS** | Return handler is idempotent -- `processOnepayCallback` checks `booking.status !== SUCCESS` before updating. Revisiting the return URL re-processes but won't downgrade. Result page is a server component that reads fresh DB state. |
| 3 | IPN arrives before return redirect | **WARN** | Both call `processOnepayCallback` which is guarded by `if (booking.status !== SUCCESS)`. However this is a **read-then-write race**: two concurrent requests both read `status=processing`, both enter the `if`, both call `updateBookingStatus`. The second UPDATE is harmless (same data) but `addPaymentTransaction` inserts duplicate audit rows. Not a data-loss bug, but noisy audit log. **Fix**: Use `UPDATE ... WHERE status != 'success' RETURNING *` as atomic CAS, or add a `SELECT FOR UPDATE`. |
| 4 | IPN never arrives | **PASS** | Return handler also calls `processOnepayCallback` and updates status. User sees correct result. |
| 5 | Extra OnePay params | **PASS** | `verifyOnepayHash` filters to `vpc_*` and `user_*` keys only. Extra params ignored in hash, passed through to `paymentData` JSON (harmless). |
| 6 | Network timeout after DB insert | **WARN** | Booking created with `processing` status, but client never receives `paymentUrl`. User sees generic error, has no way to find their booking or retry payment. Orphaned `processing` bookings accumulate. **Suggestion**: Add a "check existing booking" step in `submitCheckout` -- if a `processing` booking exists for same customer+tour+date, return its payment URL instead of creating a new one. |
| 7 | Booking code collision | **PASS** | `randomBytes(4)` = 4.3 billion combinations. DB has `unique` constraint on `code`. If collision occurs, INSERT throws and catch block returns generic error. Acceptable at current scale. |
| 8 | Large VND amounts overflow | **FAIL** | `vpc_Amount = amountVnd * 100`. For a $5000 tour: `totalVnd = 5000 * 16500 = 82,500,000`, then `vpc_Amount = 8,250,000,000`. This exceeds `Number.MAX_SAFE_INTEGER`? No -- `MAX_SAFE_INTEGER` is ~9 quadrillion, so arithmetic is safe. However, `totalVnd` column is `bigint({mode:"number"})` and `totalUsd` is `integer` (max 2,147,483,647 cents = ~$21M). Both safe for realistic tour prices. **PASS** on second analysis. |
| 9 | Concurrent IPN callbacks | **WARN** | Same as #3. OnePay retries hit the read-then-write window. Duplicate `paymentTransactions` rows created. Functionally harmless but audit trail is noisy. |
| **Checkout UI** | | | |
| 10 | Tour deleted between load and submit | **PASS** | Server action re-fetches tour: `if (!tour \|\| !tour.published) return error`. User sees Vietnamese error message. |
| 11 | Empty lineItems after filter | **FAIL** | Client filters `quantities.filter(q => q.count > 0)`. If all counts are 0, `lineItems` is `[]`. Server schema says `lineItems: z.array().min(1)` -- validation catches this and returns error. However, the **client-side** `checkoutFormSchema` has NO lineItems field at all, so `handleSubmit` passes without checking quantities. User clicks "Book now", waits for server round-trip, then sees error. **Fix**: Add client-side validation that `totalUsd > 0` before calling submit. Currently the server also checks `totalUsdCents <= 0` at line 52. So data-safe, but bad UX. |
| 12 | Price mismatch client vs server | **PASS** | Client computes `totalUsd` for display only. Server recomputes from `lineItems[].price * count`. Both use same input data. No trust issue -- server is authoritative. |
| 13 | Tour without pricingOptions | **PASS** | `derivePricingItems` falls back to `[{label:"Adult", price: tour.price \|\| 28, count:0}]`. Works, though hardcoded `$28` fallback is questionable business logic. |
| 14 | Past date selection | **FAIL** | No validation anywhere that `departureDate` is in the future. Schema only checks `min(1)` (non-empty string). User can book a tour for yesterday. Calendar component defaults to `new Date()` (today) but nothing prevents selecting past dates. **Fix**: Add `.refine(d => new Date(d) >= todayStart, "Date must be in the future")` to `createBookingSchema.departureDate`. |
| 15 | Form state after failed submit | **PASS** | `setSubmitting(false)` called in else branch. Error displayed via `submitError` state. User can retry. |
| **IPN/Return Handlers** | | | |
| 16 | Malformed IPN body (missing vpc_OrderInfo) | **WARN** | `bookingCode = params.vpc_OrderInfo \|\| null`. If null, `addPaymentTransaction` is skipped (line 32 guard), then `verified=true` but `bookingFound=false`. IPN returns `confirm-fail`. No crash, but the malformed callback is silently lost -- no audit trail at all. **Fix**: Log malformed IPNs even when bookingCode is null. |
| 17 | IPN for non-existent booking | **PASS** | Transaction logged via `addPaymentTransaction`, then `bookingFound: false` returned. IPN responds `confirm-fail`. |
| 18 | Tampered return URL params | **PASS** | `verifyOnepayHash` uses HMAC-SHA256 with timing-safe comparison. Tampered params fail hash check. User redirected to result page with `error=invalid_hash`. |
| **Admin** | | | |
| 19 | Cancel already-cancelled booking | **PASS** | `cancelBooking` checks `booking.status === SUCCESS` to block, but does NOT check `CANCELLED`. So re-cancelling a cancelled booking just re-sets status to `cancelled` -- idempotent, no harm. |
| 20 | Admin view with 0 bookings | **PASS** | Table renders "Chua co don hang nao" empty state. |
| 21 | Null paymentData in detail dialog | **PASS** | Dialog doesn't render `paymentData` at all -- only shows structured booking fields. |
| **Data Integrity** | | | |
| 22 | Cents vs display | **PASS** | `totalUsd` stored as cents. All display sites use `/ 100`: result page line 62, admin table line 92, admin dialog line 94. Consistent. |
| 23 | Hardcoded VND_RATE | **WARN** | `VND_RATE = 16500` is hardcoded. Backend reference uses dynamic `curencyService.serviceGetOne('vnd')`. Acceptable for MVP but will cause price drift as exchange rate changes. |

## Critical Issues (blocking)

### C1. Double-submit creates duplicate bookings (#1)
- **File**: `src/app/(website)/tours/checkout/checkout-action.ts`
- **Risk**: Real money loss -- two bookings created, one paid, one orphaned
- **Fix**: Before INSERT (line 60), query for existing `processing` booking with same `tourSlug + customerEmail + departureDate` created within last 5 minutes. If found, return its payment URL.

### C2. No past-date validation (#14)
- **File**: `src/lib/validations/booking-schema.ts:24`
- **Risk**: Bookings for past dates cause operational confusion
- **Fix**: Add `.refine()` to `departureDate` field checking `>= today`

## High Priority

### H1. IPN/Return race creates duplicate audit rows (#3, #9)
- **File**: `src/lib/payments/onepay-response-handler.ts:53`
- **Fix**: Use atomic UPDATE: `UPDATE bookings SET status=$1 WHERE code=$2 AND status != 'success' RETURNING *`

### H2. Orphaned bookings on network timeout (#6)
- **File**: `src/app/(website)/tours/checkout/checkout-action.ts`
- **Fix**: Reuse existing `processing` booking (same fix as C1 addresses this too)

## Informational (non-blocking)

- Empty lineItems requires server round-trip to catch (#11) -- bad UX but safe
- Malformed IPN with no bookingCode leaves no audit trail (#16) -- add logging
- Hardcoded VND_RATE (#23) -- acceptable for MVP, document plan to make dynamic
- Sidebar shows "Children:" label with messenger content (#sidebar line 108-109) -- minor UI bug, should show "Messenger:" label

---

**Status:** DONE
**Summary:** 2 critical (double-submit, past-date), 2 high (race condition, orphaned bookings), 4 informational. Payment hash and core flow are sound.
