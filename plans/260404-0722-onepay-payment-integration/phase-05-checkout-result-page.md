# Phase 5: Checkout Result Page

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 2h
- **Depends on**: Phase 1 (booking queries, types)

Thank-you / payment-result page at `/tours/checkout/result?code=BK-xxx`. Shows booking details and payment status (success, failed, or error). Server component that fetches booking by code.

## Key Insights
- User lands here via redirect from `/api/payments/onepay/return`
- URL params: `code` (booking code), optional `error` (hash failure or system error)
- No auth needed — booking code is the access token (short-lived, single-use context)
- Must handle: success, payfail, processing (IPN hasn't arrived yet), error (hash invalid)
- Vietnamese UI text consistent with existing pages
- Follow existing page pattern: server component + section component

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/(website)/tours/checkout/result/page.tsx` | Server component: fetch booking, render result |
| `src/components/sections/tour-checkout/tour-checkout-result-content.tsx` | Client component: display booking result UI |
| `src/components/sections/tour-checkout/tour-checkout-result-status-card.tsx` | Status badge + icon card (success/fail/processing) |

## Data Flow

```
Browser GET /tours/checkout/result?code=BK-xxx
  -> page.tsx reads searchParams.code
  -> Fetch booking from DB by code
  -> If error param or booking not found: show error state
  -> If booking found: show status + booking details
  -> User sees: "Payment successful!" or "Payment failed" or "Processing..."
```

## Implementation Steps

### Step 1: Create `src/app/(website)/tours/checkout/result/page.tsx`

```typescript
import type { Metadata } from "next";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { generatePageMetadata, buildOrganizationJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { getBookingByCode } from "@/db/queries/booking-queries";
import { TourCheckoutResultContent } from "@/components/sections/tour-checkout/tour-checkout-result-content";

export const metadata: Metadata = generatePageMetadata({
  title: "Booking Result - Meetup Travel",
  description: "Your tour booking payment result.",
  path: "/tours/checkout/result",
});

type Props = { searchParams: Promise<{ code?: string; error?: string }> };

export default async function CheckoutResultPage({ searchParams }: Props) {
  const { code, error } = await searchParams;
  const booking = code ? await getBookingByCode(code) : null;

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: "Booking Result", href: "/tours/checkout/result" },
          ]),
        ]}
      />
      <section className="bg-[var(--color-background)] py-10 md:py-16 min-h-[60vh]">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6">
          <TourCheckoutResultContent booking={booking} errorType={error} />
        </div>
      </section>
    </>
  );
}
```

### Step 2: Create `src/components/sections/tour-checkout/tour-checkout-result-status-card.tsx`

Renders the status icon + headline based on booking status:

```typescript
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

type StatusConfig = {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    title: "Thanh toán thành công!",
    description: "Booking của bạn đã được xác nhận. Chúng tôi sẽ liên hệ qua email và WhatsApp.",
  },
  payfail: {
    icon: XCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    title: "Thanh toán thất bại",
    description: "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
  },
  processing: {
    icon: Clock,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    title: "Đang xử lý...",
    description: "Giao dịch đang được xử lý. Vui lòng chờ trong giây lát.",
  },
  error: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    title: "Có lỗi xảy ra",
    description: "Không thể xác minh giao dịch. Vui lòng liên hệ hỗ trợ.",
  },
};

export function TourCheckoutResultStatusCard({ status }: { status: string }) {
  const config = STATUS_MAP[status] || STATUS_MAP.error;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} rounded-xl p-6 text-center`}>
      <Icon className={`w-12 h-12 mx-auto mb-3 ${config.iconColor}`} />
      <h1 className="text-xl font-bold text-[#1D1D1D] mb-2">{config.title}</h1>
      <p className="text-sm text-[#828282]">{config.description}</p>
    </div>
  );
}
```

### Step 3: Create `src/components/sections/tour-checkout/tour-checkout-result-content.tsx`

