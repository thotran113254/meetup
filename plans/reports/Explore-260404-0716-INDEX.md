# OnePay Payment Integration - Complete Analysis Index

**Report Generation Date:** 2026-04-04  
**Analysis Scope:** NestJS Backend Payment Integration  
**Backend Path:** `/home/automation/meetup/meetup-travel-website-be/src/`

---

## GENERATED REPORTS

### 1. **Payment Integration Deep-Read** (20KB, 553 lines)
**File:** `Explore-260404-0716-payment-integration.md`

Comprehensive technical analysis covering:
- Complete order creation workflow
- OnePay API URL and parameter structure
- HMAC-SHA256 signing algorithm (exact code)
- IPN callback verification logic
- Thank you page verification flow
- Order/Transaction/Wallet data models
- Payment status transitions
- Token/wallet management for recurring payments
- Email notification system
- Security implementation details
- Configuration variables
- Sample payment request/response structures
- Unresolved questions and edge cases

**Best for:** Implementation reference, understanding the full payment flow, security audit

---

### 2. **Quick Reference Guide** (13KB, 388 lines)
**File:** `Explore-260404-0716-payment-quick-reference.md`

Condensed implementation guide with:
- Ready-to-copy HMAC generation functions (JavaScript)
- Payment field mappings (JSON structures)
- Database schema definitions
- API endpoint summary table
- Configuration variable reference
- Payment status flow diagram
- Amount calculation formulas
- Token management workflows
- Email notification details
- Error response formats
- Security checklist
- Implementation checklist for other platforms

**Best for:** Quick lookup, copy-paste code, implementation checklist, configuration setup

---

### 3. **Sequence Diagrams** (31KB, 420+ lines)
**File:** `Explore-260404-0716-payment-sequence.md`

Visual representations of payment flows:
- Payment creation & URL generation sequence
- Callback/IPN verification sequence
- Thank you page verification sequence
- HMAC-SHA256 calculation detailed walkthrough
- Email notification trigger sequence
- Order status state machine diagram
- Data flow - price calculation breakdown

**Best for:** Understanding flow logic, debugging integration issues, team presentations

---

### 4. **Original Analysis** (17KB, 548 lines)
**File:** `Explore-260404-0716-meetup-payment-readiness.md`

Early analysis document (preserved for reference):
- Initial payment integration findings
- Architecture overview
- Code organization notes

**Best for:** Historical context, architecture overview

---

## KEY FINDINGS SUMMARY

### HMAC-SHA256 Signing (Critical)
```typescript
// Request Signing:
const secretBinary = Buffer.from(secretHex, 'hex');
const hash = createHmac('sha256', secretBinary)
    .update(sortedParams)
    .digest('hex')
    .toUpperCase();

// Verification:
// Same process BUT exclude vpc_SecureHash from data
```

### Configuration Required
```env
PAY_MERCHANT=<merchant_id>
PAY_ACCESSCODE=<access_code>
PAY_SECURE_SECRET=<hex_string>      # CRITICAL: HEX format
PAY_URL=https://mtf.onepay.vn/paygate/vpcpay.op
PAY_RETURN=https://domain/app/order/
FALLBACK_LANGUAGE=en
```

### Payment Flow (Simple Version)
1. User creates order → Backend generates order code & calculates price in VND
2. Backend builds payment parameters → Signs with HMAC-SHA256
3. Frontend redirects user to OnePay → User enters card details
4. OnePay calls `/app/order/ipn` → Backend verifies HMAC & updates status
5. OnePay redirects to `/app/order/{code}/thank` → Final verification & redirect
6. RabbitMQ triggers email notifications to all parties

### Data Models
- **Order:** Stores all order details, pricing breakdown, customer info, status
- **Transaction:** Audit log of all payment callbacks (not queried, just stored)
- **Wallet:** Saved card tokens for one-click payments

### Security Features Implemented
- HMAC-SHA256 signature on all requests/responses
- Idempotency checks (multiple callbacks for same order safe)
- Duplicate token prevention
- Full callback data stored for audit
- Separate transaction audit log

---

## FILE LOCATIONS (Absolute Paths)

### Core Payment Files
- `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/orders/order.service.ts` (809 lines) - Main payment logic
- `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/orders/order.controller.ts` (137 lines) - API endpoints
- `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/wallets/wallet.service.ts` (54 lines) - Token management

### Data Models
- `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/entities/order.entity.ts` (320 lines)
- `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/entities/transaction.entity.ts` (51 lines)
- `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/entities/wallet.entity.ts` (109 lines)

### DTOs & Enums
- `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/orders/dto/app-create-order.dto.ts`
- `/home/automation/meetup/meetup-travel-website-be/src/modules/app/modules/orders/dto/req.order.dto.ts`
- `/home/automation/meetup/meetup-travel-website-be/src/modules/shared/enums/status.enum.ts`

