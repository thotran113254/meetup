# NestJS Payment Integration Analysis: OnePay

**Date:** 2026-04-04  
**File Path:** `/home/automation/meetup/meetup-travel-website-be/src/`

---

## EXECUTIVE SUMMARY

The Meetup Travel backend implements OnePay payment gateway integration with:
- **API:** HMAC-SHA256 signed requests
- **Flow:** Order creation → Payment URL generation → IPN/Callback verification → Email notifications
- **Status:** Processing → Success/PayFail
- **Tokenization:** Card token storage for recurring payments

---

## 1. ONEPAY PAYMENT FLOW

### 1.1 Order Creation
**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/orders/order.service.ts`

**Entry Points:**
- `POST /app/order` - Authenticated user order creation
- `POST /app/order/web` - Anonymous web checkout

**Key Flow:**
1. Create order with status `EStatusOrder.processing`
2. Calculate total price (items + services + extensions)
3. Convert to VND: `total_convert_vn = total * curency_setting.transfer`
4. Generate unique order code: `uid(10)`
5. Return payment data via `serviceGetPayData(type_pay, orderContent, lang)`

### 1.2 Payment URL Generation
**Method:** `AppOrderService.serviceGetPayData()`  
**Lines:** 652-718

```typescript
async serviceGetPayData(type_pay, orderContent, lang): Promise<Order> {
    let pay_data: any = {
        vpc_Merchant: this.configService.get<string>('PAY_MERCHANT'),
        vpc_AccessCode: this.configService.get<string>('PAY_ACCESSCODE'),
        vpc_MerchTxnRef: Math.floor(Date.now() / 1000),
        vpc_OrderInfo: orderContent?.code,  // Order code
        vpc_Amount: orderContent?.price?.total_convert_vn * 100,  // VND in cents
        vpc_ReturnURL: this.configService.get<string>('PAY_RETURN') + orderContent.code + '/thank',
        vpc_Locale: lang == 'vn' ? 'vn' : 'en',
        vpc_Currency: 'VND',
        vpc_Version: 2,
        vpc_Command: 'pay',
        Title: 'One PAY',
        AgainLink: 'onepay.vn',
        vpc_Customer_Id: orderContent?.userId ? orderContent?.userId : 0
    };

    // Token handling for saved cards
    if (type_pay == "onepay") {
        pay_data.vpc_CreateToken = orderContent?.userId ? true : false
    } else if (type_pay == "APPLEPAY") {
        pay_data.vpc_CreateToken = orderContent?.userId ? true : false
        pay_data.vpc_CardList = type_pay
    } else {
        const checkWallet = await this.walletService.getOneWallet(type_pay);
        if (checkWallet?.vpc_TokenNum && checkWallet?.vpc_TokenExp) {
            pay_data.vpc_TokenNum = checkWallet?.vpc_TokenNum
            pay_data.vpc_TokenExp = checkWallet?.vpc_TokenExp
        }
    }
    
    // ... HMAC SIGNING (see section 2.1)
}
```

---

## 2. HMAC-SHA256 SIGNING ALGORITHM

### 2.1 Request Signing (Order → Payment)
**Method:** `AppOrderService.serviceGetPayData()`  
**Lines:** 684-709

```typescript
const Kiss = Object.keys(pay_data).sort();  // Sort keys alphabetically
let pay_dataAZ: any = {};
let stringHashData: any = '';
let urlRedirect = this.configService.get('PAY_URL') + '?';

