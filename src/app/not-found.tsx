import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 page - shown for any unmatched route.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center section-padding text-center">
      <p className="text-8xl font-black text-[var(--color-primary)]/20 select-none">404</p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Trang khong tim thay
      </h1>

      <p className="mt-4 max-w-md text-[var(--color-muted-foreground)] leading-relaxed">
        Xin loi, trang ban dang tim khong ton tai hoac da bi di chuyen. Vui long kiem tra lai duong dan hoac quay ve trang chu.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Ve trang chu
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/contact">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Lien he ho tro
          </Link>
        </Button>
      </div>
    </div>
  );
}