```typescript
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Booking } from "@/lib/types/booking-types";
import { TourCheckoutResultStatusCard } from "./tour-checkout-result-status-card";
import { VND_RATE } from "@/lib/constants/payment-constants";

type Props = {
  booking: Booking | null;
  errorType?: string;
};

export function TourCheckoutResultContent({ booking, errorType }: Props) {
  // Determine display status
  const status = errorType ? "error" : booking?.status || "error";

  return (
    <div className="flex flex-col gap-4">
      {/* Back link */}
      <Link
        href="/tours"
        className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Tours
      </Link>

      {/* Status card */}
      <TourCheckoutResultStatusCard status={status} />

      {/* Booking details (only if booking found) */}
      {booking && (
        <div className="bg-white rounded-xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#1D1D1D]">Chi tiết booking</h2>
          <div className="h-px bg-[#ECECEC]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
            <DetailRow label="Mã booking" value={booking.code} />
            <DetailRow label="Tour" value={booking.tourTitle} />
            <DetailRow label="Ngày khởi hành" value={booking.departureDate} />
            <DetailRow label="Họ tên" value={booking.customerName} />
            <DetailRow label="Email" value={booking.customerEmail} />
            <DetailRow label="WhatsApp" value={booking.customerWhatsapp} />
            {booking.pickupPoint && <DetailRow label="Điểm đón" value={booking.pickupPoint} />}
            {booking.tourOption && <DetailRow label="Gói tour" value={booking.tourOption} />}
          </div>
          <div className="h-px bg-[#ECECEC]" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#828282]">Tổng thanh toán</span>
            <div className="text-right">
              <span className="text-[16px] font-bold text-[#1D1D1D]">
                ${(booking.totalUsd / 100).toFixed(2)}
              </span>
              <span className="text-[12px] text-[#828282] ml-2">
                ({booking.totalVnd.toLocaleString("en-US")} VND)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {status === "payfail" && (
          <Link
            href={booking ? `/tours/checkout?slug=${booking.tourPackageId}` : "/tours"}
            className="flex-1 text-center h-10 leading-10 bg-[var(--color-primary)] text-white text-[14px] font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Thử lại
          </Link>
        )}
        <Link
          href="/tours"
          className="flex-1 text-center h-10 leading-10 border border-[var(--color-border)] text-[14px] font-medium rounded-xl hover:bg-[var(--color-muted)] transition-colors"
        >
          Xem tour khác
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="text-[#828282] shrink-0">{label}:</span>
      <span className="text-[#1D1D1D] break-all">{value}</span>
    </div>
  );
}
```

## Important Notes

### "Processing" State
- If user hits result page but IPN hasn't updated status yet, show "processing" with a note to wait
- Could add client-side polling later (YAGNI for now — IPN is usually fast)
- User can refresh the page to check updated status

### "Retry" Button for Failed Payments
- Links back to `/tours/checkout?slug=...` so user can try again
- Does NOT reuse the old booking — a new one will be created on submit
- The old booking stays with `payfail` status in DB (audit trail)

### Security
- Booking code in URL is not secret per se, but booking details are low-sensitivity (name, email, tour)
- No sensitive payment data (card numbers) is ever stored — only OnePay response codes
- If needed later: add rate limiting on this page to prevent code enumeration

## Todo

- [ ] Create `src/app/(website)/tours/checkout/result/page.tsx`
- [ ] Create `src/components/sections/tour-checkout/tour-checkout-result-status-card.tsx`
- [ ] Create `src/components/sections/tour-checkout/tour-checkout-result-content.tsx`
- [ ] Verify page renders for each status: success, payfail, processing, error
- [ ] Verify page renders when booking not found (error state)
- [ ] Check responsive layout on mobile
- [ ] `pnpm typecheck` passes

## Success Criteria

- `/tours/checkout/result?code=BK-xxx` shows correct booking details and status
- Success status shows green confirmation with booking summary
- Payfail status shows red error with "retry" button
- Missing or invalid code shows error state gracefully
- Page is responsive and matches design system (white cards, shadows, etc.)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| IPN not arrived when user hits page | Medium | Low | Show "processing" state; user can refresh |
| Invalid booking code in URL | Low | Low | Graceful error state, no crash |
| Stale booking status on page | Low | Low | Server component fetches fresh data on load |

## Backwards Compatibility

- New route only — `/tours/checkout/result/` does not exist yet
- No existing pages or components modified
