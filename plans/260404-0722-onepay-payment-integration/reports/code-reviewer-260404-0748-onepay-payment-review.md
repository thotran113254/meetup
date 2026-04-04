# OnePay Payment Integration Review

**Reviewer:** code-reviewer | **Date:** 2026-04-04 | **Scope:** 15 files, ~600 LOC

## Overall Assessment

The implementation is architecturally sound and closely mirrors the reference NestJS backend. HMAC-SHA256 hash signing/verification, IPN plain-text responses, idempotent status updates, and the overall data flow are all correct. A few issues found, one critical (broken retry link), one high (zero-amount bypass), and several medium/informational.

---

## CRITICAL Issues

### C1. Retry link uses UUID instead of slug — always 404s

**File:** `src/components/sections/tour-checkout/tour-checkout-result-content.tsx:75`
```tsx
href={`/tours/checkout?slug=${booking.tourPackageId}`}
```

`booking.tourPackageId` is a UUID. The checkout page (`/tours/checkout`) does `getTourPackageBySlug(slug)` which queries by `tourPackages.slug`. A UUID will never match a slug, so "Try Again" always returns 404.

**Fix options (pick one):**
1. Store `tourSlug` in the bookings table and use it here.
2. Look up the tour by ID to get its slug at render time (adds a query).
3. Change the booking creation to also store `tourSlug`:
   - Add `tourSlug text("tour_slug")` to `bookings` schema
   - Set it in `checkout-action.ts` from `tour.slug`
   - Use `booking.tourSlug` in the retry link

Option 1/3 is preferred (single source of truth, no extra query).

---

## HIGH Priority

### H1. Zero-amount booking bypass — server allows $0 payment

**File:** `src/lib/validations/booking-schema.ts:28` + `checkout-action.ts:40-49`

The server schema requires `lineItems: z.array(lineItemSchema).min(1)` but `lineItemSchema` allows `count: 0`. A crafted request like:
```json
{ "lineItems": [{ "label": "Adult", "price": 28, "count": 0 }], ... }
```
passes validation, produces `totalUsdCents = 0`, `totalVnd = 0`, `vpc_Amount = 0`. OnePay may reject or (worse) accept a zero-amount payment.

**Fix:** Add a refinement to the schema or a guard in the action:
```ts
// Option A: schema refinement
lineItems: z.array(lineItemSchema).min(1).refine(
  (items) => items.some(i => i.count > 0),
  "At least one guest with count > 0 required"
),

// Option B: guard in checkout-action.ts after line 50
if (totalUsdCents <= 0) {
  return { success: false, message: "Order total must be greater than zero." };
}
```

### H2. No timing-safe comparison for HMAC hash verification

**File:** `src/lib/payments/onepay-hash.ts:44`
```ts
return computed === receivedHash.toUpperCase();
```

String `===` comparison is vulnerable to timing attacks. An attacker could theoretically probe the hash character-by-character. The backend has the same vulnerability but that does not make it acceptable.

