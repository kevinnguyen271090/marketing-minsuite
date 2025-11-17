# MinSuite API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All API endpoints (except tracking endpoints) require authentication via NextAuth session.

### Login
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

---

## Campaigns

### List Campaigns
```bash
GET /api/campaigns?status=ACTIVE
Authorization: Required (Session)

Response:
{
  "campaigns": [
    {
      "id": "clx...",
      "name": "Summer Sale 2024",
      "slug": "summer-sale-2024",
      "status": "ACTIVE",
      "type": "HYBRID",
      "budget": 50000000,
      "spent": 20000000,
      "revenue": 80000000,
      "createdBy": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "_count": {
        "trackingLinks": 5,
        "qrCodes": 3,
        "events": 1234
      }
    }
  ]
}
```

### Create Campaign
```bash
POST /api/campaigns
Authorization: Required (Session)
Content-Type: application/json

{
  "name": "Tet Campaign 2025",
  "slug": "tet-2025",
  "description": "Chương trình khuyến mãi Tết",
  "type": "HYBRID",
  "budget": 100000000,
  "startDate": "2025-01-20T00:00:00Z",
  "endDate": "2025-02-10T23:59:59Z"
}

Response:
{
  "campaign": { ... }
}
```

### Get Campaign Analytics
```bash
GET /api/campaigns/{campaignId}/analytics
Authorization: Required (Session)

Response:
{
  "campaign": { ... },
  "metrics": {
    "roi": 150.5,
    "cac": 50000,
    "conversionRate": 2.5,
    "roas": 4.0,
    "budgetUsage": 65.5,
    "totalClicks": 5000,
    "totalScans": 300,
    "totalConversions": 125,
    "totalEvents": 5432
  },
  "eventsByType": [...],
  "eventsOverTime": [...],
  "topLinks": [...],
  "topQRCodes": [...]
}
```

---

## Tracking Links

### List Tracking Links
```bash
GET /api/tracking-links?campaignId={campaignId}
Authorization: Required (Session)

Response:
{
  "trackingLinks": [
    {
      "id": "clx...",
      "shortCode": "abc12345",
      "campaignId": "clx...",
      "targetUrl": "https://example.com/product",
      "utmSource": "facebook",
      "utmMedium": "social",
      "utmCampaign": "summer-sale",
      "clicks": 234,
      "conversions": 12,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Tracking Link
```bash
POST /api/tracking-links
Authorization: Required (Session)
Content-Type: application/json

{
  "campaignId": "clx...",
  "targetUrl": "https://example.com/product",
  "utmSource": "facebook",
  "utmMedium": "cpc",
  "utmCampaign": "summer-sale",
  "utmContent": "ad-variant-a"
}

Response:
{
  "trackingLink": {
    "id": "clx...",
    "shortCode": "abc12345",
    "trackingUrl": "http://localhost:3000/t/abc12345?utm_source=facebook&utm_medium=cpc..."
  }
}
```

### Track Click (Public Endpoint)
```bash
GET /t/{shortCode}
# Automatically tracks click and redirects to target URL
```

---

## QR Codes

### List QR Codes
```bash
GET /api/qr?campaignId={campaignId}
Authorization: Required (Session)

Response:
{
  "qrCodes": [
    {
      "id": "clx...",
      "code": "QR-xyz789",
      "campaignId": "clx...",
      "name": "Poster Landmark 81",
      "type": "DISCOUNT",
      "discountCode": "TET2025",
      "discountValue": 20,
      "discountType": "PERCENTAGE",
      "location": "Landmark 81, HCMC",
      "scans": 145,
      "conversions": 28,
      "revenue": 14000000,
      "imageUrl": "data:image/png;base64,..."
    }
  ]
}
```

### Create QR Code
```bash
POST /api/qr
Authorization: Required (Session)
Content-Type: application/json

