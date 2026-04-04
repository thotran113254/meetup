# PHÂN TÍCH HỆ THỐNG THANH TOÁN & ĐƠN HÀNG - MEETUP TRAVEL

**Ngày phân tích:** 04/04/2026  
**Phạm vi:** `/meetup-travel-website-be/src/modules/orders` & `/modules/app/modules/orders`

---

## 1. KIẾN TRÚC TỔNG QUÁT

Hệ thống phân tách thành 2 lớp:

| Thành phần | Vị trí | Mục đích |
|-----------|--------|---------|
| **Admin Orders** | `modules/orders/` | Quản lý đơn hàng backend (list, search, detail) |
| **App Orders** | `modules/app/modules/orders/` | Tạo & xử lý thanh toán (mobile, web) |
| **Wallet Module** | `modules/app/modules/wallets/` | Lưu token thẻ thanh toán |
| **Commission** | `modules/commission/` | Tính hoa hồng |
| **Email Service** | `modules/email/` | Gửi template emails async |

---

## 2. FLOW TẠO & CẬP NHẬT ĐƠN HÀNG

### 2.1 Tạo Đơn Hàng (AppOrderService.createOrder)

```
Input:  POST /app/order
        {date, type_pay, product_id, line_item[], extension[], ...}

Step 1: Kiểm tra đơn cùng tour + user đang pending
        ├─ Nếu YES → Cập nhật (updateOrder) thay vì tạo mới
        └─ Nếu NO → Tạo đơn mới

Step 2: Lấy thông tin tour (checkProductId)
        ├─ location_go → Tìm giá đón khách
        └─ commission → Lấy phần trăm hoa hồng

Step 3: Tính toán giá
        ├─ Line items: price × quality + location_cost
        ├─ Extensions: service + gift + custom service
        ├─ Total: ∑(line_items) + ∑(extensions) - discount
        └─ Convert VND: total × exchange_rate

Step 4: Tính hoa hồng
        commission = pax_quantity × tour.commission

Step 5: Lưu Order
        ├─ status: "processing" (chờ thanh toán)
        ├─ code: uid(10) - mã đơn duy nhất
        ├─ customer_id, vendorId, provider_code
        └─ Trả response với payment link
```

### 2.2 Cập Nhật Đơn Hàng (updateOrder)

Flow tương tự createOrder nhưng gọi `repository.update()` thay `create()`.

---

## 3. HỆ THỐNG THANH TOÁN (ONEPAY)

### 3.1 Nhà Cung Cấp Hiện Tại
- **OnePay**: VietQR, NAPAS, VISA, Apple Pay
- **Verify**: HMAC-SHA256 (hex secret)
- **Wallet**: Lưu token thẻ (`vpc_TokenNum`, `vpc_TokenExp`)

### 3.2 Payment Flow - Chi Tiết

```typescript
// Step 1: Client gọi tạo đơn
POST /app/order
  Response: {
    code: "abc1234567",
    pay_redirect: "https://mtf.onepay.vn/paygate/vpcpay.op?vpc_...",
    pay_data: { vpc_OrderInfo, vpc_Amount, vpc_SecureHash, ... },
    total: 100
  }

// Step 2: Client redirect đến OnePay
// OnePay xử lý thanh toán (user nhập thẻ hoặc chọn wallet)

// Step 3: OnePay gọi IPN callback
GET /app/order/ipn?vpc_OrderInfo=abc&vpc_TxnResponseCode=0&vpc_SecureHash=...
  ├─ appOrderService.updateIPNOrder()
  ├─ Verify signature: HMAC-SHA256(sorted params) == vpc_SecureHash?
  ├─ Kiểm tra: vpc_TxnResponseCode == 0 (success) ?
  ├─ Nếu thành công:
  │  ├─ Update order status = "success"
  │  ├─ Lưu vpc_TokenNum → Wallet
  │  └─ RabbitMQ send email notification
  └─ Return: "responsecode=1&desc=confirm-success"

// Step 4: Client redirect đến thank you page
GET /app/order/{code}/thank?vpc_*
  ├─ updateThankOrder()
  ├─ Verify signature lần nữa
  ├─ Nếu callback URL có → Redirect
  └─ Nếu không → Return {message: "success"}
```

### 3.3 Signature Verification Code

```typescript
// Từ order.service.ts (line 613-615)
const Kiss = Object.keys(pay_data).sort();
let stringHashData = '';
for (const item of Kiss) {
  if (pay_data[item] != null && 
      item != 'vpc_SecureHash' &&
      (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')) {
    stringHashData += item + '=' + pay_data[item] + '&';
  }
}
stringHashData = stringHashData.slice(0, -1);  // Remove last &

const secureSecret = configService.get('PAY_SECURE_SECRET');  // hex string
const secretBinary = Buffer.from(secureSecret, 'hex');
const vpc_SecureHash = createHmac('sha256', secretBinary)
  .update(stringHashData)
  .digest('hex');

// Compare: vpc_SecureHash.toUpperCase() == pay_data?.vpc_SecureHash
```