### Supporting Service (Email Notifications)
- `/home/automation/meetup/meetup-travel-website-be/src/modules/orders/order.service.ts` (868 lines) - Email handler via RabbitMQ

---

## EXACT CODE SNIPPETS (Critical for Reimplementation)

### HMAC Request Signing (Lines 684-709, order.service.ts)
```typescript
const Kiss = Object.keys(pay_data).sort();
let stringHashData = '';
for await (const item of Kiss) {
    if (pay_data[item] != null &&
        (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')) {
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
```

### HMAC Verification (Lines 595-616, order.service.ts)
```typescript
const Kiss = Object.keys(pay_data).sort();
let stringHashData = '';
for await (const item of Kiss) {
    if (pay_data[item] != null && item != 'vpc_SecureHash' &&
        (item.substring(0, 4) == 'vpc_' || item.substring(0, 5) == 'user_')) {
        stringHashData += item + '=' + pay_data[item] + '&';
    }
}
stringHashData = stringHashData.slice(0, -1);
const secureSecret = this.configService.get('PAY_SECURE_SECRET');
const secretBinary = Buffer.from(secureSecret, 'hex');
const vpc_SecureHash = createHmac('sha256', secretBinary)
    .update(stringHashData)
    .digest('hex');
if (vpc_SecureHash.toUpperCase() == pay_data?.vpc_SecureHash) { /* valid */ }
```

### Order Creation with Payment URL (Lines 652-718, order.service.ts)
```typescript
async serviceGetPayData(type_pay, orderContent, lang): Promise<Order> {
    let pay_data = {
        vpc_Merchant: this.configService.get('PAY_MERCHANT'),
        vpc_AccessCode: this.configService.get('PAY_ACCESSCODE'),
        vpc_MerchTxnRef: Math.floor(Date.now() / 1000),
        vpc_OrderInfo: orderContent?.code,
        vpc_Amount: orderContent?.price?.total_convert_vn * 100,
        vpc_ReturnURL: this.configService.get('PAY_RETURN') + orderContent.code + '/thank',
        vpc_Locale: lang == 'vn' ? 'vn' : 'en',
        vpc_Currency: 'VND',
        vpc_Version: 2,
        vpc_Command: 'pay',
        // ... add vpc_SecureHash (see signing code above)
    };
    // Returns: {pay_data, pay_redirect, pay_data_securehash, ...orderContent}
}
```

### IPN Callback Handler (Lines 577-650, order.service.ts)
```typescript
async updateIPNOrder(pay_data) {
    const code = pay_data.vpc_OrderInfo;
    const [orderId, addTransaction] = await Promise.all([
        this.main_repository.findOneByCondition({code}),
        this.transactionService.addTransaction({
            vpc_OrderInfo: pay_data?.vpc_OrderInfo,
            data: pay_data,
            type: "onepay"
        })
    ])
    if (orderId && orderId?.status != 'success') {
        // Verify hash (see code above)
        if (vpc_SecureHash.toUpperCase() == pay_data?.vpc_SecureHash) {
            if (pay_data?.vpc_TxnResponseCode == 0) {
                await this.main_repository.update(orderId._id, {
                    status: 'success',
                    data_pay: pay_data,
                });
                await this.rabbitMqService.addQueueExchanges("order", "order-mail", orderId._id)
                return 'responsecode=1&desc=confirm-success';
            } else {
                // payment failed
                await this.main_repository.update(orderId._id, {
                    status: 'payfail',
                    data_pay: pay_data,
                });
                await this.rabbitMqService.addQueueExchanges("order", "order-mail", orderId._id)
                return 'responsecode=1&desc=confirm-success';
            }
        } else {
            return 'responsecode=0&desc=confirm-fail';
        }
    }
}
```

---

## HOW TO USE THESE REPORTS

### For Payment Integration Implementation
1. Start with **Quick Reference** (Section 1 - HMAC functions)
2. Copy exact hash generation code
3. Reference **Payment Integration** for API details
4. Use **Sequence Diagrams** to understand flow logic
5. Follow **Implementation Checklist** in Quick Reference

### For Security Audit
1. Review **Payment Integration** Section 9 (Security Notes)
2. Cross-check against **Security Checklist** in Quick Reference
3. Verify hash implementation matches exact code snippets

### For Debugging Payment Issues
1. Check **Sequence Diagrams** Section 2 (IPN Verification)
2. Verify HMAC calculation step-by-step
3. Confirm env variables match Configuration section
4. Check order status transitions in **Sequence Diagrams** Section 6

### For Database Schema Setup
1. Reference **Quick Reference** Section - Database Models
2. See **Payment Integration** Section 4 for detailed field definitions
3. Note: Transaction table is audit-only (not queried in payment flow)

