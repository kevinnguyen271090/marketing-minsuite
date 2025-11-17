# MinSuite Setup Guide

## Hướng dẫn cài đặt chi tiết

### Bước 1: Cài đặt Dependencies

```bash
npm install
```

### Bước 2: Setup PostgreSQL Database

#### Option A: Sử dụng Docker (Recommended)

```bash
# Start PostgreSQL và Redis
docker compose up -d

# Kiểm tra containers đang chạy
docker ps
```

#### Option B: Sử dụng PostgreSQL local

Nếu bạn đã có PostgreSQL cài sẵn:

1. Tạo database:
```sql
CREATE DATABASE minsuite;
CREATE USER minsuite WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE minsuite TO minsuite;
```

2. Update `.env`:
```
DATABASE_URL="postgresql://minsuite:your_password@localhost:5432/minsuite"
```

### Bước 3: Configure Environment Variables

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường quan trọng:

```bash
# Database - REQUIRED
DATABASE_URL="postgresql://minsuite:minsuite_dev_2024@localhost:5432/minsuite"

# NextAuth - REQUIRED
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-use-openssl-rand-base64-32"

# Redis - REQUIRED (nếu dùng BullMQ)
REDIS_URL="redis://localhost:6379"

# Zalo OA - OPTIONAL (để sau)
ZALO_OA_APP_ID=""
ZALO_OA_SECRET_KEY=""
ZALO_OA_ACCESS_TOKEN=""
```

**Tạo NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Bước 4: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Seed database với sample data
# npx prisma db seed
```

### Bước 5: Start Development Server

```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## Tạo User và Organization đầu tiên

### Option 1: Sử dụng Prisma Studio (Recommended)

```bash
npx prisma studio
```

Truy cập http://localhost:5555 và:

1. Tạo **Organization** mới:
   - name: "My Company"
   - slug: "my-company"

2. Tạo **User** mới:
   - email: "admin@example.com"
   - password: (hash bằng bcrypt)
   - role: "ADMIN"
   - organizationId: (ID của organization vừa tạo)

**Hash password với bcrypt:**
```javascript
// Chạy trong Node.js REPL
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

### Option 2: Sử dụng SQL

```sql
-- Tạo organization
INSERT INTO organizations (id, name, slug, created_at, updated_at)
VALUES (
  'org_123',
  'My Company',
  'my-company',
  NOW(),
  NOW()
);

-- Tạo user (password: "admin123")
INSERT INTO users (id, email, name, password, role, organization_id, created_at, updated_at)
VALUES (
  'user_123',
  'admin@example.com',
  'Admin User',
  '$2a$10$example_hash_here',
  'ADMIN',
  'org_123',
  NOW(),
  NOW()
);
```

---

## Testing API Endpoints

### 1. Test Authentication

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 2. Create Campaign

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "Summer Sale 2024",
    "slug": "summer-sale-2024",
    "type": "HYBRID",
    "budget": 50000000,
    "startDate": "2024-06-01T00:00:00Z",
    "endDate": "2024-08-31T23:59:59Z"
  }'
```

### 3. Create Tracking Link

```bash
curl -X POST http://localhost:3000/api/tracking-links \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "campaignId": "YOUR_CAMPAIGN_ID",
    "targetUrl": "https://example.com/products",
    "utmSource": "facebook",
    "utmMedium": "cpc",
    "utmCampaign": "summer-sale"
  }'
```

### 4. Create QR Code

```bash
curl -X POST http://localhost:3000/api/qr \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "campaignId": "YOUR_CAMPAIGN_ID",
    "name": "Poster Landmark 81",
    "type": "DISCOUNT",
    "discountCode": "SALE50",
    "discountValue": 50,
    "discountType": "PERCENTAGE",
    "location": "Landmark 81, HCMC",
    "targetUrl": "https://example.com/checkout"
  }'
```

### 5. Track Event

```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "type": "PURCHASE",
    "campaignId": "YOUR_CAMPAIGN_ID",
    "revenue": 1000000,
    "metadata": {
      "orderId": "ORD-12345"
    }
  }'
```

---

## Setup Zalo OA Integration

### 1. Tạo Zalo OA

1. Truy cập https://oa.zalo.me/
2. Tạo Official Account mới
3. Lấy App ID và Secret Key từ Developer Console

### 2. Generate Access Token

```bash
curl -X POST https://oauth.zaloapp.com/v4/oa/access_token \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": "YOUR_APP_ID",
    "secret_key": "YOUR_SECRET_KEY",
    "code": "YOUR_CODE"
  }'
```

### 3. Update .env

```bash
ZALO_OA_APP_ID="your_app_id"
ZALO_OA_SECRET_KEY="your_secret_key"
ZALO_OA_ACCESS_TOKEN="your_access_token"
```

### 4. Test Alert

```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "name": "ROI Negative Alert",
    "type": "ROI_NEGATIVE",
    "condition": {},
    "channels": ["ZALO"],
    "recipients": ["zalo_user_id"],
    "throttleMinutes": 60
  }'
```

---

## Cron Jobs Setup

### Check Alerts Every 5 Minutes

Add to your cron or use Vercel Cron:

```bash
*/5 * * * * curl -X POST http://localhost:3000/api/alerts/check \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Vercel Cron (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/alerts/check",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Production Deployment

### Environment Variables cần thiết

```bash
DATABASE_URL=your_production_db_url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret
REDIS_URL=your_redis_url
ZALO_OA_APP_ID=your_app_id
ZALO_OA_SECRET_KEY=your_secret_key
ZALO_OA_ACCESS_TOKEN=your_access_token
CRON_SECRET=your_cron_secret
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Database Migration in Production

```bash
# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (⚠️ xóa hết data)
npx prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate client
npx prisma generate

# Clear node_modules và reinstall
rm -rf node_modules
npm install
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## Next Steps

1. ✅ Setup database và tạo user đầu tiên
2. ✅ Test các API endpoints
3. 📱 Setup Zalo OA integration
4. 📊 Build Dashboard UI
5. 🔗 Integrate với Haravan/Sapo
6. 🚀 Deploy to production

---

## Support

- Documentation: https://docs.minsuite.vn
- Issues: https://github.com/your-org/minsuite/issues
- Email: support@minsuite.vn