---

## 4. TRANSACTION TRACKING

```typescript
Transaction {
  vpc_OrderInfo: "abc1234567",        // Mã đơn hàng
  type: "onepay",                     // Loại gateway
  data: {
    vpc_Amount,
    vpc_TxnResponseCode,  // 0=success, other=fail
    vpc_Message,
    vpc_TransactionNo,
    ...
  },
  created_at, updated_at
}

// Query: transactionByCode(code)
// → Trả về mảng tất cả transaction của đơn hàng
```

---

## 5. WALLET TOKEN SYSTEM

```typescript
// Sau thanh toán thành công, lưu token:
createWallet(pay_data, orderId):
  ├─ Kiểm tra: pay_data.vpc_TokenNum && vpc_TokenExp?
  ├─ Kiểm tra unique: Token đã tồn tại?
  └─ Lưu Wallet {
       vpc_TokenNum,       // Token
       vpc_TokenExp,       // Expiry
       vpc_Card,           // Type (VD: "visa")
       vpc_CardNum,        // Last 4 digits
       vpc_ItaBank,        // Issuer
       status: "success",
       userId: orderId.customer_id,
       type: "onepay"
     }

// Lần thanh toán sau:
serviceGetPayData():
  ├─ Nếu type_pay == wallet_id:
  │  └─ wallet = getOneWallet(wallet_id)
  │     └─ pay_data.vpc_TokenNum = wallet.vpc_TokenNum
  │        pay_data.vpc_TokenExp = wallet.vpc_TokenExp
  └─ Bypass nhập thẻ (token-based payment)
```

---

## 6. HÓÔNG HOA HỒNG (COMMISSION)

### 6.1 Tính Toán

```typescript
// Trong createOrder (line 159-161):
const comission = checkProductId?.commission || 0;  // % từ tour
const comissionDeal = paxQuantity * comission;      // Tổng hoa hồng
orderDetail.commission = comissionDeal;
```

### 6.2 Data Model

```typescript
Commission {
  order_id,                                    // ObjectId
  commisison: number,                         // Số tiền
  commisison_type: "COMMISISON" |             // Type
                  "COMMISSION_FIRST_DEAL"
}
```

### 6.3 Trạng Thái Hiện Tại
- ✅ Tính hoa hồng ngay lúc tạo order
- ✅ Lưu vào Order.commission field
- ⚠️ CommissionService.createCommission() chưa implement (commented)
- ⚠️ Chưa có API rút hoa hồng cho vendor/provider

---

## 7. EMAIL & ASYNC PROCESSING

### 7.1 RabbitMQ Queues

```typescript
// rabbitmq.module.ts
Exchanges: [
  { name: 'order', type: 'fanout' },    // Order events
  { name: 'tour', type: 'fanout' },     // Tour events
  { name: 'notication', type: 'fanout' }
]

// Khi order success:
rabbitMqService.addQueueExchanges(
  "order", 
  "order-mail", 
  orderId._id
)
```

### 7.2 Email Templates

```
4 emails được gửi:

1. Email_New_Order_User
   → Khách hàng
   Nội dung: Xác nhận đơn hàng, chi tiết tour, giá

2. Email_New_Order_Vendor
   → Nhà cung cấp tour
   Nội dung: Thông báo đơn hàng mới, liên hệ khách

3. Email_New_Order_Aff
   → Người đại lý / Affiliate
   Nội dung: Thông báo đơn, thông tin khách, hoa hồng

4. Email_New_Order_Admin
   → Admin (vn.meetup.travel@gmail.com)
   CC: booking@meetup.travel
   Nội dung: Toàn bộ thông tin đơn hàng

Template Variables:
{
  tour_name, user_name, user_email, user_whatsapp,
  order_code, order_date, order_total, order_pax,
  order_detail (HTML table), order_discount,
  order_total_convert_vn, order_status,
  aff_name, aff_email, aff_hotline*,
  vendor_name, vendor_email, vendor_hotline*
}
```

---

## 8. DATA MODELS

### 8.1 Order Entity

