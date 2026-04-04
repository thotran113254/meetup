# OnePay Payment Integration - Sequence Diagrams

## 1. Payment Creation & URL Generation Sequence

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐         ┌──────────┐
│   Mobile    │         │   Backend    │         │ Database │         │  OnePay  │
│    App      │         │   (NestJS)   │         │ MongoDB  │         │  Gateway │
└──────┬──────┘         └──────┬───────┘         └────┬─────┘         └────┬─────┘
       │                       │                       │                     │
       │  POST /app/order      │                       │                     │
       │    (order details)    │                       │                     │
       ├──────────────────────>│                       │                     │
       │                       │                       │                     │
       │                       │ 1. Create Order       │                     │
       │                       │    status='processing'│                     │
       │                       ├──────────────────────>│                     │
       │                       │                       │                     │
       │                       │ Generate code (uid)   │                     │
       │                       │ Calculate pricing     │                     │
       │                       │ Convert USD→VND       │                     │
       │                       │ * curency_transfer    │                     │
       │                       │                       │                     │
       │                       │ 2. Build pay_data     │                     │
       │                       │ └─ vpc_Merchant       │                     │
       │                       │ └─ vpc_AccessCode     │                     │
       │                       │ └─ vpc_OrderInfo      │                     │
       │                       │ └─ vpc_Amount         │                     │
       │                       │    (VND * 100)       │                     │
       │                       │ └─ vpc_ReturnURL      │                     │
       │                       │ └─ vpc_Locale         │                     │
       │                       │ └─ vpc_Currency:'VND' │                     │
       │                       │ └─ vpc_Version: 2     │                     │
       │                       │ └─ vpc_Command:'pay'  │                     │
       │                       │ └─ vpc_Customer_Id    │                     │
       │                       │ └─ vpc_CreateToken:   │                     │
       │                       │    (if authenticated) │                     │
       │                       │                       │                     │
       │                       │ 3. Generate HMAC Hash │                     │
       │                       │    ┌─────────────────┐│                     │
       │                       │    │ Sort keys (AZ)  ││                     │
       │                       │    │ Filter vpc_*,   ││                     │
       │                       │    │ user_* only     ││                     │
       │                       │    │ Build: k=v&... ││                     │
       │                       │    │ Load secret hex ││                     │
       │                       │    │ Convert: hex→bin││                     │
       │                       │    │ HMAC-SHA256     ││                     │
       │                       │    │ .digest('hex')  ││                     │
       │                       │    │ .toUpperCase()  ││                     │
       │                       │    └─────────────────┘│                     │
       │                       │ Result: vpc_SecureHash│                     │
       │                       │                       │                     │
       │                       │ 4. Build redirect URL │                     │
       │                       │    pay_data +         │                     │
       │                       │    vpc_SecureHash     │                     │
       │                       │                       │                     │
       │                       │ 5. Save order to DB   │                     │
       │                       │    with data_pay: {}  │                     │
       │                       ├──────────────────────>│                     │
       │                       │                       │                     │
       │   Return pay data     │                       │                     │
       │   ├─pay_redirect      │                       │                     │
       │   ├─pay_data          │                       │                     │
       │   └─pay_data_securehash                      │                     │
       │<──────────────────────┤                       │                     │
       │                       │                       │                     │
       │ Redirect to OnePay    │                       │                     │
       │ with all parameters   │                       │                     │
       ├──────────────────────────────────────────────────────────────────> │
       │                       │                       │                     │
       │                       │                       │          User enters│
       │                       │                       │          card info  │
       │                       │                       │          & pays     │
       │                       │                       │                     │
       │  <─ Redirected back to vpc_ReturnURL ─────────────────────────────┤
       │     /app/order/{code}/thank?vpc_*=...&vpc_SecureHash=...          │
       │                       │                       │                     │
