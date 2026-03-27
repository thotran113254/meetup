"use client";

/**
 * NewsletterSection — Email subscription card.
 * Light teal card: heading + quote on the left, stacked form inputs on the right.
 * Client component for form state.
 */

import { useState } from "react";

export function NewsletterSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up real subscription endpoint
  };

  return (
    <section className="py-10 md:py-14 bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Card with light teal/mint background */}
        <div className="rounded-2xl bg-[var(--color-secondary)] px-8 py-10 md:px-12 md:py-12">
          <div className="flex flex-col md:flex-row gap-10 items-center">

            {/* Left: heading + quote */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-foreground)] leading-tight mb-4">
                Like a travel expert<br />in your inbox
              </h2>
              <p className="text-[var(--color-muted-foreground)] text-sm sm:text-base italic max-w-sm">
                &ldquo;Friendship, integrity and a spirit of self-improvement forge the strength of an
                organization that continues to grow.&rdquo;
              </p>
            </div>

            {/* Right: subscription form */}
            <form onSubmit={handleSubmit} className="flex-1 w-full max-w-sm flex flex-col gap-3">
              <div>
                <label htmlFor="nl-first" className="sr-only">First name</label>
                <input id="nl-first" type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]" />
              </div>
              <div>
                <label htmlFor="nl-last" className="sr-only">Last name</label>
                <input id="nl-last" type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]" />
              </div>
              <div>
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input id="nl-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your e-mail address" required className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]" />
              </div>
              <button
                type="submit"
                className="w-fit bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-8 py-2.5 rounded-full transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
