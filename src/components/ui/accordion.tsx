"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  value,
  children,
  ...props
}: {
  className?: string;
  value: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "value">) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn("border-b border-[var(--color-border)]", className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 pt-0 text-[var(--color-muted-foreground)]", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
