import { notFound } from "next/navigation";
import { getTourPackageBySlug } from "@/db/queries/tour-packages-queries";
import { AdminTourEditPage } from "@/components/admin/admin-tour-edit-page";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminTourEditRoute({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourPackageBySlug(slug);
  if (!tour) notFound();
  return <AdminTourEditPage tour={tour} />;
}
