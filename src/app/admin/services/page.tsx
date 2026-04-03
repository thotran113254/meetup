"use client";

import { Construction } from "lucide-react";

export default function AdminPagePlaceholder() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 text-center">
      <Construction className="h-12 w-12 text-[var(--color-muted-foreground)] mb-4" />
      <h1 className="text-xl font-bold mb-2">Đang phát triển</h1>
      <p className="text-sm text-[var(--color-muted-foreground)] max-w-md">
        Trang quản lý này đang được xây dựng. Nội dung sẽ được chuyển từ hardcoded sang CMS.
      </p>
    </div>
  );
}
