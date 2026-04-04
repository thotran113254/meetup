# Phase 3: Checkout Server Action

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 2h
- **Depends on**: Phase 1 (DB schema, types, queries) + Phase 2 (OnePay URL builder)

Wire the checkout form to a server action that validates input, creates a booking in DB, generates a OnePay payment URL, and redirects the user.

## Key Insights
- Existing pattern: `contact-form-action.ts` — server action with Zod validation + DB insert
- Current checkout form calls `console.log` on submit — replace with server action
- `TourCheckoutContent` is a client component with `useForm` — call server action from `onSubmit`
- Need `tourSlug` passed to checkout page (currently hardcoded sample data)
- `totalUsd` stored in cents to avoid float issues; `totalVnd = totalUsd * VND_RATE / 100`
- Booking code: `BK-` + 8-char random (short, user-friendly for email/WhatsApp)

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/(website)/tours/checkout/checkout-action.ts` | "use server" action: validate, save booking, return OnePay URL |
| `src/lib/payments/generate-booking-code.ts` | Generate unique short booking code |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/sections/tour-checkout/tour-checkout-content.tsx` | Accept tour data as props; call server action; redirect to OnePay |
| `src/app/(website)/tours/checkout/page.tsx` | Fetch tour by slug from searchParams; pass to content component |
| `src/lib/validations/checkout-schema.ts` | Add `tourSlug`, `departureDate`, `pickupPoint`, `address`, `tourOption`, `lineItems`, `serviceItems` to schema |

## Data Flow

```
1. User visits /tours/checkout?slug=ha-giang-loop
2. page.tsx reads searchParams.slug -> fetches tour from DB -> passes to TourCheckoutContent
3. User fills form + selects date/quantities -> clicks "Book now"
4. Client: collects all state into CreateBookingInput -> calls submitCheckout(data)
5. Server action:
   a. Validate with createBookingSchema.safeParse()
   b. Fetch tour by slug (verify exists + published)
   c. Generate booking code (BK-xxxxxxxx)
   d. Compute totalUsd (cents) and totalVnd
   e. Insert booking row (status=processing)
   f. Build OnePay payment URL via buildOnepayPaymentUrl()
   g. Return { success: true, paymentUrl: "https://mtf.onepay.vn/..." }
6. Client: window.location.href = paymentUrl (redirect to OnePay)
```

## Implementation Steps

### Step 1: Create `src/lib/payments/generate-booking-code.ts`

```typescript
import { randomBytes } from "crypto";

/** Generate a unique booking code: BK-XXXXXXXX (8 hex chars) */
export function generateBookingCode(): string {
  return `BK-${randomBytes(4).toString("hex")}`;
}
```

### Step 2: Update `src/lib/validations/checkout-schema.ts`

Keep the existing `checkoutFormSchema` for client-side form validation. The `createBookingSchema` from Phase 1 handles server-side validation of the full payload including lineItems/serviceItems.

No changes needed here — the `createBookingSchema` in `booking-schema.ts` already covers it.

### Step 3: Create `src/app/(website)/tours/checkout/checkout-action.ts`

```typescript
"use server";

import { createBookingSchema } from "@/lib/validations/booking-schema";
import { getTourPackageBySlug } from "@/db/queries/tour-packages-queries";
import { createBooking } from "@/db/queries/booking-queries";
import { buildOnepayPaymentUrl } from "@/lib/payments/onepay-url-builder";
import { generateBookingCode } from "@/lib/payments/generate-booking-code";
import { VND_RATE, BOOKING_STATUS } from "@/lib/constants/payment-constants";
import type { CreateBookingInput } from "@/lib/validations/booking-schema";

export type CheckoutActionResult = {
  success: boolean;
  message: string;
  paymentUrl?: string;
};

export async function submitCheckout(data: CreateBookingInput): Promise<CheckoutActionResult> {
  // 1. Server-side validation
  const parsed = createBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại." };
  }

  try {
    // 2. Verify tour exists and is published
    const tour = await getTourPackageBySlug(parsed.data.tourSlug);
    if (!tour || !tour.published) {
      return { success: false, message: "Tour không tồn tại hoặc đã ngưng nhận booking." };
    }

    // 3. Compute totals
    const lineTotal = parsed.data.lineItems.reduce((s, i) => s + i.price * i.count, 0);
    const serviceTotal = parsed.data.serviceItems.reduce((s, i) => s + i.price * i.count, 0);
    const totalUsdCents = Math.round((lineTotal + serviceTotal) * 100); // store as cents
    const totalVnd = Math.round((totalUsdCents / 100) * VND_RATE);
    const totalPax = parsed.data.lineItems.reduce((s, i) => s + i.count, 0);

    // 4. Generate booking code
    const code = generateBookingCode();

    // 5. Save booking
    await createBooking({
      code,
      tourPackageId: tour.id,
      tourTitle: tour.title,
      status: BOOKING_STATUS.PROCESSING,
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      customerWhatsapp: parsed.data.whatsapp,
      customerMessage: parsed.data.messenger || null,
      promotionCode: parsed.data.promotionCode || null,
      departureDate: parsed.data.departureDate,
      pickupPoint: parsed.data.pickupPoint || null,
      address: parsed.data.address || null,
      tourOption: parsed.data.tourOption || null,
      lineItems: parsed.data.lineItems,
      serviceItems: parsed.data.serviceItems,
      totalUsd: totalUsdCents,
      totalVnd,
      totalPax,
    });

    // 6. Build OnePay payment URL
    const paymentUrl = buildOnepayPaymentUrl({
      bookingCode: code,
      amountVnd: totalVnd,
    });

    return { success: true, message: "Đang chuyển đến trang thanh toán...", paymentUrl };
  } catch (error) {
    console.error("[submitCheckout]", error);
    return { success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
```