for await (const item of Kiss) {
    pay_dataAZ[item] = pay_data[item];
    urlRedirect +=
        encodeURIComponent(item) +
        '=' +
        encodeURIComponent(pay_data[item]) +
        '&';
    if (
        pay_data[item] != null &&
        (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')
    ) {
        stringHashData += item + '=' + pay_data[item] + '&';
    }
}
stringHashData = stringHashData.slice(0, -1);  // Remove trailing &

const secureSecret = this.configService.get('PAY_SECURE_SECRET');
const secretBinary = Buffer.from(secureSecret, 'hex');  // Convert from hex
const vpc_SecureHash = createHmac('sha256', secretBinary)
    .update(stringHashData)
    .digest('hex');
urlRedirect += 'vpc_SecureHash=' + vpc_SecureHash.toUpperCase();
```

**Key Points:**
- **Secret Key Format:** Stored as HEX string in config, converted to binary buffer
- **Data to Sign:** Only `vpc_*` and `user_*` prefixed fields (alphabetically sorted)
- **Hash Algorithm:** HMAC-SHA256
- **Output Format:** HEX uppercase
- **URL Encoding:** Standard URI encoding for redirect URL

### 2.2 Response Verification (Callback → Order)
**Method:** `AppOrderService.updateIPNOrder()` or `updateThankOrder()`  
**Lines:** 577-650 and 720-808

```typescript
async updateIPNOrder(pay_data) {
    const code = pay_data.vpc_OrderInfo;
    const [orderId, addTransaction] = await Promise.all([
        this.main_repository.findOneByCondition({ code }),
        this.transactionService.addTransaction({
            vpc_OrderInfo: pay_data?.vpc_OrderInfo,
            data: pay_data,
            type: "onepay"
        })
    ])
    
    if (orderId && orderId?.status != 'success') {
        // Token handling
        if (pay_data?.vpc_TokenNum && pay_data?.vpc_TokenExp) {
            this.walletService.createWallet(pay_data, orderId);
        }
        
        const Kiss = Object.keys(pay_data).sort();
        let stringHashData: any = '';
        let pay_dataAZ: any = {};
        
        for await (const item of Kiss) {
            pay_dataAZ[item] = pay_data[item];
            if (
                pay_data[item] != null &&
                item != 'vpc_SecureHash' &&  // EXCLUDE the hash itself
                (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')
            ) {
                stringHashData += item + '=' + pay_data[item] + '&';
            }
        }
        stringHashData = stringHashData.slice(0, -1);
        
        const secureSecret = this.configService.get('PAY_SECURE_SECRET');
        const secretBinary = Buffer.from(secureSecret, 'hex');
        const vpc_SecureHash = createHmac('sha256', secretBinary)
            .update(stringHashData)
            .digest('hex');
        
        // CRITICAL: Case-insensitive comparison
        if (vpc_SecureHash.toUpperCase() == pay_data?.vpc_SecureHash) {
            // Signature valid
            if (pay_data?.vpc_TxnResponseCode == 0) {
                // Payment successful
                await this.main_repository.update(orderId._id, {
                    status: 'success',
                    data_pay: pay_data,
                });
                await this.rabbitMqService.addQueueExchanges("order", "order-mail", orderId._id)
                return 'responsecode=1&desc=confirm-success';
            } else {
                // Payment failed
                await this.main_repository.update(orderId._id, {
                    status: 'payfail',
                    data_pay: pay_data,
                });
                await this.rabbitMqService.addQueueExchanges("order", "order-mail", orderId._id)
                return 'responsecode=1&desc=confirm-success';
            }
        } else {
            // Signature mismatch
            return 'responsecode=0&desc=confirm-fail';
        }
    }
}
```

---

## 3. API ENDPOINTS

### 3.1 Controllers
**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/orders/order.controller.ts`

| Endpoint | Method | Auth | Handler |
|----------|--------|------|---------|
| `/app/order` | POST | JWT | `createOrder()` |
| `/app/order/web` | POST | None | `createOrderWeb()` |
| `/app/order/web/:code` | GET | None | `getOrderWeb()` |
| `/app/order/:id` | PATCH | JWT | `updateOrder()` |
| `/app/order/ipn` | GET | None | `getOrderIPN()` |
| `/app/order/:code/thank` | GET | None | `getOrderThanks()` |
| `/app/order/:id` | GET | JWT | `getOrder()` |
| `/app/order` | GET | JWT | `getAllOrder()` |

### 3.2 IPN Callback
**Endpoint:** `GET /app/order/ipn`  
**Expects:** Query parameters from OnePay (all `vpc_*` fields)  
**Returns:** `responsecode=1&desc=confirm-success` or `responsecode=0&desc=confirm-fail`

### 3.3 Thank You Page
**Endpoint:** `GET /app/order/:code/thank`  
**Expects:** Query parameters from OnePay  
**Returns:** Redirect to callback URL or success JSON  
**Method:** `updateThankOrder()` (lines 720-808)

---

## 4. DATA MODELS

### 4.1 Order Entity
**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/entities/order.entity.ts`

```typescript
@Schema()
export class Order {
    date: string;                          // YYYY-MM-DD
    price: {
        total: number;                     // Original currency
        total_cost: number;                // Cost in VND
        total_convert_vn: number;          // Total in VND (for payment)
        discount: number;
    };
    pick_up: string;                       // Pickup location
    address: string;                       // Customer address
    name: string;                          // Customer name
    email: string;                         // Customer email
    whatsapp: string;                      // Customer WhatsApp
    messager: string;                      // Special requests
    type: string;                          // Order type
    product_id: ObjectId;                  // Reference to Tour
    line_item: LineItem[];                 // Tour price items
    extension: ExtensionLineItem[];        // Services/gifts
    type_pay: string;                      // Payment method
    customer_id: ObjectId;                 // Reference to User
    status: string;                        // 'processing' | 'success' | 'payfail'
    channel: string;                       // 'app' | 'web'
    callback: string;                      // URL for web orders
    code: string;                          // UNIQUE order code (10 chars)
    data_pay: Record<string, any>;         // Raw OnePay response
    total: number;                         // Total amount (USD)
    pax: number;                           // Number of passengers
    commission: number;                    // Commission amount
    provider_code: ObjectId;               // Affiliate vendor
    vendorId: ObjectId;                    // Tour vendor
    created_at: Date;
    updated_at: Date;
}
```

### 4.2 Transaction Entity
**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/entities/transaction.entity.ts`

```typescript
@Schema()
export class Transaction {
    vpc_OrderInfo: string;                 // Order code
    type: string;                          // 'onepay'
    data: Record<string, any>;             // Full OnePay response
    created_at: Date;
    updated_at: Date;
}
```

### 4.3 Wallet Entity
**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/entities/wallet.entity.ts`

```typescript
@Schema()
export class Wallet {
    userId: ObjectId;                      // User reference
    type: string;                          // 'onepay'
    vpc_TokenNum: string;                  // Card token number
    vpc_TokenExp: string;                  // Token expiration
    vpc_Card: string;                      // Card type (Visa, MC, etc)
    vpc_CardUid: string;                   // OnePay card UID
    vpc_CardNum: string;                   // Last 4 digits
    vpc_ItaBank: string;                   // Issuing bank
    data: Record<string, any>;             // Full token data
    status: string;                        // 'success'
    messager: string;                      // Notes
    created_at: Date;
    updated_at: Date;
}
```

---

## 5. PAYMENT STATUS FLOW

**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/enums/status.enum.ts`

```typescript
export enum EStatusOrder {
    draft = 'draft',
    created = 'created',
    processing = 'processing',      // Initial state after order creation
    success = 'success',             // Successful payment (vpc_TxnResponseCode == 0)
}
```

**Custom Status from Code:**
- `payfail` - Payment rejected (vpc_TxnResponseCode != 0)

**Status Transitions:**
```
processing → success     [vpc_TxnResponseCode == 0]
processing → payfail     [vpc_TxnResponseCode != 0]
success → success        [idempotent, returns early]
```

---

## 6. CONFIGURATION

**Environment Variables Required:**

| Variable | Purpose | Type | Example |
|----------|---------|------|---------|
| `PAY_MERCHANT` | Merchant ID | String | From OnePay dashboard |
| `PAY_ACCESSCODE` | Access code | String | From OnePay dashboard |
| `PAY_SECURE_SECRET` | HMAC key | HEX String | `a1b2c3d4e5f6...` (hex format) |
| `PAY_URL` | Payment gateway URL | String | `https://mtf.onepay.vn/paygate/vpcpay.op` |
| `PAY_RETURN` | Return URL base | String | `{domain}/app/order/` |
| `FALLBACK_LANGUAGE` | Default language | String | `en` |

---

## 7. TOKEN/WALLET MANAGEMENT

### 7.1 Token Creation
**Method:** `AppOrderService.serviceGetPayData()`  
**Logic:**
```typescript
if (type_pay == "onepay") {
    pay_data.vpc_CreateToken = orderContent?.userId ? true : false
}
```
- Tokens created only for authenticated users
- OnePay returns `vpc_TokenNum`, `vpc_TokenExp` in response

### 7.2 Token Storage
**Method:** `AppWalletService.createWallet()`  
**Lines:** 23-44

```typescript
async createWallet(pay_data, orderId) {
    if (pay_data?.vpc_TokenNum && pay_data?.vpc_TokenExp) {
        const checkExists = await this.main_repository.findOneByCondition({
            vpc_TokenNum: pay_data?.vpc_TokenNum
        })
        if (!checkExists) {
            this.main_repository.create({
                vpc_TokenNum: pay_data?.vpc_TokenNum,
                vpc_TokenExp: pay_data?.vpc_TokenExp,
                vpc_Card: pay_data?.vpc_Card,
                vpc_CardUid: pay_data?.vpc_CardUid,
                vpc_CardNum: pay_data?.vpc_CardNum,
                vpc_ItaBank: pay_data?.vpc_ItaBank,
                status: "success",
                userId: orderId?.customer_id,
                type: "onepay",
            })
        }
    }
    return true;
}
```

### 7.3 Token Usage
**Method:** `AppOrderService.serviceGetPayData()`  
**Logic:**
```typescript
else {
    const checkWallet = await this.walletService.getOneWallet(type_pay);
    if (checkWallet?.vpc_TokenNum && checkWallet?.vpc_TokenExp) {
        pay_data.vpc_TokenNum = checkWallet?.vpc_TokenNum
        pay_data.vpc_TokenExp = checkWallet?.vpc_TokenExp
    }
}
```
- Pass `vpc_TokenNum` and `vpc_TokenExp` to skip payment details entry
- One-click payment for stored cards

---

## 8. EMAIL NOTIFICATIONS

### 8.1 Trigger
**Event:** Order status changes to `success` or `payfail`  
**Mechanism:** RabbitMQ async message  
**Line:** `await this.rabbitMqService.addQueueExchanges("order", "order-mail", orderId._id)`

### 8.2 Recipients
**File:** `/home/automation/meetup/meetup-travel-website-be/src/modules/orders/order.service.ts`  
**Lines:** 818-858

- **Customer:** `orderInfo?.email`
- **Vendor:** `orderInfo?.vendorId?.email`
- **Affiliate:** `orderInfo?.provider_code?.email`
- **Admin:** `vn.meetup.travel@gmail.com` (CC: `booking@meetup.travel`)

### 8.3 Email Template
**Code:** `Email_New_Order_*` (User, Vendor, Aff, Admin variants)  
**Data Variables:**
```
tour_name, user_name, user_address, user_email, user_whatsapp,
order_detail (HTML table), order_code, order_pick_up, order_date,
order_created_at, order_total, order_pax, order_discount,
order_total_convert_vn, order_status,
aff_name, aff_company, aff_email, aff_hotline[1-3],
vendor_name, vendor_company, vendor_email, vendor_hotline[1-3]
```

---

## 9. CRITICAL SECURITY NOTES

### 9.1 Hash Verification
- **✓ Correct:** Case-insensitive uppercase comparison
- **✓ Correct:** Exclude `vpc_SecureHash` from signed data
- **✓ Correct:** Convert secret from HEX to binary buffer
- **✓ Correct:** Sort keys alphabetically before signing

### 9.2 Data Storage
- **✓ Stored:** Full OnePay response in `order.data_pay` (for audit)
- **✓ Stored:** All transactions in separate Transaction collection (audit trail)
- **✓ Stored:** Token data in Wallet (with duplicate check)

### 9.3 Idempotency
- **✓ Safe:** Multiple IPN callbacks for same order (checks `status != 'success'`)
- **✓ Safe:** Duplicate wallet tokens prevented (checks `vpc_TokenNum` exists)

---

## 10. EXACT HASH GENERATION CODE SNIPPETS

### Request Signing (Generate Payment URL)
```typescript
// Sort parameters alphabetically
const Kiss = Object.keys(pay_data).sort();
let stringHashData = '';

for (const item of Kiss) {
    // Include only vpc_* and user_* prefixed fields
    if (
        pay_data[item] != null &&
        (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')
    ) {
        stringHashData += item + '=' + pay_data[item] + '&';
    }
}

// Remove trailing ampersand
stringHashData = stringHashData.slice(0, -1);

// Create signature
const secureSecret = this.configService.get('PAY_SECURE_SECRET');
const secretBinary = Buffer.from(secureSecret, 'hex');
const vpc_SecureHash = createHmac('sha256', secretBinary)
    .update(stringHashData)
    .digest('hex')
    .toUpperCase();
```

### Response Verification (Validate Callback)
```typescript
// Same process, BUT exclude vpc_SecureHash from data
const Kiss = Object.keys(pay_data).sort();
let stringHashData = '';

for (const item of Kiss) {
    if (
        pay_data[item] != null &&
        item != 'vpc_SecureHash' &&  // CRITICAL: Exclude the hash itself
        (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')
    ) {
        stringHashData += item + '=' + pay_data[item] + '&';
    }
}

stringHashData = stringHashData.slice(0, -1);

const secureSecret = this.configService.get('PAY_SECURE_SECRET');
const secretBinary = Buffer.from(secureSecret, 'hex');
const vpc_SecureHash = createHmac('sha256', secretBinary)
    .update(stringHashData)
    .digest('hex')
    .toUpperCase();

// Verify
const isValid = vpc_SecureHash === pay_data?.vpc_SecureHash.toUpperCase();
```

---

## 11. SAMPLE PAYMENT REQUEST STRUCTURE

```json
{
    "vpc_Merchant": "MEETUP",
    "vpc_AccessCode": "ABC123XYZ",
    "vpc_MerchTxnRef": 1712234567,
    "vpc_OrderInfo": "order_code_xyz",
    "vpc_Amount": 500000,
    "vpc_ReturnURL": "https://meetup.travel/app/order/order_code_xyz/thank",
    "vpc_Locale": "vn",
    "vpc_Currency": "VND",
    "vpc_Version": 2,
    "vpc_Command": "pay",
    "vpc_Customer_Id": "user_id_xyz",
    "vpc_CreateToken": true,
    "vpc_SecureHash": "ABCD1234..."
}
```

---

## 12. UNRESOLVED QUESTIONS

1. **PAY_RETURN URL Construction:** Are there multiple payment environments (sandbox vs production)? Currently hardcoded.
2. **.env.dev Secrets:** Actual merchant credentials not provided (privacy blocked). Need to validate against real OnePay API docs.
3. **Callback Security:** No webhook signature verification beyond HMAC. Are there rate limits or IP whitelisting?
4. **Idempotency Token:** No UUID tracking for duplicate submissions. `vpc_MerchTxnRef` is timestamp-based, collision risk if multiple requests in same second.
5. **Error Handling:** 404 thrown for missing orders, but should there be a generic 400 to avoid order code enumeration?
6. **Transaction Audit:** Transaction table stores events but never queries them. Query by `vpc_OrderInfo` exists but unused in payment flow.

---

## CRITICAL FILES SUMMARY

| File | Lines | Purpose |
|------|-------|---------|
| `order.service.ts` (app) | 58-809 | Order creation, payment URL generation, IPN/callback verification |
| `order.controller.ts` | 32-119 | All HTTP endpoints |
| `order.entity.ts` | 1-320 | Order schema with price breakdown, items, extensions |
| `transaction.entity.ts` | 1-51 | Payment transaction audit log |
| `wallet.entity.ts` | 1-109 | Saved card tokens for recurring payments |
| `wallet.service.ts` | 23-54 | Token management |
| `status.enum.ts` | 20-25 | Order status lifecycle |
