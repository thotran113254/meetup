"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

// TODO: Replace with real DB queries from contact-queries.ts
const SAMPLE_CONTACTS = [
  {
    id: "1",
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "0901234567",
    message: "Toi muon tim hieu them ve dich vu thiet ke website cua cong ty.",
    read: false,
    createdAt: new Date("2026-03-07"),
  },
  {
    id: "2",
    name: "Tran Thi B",
    email: "b@example.com",
    phone: "",
    message: "Xin chao, toi can tu van ve goi SEO cho website ban hang.",
    read: true,
    createdAt: new Date("2026-03-06"),
  },
  {
    id: "3",
    name: "Le Van C",
    email: "c@example.com",
    phone: "0987654321",
    message: "Bao gia thiet ke app mobile cho startup cua toi, budget khoang 50 trieu.",
    read: true,
    createdAt: new Date("2026-03-05"),
  },
];

export default function AdminContactsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Tin nhan lien he</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          {SAMPLE_CONTACTS.filter((c) => !c.read).length} chua doc /{" "}
          {SAMPLE_CONTACTS.length} tong
        </p>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">
                Ho ten
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden sm:table-cell">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden md:table-cell">
                So dien thoai
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)] hidden lg:table-cell">
                Ngay gui
              </th>
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted-foreground)]">
                Trang thai
              </th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {SAMPLE_CONTACTS.map((contact) => (
              <>
                <tr
                  key={contact.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors cursor-pointer"
                  onClick={() => toggle(contact.id)}
                >
                  <td className="px-4 py-3">
                    <span className={contact.read ? "" : "font-semibold"}>
                      {contact.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden sm:table-cell">
                    {contact.email}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden md:table-cell">
                    {contact.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)] hidden lg:table-cell">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        contact.read
                          ? "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {contact.read ? "Da doc" : "Chua doc"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted-foreground)]">
                    {expandedId === contact.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </td>
                </tr>
                {expandedId === contact.id && (
                  <tr key={`${contact.id}-expanded`} className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
                    <td colSpan={6} className="px-6 py-4">
                      <p className="text-sm font-medium mb-1 text-[var(--color-muted-foreground)]">
                        Noi dung tin nhan:
                      </p>
                      <p className="text-sm">{contact.message}</p>
                      <div className="mt-3 flex gap-4 text-xs text-[var(--color-muted-foreground)] sm:hidden">
                        <span>{contact.email}</span>
                        {contact.phone && <span>{contact.phone}</span>}
                        <span>{formatDate(contact.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