### Step 4: Modify `src/app/(website)/tours/checkout/page.tsx`

Change to async server component that reads `searchParams.slug` and fetches tour:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { generatePageMetadata, buildOrganizationJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { TourCheckoutContent } from "@/components/sections/tour-checkout/tour-checkout-content";
import { getTourPackageBySlug } from "@/db/queries/tour-packages-queries";

export const metadata: Metadata = generatePageMetadata({
  title: "Tour Checkout - Book Your Vietnam Adventure",
  description: "Complete your booking for an unforgettable Vietnam tour experience.",
  path: "/tours/checkout",
});

type Props = { searchParams: Promise<{ slug?: string }> };

export default async function TourCheckoutPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  if (!slug) return notFound();

  const tour = await getTourPackageBySlug(slug);
  if (!tour || !tour.published) return notFound();

  return (
    <>
      <JsonLdScript
        data={[
          buildOrganizationJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Homepage", href: "/" },
            { name: "Tour Packages", href: "/tours" },
            { name: "Checkout", href: `/tours/checkout?slug=${slug}` },
          ]),
        ]}
      />
      <section className="bg-[var(--color-background)] py-6 md:py-10 pb-20 lg:pb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-[100px]">
          <TourCheckoutContent tour={tour} />
        </div>
      </section>
    </>
  );
}
```

### Step 5: Modify `src/components/sections/tour-checkout/tour-checkout-content.tsx`

Key changes:
- Accept `tour: TourPackage` prop instead of hardcoded data
- Derive pricing quantities from `tour.pricingOptions`
- On submit: call `submitCheckout()` server action -> redirect to `paymentUrl`
- Add loading/error state for submission

```typescript
// In onSubmit handler:
async function onSubmit(data: CheckoutFormData) {
  setSubmitting(true);
  setSubmitError(null);

  const result = await submitCheckout({
    tourSlug: tour.slug,
    name: data.name,
    email: data.email,
    whatsapp: data.whatsapp,
    promotionCode: data.promotionCode || "",
    messenger: data.messenger,
    departureDate: selectedDate.toISOString().split("T")[0],
    pickupPoint,
    address,
    tourOption: option,
    lineItems: quantities.map((q) => ({ label: q.label, price: q.price, count: q.count })),
    serviceItems: services.map((s) => ({ label: s.label, price: s.price, count: s.count, description: s.description })),
  });

  if (result.success && result.paymentUrl) {
    window.location.href = result.paymentUrl;
  } else {
    setSubmitError(result.message);
    setSubmitting(false);
  }
}
```

Replace hardcoded constants:
- `TOUR_TITLE` -> `tour.title`
- `TOUR_DESCRIPTION` -> `tour.description`
- `TOUR_IMAGE` -> `tour.image`
- `INITIAL_QUANTITIES` -> derive from `tour.pricingOptions` (map rows to QuantityItem[])
- Keep `INITIAL_SERVICES` as sample for now (services not yet CMS-managed)
- Remove `VND_RATE` local const, import from `payment-constants.ts`

### Step 6: Update "Book now" button in confirm sidebar

Pass `submitting` state to sidebar -> disable button + show spinner during submit:

```typescript
// In TourCheckoutConfirmSidebar:
<button
  type="submit"
  onClick={onBookNow}
  disabled={submitting}
  className="h-10 px-8 bg-[var(--color-primary)] text-white text-[14px] font-bold rounded-[12px] hover:opacity-90 transition-opacity disabled:opacity-50"
>
  {submitting ? "Đang xử lý..." : "Book now"}
</button>
```

## Todo

- [ ] Create `src/lib/payments/generate-booking-code.ts`
- [ ] Create `src/app/(website)/tours/checkout/checkout-action.ts`
- [ ] Update `src/app/(website)/tours/checkout/page.tsx` — fetch tour by slug
- [ ] Update `src/components/sections/tour-checkout/tour-checkout-content.tsx` — accept tour prop, call server action
- [ ] Update `src/components/sections/tour-checkout/tour-checkout-confirm-sidebar.tsx` — submitting state
- [ ] Verify end-to-end: fill form -> booking saved in DB -> redirected to OnePay test page
- [ ] `pnpm typecheck` passes

## Success Criteria

- Clicking "Book now" with valid form data creates a `bookings` row with status "processing"
- Browser redirects to OnePay MTF test gateway URL
- Invalid form data shows error message, no booking created
- Non-existent or unpublished tour slug returns 404
- Booking code is unique and stored correctly

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Duplicate booking codes | Very Low | Medium | 8 hex chars = 4B combinations; code column has UNIQUE constraint |
| Race condition: double submit | Medium | Medium | Disable button on submit; server creates unique code per request |
| Tour data changes between page load and submit | Low | Low | Server re-fetches tour by slug; uses snapshot title |
| OnePay env vars missing in dev | Medium | High | `getOnepayConfig()` throws clear error message |

## Backwards Compatibility

- `/tours/checkout` without `?slug=` now returns 404 (previously showed sample data)
- This is acceptable — the old page was non-functional (console.log only)
- Tour detail page's "Book now" button must link to `/tours/checkout?slug={slug}`
