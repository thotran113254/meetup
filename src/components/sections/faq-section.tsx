import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
  className?: string;
}

/**
 * FaqSection - FAQ list powered by Radix Accordion for accessible expand/collapse.
 */
export function FaqSection({
  title = "Cau hoi thuong gap",
  subtitle,
  faqs,
  className,
}: FaqSectionProps) {
  return (
    <section className={cn("section-padding bg-[var(--color-muted)]", className)}>
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">{subtitle}</p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden px-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm sm:text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
