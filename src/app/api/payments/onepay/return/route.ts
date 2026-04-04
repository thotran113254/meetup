import { NextRequest, NextResponse } from "next/server";
import { processOnepayCallback } from "@/lib/payments/onepay-response-handler";

/**
 * OnePay Return URL — browser GET redirect after payment.
 * Verifies hash, updates booking, redirects to result page.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log(
      "[OnePay Return] Received:",
      params.vpc_OrderInfo,
      "TxnResponse:",
      params.vpc_TxnResponseCode,
    );

    const result = await processOnepayCallback(params);
    const code = result.bookingCode || "unknown";

    if (!result.verified) {
      return NextResponse.redirect(
        new URL(
          `/tours/checkout/result?code=${code}&error=invalid_hash`,
          request.url,
        ),
      );
    }

    return NextResponse.redirect(
      new URL(`/tours/checkout/result?code=${code}`, request.url),
    );
  } catch (error) {
    console.error("[OnePay Return] Error:", error);
    return NextResponse.redirect(
      new URL("/tours/checkout/result?error=system_error", request.url),
    );
  }
}
