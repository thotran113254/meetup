import { createHmac, timingSafeEqual } from "crypto";

/**
 * Build the hash data string from params:
 * - Sort keys alphabetically
 * - Include only vpc_* and user_* keys (exclude vpc_SecureHash)
 * - Join as key=value&key=value
 */
function buildHashData(
  params: Record<string, string | number | boolean>,
): string {
  return Object.keys(params)
    .sort()
    .filter(
      (key) =>
        params[key] != null &&
        key !== "vpc_SecureHash" &&
        (key.startsWith("vpc_") || key.startsWith("user_")),
    )
    .map((key) => `${key}=${params[key]}`)
    .join("&");
}

/** Generate HMAC-SHA256 hash (uppercase hex) */
export function signOnepayParams(
  params: Record<string, string | number | boolean>,
  secureSecretHex: string,
): string {
  const hashData = buildHashData(params);
  const secretBinary = Buffer.from(secureSecretHex, "hex");
  return createHmac("sha256", secretBinary)
    .update(hashData)
    .digest("hex")
    .toUpperCase();
}

/** Verify incoming OnePay hash matches computed hash (timing-safe) */
export function verifyOnepayHash(
  params: Record<string, string>,
  secureSecretHex: string,
): boolean {
  const receivedHash = params.vpc_SecureHash;
  if (!receivedHash) return false;
  const computed = signOnepayParams(params, secureSecretHex);
  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(receivedHash.toUpperCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
