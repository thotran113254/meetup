"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  checkoutFormSchema,
  type CheckoutFormData,
  type QuantityItem,
  type ServiceItem,
} from "@/lib/validations/checkout-schema";
import { TourCheckoutInfoCard } from "./tour-checkout-info-card";
import { TourCheckoutCalendar } from "./tour-checkout-calendar";
import { QuantitySelector, ServiceSelector } from "./tour-checkout-quantity-selector";
import { TourCheckoutInformationForm } from "./tour-checkout-information-form";
import { TourCheckoutConfirmSidebar } from "./tour-checkout-confirm-sidebar";
import { inputStyles } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

/** Sample tour data — in production this comes from API/props */
const TOUR_TITLE =
  "Ha Giang Loop Tour - HaGiang Motorventures Ha Giang Loop Tour - HaGiang Motorventures";
const TOUR_DESCRIPTION =
  "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's Lorem ipsum.";
const TOUR_IMAGE = "/images/tour-1-floating-market.png";

const INITIAL_QUANTITIES: QuantityItem[] = [
  { label: "Adult", price: 28, count: 2 },
  { label: "Child", price: 28, count: 2 },
  { label: "Adult", price: 28, count: 2 },
  { label: "Adult", price: 28, count: 2 },
  { label: "Adult", price: 28, count: 2 },
  { label: "Adult", price: 28, count: 2 },
  { label: "Adult", price: 28, count: 2 },
];

const INITIAL_SERVICES: ServiceItem[] = [
  { label: "Vip Private tour", price: 10, count: 2, description: "Add $10.00 per guests" },
  { label: "Book Scooter", price: 10, count: 2, description: "Add $10.00 per guests" },
  { label: "Esim 15 days", price: 10, count: 2, description: "Add $10.00 per guests" },
];

const VND_RATE = 16500;

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatVnd(usd: number) {
  return (usd * VND_RATE).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Dropdown-style select matching Figma design */
function CheckoutSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-[#828282] leading-[1.4] pl-0.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputStyles, "!text-[14px] appearance-none pr-8")}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD] pointer-events-none" />
      </div>
    </div>
  );
}

/** Main checkout content — orchestrates all state */
export function TourCheckoutContent() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 8, 26));
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 8));
  const [pickupPoint, setPickupPoint] = useState("");
  const [address, setAddress] = useState("");
  const [option, setOption] = useState("");
  const [quantities, setQuantities] = useState(INITIAL_QUANTITIES);
  const [services, setServices] = useState(INITIAL_SERVICES);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { name: "", email: "", whatsapp: "", promotionCode: "", messenger: "" },
  });

  const watchedValues = watch();

  const updateQuantity = useCallback((i: number, count: number) => {
    setQuantities((prev) => prev.map((q, idx) => (idx === i ? { ...q, count } : q)));
  }, []);

  const updateService = useCallback((i: number, count: number) => {
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, count } : s)));
  }, []);

  const totalUsd =
    quantities.reduce((s, q) => s + q.price * q.count, 0) +
    services.reduce((s, sv) => s + sv.price * sv.count, 0);

  const endDate = new Date(selectedDate);
  endDate.setDate(endDate.getDate() + 3);

  function onSubmit(data: CheckoutFormData) {
    console.log("Checkout submitted:", { ...data, selectedDate, quantities, services, totalUsd });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Back button */}
      <Link
        href="/tours"
        className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--color-primary)] mb-4 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <TourCheckoutInfoCard
            title={TOUR_TITLE}
            description={TOUR_DESCRIPTION}
            imageUrl={TOUR_IMAGE}
          />

          {/* Service Detail */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[20px] font-bold leading-[1.2] text-[#1D1D1D]">
              Service detail
            </h2>

            {/* Row 1: Dropdowns + Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white rounded-[12px] p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-2 md:gap-3">
                <CheckoutSelect
                  label="Pick-up point"
                  placeholder="Select location"
                  value={pickupPoint}
                  onChange={setPickupPoint}
                  options={["Hanoi Old Quarter", "Noi Bai Airport", "Ha Giang City"]}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] text-[#828282] leading-[1.4] pl-0.5">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your details address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={cn(inputStyles, "!text-[14px]")}
                  />
                </div>
                <CheckoutSelect
                  label="Option"
                  placeholder="Select"
                  value={option}
                  onChange={setOption}
                  options={["3 Days 2 Nights", "4 Days 3 Nights", "5 Days 4 Nights"]}
                />
                {/* Arrival date — mobile only (replaces calendar widget) */}
                <div className="md:hidden flex flex-col gap-1.5">
                  <label className="text-[12px] text-[#828282] leading-[1.4] pl-0.5">
                    Arrival date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`}
                      onChange={(e) => {
                        const d = new Date(e.target.value + "T00:00:00");
                        if (!isNaN(d.getTime())) setSelectedDate(d);
                      }}
                      className={cn(inputStyles, "!text-[14px]")}
                    />
                    <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD] pointer-events-none" />
                  </div>
                </div>
              </div>
              {/* Calendar — desktop only */}
              <div className="hidden md:block">
                <TourCheckoutCalendar
                  selectedDate={selectedDate}
                  currentMonth={currentMonth}
                  onDateSelect={setSelectedDate}
                  onMonthChange={setCurrentMonth}
                />
              </div>
            </div>

            {/* Row 2: Quantity + Additional services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <QuantitySelector
                title="Quantity"
                maxLabel="Please select at most is 1000"
                items={quantities}
                onUpdate={updateQuantity}
              />
              <ServiceSelector
                title="Additional service"
                maxLabel="Please select at most is 1"
                items={services}
                onUpdate={updateService}
              />
            </div>
          </div>

          {/* Information form */}
          <TourCheckoutInformationForm register={register} errors={errors} />
        </div>

        {/* RIGHT COLUMN — sticky sidebar */}
        <div className="w-full lg:w-[574px] shrink-0">
          <div className="lg:sticky lg:top-[80px]">
            <TourCheckoutConfirmSidebar
              tourTitle={TOUR_TITLE}
              departureDate={formatDate(selectedDate)}
              endDate={formatDate(endDate)}
              name={watchedValues.name}
              whatsapp={watchedValues.whatsapp}
              email={watchedValues.email}
              quantities={quantities}
              messenger={watchedValues.messenger}
              totalUsd={totalUsd}
              totalVnd={formatVnd(totalUsd)}
              onBookNow={() => handleSubmit(onSubmit)()}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
