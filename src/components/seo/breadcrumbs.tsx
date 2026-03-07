import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildBreadcrumbJsonLd } from "@/lib/seo-utils";
import { JsonLdScript } from "@/components/seo/json-ld-script";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs - Navigation trail with accessible markup.
 * First item is always home; last item is current page (not linked).
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const allItems = [{ name: "Trang chu", href: "/" }, ...items.map((i) => ({ name: i.label, href: i.href }))];

  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd(allItems)} />
    <nav
      aria-label="Breadcrumb"
      className={cn("container-wide py-4", className)}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-[var(--color-foreground)] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Trang chu</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-[var(--color-foreground)] font-medium"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[var(--color-foreground)] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
    </>
  );
}