{
  "campaignId": "clx...",
  "name": "Poster Vincom Center",
  "type": "DISCOUNT",
  "discountCode": "VINCOM20",
  "discountValue": 20,
  "discountType": "PERCENTAGE",
  "location": "Vincom Center, Hanoi",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "targetUrl": "https://example.com/products",
  "expiresAt": "2025-02-28T23:59:59Z"
}

Response:
{
  "qrCode": {
    "id": "clx...",
    "code": "QR-xyz789",
    "qrUrl": "http://localhost:3000/qr/QR-xyz789?discount=VINCOM20",
    "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }
}
```

### Scan QR Code (Public Endpoint)
```bash
GET /qr/{code}
# Automatically tracks scan and redirects or returns discount info
```

---

## Tracking Events

### Track Event (Public Endpoint)
```bash
POST /api/track
Content-Type: application/json

{
  "type": "CONVERSION",
  "campaignId": "clx...",
  "trackingLinkId": "clx...",
  "revenue": 500000,
  "referrer": "https://facebook.com",
  "landingPage": "https://example.com/checkout",
  "fingerprint": {
    "language": "vi-VN",
    "timezone": "Asia/Ho_Chi_Minh",
    "screen": "1920x1080"
  },
  "metadata": {
    "orderId": "ORD-12345"
  }
}

Response:
{
  "success": true,
  "eventId": "clx..."
}
```

### Event Types
- `CLICK` - Link click
- `SCAN` - QR code scan
- `PAGE_VIEW` - Page view
- `CONVERSION` - General conversion
- `PURCHASE` - Purchase with revenue
- `LEAD` - Lead generation
- `SIGNUP` - User signup

---

## Alerts

### List Alerts
```bash
GET /api/alerts
Authorization: Required (Session)

Response:
{
  "alerts": [
    {
      "id": "clx...",
      "name": "ROI Negative Alert",
      "type": "ROI_NEGATIVE",
      "channels": ["ZALO"],
      "recipients": ["zalo_user_id"],
      "isActive": true,
      "lastTriggeredAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

### Create Alert
```bash
POST /api/alerts
Authorization: Required (Session)
Content-Type: application/json

{
  "name": "Budget Warning",
  "type": "BUDGET_THRESHOLD",
  "condition": {
    "threshold": 80
  },
  "channels": ["ZALO", "EMAIL"],
  "recipients": ["zalo_user_id", "admin@example.com"],
  "throttleMinutes": 60
}

Response:
{
  "alert": { ... }
}
```

### Check Alerts (Cron Job)
```bash
POST /api/alerts/check
Authorization: Bearer {CRON_SECRET}

Response:
{
  "success": true,
  "alertsChecked": 25,
  "alertsSent": 3,
  "results": [...]
}
```

---

## Analytics Calculations

### ROI (Return on Investment)
```
ROI = ((Revenue - Cost) / Cost) × 100
```

### CAC (Customer Acquisition Cost)
```
CAC = Total Marketing Spend / Number of Conversions
```

### ROAS (Return on Ad Spend)
```
ROAS = Revenue / Ad Spend
```

### Conversion Rate
```
Conversion Rate = (Conversions / Total Clicks) × 100
```

### Budget Usage
```
Budget Usage = (Spent / Budget) × 100
```

---

## Privacy & Hashing

MinSuite sử dụng hashing để bảo vệ privacy:

### Session Hash
```javascript
SHA-256(IP_Address + ":" + User_Agent)
```

### Fingerprint Hash
```javascript
SHA-256(User_Agent + ":" + Language + ":" + Timezone + ":" + Screen)
```

Không có dữ liệu PII (Personally Identifiable Information) được lưu trữ trực tiếp.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Campaign not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limits

- API endpoints: 100 requests/minute per user
- Tracking endpoints: 1000 requests/minute per IP
- Alert checks: Run every 5 minutes via cron

---

## Webhooks (Coming Soon)

MinSuite sẽ hỗ trợ webhooks cho các events:
- Campaign started
- Campaign completed
- ROI threshold reached
- Budget threshold reached
- Revenue milestones

---

For more information, visit: https://docs.minsuite.vn
