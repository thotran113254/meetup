# OnePay Payment Integration - Quick Reference

## HMAC-SHA256 Hash Generation (Critical Code)

### Signing Request Data (Generate Payment URL)
```javascript
const crypto = require('crypto');

function generatePaymentHash(paymentData, secretHex) {
    // 1. Sort all keys alphabetically
    const keys = Object.keys(paymentData).sort();
    
    // 2. Build string from vpc_* and user_* fields only
    let dataToSign = '';
    for (const key of keys) {
        if (paymentData[key] !== null && 
            (key.startsWith('vpc_') || key.startsWith('user_'))) {
            dataToSign += key + '=' + paymentData[key] + '&';
        }
    }
    
    // 3. Remove trailing '&'
    dataToSign = dataToSign.slice(0, -1);
    
    // 4. Convert hex secret to binary buffer
    const secretBuffer = Buffer.from(secretHex, 'hex');
    
    // 5. Create HMAC-SHA256 signature
    const hash = crypto
        .createHmac('sha256', secretBuffer)
        .update(dataToSign)
        .digest('hex')
        .toUpperCase();
    
    return hash;
}
```

### Verifying Callback Data (Validate OnePay Response)
```javascript
function verifyCallbackHash(callbackData, secretHex) {
    // 1. Extract the hash from callback
    const receivedHash = callbackData.vpc_SecureHash;
    
    // 2. Sort all keys alphabetically
    const keys = Object.keys(callbackData).sort();
    
    // 3. Build string from vpc_* and user_* fields, EXCLUDING vpc_SecureHash
    let dataToSign = '';
    for (const key of keys) {
        if (key !== 'vpc_SecureHash' && 
            callbackData[key] !== null && 
            (key.startsWith('vpc_') || key.startsWith('user_'))) {
            dataToSign += key + '=' + callbackData[key] + '&';
        }
    }
    
    // 4. Remove trailing '&'
    dataToSign = dataToSign.slice(0, -1);
    
    // 5. Convert hex secret to binary buffer
    const secretBuffer = Buffer.from(secretHex, 'hex');
    
    // 6. Generate expected hash
    const expectedHash = crypto
        .createHmac('sha256', secretBuffer)
        .update(dataToSign)
        .digest('hex')
        .toUpperCase();
    
    // 7. Compare (case-insensitive)
    return expectedHash === receivedHash.toUpperCase();
}
```

---

## Payment Field Mappings

### Create Payment Request
```json
{
    "vpc_Merchant": "string",           // Merchant ID from OnePay
    "vpc_AccessCode": "string",         // Access code from OnePay
    "vpc_MerchTxnRef": "number",        // Unix timestamp (Math.floor(Date.now() / 1000))
    "vpc_OrderInfo": "string",          // Order code (10 chars)
    "vpc_Amount": "number",             // Total in VND * 100 (cents)
    "vpc_ReturnURL": "string",          // Return URL (domain/app/order/{code}/thank)
    "vpc_Locale": "vn|en",              // Language
    "vpc_Currency": "VND",              // Always VND
    "vpc_Version": 2,                   // API version
    "vpc_Command": "pay",               // Command type
    "vpc_Customer_Id": "string|0",      // User ID or 0
    "vpc_CreateToken": "boolean",       // Request token for saved card
    "vpc_TokenNum": "string",           // Token (if using saved card)
    "vpc_TokenExp": "string",           // Token expiry (if using saved card)
    "vpc_CardList": "APPLEPAY",         // Only if Apple Pay
    "vpc_SecureHash": "string"          // HMAC-SHA256 hash (uppercase hex)
}
```

