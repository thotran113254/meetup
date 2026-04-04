# Phase 4: Payment API Routes

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 2h
- **Depends on**: Phase 1 (DB queries) + Phase 2 (hash verification)

Two API routes that OnePay calls after payment:
1. **IPN (Instant Payment Notification)**: Server-to-server POST from OnePay -> verify hash -> update booking
2. **Return URL**: Browser GET redirect -> verify hash -> redirect user to result page

## Key Insights (from backend `updateIPNOrder` + `updateThankOrder`)

- IPN must return plain text `responsecode=1&desc=confirm-success` (not JSON)
- IPN may arrive before OR after the return redirect — both must handle status update idempotently
- Return URL: OnePay appends all vpc_* params as query string -> verify -> redirect to our result page
- `vpc_TxnResponseCode == "0"` means success; anything else is failure
- Must record transaction in `paymentTransactions` for audit regardless of success/failure
- If booking already `success`, IPN should still return `responsecode=1` (idempotent)

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/api/payments/onepay/ipn/route.ts` | POST handler for OnePay IPN callback |
| `src/app/api/payments/onepay/return/route.ts` | GET handler for OnePay browser return redirect |
| `src/lib/payments/onepay-response-handler.ts` | Shared logic: verify hash + update booking status |

## Data Flow

### IPN Flow
```
OnePay POST /api/payments/onepay/ipn
  -> Parse form body (vpc_* params)
  -> Log transaction to payment_transactions table
  -> verifyOnepayHash(params, secret)
     -> FAIL: return "responsecode=0&desc=confirm-fail"
  -> Find booking by vpc_OrderInfo (= booking code)
     -> NOT FOUND: return "responsecode=0&desc=confirm-fail"
  -> If booking.status != "success":
     -> vpc_TxnResponseCode == "0": update status to "success"
     -> else: update status to "payfail"
     -> Store paymentData (full response) on booking
  -> return "responsecode=1&desc=confirm-success"
```

### Return Flow
```
OnePay GET /api/payments/onepay/return?vpc_OrderInfo=BK-xxx&vpc_TxnResponseCode=0&vpc_SecureHash=ABC...
  -> Parse searchParams
  -> Log transaction to payment_transactions table
  -> verifyOnepayHash(params, secret)
     -> FAIL: redirect to /tours/checkout/result?code=BK-xxx&error=invalid_hash
  -> Find booking by vpc_OrderInfo
  -> If booking.status != "success":
     -> vpc_TxnResponseCode == "0": update status to "success"
     -> else: update status to "payfail"
  -> Redirect to /tours/checkout/result?code=BK-xxx
```

## Implementation Steps

### Step 1: Create `src/lib/payments/onepay-response-handler.ts`

Shared logic used by both IPN and return routes:

```typescript
import { getOnepayConfig } from "./onepay-config";
import { verifyOnepayHash } from "./onepay-hash";
import { getBookingByCode, updateBookingStatus, addPaymentTransaction } from "@/db/queries/booking-queries";
import { BOOKING_STATUS, ONEPAY_SUCCESS_CODE } from "@/lib/constants/payment-constants";

export type OnepayProcessResult = {
  verified: boolean;
  bookingCode: string | null;
  bookingFound: boolean;
  newStatus: string | null;
};

/**
 * Process OnePay callback params:
 * 1. Log transaction
 * 2. Verify hash
 * 3. Update booking if not already success
 */
export async function processOnepayCallback(
  params: Record<string, string>,
): Promise<OnepayProcessResult> {
  const bookingCode = params.vpc_OrderInfo || null;

  // Always log transaction for audit
  if (bookingCode) {
    await addPaymentTransaction(bookingCode, "onepay", params);
  }

  // Verify hash
  const config = getOnepayConfig();
  const verified = verifyOnepayHash(params, config.secureSecret);
  if (!verified) {
    return { verified: false, bookingCode, bookingFound: false, newStatus: null };
  }

  // Find booking
  if (!bookingCode) {
    return { verified: true, bookingCode: null, bookingFound: false, newStatus: null };
  }
  const booking = await getBookingByCode(bookingCode);
  if (!booking) {
    return { verified: true, bookingCode, bookingFound: false, newStatus: null };
  }

  // Update status if not already success (idempotent)
  if (booking.status !== BOOKING_STATUS.SUCCESS) {
    const newStatus = params.vpc_TxnResponseCode === ONEPAY_SUCCESS_CODE
      ? BOOKING_STATUS.SUCCESS
      : BOOKING_STATUS.PAYFAIL;
    await updateBookingStatus(bookingCode, newStatus, params, params.vpc_MerchTxnRef);
    return { verified: true, bookingCode, bookingFound: true, newStatus };
  }

  return { verified: true, bookingCode, bookingFound: true, newStatus: BOOKING_STATUS.SUCCESS };
}
```

### Step 2: Create `src/app/api/payments/onepay/ipn/route.ts`

```typescript
import { NextRequest } from "next/server";
import { processOnepayCallback } from "@/lib/payments/onepay-response-handler";

