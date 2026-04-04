# Phase 6: Admin Orders Page

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 3h
- **Depends on**: Phase 1 (booking queries, types)

Admin page at `/admin/orders` to view and manage bookings. Lists all bookings with status filters, search, pagination, and detail view. Follows existing admin page patterns (tabs, section nav, server actions).

## Key Insights
- Existing admin pattern: client component page + server action for data fetching + hook for state
- Admin contacts page is closest reference: table list + status filter + pagination
- Admin sidebar needs new nav item under "He thong" group
- Keep it simple: read-only list view + status badge + detail expansion. No inline editing of bookings.
- Optional: manual status update (cancel booking) via server action

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/admin/orders/page.tsx` | Admin orders page (client component) |
| `src/components/admin/admin-orders-table.tsx` | Bookings table with filters |
| `src/components/admin/admin-orders-detail-dialog.tsx` | Booking detail modal/dialog |
| `src/app/admin/_actions/booking-actions.ts` | Server actions: fetch bookings, update status |
| `src/hooks/use-admin-orders.ts` | Hook: state management for orders page |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/admin/admin-sidebar.tsx` | Add "Don hang" nav item under "He thong" group |
| `src/db/queries/booking-queries.ts` | Add `getBookingsByStatus()` and `getBookingsCount()` for filtered queries |

## Data Flow

```
Admin visits /admin/orders
  -> useAdminOrders() hook initializes
  -> Calls fetchBookings server action (page=1, status=all)
  -> Server action queries DB via booking-queries
  -> Returns { data: Booking[], total, page, limit }
  -> Table renders with status badges, customer info, totals
  -> Admin clicks row -> detail dialog shows full booking info
  -> Admin can filter by status dropdown
  -> Admin can cancel booking -> updateBookingStatusAction server action
```

## Implementation Steps

### Step 1: Add booking queries for admin in `src/db/queries/booking-queries.ts`

Append to existing file:

```typescript
import { eq, desc, and, sql } from "drizzle-orm";

/** Filtered bookings for admin — supports status filter + pagination */
export async function getFilteredBookings(
  status: string | null,
  limit = 20,
  offset = 0,
): Promise<{ data: Booking[]; total: number }> {
  const db = getDb();
  const where = status ? eq(bookings.status, status) : undefined;

  const [data, total] = await Promise.all([
    where
      ? db.select().from(bookings).where(where).orderBy(desc(bookings.createdAt)).limit(limit).offset(offset)
      : db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit).offset(offset),
    where ? db.$count(bookings, where) : db.$count(bookings),
  ]);

  return { data: data.map(toBooking), total: Number(total) };
}

/** Count bookings per status — for admin dashboard badges */
export async function getBookingStatusCounts(): Promise<Record<string, number>> {
  const db = getDb();
  const rows = await db
    .select({ status: bookings.status, count: sql<number>`count(*)::int` })
    .from(bookings)
    .groupBy(bookings.status);
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.status] = row.count;
  return counts;
}
```

### Step 2: Create `src/app/admin/_actions/booking-actions.ts`

```typescript
"use server";

import {
  getFilteredBookings,
  getBookingStatusCounts,
  updateBookingStatus,
  getBookingByCode,
} from "@/db/queries/booking-queries";
import { BOOKING_STATUS } from "@/lib/constants/payment-constants";
import type { Booking } from "@/lib/types/booking-types";

export type BookingListResult = {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<string, number>;
};

export async function fetchBookings(
  page = 1,
  limit = 20,
  status: string | null = null,
): Promise<BookingListResult> {
  const offset = (page - 1) * limit;
  const [result, statusCounts] = await Promise.all([
    getFilteredBookings(status, limit, offset),
    getBookingStatusCounts(),
  ]);
  return { ...result, page, limit, statusCounts };
}

export async function fetchBookingDetail(code: string): Promise<Booking | null> {
  return getBookingByCode(code);
}

export async function cancelBooking(code: string): Promise<{ success: boolean; message: string }> {
  const booking = await getBookingByCode(code);
  if (!booking) return { success: false, message: "Booking khong ton tai" };
  if (booking.status === BOOKING_STATUS.SUCCESS) {
    return { success: false, message: "Khong the huy booking da thanh toan thanh cong" };
  }
  await updateBookingStatus(code, BOOKING_STATUS.CANCELLED);
  return { success: true, message: "Da huy booking" };
}
```

### Step 3: Create `src/hooks/use-admin-orders.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchBookings,
  cancelBooking,
  type BookingListResult,
} from "@/app/admin/_actions/booking-actions";
import type { Booking } from "@/lib/types/booking-types";