### Callback/IPN Response Fields
```json
{
    "vpc_OrderInfo": "string",                  // Your order code
    "vpc_Amount": "number",                     // Amount in cents
    "vpc_Command": "string",                    // "pay"
    "vpc_Message": "string",                    // "Successful"
    "vpc_TxnResponseCode": "number",            // 0 = success, else failure
    "vpc_TransactionNo": "string",              // OnePay transaction ID
    "vpc_Card": "string",                       // "MC|VI|AE" (card type)
    "vpc_PayChannel": "string",                 // Payment method
    "vpc_CardUid": "string",                    // Card identifier
    "vpc_CardNum": "string",                    // Last 4 digits
    "vpc_CardHolderName": "string",             // Cardholder name
    "vpc_ItaBank": "string",                    // Bank code
    "vpc_ItaFeeAmount": "number",               // Fee amount
    "vpc_ItaTime": "string",                    // Timestamp from bank
    "vpc_ItaMobile": "string",                  // Mobile number (if provided)
    "vpc_ItaEmail": "string",                   // Email (if provided)
    "vpc_TokenNum": "string",                   // Token for future use (if vpc_CreateToken=true)
    "vpc_TokenExp": "string",                   // Token expiry YYYYMM format
    "vpc_SecureHash": "string",                 // HMAC-SHA256 signature
    "user_*": "string"                          // Any custom user_* fields echoed back
}
```

---

## Database Models

### Order
```typescript
{
    _id: ObjectId,
    date: "YYYY-MM-DD",
    price: {
        total: number,              // Original currency
        total_cost: number,         // VND cost
        total_convert_vn: number,   // PAYMENT AMOUNT (before * 100)
        discount: number
    },
    product_id: ObjectId,           // Tour reference
    customer_id: ObjectId,          // User reference
    code: string,                   // Unique order code (10 chars)
    type_pay: string,               // "onepay", "APPLEPAY", wallet ID
    status: "processing|success|payfail",
    data_pay: {},                   // Full OnePay response stored
    line_item: [{ id, quality, price, total, total_cost, discount }],
    extension: [{ id, type, quality, price, total, discount }],
    name: string,                   // Customer name
    email: string,                  // Customer email
    whatsapp: string,               // WhatsApp
    address: string,                // Customer address
    pick_up: string,                // Pickup location
    messager: string,               // Special requests
    type: string,                   // Order type
    total: number,                  // Total USD
    pax: number,                    // Passenger count
    commission: number,             // Commission amount
    provider_code: ObjectId,        // Affiliate vendor
    vendorId: ObjectId,             // Tour vendor
    channel: "app|web",
    callback: string,               // Web order callback URL
    created_at: Date,
    updated_at: Date
}
```

### Transaction (Audit Log)
```typescript
{
    _id: ObjectId,
    vpc_OrderInfo: string,          // Order code
    type: "onepay",
    data: {},                       // Full callback data
    created_at: Date,
    updated_at: Date
}
```

### Wallet (Saved Cards)
```typescript
{
    _id: ObjectId,
    userId: ObjectId,
    type: "onepay",
    vpc_TokenNum: string,           // Token for API
    vpc_TokenExp: string,           // Expiry YYYYMM
    vpc_Card: string,               // VI, MC, AE
    vpc_CardUid: string,            // OnePay identifier
    vpc_CardNum: string,            // Last 4 digits
    vpc_ItaBank: string,            // Bank code
    status: "success",
    data: {},                       // Additional data
    messager: string,
    created_at: Date,
    updated_at: Date
}
```

---

## API Endpoints

| Path | Method | Auth | Purpose |
|------|--------|------|---------|
| `/app/order` | POST | JWT | Create authenticated order |
| `/app/order/web` | POST | None | Create anonymous order |
| `/app/order/:id` | GET | JWT | Get order by ID |
| `/app/order/web/:code` | GET | None | Get order by code |
| `/app/order/:id` | PATCH | JWT | Update order |
| `/app/order/ipn` | GET | None | IPN callback handler |
| `/app/order/:code/thank` | GET | None | Thank you page/final verification |
| `/app/order` | GET | JWT | List user orders |

---

## Configuration Variables

```env
PAY_MERCHANT=<merchant_id>              # From OnePay dashboard
PAY_ACCESSCODE=<access_code>            # From OnePay dashboard
PAY_SECURE_SECRET=<hex_string>          # HMAC key in hex format (critical!)
PAY_URL=https://mtf.onepay.vn/paygate/vpcpay.op  # Payment gateway URL
PAY_RETURN=https://your-domain.com/app/order/    # Return URL base
FALLBACK_LANGUAGE=en                    # Default lang
```

---

## Status Flow

