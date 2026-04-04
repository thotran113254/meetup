/** OnePay gateway configuration — reads from env at call time */
export function getOnepayConfig() {
  const merchantId = process.env.ONEPAY_MERCHANT_ID;
  const accessCode = process.env.ONEPAY_ACCESS_CODE;
  const secureSecret = process.env.ONEPAY_SECURE_SECRET;
  const paymentUrl = process.env.ONEPAY_PAYMENT_URL;
  const returnUrl = process.env.ONEPAY_RETURN_URL;

  if (!merchantId || !accessCode || !secureSecret || !paymentUrl || !returnUrl) {
    throw new Error("Missing OnePay environment variables. Check .env.local");
  }

  return { merchantId, accessCode, secureSecret, paymentUrl, returnUrl };
}
