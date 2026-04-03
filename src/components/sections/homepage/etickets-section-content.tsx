"use client";

/**
 * EticketsSectionContent — e-Tickets flight search banner.
 * Ticket-style card: teal left panel (338px) + form panel.
 * Figma node 13263:4171.
 * Receives title, cities, passengers from server wrapper.
 */

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Search, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type SelectOption = { value: string; label: string };
type Props = { title: string; cities: SelectOption[]; passengers: SelectOption[] };

export function EticketsSectionContent({ title, cities, passengers }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure, setDeparture] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [pax, setPax] = useState("");

  return (
    <section className="section-padding bg-[var(--color-background)] overflow-x-clip">
      <div className="container-wide">
        <ScrollReveal>
        <div className="relative">
          <PunchHole side="left" />
          <PunchHole side="right" />

          <div className="rounded-xl flex flex-col lg:flex-row gap-2 lg:gap-0">
            <TealPanel title={title} />

            <div className="relative flex-1 min-w-0 bg-[#EBF8F8] rounded-xl lg:rounded-l-none flex items-center justify-center p-2 lg:py-4 lg:px-6">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white rounded-xl p-2 lg:p-3 flex flex-col lg:flex-row gap-2 items-stretch w-full"
              >
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex flex-col xl:flex-row gap-2">
                    <FormSelect label="From" value={from} onChange={setFrom} placeholder="City, domestic or international..." icon={<MapPin className="size-3.5 text-[var(--color-muted-foreground)]" />} options={cities} className="flex-1" />
                    <FormSelect label="To" value={to} onChange={setTo} placeholder="City, domestic or international..." icon={<MapPin className="size-3.5 text-[var(--color-muted-foreground)]" />} options={cities} className="flex-1" />
                    <div className="flex gap-2 flex-1">
                      <FormDate label="Departure date" value={departure} onChange={setDeparture} placeholder="Sunday, Nov 16" className="flex-1 xl:flex-none xl:w-[188px]" />
                      <FormDate label="Return date" value={returnDate} onChange={setReturnDate} placeholder="Sunday, Nov 16" className="flex-1 xl:flex-none xl:w-[188px]" />
                    </div>
                  </div>
                  <FormSelect label="Number of passengers, seat class" value={pax} onChange={setPax} placeholder="3 passengers , economy/premium economy..." icon={<Users className="size-3.5 text-[var(--color-muted-foreground)]" />} options={passengers} />
                </div>
                <button type="submit" className="flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl transition-colors cursor-pointer h-10 lg:h-auto lg:w-[58px] lg:shrink-0" aria-label="Search flights">
                  <Search className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── Teal branding panel with airplane + clouds ── */
function TealPanel({ title }: { title: string }) {
  return (
    <div className="relative w-full lg:w-[338px] h-[116px] md:h-[211px] shrink-0 overflow-hidden rounded-xl lg:rounded-r-none" style={{ backgroundColor: "#29A2C3" }}>
      <div className="absolute inset-0 bg-[var(--color-primary)] opacity-80" />
      <Image src="/images/eticket-cloud.png" alt="" width={2442} height={474} className="absolute top-[-103px] left-[-523px] w-[2442px] opacity-90 pointer-events-none select-none -scale-y-100 rotate-[-0.37deg]" aria-hidden="true" />
      <Image src="/images/eticket-cloud.png" alt="" width={2265} height={439} className="absolute top-[-14px] left-[-468px] w-[2265px] opacity-90 pointer-events-none select-none rotate-[-0.37deg]" aria-hidden="true" />
      <Image src="/images/eticket-airplane.png" alt="Airplane" width={493} height={179} className="absolute pointer-events-none select-none w-[330px] md:w-[493px] top-[10px] left-[28px] md:top-[60px] md:left-[85px] animate-float" priority />
      <h2 className="absolute left-3 top-3 md:left-[25px] md:top-[21px] text-white font-bold text-[28px] md:text-5xl lg:text-6xl leading-[1.2] tracking-[0.07px] md:tracking-[0.15px] z-10">
        {title}
      </h2>
    </div>
  );
}

/* ── Punch hole (ticket perforation) ── */
function PunchHole({ side }: { side: "left" | "right" }) {
  const cls = side === "left"
    ? "left-0 rounded-r-full shadow-[inset_-2px_0_5px_rgba(0,0,0,0.08)]"
    : "right-0 rounded-l-full shadow-[inset_2px_0_5px_rgba(0,0,0,0.08)]";
  return <div className={`absolute top-1/2 -translate-y-1/2 z-20 w-4 h-8 bg-[var(--color-background)] hidden lg:block ${cls}`} aria-hidden="true" />;
}

/* ── Select dropdown field ── */
function FormSelect({ label, value, onChange, placeholder, icon, options, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
  icon: React.ReactNode; options: SelectOption[]; className?: string;
}) {
  return (
    <div className={`bg-[#F3F3F3] rounded-xl p-3 flex flex-col gap-1 flex-1 min-w-0 transition-all duration-200 has-[button[data-state=open]]:bg-white has-[button[data-state=open]]:ring-2 has-[button[data-state=open]]:ring-[var(--color-ring)]/40 has-[button[data-state=open]]:shadow-sm ${className}`}>
      <p className="text-xs font-bold leading-[1.3] text-[var(--color-foreground)] truncate">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-auto border-0 shadow-none bg-transparent p-0 text-xs leading-[1.5] gap-1 w-full focus:ring-0 focus-visible:ring-0 [&>svg]:text-[var(--color-muted-foreground)] [&>svg]:size-3.5 cursor-pointer max-w-full">
          <span className="shrink-0">{icon}</span>
          <span className="truncate text-left flex-1"><SelectValue placeholder={placeholder} /></span>
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={8} className="rounded-xl border-[var(--color-border)] shadow-lg max-h-[280px] bg-white">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="rounded-lg cursor-pointer text-sm focus:bg-[var(--color-secondary)] focus:text-[var(--color-secondary-foreground)]">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/* ── Date picker field with calendar popover ── */
function FormDate({ label, value, onChange, placeholder, className = "" }: {
  label: string; value: Date | undefined; onChange: (d: Date | undefined) => void;
  placeholder: string; className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-[#F3F3F3] rounded-xl p-3 flex flex-col gap-1 flex-1 min-w-0 transition-all duration-200 ${open ? "bg-white ring-2 ring-[var(--color-ring)]/40 shadow-sm" : ""} ${className}`}>
      <p className="text-xs font-bold leading-[1.3] text-[var(--color-foreground)] truncate">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="flex items-center gap-1 text-left w-full cursor-pointer max-w-full">
            <CalendarIcon className="size-3.5 text-[#828282] shrink-0" />
            <span className={`flex-1 text-xs leading-[1.5] truncate ${value ? "text-[var(--color-foreground)]" : "text-[#828282]"}`}>
              {value ? format(value, "EEEE, MMM d") : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-auto p-0 rounded-xl border-[var(--color-border)] shadow-lg bg-white">
          <Calendar
            mode="single" selected={value}
            onSelect={(d) => { onChange(d); setOpen(false); }}
            disabled={{ before: new Date() }}
            className="[--cell-size:36px]"
            classNames={{
              today: "rounded-md bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]",
              day: "group/day relative aspect-square h-full w-full p-0 text-center select-none",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
