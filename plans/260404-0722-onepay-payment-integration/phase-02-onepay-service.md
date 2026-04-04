# Phase 2: OnePay Service

## Overview
- **Priority**: P1 (blocker for Phases 3+4)
- **Status**: pending
- **Effort**: 1.5h
- **Depends on**: Phase 1 (types, constants)

Pure utility module: generate OnePay payment URLs and verify IPN/return hash signatures. No DB access — that stays in queries layer.

## Key Insights (from backend reference)

1. **Hash algorithm**: HMAC-SHA256 with `Buffer.from(secretHex, 'hex')` as key
2. **Hash data**: sorted `vpc_*` and `user_*` params joined as `key=value&key=value` (no trailing `&`)
3. **Exclude from hash**: `vpc_SecureHash` itself
4. **Amount**: VND * 100 (OnePay expects smallest currency unit)
5. **Return URL**: OnePay appends query params (vpc_TxnResponseCode, vpc_SecureHash, etc.)
6. **IPN**: POST body with same params — must respond `responsecode=1&desc=confirm-success`
7. **No wallet/token needed** — simplified vs backend (no `vpc_CreateToken`, `vpc_TokenNum`)

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/payments/onepay-config.ts` | Read env vars, validate presence |
| `src/lib/payments/onepay-hash.ts` | HMAC-SHA256 sign + verify functions |
| `src/lib/payments/onepay-url-builder.ts` | Build payment redirect URL |

## Implementation Steps

### Step 1: Create `src/lib/payments/onepay-config.ts`

```typescript
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
```

### Step 2: Create `src/lib/payments/onepay-hash.ts`

```typescript
import { createHmac } from "crypto";

/**
 * Build the hash data string from params:
 * - Sort keys alphabetically
 * - Include only vpc_* and user_* keys (exclude vpc_SecureHash)
 * - Join as key=value&key=value
 */
function buildHashData(params: Record<string, string | number | boolean>): string {
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
  return createHmac("sha256", secretBinary).update(hashData).digest("hex").toUpperCase();
}

/** Verify incoming OnePay hash matches computed hash */
export function verifyOnepayHash(
  params: Record<string, string>,
  secureSecretHex: string,
): boolean {
  const receivedHash = params.vpc_SecureHash;
  if (!receivedHash) return false;
  const computed = signOnepayParams(params, secureSecretHex);
  return computed === receivedHash.toUpperCase();
}
```

### Step 3: Create `src/lib/payments/onepay-url-builder.ts`

```typescript
import { getOnepayConfig } from "./onepay-config";
import { signOnepayParams } from "./onepay-hash";

type BuildPaymentUrlInput = {
  bookingCode: string;     // vpc_OrderInfo
  amountVnd: number;       // VND amount (will be * 100 for OnePay)
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
    vpc_Amount: input.amountVnd * 100,   // OnePay expects smallest unit
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
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`);
  queryParts.push(`vpc_SecureHash=${hash}`);

  return `${config.paymentUrl}?${queryParts.join("&")}`;
}
```

## Data Flow

```
buildOnepayPaymentUrl({ bookingCode, amountVnd })
  -> assemble vpc_* params
  -> signOnepayParams(params, secretHex)
     -> sort keys, filter vpc_*/user_*, join as string
     -> HMAC-SHA256 with hex-decoded secret
     -> uppercase hex digest
  -> append vpc_SecureHash to URL query
  -> return full redirect URL

verifyOnepayHash(incomingParams, secretHex)
  -> same sort/filter/join logic
  -> compare computed hash vs vpc_SecureHash from OnePay
  -> return boolean
```

## Todo

- [ ] Create `src/lib/payments/onepay-config.ts`
- [ ] Create `src/lib/payments/onepay-hash.ts`
- [ ] Create `src/lib/payments/onepay-url-builder.ts`
- [ ] Verify hash generation matches backend logic manually (test with known test credentials)
- [ ] `pnpm typecheck` passes

## Success Criteria

- `buildOnepayPaymentUrl()` returns a well-formed URL with valid HMAC hash
- `verifyOnepayHash()` correctly validates OnePay IPN/return params
- Hash output matches backend's `serviceGetPayData` and `updateIPNOrder` for same inputs
- No external dependencies beyond Node.js `crypto` module

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Hash mismatch with OnePay | Medium | High | Use exact same algorithm as backend; test with OnePay sandbox |
| Env vars missing at runtime | Low | High | `getOnepayConfig()` throws eagerly with clear message |
| URL encoding differences | Low | Medium | Use `encodeURIComponent` consistently, same as backend |

## Backwards Compatibility

- Pure additions, no existing files modified
- New `src/lib/payments/` directory
