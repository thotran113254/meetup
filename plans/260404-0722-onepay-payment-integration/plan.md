---
title: "OnePay Payment Integration"
description: "Integrate OnePay payment gateway into tour checkout flow with bookings DB, IPN callback, result page, and admin orders view"
status: pending
priority: P1
effort: 12h
branch: main
tags: [payment, onepay, checkout, bookings]
created: 2026-04-04
---

# OnePay Payment Integration

## Data Flow

```
User fills checkout form
  -> Server Action: validate + save booking (status=processing) + generate OnePay URL
  -> Redirect to OnePay payment page
  -> User pays
  -> OnePay sends IPN POST to /api/payments/onepay/ipn (verify hash, update booking)
  -> OnePay redirects user GET to /api/payments/onepay/return (verify hash, redirect to result)
  -> /tours/checkout/result?code=XXX shows success/failure
```

## Phases

| # | Phase | Status | Files | Effort |
|---|-------|--------|-------|--------|
| 1 | [DB Schema & Types](phase-01-db-schema-and-types.md) | pending | schema.ts, types, validations | 1.5h |
| 2 | [OnePay Service](phase-02-onepay-service.md) | pending | lib/payments/ | 1.5h |
| 3 | [Checkout Server Action](phase-03-checkout-server-action.md) | pending | checkout action, queries | 2h |
| 4 | [Payment API Routes](phase-04-payment-api-routes.md) | pending | api/payments/ | 2h |
| 5 | [Checkout Result Page](phase-05-checkout-result-page.md) | pending | tours/checkout/result/ | 2h |
| 6 | [Admin Orders Page](phase-06-admin-orders-page.md) | pending | admin/orders/ | 3h |

## Dependencies

- Phase 2 depends on Phase 1 (types)
- Phase 3 depends on Phase 1 + 2 (DB queries + OnePay URL generation)
- Phase 4 depends on Phase 1 + 2 (DB queries + hash verification)
- Phase 5 depends on Phase 1 (booking queries)
- Phase 6 depends on Phase 1 (booking queries)
- Phases 3-6 can be parallelized after 1+2 complete

## Env Vars Required

```
ONEPAY_MERCHANT_ID=...
ONEPAY_ACCESS_CODE=...
ONEPAY_SECURE_SECRET=...          # hex string
ONEPAY_PAYMENT_URL=https://mtf.onepay.vn/paygate/vpcpay.op
ONEPAY_RETURN_URL=http://localhost:3000/api/payments/onepay/return
```

## Rollback

- Phase 1: `pnpm db:push` after reverting schema.ts — Drizzle handles drops
- Phase 2-6: pure code additions, `git revert` suffices
- No existing functionality modified (checkout form wired to `console.log` today)

## Success Criteria

- [ ] Booking saved to DB with line items on checkout submit
- [ ] OnePay test gateway accepts payment and returns
- [ ] IPN callback verifies hash and updates booking status
- [ ] Result page shows success/failure with booking details
- [ ] Admin orders page lists bookings with status filters