/**
 * OnePay IPN (Instant Payment Notification) — server-to-server POST.
 * No auth required — OnePay sends this directly.
 * Must return plain text response (not JSON).
 */
export async function POST(request: NextRequest) {
  try {
    // OnePay sends form-urlencoded body
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = String(value);
    });

    // Also handle JSON body as fallback
    if (Object.keys(params).length === 0) {
      const body = await request.json().catch(() => ({}));
      Object.entries(body).forEach(([key, value]) => {
        params[key] = String(value);
      });
    }

    console.log("[OnePay IPN] Received:", params.vpc_OrderInfo, "TxnResponse:", params.vpc_TxnResponseCode);

    const result = await processOnepayCallback(params);

    if (!result.verified || !result.bookingFound) {
      return new Response("responsecode=0&desc=confirm-fail", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("responsecode=1&desc=confirm-success", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("[OnePay IPN] Error:", error);
    return new Response("responsecode=0&desc=confirm-fail", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
```

### Step 3: Create `src/app/api/payments/onepay/return/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { processOnepayCallback } from "@/lib/payments/onepay-response-handler";

/**
 * OnePay Return URL — browser GET redirect after payment.
 * Verifies hash, updates booking, redirects to result page.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log("[OnePay Return] Received:", params.vpc_OrderInfo, "TxnResponse:", params.vpc_TxnResponseCode);

    const result = await processOnepayCallback(params);
    const code = result.bookingCode || "unknown";

    if (!result.verified) {
      return NextResponse.redirect(
        new URL(`/tours/checkout/result?code=${code}&error=invalid_hash`, request.url),
      );
    }

    return NextResponse.redirect(
      new URL(`/tours/checkout/result?code=${code}`, request.url),
    );
  } catch (error) {
    console.error("[OnePay Return] Error:", error);
    return NextResponse.redirect(
      new URL("/tours/checkout/result?error=system_error", request.url),
    );
  }
}
```

## Important Notes

### IPN Handling Edge Cases
- OnePay may retry IPN if it doesn't get `responsecode=1` — our handler is idempotent
- IPN always returns HTTP 200 (OnePay requirement) even on verification failure
- IPN body might be form-urlencoded or JSON depending on OnePay version — handle both

### No Auth on These Routes
- IPN and Return are called by OnePay, not our users or API clients
- Security is via HMAC hash verification, not Bearer token
- Do NOT add `checkApiAccess()` or `validateApiKey()` to these routes

### formData Parsing
- OnePay IPN typically sends `application/x-www-form-urlencoded`
- Next.js `request.formData()` handles this
- Added JSON fallback for robustness

## Todo

- [ ] Create `src/lib/payments/onepay-response-handler.ts`
- [ ] Create `src/app/api/payments/onepay/ipn/route.ts`
- [ ] Create `src/app/api/payments/onepay/return/route.ts`
- [ ] Test IPN with curl: `curl -X POST http://localhost:3000/api/payments/onepay/ipn -d "vpc_OrderInfo=BK-test&vpc_TxnResponseCode=0&vpc_SecureHash=..."`
- [ ] Test return redirect with browser: visit `/api/payments/onepay/return?vpc_OrderInfo=BK-test&...`
- [ ] `pnpm typecheck` passes

## Success Criteria

- IPN endpoint returns plain text `responsecode=1&desc=confirm-success` on valid hash
- IPN endpoint returns `responsecode=0&desc=confirm-fail` on invalid hash
- Return endpoint redirects to `/tours/checkout/result?code=BK-xxx`
- Booking status updated in DB after both IPN and return
- `paymentTransactions` table has audit record for every callback
- Idempotent: second IPN for same booking doesn't change already-success status

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| IPN arrives before booking is in DB | Very Low | Medium | Booking created before redirect; IPN comes after |
| Double status update (IPN + return race) | Medium | Low | Both check `status !== success` before update; final state is correct |
| formData parsing fails | Low | High | JSON fallback; log raw request for debugging |
| OnePay test server unreachable | Medium | Low | Does not block local dev; only affects live testing |

## Backwards Compatibility

- New routes only — `/api/payments/` directory does not exist yet
- No existing routes modified