```typescript
@Schema()
export class Order {
  code: string;                    // uid(10)
  date: string;                    // YYYY-MM-DD
  product_id: ObjectId;            // Tour ID
  customer_id: ObjectId;           // User ID
  vendorId: ObjectId;              // Tour vendor
  provider_code: ObjectId;         // Affiliate/provider
  
  price: {
    total: number;                 // USD
    discount: number;
    total_cost: number;            // Cost
    total_convert_vn: number;      // VND
  };
  
  line_item: [{
    id: ObjectId;                  // TourPrice ID
    quality: number;               // Khách
    price: number;                 // Unit price
    total: number;                 // quality × price
    total_cost: number;
    discount: number;
  }];
  
  extension: [{                    // Extra services
    type: "service" | "gift" | "service-customize";
    id: ObjectId;
    name?: string;
    unit?: string;
    quality: number;
    price: number;
    total: number;
    discount: number;
  }];
  
  type_pay: string;                // "onepay", "wallet-id"
  status: string;                  // "processing", "success", "payfail"
  channel: string;                 // "app" (default)
  callback?: string;               // Webhook URL for web
  commission: number;              // Total commission
  pax: number;                     // Total passengers
  total: number;                   // Total amount (USD)
  
  data_pay: any;                   // Raw payment response
  created_at: Date;
  updated_at: Date;
}
```

### 8.2 Transaction Entity

```typescript
@Schema()
export class Transaction {
  vpc_OrderInfo: string;           // Order code
  type: string;                    // "onepay"
  data: Record<string, any>;       // Payment response
  created_at: Date;
  updated_at: Date;
}
```

### 8.3 Wallet Entity

```typescript
@Schema()
export class Wallet {
  vpc_TokenNum: string;            // Token ID
  vpc_TokenExp: string;            // Expiry
  vpc_Card: string;                // Card type
  vpc_CardUid: string;
  vpc_CardNum: string;             // Last 4 digits
  vpc_ItaBank: string;             // Bank
  status: "success";
  userId: ObjectId;
  type: "onepay";
  created_at: Date;
}
```

---

## 9. API ENDPOINTS

### Create Order
```
POST /app/order
Authorization: Bearer {token}
X-Curency: vnd

{
  "date": "2025-04-15",
  "type_pay": "onepay",
  "type": "tour",
  "product_id": "507f1f77bcf86cd799439011",
  "line_item": [
    {"id": "507f1f77bcf86cd799439012", "quality": 2}
  ],
  "extension": [
    {"id": "507f1f77bcf86cd799439013", "quality": 1, "type": "service"}
  ],
  "pick_up": "Ho Chi Minh City",
  "address": "District 1",
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+84901234567"
}

Response:
{
  "code": "abc1234567",
  "pay_redirect": "https://mtf.onepay.vn/paygate/...",
  "total": 100,
  "price": {"total": 100, "total_convert_vn": 2500000}
}
```

### Get Order
```
GET /app/order/{orderId}
Authorization: Bearer {token}
X-Curency: vnd

Response: Order object with line_item details expanded
```

### IPN Callback
```
GET /app/order/ipn?vpc_OrderInfo=abc&vpc_TxnResponseCode=0&...

Auto-called by OnePay
No auth needed
```

### Thank You Page
```
GET /app/order/{code}/thank?vpc_*

Redirects to callback URL or returns {message: "success"}
```

---

## 10. KEY POINTS

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Payment Provider** | OnePay (VietQR, NAPAS, VISA, Apple Pay) |
| **Security** | HMAC-SHA256 signature verification (2x: IPN + Thank) |
| **Commission** | Auto-calc = pax × tour.commission |
| **Multi-currency** | Display USD, store VND (× exchange_rate) |
| **Wallet** | Token-based saved cards for faster checkout |
| **Async** | RabbitMQ queues for email notifications |
| **Status Flow** | processing → success/payfail |
| **Code** | 10-char unique ID per order (uid) |

---

## 11. FILES ANALYZED

```
✓ modules/orders/order.service.ts
✓ modules/orders/order.controller.ts
✓ modules/orders/dto/create-order.dto.ts
✓ modules/orders/dto/update-order.dto.ts
✓ modules/shared/entities/order.entity.ts
✓ modules/shared/entities/transaction.entity.ts
✓ modules/shared/enums/status.enum.ts
✓ modules/app/modules/orders/order.service.ts
✓ modules/app/modules/orders/order.controller.ts
✓ modules/app/modules/orders/dto/app-create-order.dto.ts
✓ modules/app/modules/wallets/wallet.service.ts
✓ modules/app/modules/wallets/wallet.module.ts
✓ modules/commission/commission.service.ts
✓ modules/commission/entities/commission.entity.ts
✓ modules/email/email.service.ts
✓ modules/rabbitmq/rabbitmq.module.ts
```

---

**Report Completed:** 04/04/2026 | **Word Count:** 580