**Fix:**
```ts
import { timingSafeEqual } from "crypto";

export function verifyOnepayHash(params: Record<string, string>, secureSecretHex: string): boolean {
  const receivedHash = params.vpc_SecureHash;
  if (!receivedHash) return false;
  const computed = signOnepayParams(params, secureSecretHex);
  const a = Buffer.from(computed);
  const b = Buffer.from(receivedHash.toUpperCase());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

**Practical risk:** Low for OnePay (server-to-server, limited retries), but it is a security best practice for all HMAC verification.

---

## MEDIUM Priority

### M1. IPN returns `responsecode=0` when booking not found but hash is valid

**File:** `src/app/api/payments/onepay/ipn/route.ts:36-39`

The backend (`updateIPNOrder:648`) also returns `responsecode=0&desc=confirm-fail` when the order is not found. So this matches. However, our implementation returns confirm-fail even when hash is verified but booking is missing. This is correct behavior -- confirmed match with backend.

No change needed, just documenting the verification.

### M2. Result page exposes PII without authentication

**File:** `src/app/(website)/tours/checkout/result/page.tsx:21`

Anyone with a booking code can view customer name, email, WhatsApp. Booking codes have 32 bits of entropy (8 hex chars) -- not trivially brute-forceable but the code appears in URLs, browser history, OnePay redirect logs.

**Recommendation:** This is acceptable for MVP but consider:
- Increasing entropy to 12-16 hex chars (48-64 bits) via `randomBytes(6)` or `randomBytes(8)`
- Adding a short-lived session token for result page access

### M3. Hardcoded VND exchange rate

**File:** `src/lib/constants/payment-constants.ts:2`
```ts
export const VND_RATE = 16500;
```

The backend uses a dynamic `curencyService.serviceGetOne('vnd')` call. Our implementation hardcodes 16500. This is acknowledged in the plan and acceptable for initial launch, but will drift from actual exchange rates.

**Recommendation:** Move to DB/env config: `VND_RATE = parseInt(process.env.VND_RATE || "16500")`

### M4. Hardcoded service items in checkout UI

**File:** `src/components/sections/tour-checkout/tour-checkout-content.tsx:25-29`

```ts
const INITIAL_SERVICES: ServiceItem[] = [
  { label: "Vip Private tour", price: 10, count: 0, ... },
  ...
];
```

Prices hardcoded in client component. Should come from tour data or CMS. Lower priority since the backend also prices services separately.

### M5. `lineItems.min(1)` validation mismatch with client filter

**File:** `src/lib/validations/booking-schema.ts:28` vs `tour-checkout-content.tsx:126`

Client filters `quantities.filter(q => q.count > 0)` before sending. If user selects zero quantities for all items, the filtered array is empty, and the server rejects with "At least one guest required". This is the correct behavior, but the error message goes to the form's `submitError` state -- not to a field-level error. Acceptable UX, just noting.

---

## LOW Priority

### L1. Booking code collision (theoretical)

`randomBytes(4)` gives 2^32 possibilities. At scale (>50k bookings), collision probability exceeds 1 in 1M (birthday paradox). The `code` column has a unique constraint, so Drizzle will throw on collision, but the error is caught as a generic "system error" in the action.

**Long-term fix:** Use `randomBytes(8)` for 64-bit codes.

### L2. IPN JSON fallback may never be needed

**File:** `src/app/api/payments/onepay/ipn/route.ts:21-25`

The JSON fallback branch is defensive coding. OnePay always sends `application/x-www-form-urlencoded`. Not harmful, just dead code.

---

## Hash Algorithm Verification (CRITICAL CHECK -- PASSED)

| Aspect | Backend (order.service.ts) | Our implementation | Match |
|--------|--------------------------|-------------------|-------|
| Algorithm | HMAC-SHA256 | HMAC-SHA256 | YES |
| Key derivation | `Buffer.from(secret, 'hex')` | `Buffer.from(secretHex, 'hex')` | YES |
| Sort | `Object.keys().sort()` | `Object.keys().sort()` | YES |
| Filter | `vpc_*` and `user_*` only | `vpc_*` and `user_*` only | YES |
| Exclude | `vpc_SecureHash` + null values | `vpc_SecureHash` + null values | YES |
| Join | `key=value&` then `slice(0,-1)` | `.map(k=v).join('&')` | YES (equivalent) |
| Output | `.digest('hex').toUpperCase()` | `.digest('hex').toUpperCase()` | YES |
| URL params | `encodeURIComponent` | `encodeURIComponent` | YES |
| Hash appended last | Yes (`vpc_SecureHash=` at end) | Yes (`queryParts.push`) | YES |

## IPN Handler Verification (PASSED)

| Aspect | Backend | Our implementation | Match |
|--------|---------|-------------------|-------|
| Response format | plain text `responsecode=X&desc=Y` | plain text `responsecode=X&desc=Y` | YES |
| HTTP status | 200 always (implicit NestJS) | 200 always (explicit) | YES |
| Body parsing | form-urlencoded | form-urlencoded (+ JSON fallback) | YES |
| Idempotent | skips if `status == 'success'` | skips if `status !== SUCCESS` | YES |
| Logs transaction first | `Promise.all([findOrder, addTransaction])` | `addPaymentTransaction()` before verify | YES |
| Success code check | `vpc_TxnResponseCode == 0` (loose) | `=== "0"` (strict, safer) | YES |

## Return URL Verification (PASSED)

| Aspect | Backend | Our implementation | Match |
|--------|---------|-------------------|-------|
| Method | GET | GET | YES |
| Hash verification | Same HMAC-SHA256 | Same (shared handler) | YES |
| Redirect on success | yes (to callback URL) | yes (to `/tours/checkout/result`) | YES |
| Updates booking | yes | yes (shared handler) | YES |

## Security Verification

| Check | Status | Notes |
|-------|--------|-------|
| No secrets in client code | PASS | `onepay-config.ts` only imported in server files |
| No `NEXT_PUBLIC_` OnePay vars | PASS | All OnePay env vars are server-only |
| IPN/return routes have no auth | PASS (correct) | Security via HMAC hash verification |
| Hash verification on all callbacks | PASS | Both IPN and return verify before status update |
| SQL injection via booking code | PASS | Drizzle ORM parameterizes queries |
| `.env.example` uses test credentials | PASS | `TESTONEPAY` merchant, MTF (test) URL |

---

## Recommended Actions (Prioritized)

1. **[CRITICAL] Fix retry link** -- store `tourSlug` in bookings table, use in result page
2. **[HIGH] Add zero-amount guard** -- reject bookings where total <= 0
3. **[HIGH] Use timing-safe comparison** for HMAC hash verification
4. **[MEDIUM] Increase booking code entropy** to 6-8 bytes for safety at scale
5. **[LOW] Consider dynamic VND rate** from env/DB

## Unresolved Questions

- Is `messenger` field intentionally required (`min(10)`) in the booking schema? The checkout form has it as a text input with "Message must be at least 10 characters". The backend schema uses `messager` (typo preserved from legacy). Confirm this is the intended behavior.
- Are the hardcoded pickup points and tour options in the checkout UI temporary or will they be CMS-driven?
