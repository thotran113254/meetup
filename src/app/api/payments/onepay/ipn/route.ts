import { NextRequest } from "next/server";
import { processOnepayCallback } from "@/lib/payments/onepay-response-handler";

/**
 * OnePay IPN (Instant Payment Notification) — server-to-server POST.
 * No auth required — security via HMAC hash verification.
 * Must return plain text response (not JSON).
 */
export async function POST(request: NextRequest) {
  try {
    const params: Record<string, string> = {};

    // OnePay sends form-urlencoded body
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("form")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        params[key] = String(value);
      });
    } else {
      // JSON fallback
      const body = await request.json().catch(() => ({}));
      Object.entries(body).forEach(([key, value]) => {
        params[key] = String(value);
      });
    }

    console.log(
      "[OnePay IPN] Received:",
      params.vpc_OrderInfo,
      "TxnResponse:",
      params.vpc_TxnResponseCode,
    );

    const result = await processOnepayCallback(params);

    if (!result.verified || !result.bookingFound) {
      return new Response("responsecode=0&desc=confirm-fail", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("responsecode=1&desc=confirm-success", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("[OnePay IPN] Error:", error);
    return new Response("responsecode=0&desc=confirm-fail", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
