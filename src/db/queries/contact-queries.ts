import { getDb } from "../connection";
import { contactSubmissions } from "../schema";

/** Save a contact form submission */
export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const result = await getDb()
    .insert(contactSubmissions)
    .values(data)
    .returning();
  return result[0];
}