```

---

## 2. Callback/IPN Verification Sequence

```
┌──────────────┐         ┌──────────────┐         ┌──────────┐
│   OnePay     │         │   Backend    │         │ Database │
│   Server     │         │   (NestJS)   │         │ MongoDB  │
└──────┬───────┘         └──────┬───────┘         └────┬─────┘
       │                        │                      │
       │  GET /app/order/ipn?   │                      │
       │     vpc_OrderInfo=...  │                      │
       │     vpc_Amount=...     │                      │
       │     &vpc_TxnResponseCode=0                    │
       │     &vpc_SecureHash=... │                      │
       ├───────────────────────>│                      │
       │                        │                      │
       │                        │ 1. Extract query     │
       │                        │    all vpc_* params  │
       │                        │                      │
       │                        │ 2. Verify hash       │
       │                        │    ┌────────────────┐│
       │                        │    │ Sort keys (AZ) ││
       │                        │    │ Exclude:       ││
       │                        │    │  - vpc_SecureHash
       │                        │    │ Filter vpc_*,  ││
       │                        │    │ user_* only    ││
       │                        │    │ Build: k=v&... ││
       │                        │    │ Load secret hex ││
       │                        │    │ HMAC-SHA256    ││
       │                        │    │ Compare        ││
       │                        │    │ received_hash  ││
       │                        │    └────────────────┘│
       │                        │                      │
       │                        │ IF hash MISMATCH:    │
       │                        │ ├─ return '0&fail'   │
       │                        │ └─ ABORT             │
       │                        │                      │
       │                        │ 3. Lookup order by   │
       │                        │    vpc_OrderInfo     │
       │                        ├─────────────────────>│
       │                        │ Found order?         │
       │                        │<─────────────────────┤
       │                        │                      │
       │                        │ IF NOT FOUND:        │
       │                        │ ├─ return '0&fail'   │
       │                        │ └─ ABORT             │
       │                        │                      │
       │                        │ 4. Store transaction │
       │                        │    (Audit log)       │
       │                        ├─────────────────────>│
       │                        │ INSERT {             │
       │                        │  vpc_OrderInfo,      │
       │                        │  type: 'onepay',     │
       │                        │  data: {...}         │
       │                        │ }                    │
       │                        │                      │
       │                        │ 5. Check if already  │
       │                        │    processed         │
       │                        │    (status =         │
       │                        │     'success'?)      │
       │                        │                      │
       │                        │ 6. IF vpc_TokenNum   │
       │                        │    & vpc_TokenExp:   │
       │                        │                      │
       │                        │    Save to Wallet    │
       │                        ├─────────────────────>│
       │                        │ INSERT {             │
       │                        │  userId,             │
       │                        │  vpc_TokenNum,       │
       │                        │  vpc_TokenExp,       │
       │                        │  vpc_Card,           │
       │                        │  vpc_CardUid,        │
       │                        │  vpc_CardNum,        │
       │                        │  vpc_ItaBank         │
       │                        │ } (if not exists)    │
       │                        │                      │
       │                        │ 7. Check response    │
       │                        │    code              │
       │                        │                      │
       │                        │ IF vpc_TxnResponseCode
       │                        │    == 0:             │
       │                        │   Status='success'   │
       │                        │   Queue: email-send  │
       │                        │ ELSE:                │
       │                        │   Status='payfail'   │
       │                        │   Queue: email-send  │
       │                        ├─────────────────────>│
       │                        │ UPDATE order {       │
       │                        │   status,            │
       │                        │   data_pay: {...}    │
       │                        │ }                    │
       │                        │                      │
       │   Return response      │                      │
       │ responsecode=1&        │                      │
       │ desc=confirm-success   │                      │
       │<───────────────────────┤                      │
       │                        │                      │
```

---

## 3. Thank You Page Verification Sequence

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│   Browser   │         │   Backend    │         │ Database │
│   User      │         │   (NestJS)   │         │ MongoDB  │
└──────┬──────┘         └──────┬───────┘         └────┬─────┘
       │                       │                      │
       │ GET /app/order/       │                      │
       │  {code}/thank?vpc_*   │                      │
       ├──────────────────────>│                      │
       │                       │                      │
       │                       │ 1. Extract code      │
       │                       │    from URL param    │
       │                       │                      │
       │                       │ 2. Extract all       │
       │                       │    query params      │
       │                       │                      │
       │                       │ 3. Verify hash       │
       │                       │    (same as IPN)     │
       │                       │                      │
       │                       │ IF hash MISMATCH:    │
       │                       │ └─ throw 403         │
       │                       │    ForbiddenException
       │                       │                      │
       │                       │ 4. Lookup order by   │
       │                       │    code              │
       │                       ├─────────────────────>│
       │                       │ Lookup {code}        │
       │                       │<─────────────────────┤
       │                       │                      │
       │                       │ IF NOT FOUND:        │
       │                       │ └─ throw 404         │
       │                       │                      │
       │                       │ 5. Store transaction │
       │                       ├─────────────────────>│
       │                       │ INSERT {             │
       │                       │  vpc_OrderInfo,      │
       │                       │  data: {...}         │
       │                       │ }                    │
       │                       │                      │
       │                       │ 6. Check status      │
       │                       │                      │
       │                       │ IF status =          │
       │                       │    'success':        │
       │                       │   ├─ Return success  │
       │                       │   │  JSON or         │
       │                       │   └─ Redirect to     │
       │                       │      callback URL    │
       │                       │                      │
       │                       │ IF vpc_TxnResponseCode
       │                       │    == 0:             │
       │                       │   ├─ Update status   │
       │                       │   │  to 'success'    │
       │                       │   ├─ Save data_pay   │
       │                       │   ├─ Queue email     │
       │                       │   └─ Process token   │
       │                       │      if returned     │
       │                       │ ELSE:                │
       │                       │   ├─ Update status   │
       │                       │   │  to 'payfail'    │
       │                       │   ├─ Save data_pay   │
       │                       │   └─ Queue email     │
       │                       ├─────────────────────>│
       │                       │ UPDATE order         │
       │                       │                      │
       │   Redirect or JSON    │                      │
       │<──────────────────────┤                      │
       │                       │                      │
```

