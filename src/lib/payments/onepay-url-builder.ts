import { getOnepayConfig } from "./onepay-config";
import { signOnepayParams } from "./onepay-hash";

type BuildPaymentUrlInput = {
  bookingCode: string; // vpc_OrderInfo
  amountVnd: number; // VND amount (will be × 100 for OnePay)
  locale?: "vn" | "en";
};

/** Build full OnePay redirect URL with signed hash */
export function buildOnepayPaymentUrl(input: BuildPaymentUrlInput): string {
  const config = getOnepayConfig();

  const params: Record<string, string | number | boolean> = {
    vpc_Merchant: config.merchantId,
    vpc_AccessCode: config.accessCode,
    vpc_MerchTxnRef: `${Date.now()}-${input.bookingCode}`,
    vpc_OrderInfo: input.bookingCode,
    vpc_Amount: input.amountVnd * 100, // OnePay expects smallest unit
    vpc_ReturnURL: config.returnUrl,
    vpc_Locale: input.locale ?? "en",
    vpc_Currency: "VND",
    vpc_Version: 2,
    vpc_Command: "pay",
    Title: "OnePay",
    AgainLink: "onepay.vn",
  };

  const hash = signOnepayParams(params, config.secureSecret);

  // Build URL: sorted params + hash at the end
  const queryParts = Object.keys(params)
    .sort()
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`,
    );
  queryParts.push(`vpc_SecureHash=${hash}`);

  return `${config.paymentUrl}?${queryParts.join("&")}`;
}