### For System Integration (Email, Tokens)
1. **Payment Integration** Section 8 - Email notifications
2. **Quick Reference** - Token Management section
3. Note: Email triggered via RabbitMQ async message queue

---

## CRITICAL GOTCHAS & NOTES

### HMAC Secret Format
- **STORED AS:** HEX string in environment
- **MUST CONVERT:** `Buffer.from(secretHex, 'hex')` before HMAC
- **OUTPUT:** HEX uppercase

### Hash Verification
- **EXCLUDE:** vpc_SecureHash from verification data
- **CASE:** Uppercase comparison for received hash
- **SORT:** Keys MUST be alphabetically sorted before signing

### Order Code
- **UNIQUE:** Must be unique per order (via uid(10))
- **LENGTH:** 10 characters (matches uid default)
- **USED AS:** vpc_OrderInfo (OnePay's reference)
- **ALSO USED:** In return URL path (/app/order/{code}/thank)

### Amount Calculation
- **CURRENCY:** All prices in USD until final calculation
- **CONVERT:** total_convert_vn = total_usd * currency_transfer_rate
- **PAYMENT:** vpc_Amount = total_convert_vn * 100 (cents)
- **STORAGE:** Store total_convert_vn for audit trail

### Token Management
- **CREATED:** Only if vpc_CreateToken=true in request (authenticated users)
- **RETURNED:** OnePay returns vpc_TokenNum & vpc_TokenExp in response
- **STORED:** Check for duplicates before saving (vpc_TokenNum)
- **REUSED:** Pass vpc_TokenNum & vpc_TokenExp to skip card entry

### Status Flow
- **INITIAL:** processing (after order creation)
- **SUCCESS:** vpc_TxnResponseCode == 0 → status='success'
- **FAILURE:** vpc_TxnResponseCode != 0 → status='payfail'
- **IDEMPOTENT:** Multiple callbacks for same order safe (checks status != 'success')

---

## ENVIRONMENT CHECKLIST

Before implementing:
- [ ] Get PAY_MERCHANT from OnePay dashboard
- [ ] Get PAY_ACCESSCODE from OnePay dashboard
- [ ] Get PAY_SECURE_SECRET (HEX format) from OnePay dashboard
- [ ] Verify PAY_URL (sandbox vs production)
- [ ] Set PAY_RETURN to your domain/app/order/
- [ ] Confirm FALLBACK_LANGUAGE setting
- [ ] Test with OnePay sandbox credentials first
- [ ] Verify RabbitMQ is configured for email notifications
- [ ] Set up email templates: Email_New_Order_User, Email_New_Order_Vendor, Email_New_Order_Aff, Email_New_Order_Admin

---

## TESTING CHECKLIST

- [ ] Test order creation flow (POST /app/order)
- [ ] Verify payment URL generation with HMAC
- [ ] Test IPN callback with valid HMAC
- [ ] Test IPN callback with invalid HMAC (should return error)
- [ ] Test thank you page with valid HMAC
- [ ] Test idempotency (multiple callbacks for same order)
- [ ] Test token saving and retrieval
- [ ] Test one-click payment with saved token
- [ ] Verify email notifications sent to all recipients
- [ ] Test with different currencies (if applicable)
- [ ] Test payment failure scenarios (vpc_TxnResponseCode != 0)

---

## UNRESOLVED QUESTIONS

See **Payment Integration** Section 12 for open questions:
1. Multiple payment environments (sandbox vs production)
2. Callback rate limits or IP whitelisting
3. Idempotency token for duplicate submissions
4. Order code enumeration prevention
5. Why Transaction table stores but never queries events

---

## REPORT STATISTICS

| Document | Size | Lines | Focus |
|----------|------|-------|-------|
| payment-integration.md | 20KB | 553 | Complete technical reference |
| payment-quick-reference.md | 13KB | 388 | Implementation guide & copy-paste code |
| payment-sequence.md | 31KB | 420+ | Visual flow diagrams |
| meetup-payment-readiness.md | 17KB | 548 | Architecture overview |
| **TOTAL** | **81KB** | **2010+** | - |

---

## NEXT STEPS

1. **For Reimplementation:** Copy HMAC functions from Quick Reference, follow Implementation Checklist
2. **For Bug Fixes:** Check Sequence Diagrams Section 2 (IPN verification)
3. **For Integration:** Reference Email Notifications section
4. **For Testing:** Use Sequence Diagrams to trace expected flow
5. **For Documentation:** Refer to Payment Status Flow and state machine diagram

---

**Generated:** 2026-04-04 07:20 UTC  
**Tools Used:** Deep code reading, HMAC algorithm analysis, database schema extraction  
**Completeness:** 100% - All specified files read and analyzed
