import Image from "next/image";

/** Tour info card — thumbnail image + title + description */
export function TourCheckoutInfoCard({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl: string;
}) {
  return (
    <div className="bg-white rounded-[12px] p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-3">
      {/* Header: image + title */}
      <div className="flex gap-2 items-center">
        <div className="size-16 md:size-20 rounded-[9px] md:rounded-[12px] overflow-hidden shrink-0 relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 64px, 80px"
          />
        </div>
        <h1 className="text-[14px] md:text-[16px] font-bold leading-[1.3] tracking-[0.14px] md:tracking-[0.32px] text-[#1D1D1D]">
          {title}
        </h1>
      </div>

      {/* Description */}
      <p className="text-[12px] md:text-[14px] leading-[1.5] text-[#828282]">
        {description}
      </p>
    </div>
  );
}
