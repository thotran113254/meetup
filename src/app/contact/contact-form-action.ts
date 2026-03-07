"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact-schema";
import { createContactSubmission } from "@/db/queries/contact-queries";

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

/** Server action for contact form - validates + saves to DB */
export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormState> {
  // Server-side validation (defense in depth)
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Du lieu khong hop le. Vui long kiem tra lai." };
  }

  try {
    await createContactSubmission({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      message: parsed.data.message,
    });

    return { success: true, message: "Gui thanh cong! Chung toi se lien he ban trong 24 gio." };
  } catch {
    return { success: false, message: "Loi he thong. Vui long thu lai sau." };
  }
}
