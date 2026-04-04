import { randomBytes } from "crypto";

/** Generate a unique booking code: BK-XXXXXXXX (8 hex chars) */
export function generateBookingCode(): string {
  return `BK-${randomBytes(4).toString("hex")}`;
}