---

## 4. HMAC-SHA256 Hash Calculation - Detailed Step-by-Step

### Request Signing Example

```
Input:
{
  "Title": "One PAY",
  "AgainLink": "onepay.vn",
  "vpc_Merchant": "ABC",
  "vpc_AccessCode": "XYZ",
  "vpc_Amount": "250000000",
  "vpc_Command": "pay",
  "vpc_Currency": "VND",
  "vpc_Customer_Id": "user_123",
  "vpc_Locale": "vn",
  "vpc_MerchTxnRef": "1712345678",
  "vpc_OrderInfo": "ORDER123",
  "vpc_ReturnURL": "https://...",
  "vpc_Version": "2"
}

Secret (HEX): "a1b2c3d4e5f6..."

Step 1: Sort Keys Alphabetically
├─ AgainLink
├─ Title
├─ vpc_AccessCode
├─ vpc_Amount
├─ vpc_Command
├─ vpc_Currency
├─ vpc_Customer_Id
├─ vpc_Locale
├─ vpc_MerchTxnRef
├─ vpc_OrderInfo
├─ vpc_ReturnURL
└─ vpc_Version

Step 2: Filter & Build String (vpc_* and user_* only)
├─ vpc_AccessCode=XYZ&
├─ vpc_Amount=250000000&
├─ vpc_Command=pay&
├─ vpc_Currency=VND&
├─ vpc_Customer_Id=user_123&
├─ vpc_Locale=vn&
├─ vpc_MerchTxnRef=1712345678&
├─ vpc_OrderInfo=ORDER123&
├─ vpc_ReturnURL=https://...&
└─ vpc_Version=2
   (NO trailing &)

Result:
"vpc_AccessCode=XYZ&vpc_Amount=250000000&vpc_Command=pay&vpc_Currency=VND&vpc_Customer_Id=user_123&vpc_Locale=vn&vpc_MerchTxnRef=1712345678&vpc_OrderInfo=ORDER123&vpc_ReturnURL=https://...&vpc_Version=2"

Step 3: Convert Secret from HEX to Binary Buffer
Buffer.from("a1b2c3d4e5f6...", 'hex')
→ [0xA1, 0xB2, 0xC3, 0xD4, ...]

Step 4: Create HMAC-SHA256
createHmac('sha256', secretBuffer)
  .update(stringHashData)
  .digest('hex')
  .toUpperCase()

Result:
"F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0"

Step 5: Add to Request
vpc_SecureHash=F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0
```

---

## 5. Email Notification Trigger Sequence