```
Order Created (processing)
    ↓
User Pays via OnePay
    ↓
OnePay calls /app/order/ipn (query params)
    ↓
Backend verifies HMAC signature
    ↓
If vpc_TxnResponseCode == 0:
    Status → success
    Email sent to customer, vendor, affiliate, admin
    Wallet token saved (if vpc_TokenNum returned)
Else:
    Status → payfail
    Email sent with error details
    ↓
User redirected to /app/order/{code}/thank (via vpc_ReturnURL)
    ↓
Backend re-verifies HMAC (duplicate check)
    ↓
Return success or redirect to callback URL
```

---

## Amount Calculation

```
Line items + Services + Extensions (all in USD)
    ↓
Multiply by currency transfer rate to get VND
    ↓
Format: total_convert_vn (in VND, integer)
    ↓
Payment amount: total_convert_vn * 100 (in cents)
    ↓
Example: $100 USD = 2,500,000 VND = 250000000 cents
```

---

## Token Management

### Creating Token Request
```typescript
if (logged_in_user) {
    pay_data.vpc_CreateToken = true;  // Request OnePay to return token
}
```

### Using Saved Token
```typescript
const wallet = await walletService.getOneWallet(token_id);
if (wallet?.vpc_TokenNum && wallet?.vpc_TokenExp) {
    pay_data.vpc_TokenNum = wallet.vpc_TokenNum;
    pay_data.vpc_TokenExp = wallet.vpc_TokenExp;
    // OnePay will skip card entry form
}
```

### Storing Token
```typescript
if (callback_data?.vpc_TokenNum && callback_data?.vpc_TokenExp) {
    // Check for duplicate
    const exists = await wallet.findOne({ vpc_TokenNum });
    if (!exists) {
        // Save wallet
        await wallet.create({
            userId,
            type: "onepay",
            vpc_TokenNum: callback_data.vpc_TokenNum,
            vpc_TokenExp: callback_data.vpc_TokenExp,
            vpc_Card: callback_data.vpc_Card,
            vpc_CardUid: callback_data.vpc_CardUid,
            vpc_CardNum: callback_data.vpc_CardNum,
            vpc_ItaBank: callback_data.vpc_ItaBank
        });
    }
}
```

---

## Email Notifications

### Trigger
When order status changes to `success` or `payfail`

### Method
RabbitMQ async: `rabbitMqService.addQueueExchanges("order", "order-mail", orderId._id)`

### Recipients
- Customer email
- Vendor email
- Affiliate vendor email
- Admin: vn.meetup.travel@gmail.com (CC: booking@meetup.travel)

### Template Variables
- tour_name, user_name, user_address, user_email, user_whatsapp
- order_detail (HTML table), order_code, order_pick_up, order_date
- order_created_at, order_total, order_pax, order_discount, order_total_convert_vn, order_status
- aff_name, aff_company, aff_email, aff_hotline1/2/3
- vendor_name, vendor_company, vendor_email, vendor_hotline1/2/3

---

## Error Responses

### IPN Callback Returns
```
responsecode=1&desc=confirm-success    // Valid and processed
responsecode=0&desc=confirm-fail       // Invalid signature or no order found
```

### API Errors
- `404 NotFoundException` - Order not found
- `403 ForbiddenException` - HMAC signature mismatch on thank you page

---

## Security Checklist

- [x] HMAC-SHA256 with hex secret buffer
- [x] Alphabetic key sorting
- [x] vpc_SecureHash excluded from verification data
- [x] Case-insensitive hash comparison
- [x] Idempotency check (status != 'success')
- [x] Duplicate token prevention
- [x] Full callback stored in order.data_pay
- [x] Transaction audit log

---

## Implementation Checklist for Other Platforms

- [ ] Implement hash generation function (copy from section 1)
- [ ] Implement hash verification function (copy from section 1)
- [ ] Create Order model with required fields
- [ ] Create Transaction audit log model
- [ ] Create Wallet model for token storage
- [ ] Implement /order endpoint (create order)
- [ ] Implement /order/ipn endpoint (verify callback)
- [ ] Implement /order/{code}/thank endpoint (final check)
- [ ] Email notification system
- [ ] Configuration for merchant ID, access code, secret key
- [ ] Currency conversion (USD → VND)
- [ ] Test with OnePay sandbox

---

## Test Values
- Test Merchant: Check OnePay sandbox docs
- Test Secret (HEX): Provided by OnePay
- Test Card: Provided by OnePay (4111111111111111 is common Visa test)
