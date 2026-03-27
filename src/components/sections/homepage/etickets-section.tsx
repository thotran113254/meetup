"use client";

/**
 * EticketsSection — e-Tickets flight search banner + form.
 * Figma node 13263:4171.
 * Left: teal gradient panel (~338px) with decorative airplane.
 * Right: white card with 4-col date/city row + full-width passengers row + search btn.
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

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white h-[42px]";

  const labelClass = "block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide";

  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Outer card with nav dots on left & right edges */}
        <div className="relative">
          {/* Left nav dot */}
          <button
            aria-label="Previous"
            className="absolute left-[-16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hidden sm:flex"
          >
            <span className="w-2 h-2 border-l-2 border-b-2 border-gray-400 rotate-45 inline-block translate-x-0.5" />
          </button>

          {/* Right nav dot */}
          <button
            aria-label="Next"
            className="absolute right-[-16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hidden sm:flex"
          >
            <span className="w-2 h-2 border-r-2 border-t-2 border-gray-400 rotate-45 inline-block -translate-x-0.5" />
          </button>

          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md border border-gray-100">
            {/* Left: teal gradient panel — 338px per Figma */}
            <div
              className="flex flex-col justify-center items-center px-8 py-10 md:w-[338px] shrink-0 relative overflow-hidden"
              style={{ background: "linear-gradient(160deg, #5DD6D0 0%, #2CBCB3 40%, #1A9A93 100%)" }}
            >
              {/* Decorative large airplane */}
              <span
                className="absolute text-white/20 select-none pointer-events-none"
                style={{ fontSize: "200px", top: "-20px", right: "-30px", transform: "rotate(-20deg)" }}
                aria-hidden="true"
              >
                ✈
              </span>
              {/* Small decorative airplane */}
              <span
                className="absolute text-white/30 select-none pointer-events-none"
                style={{ fontSize: "48px", bottom: "30px", left: "20px", transform: "rotate(10deg)" }}
                aria-hidden="true"
              >
                ✈
              </span>
              <h2
                className="text-white font-extrabold leading-tight relative z-10 text-center"
                style={{ fontSize: "52px", fontStyle: "italic", textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              >
                e-Tickets
              </h2>
            </div>

            {/* Right: search form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 bg-white p-6 flex flex-col justify-center gap-3"
            >
              {/* Row 1: From, To, Departure date, Return date — 4 equal cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="eticket-from" className={labelClass}>From</label>
                  <input
                    id="eticket-from"
                    type="text"
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    placeholder="City or airport..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="eticket-to" className={labelClass}>To</label>
                  <input
                    id="eticket-to"
                    type="text"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="City or airport..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="eticket-departure" className={labelClass}>Departure date</label>
                  <input
                    id="eticket-departure"
                    type="date"
                    name="departure"
                    value={form.departure}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="eticket-return" className={labelClass}>Return date</label>
                  <input
                    id="eticket-return"
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 2: Passengers/seat class (full width) + Search button */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label htmlFor="eticket-passengers" className={labelClass}>
                    Number of passengers, seat class
                  </label>
                  <input
                    id="eticket-passengers"
                    type="text"
                    name="passengers"
                    value={form.passengers}
                    onChange={handleChange}
                    placeholder="e.g. 3 passengers, Economy / Premium Economy..."
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center bg-[var(--color-primary)] hover:bg-[#239A93] text-white font-semibold rounded-lg transition-colors shrink-0"
                  style={{ width: "58px", height: "58px" }}
                  aria-label="Search flights"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
