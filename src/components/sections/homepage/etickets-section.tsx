"use client";

/**
 * EticketsSection — e-Tickets flight search banner + form.
 * Teal gradient banner on the left, white search card on the right.
 * Client component for form state management.
 */

import { useState } from "react";
import { Search } from "lucide-react";

export function EticketsSection() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    departure: "",
    returnDate: "",
    passengers: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const inputClass = "w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] bg-[var(--color-background)]";

  return (
    <section className="py-10 md:py-14 bg-[var(--color-background)]">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md border border-[var(--color-border)]">
          {/* Left: teal gradient banner */}
          <div
            className="flex flex-col justify-center items-start px-8 py-10 min-w-[200px] md:w-56"
            style={{ background: "linear-gradient(135deg, #2CBCB3 0%, #239A93 100%)" }}
          >
            <h2 className="text-white font-extrabold text-3xl sm:text-4xl leading-tight mb-4">
              e-Tickets
            </h2>
            <span className="text-white/80 text-6xl select-none" aria-hidden="true">✈</span>
          </div>

          {/* Right: search form */}
          <form onSubmit={handleSubmit} className="flex-1 bg-[var(--color-card)] p-6 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <div>
                <label htmlFor="eticket-from" className="block text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">From</label>
                <input id="eticket-from" type="text" name="from" value={form.from} onChange={handleChange} placeholder="City, domestic or International..." className={inputClass} />
              </div>
              <div>
                <label htmlFor="eticket-to" className="block text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">To</label>
                <input id="eticket-to" type="text" name="to" value={form.to} onChange={handleChange} placeholder="City, domestic or International..." className={inputClass} />
              </div>
              <div>
                <label htmlFor="eticket-departure" className="block text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Departure date</label>
                <input id="eticket-departure" type="date" name="departure" value={form.departure} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="eticket-return" className="block text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Return date</label>
                <input id="eticket-return" type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="eticket-passengers" className="block text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Number of passengers, seat class</label>
                <input id="eticket-passengers" type="text" name="passengers" value={form.passengers} onChange={handleChange} placeholder="3 passengers , economy/premium economy..." className={inputClass} />
              </div>
              <div className="flex items-end">
                <button type="submit" className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-2 rounded-lg transition-colors h-[38px]" aria-label="Search flights">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