export function useAdminOrders() {
  const [data, setData] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchBookings(page, limit, statusFilter);
    setData(result.data);
    setTotal(result.total);
    setStatusCounts(result.statusCounts);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (code: string) => {
    setCancelling(code);
    await cancelBooking(code);
    setCancelling(null);
    await load(); // refresh
  };

  const totalPages = Math.ceil(total / limit);

  return {
    data, total, totalPages, page, setPage,
    statusFilter, setStatusFilter,
    statusCounts, loading, cancelling,
    handleCancel, refresh: load,
  };
}
```

### Step 4: Create `src/components/admin/admin-orders-table.tsx`

Table with columns: Code, Tour, Customer, Date, Total, Status, Actions.

Key UI elements:
- Status filter tabs at top: All | Processing | Success | Payfail | Cancelled (with counts)
- Each row: booking code, tour title (truncated), customer name, departure date, total USD, status badge
- Click row -> open detail dialog
- Pagination at bottom (matches contacts page pattern)

Status badge colors:
- `processing`: amber/yellow
- `success`: green
- `payfail`: red
- `cancelled`: gray

```typescript
// Status badge component
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    processing: "bg-amber-100 text-amber-700",
    success: "bg-green-100 text-green-700",
    payfail: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.cancelled}`}>
      {status}
    </span>
  );
}
```

Table structure (~120 lines):
- Filter bar with status tabs
- Responsive table (horizontal scroll on mobile)
- Empty state when no bookings
- Pagination controls

### Step 5: Create `src/components/admin/admin-orders-detail-dialog.tsx`

Modal showing full booking details:
- All customer info
- Line items table (guest type, qty, price, subtotal)
- Service items table
- Total USD + VND
- Payment data (raw JSON, collapsed by default)
- Cancel button (if status is processing)

Use existing dialog/sheet pattern from the codebase. Keep under 150 lines.

### Step 6: Create `src/app/admin/orders/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { AdminOrdersDetailDialog } from "@/components/admin/admin-orders-detail-dialog";
import type { Booking } from "@/lib/types/booking-types";

export default function AdminOrdersPage() {
  const orders = useAdminOrders();
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Don hang</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Quan ly don hang va thanh toan tour
        </p>
      </div>

      <AdminOrdersTable
        {...orders}
        onRowClick={setSelected}
      />

      {selected && (
        <AdminOrdersDetailDialog
          booking={selected}
          onClose={() => setSelected(null)}
          onCancel={orders.handleCancel}
          cancelling={orders.cancelling}
        />
      )}
    </div>
  );
}
```

### Step 7: Update `src/components/admin/admin-sidebar.tsx`

Add orders nav item to the "He thong" group:

```typescript
// In navGroups, add to "He thong" items array:
{ label: "Don hang", href: "/admin/orders", icon: ShoppingCart },
```

Import `ShoppingCart` from lucide-react.

Place it as the first item in "He thong" group (most important operational page).

## Todo

- [ ] Add `getFilteredBookings()` and `getBookingStatusCounts()` to `src/db/queries/booking-queries.ts`
- [ ] Create `src/app/admin/_actions/booking-actions.ts`
- [ ] Create `src/hooks/use-admin-orders.ts`
- [ ] Create `src/components/admin/admin-orders-table.tsx`
- [ ] Create `src/components/admin/admin-orders-detail-dialog.tsx`
- [ ] Create `src/app/admin/orders/page.tsx`
- [ ] Update `src/components/admin/admin-sidebar.tsx` — add "Don hang" nav item
- [ ] Verify table renders with sample bookings (create test booking via Phase 3)
- [ ] Verify status filter works
- [ ] Verify detail dialog shows full booking info
- [ ] Verify cancel action updates status
- [ ] Check responsive layout
- [ ] `pnpm typecheck` passes

## Success Criteria

- `/admin/orders` shows all bookings in a paginated table
- Status filter tabs show correct counts and filter results
- Clicking a row opens detail dialog with full booking info
- Cancel button on processing bookings updates status to cancelled
- Cannot cancel already-successful bookings (button disabled + error message)
- Page is responsive and follows admin design system
- Sidebar shows "Don hang" link with correct active state

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Large number of bookings slows page | Low (early stage) | Medium | Pagination with 20/page default; indexed queries |
| Admin accidentally cancels booking | Low | High | Confirmation dialog before cancel; cannot cancel "success" bookings |
| Sidebar update causes hydration mismatch | Low | Low | NavContent is stable component; adding item is safe |
| File size exceeds 200 lines | Medium | Low | Split table + dialog into separate components (already planned) |

## Backwards Compatibility

- New admin page — no existing pages modified
- Sidebar modification is additive (new nav item only)
- No API contract changes