```
┌──────────────┐         ┌──────────────┐         ┌─────────────┐
│   Backend    │         │   RabbitMQ   │         │  Email      │
│   (NestJS)   │         │   Message Q  │         │  Service    │
└──────┬───────┘         └──────┬───────┘         └──────┬──────┘
       │                        │                        │
       │ Payment callback       │                        │
       │ verified & processed   │                        │
       │                        │                        │
       │ addQueueExchanges(     │                        │
       │  "order",              │                        │
       │  "order-mail",         │                        │
       │  orderId._id           │                        │
       │ )                      │                        │
       │                        │                        │
       ├───────────────────────>│                        │
       │ Queue: {               │                        │
       │   orderId: "...",      │                        │
       │   status: "success"    │                        │
       │ }                      │                        │
       │                        │                        │
       │                        ├───────────────────────>│
       │                        │ Process order          │
       │                        │ Fetch full data        │
       │                        │ Build email(s)         │
       │                        │                        │
       │                        │ Recipients:            │
       │                        │ ├─ Customer email      │
       │                        │ ├─ Vendor email        │
       │                        │ ├─ Affiliate email      │
       │                        │ └─ Admin (with CC)     │
       │                        │                        │
       │                        │ Template:              │
       │                        │ Email_New_Order_*      │
       │                        │                        │
       │                        │ Data variables:        │
       │                        │ ├─ tour_name           │
       │                        │ ├─ user_name           │
       │                        │ ├─ order_code          │
       │                        │ ├─ order_total         │
       │                        │ ├─ order_detail (HTML) │
       │                        │ ├─ vendor_name         │
       │                        │ ├─ aff_name            │
       │                        │ └─ ...                 │
       │                        │                        │
       │                        │ Send emails            │
       │                        ├───────────────────────>│
       │                        │                        │ To: customer,
       │                        │                        │     vendor,
       │                        │                        │     affiliate,
       │                        │                        │     admin
       │                        │                        │
       │                        │                        │ Emails sent
       │                        │                        │
```

---

## 6. Order Status State Machine

```
                    ┌─────────────────┐
                    │ Order Created   │
                    │ status:         │
                    │ 'processing'    │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │  IPN Callback   │   │  Thank You Page │
        │  from OnePay    │   │  GET endpoint   │
        │                 │   │                 │
        │ HMAC verified   │   │ HMAC verified   │
        │ vpc_*           │   │ vpc_*           │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │vpc_TxnResponse   │         │vpc_TxnResponse   │
        │Code == 0?    │         │Code == 0?    │
        └──────┬───────┘         └──────┬───────┘
               │ YES                    │ YES
               │                        │
               ▼                        ▼
        ┌──────────────┐         ┌──────────────┐
        │Update status │         │Update status │
        │status:       │         │status:       │
        │'success'     │         │'success'     │
        │              │         │              │
        │Save data_pay │         │Save data_pay │
        │data: {...}   │         │data: {...}   │
        │              │         │              │
        │Save token    │         │Save token    │
        │(if any)      │         │(if any)      │
        │              │         │              │
        │Queue: email  │         │Queue: email  │
        │Email status: │         │Email status: │
        │'success'     │         │'success'     │
        └──────┬───────┘         └──────┬───────┘
               │ NO                    │ NO
               │                       │
               ▼                       ▼
        ┌──────────────┐         ┌──────────────┐
        │Update status │         │Update status │
        │status:       │         │status:       │
        │'payfail'     │         │'payfail'     │
        │              │         │              │
        │Save data_pay │         │Save data_pay │
        │data: {...}   │         │data: {...}   │
        │              │         │              │
        │Queue: email  │         │Queue: email  │
        │Email status: │         │Email status: │
        │'payfail'     │         │'payfail'     │
        └──────┬───────┘         └──────┬───────┘
               │                       │
               └───────────┬───────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │ Email sent to: │
                   │ - Customer     │
                   │ - Vendor       │
                   │ - Affiliate    │
                   │ - Admin        │
                   └────────────────┘

Note: Multiple IPN/Thank calls for same order
      are idempotent (status check prevents
      duplicate processing)
```

---

## 7. Data Flow - Price Calculation

```
User Booking Input
        ↓
┌──────────────────────────────────┐
│ Line Items (from DB):            │
│ ├─ tour_price_id_1: $50 x 2 pax  │
│ ├─ tour_price_id_2: $30 x 2 pax  │
│ → Subtotal: $160                 │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Extensions (Services/Gifts):      │
│ ├─ service_id_1: $20 x 2 pax     │
│ ├─ service_id_2: $15 x 1         │
│ → Extension total: $55            │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Total in USD:                    │
│ $160 + $55 = $215                │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Apply Discount (if any):         │
│ $215 - $10 discount = $205       │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Currency Conversion:             │
│ Fetch rate: 1 USD = 23,684 VND   │
│ $205 x 23,684 = 4,855,220 VND   │
│ (stored as total_convert_vn)     │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Payment Amount (in cents):       │
│ 4,855,220 * 100 = 485,522,000   │
│ (sent as vpc_Amount)             │
└──────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Database Storage (price object): │
│ {                                │
│   total: 205,                    │
│   discount: 10,                  │
│   total_cost: (VND cost),        │
│   total_convert_vn: 4855220      │
│ }                                │
└──────────────────────────────────┘
```

