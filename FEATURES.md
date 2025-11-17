# MinSuite Features Documentation

## 📊 Overview

MinSuite đã được triển khai với 3 modules chính:

- **MODULE 0**: Attribution & Data Foundation ✅
- **MODULE 1**: Creative Studio ✅
- **MODULE 2**: Campaign Engine ✅

---

## 🎯 MODULE 0: ATTRIBUTION & DATA FOUNDATION

### Universal Tracking Links
**Endpoints:**
- `POST /api/tracking-links` - Tạo tracking link với UTM parameters
- `GET /api/tracking-links?campaignId=xxx` - List tracking links
- `GET /t/[code]` - Redirect và track clicks

**Features:**
- Auto-generate short codes (8 characters)
- UTM parameter support (source, medium, campaign, term, content)
- Click và conversion tracking
- Privacy-safe session hashing

### Offline Revenue Attribution
**Endpoints:**
- `POST /api/qr` - Tạo QR code cho offline campaigns
- `GET /api/qr?campaignId=xxx` - List QR codes
- `GET /qr/[code]` - Scan QR và redirect

**Features:**
- QR code với discount codes
- Location tracking (latitude/longitude)
- Scan và conversion tracking
- Expiration dates
- Multiple QR types: DISCOUNT, CHECKIN, SURVEY, REDIRECT

### Unified ROI Dashboard
**Endpoints:**
- `GET /api/campaigns` - List campaigns với metrics
- `GET /api/campaigns/[id]/analytics` - Detailed analytics

**Analytics Metrics:**
- ROI: `((Revenue - Cost) / Cost) × 100`
- CAC: `Total Spend / Conversions`
- ROAS: `Revenue / Ad Spend`
- Conversion Rate: `(Conversions / Clicks) × 100`
- Budget Usage: `(Spent / Budget) × 100`

**Data Provided:**
- Events by type
- Events over time (30 days)
- Top performing tracking links
- Top performing QR codes

### Automated Alerts
**Endpoints:**
- `POST /api/alerts` - Create alert rules
- `GET /api/alerts` - List alerts
- `POST /api/alerts/check` - Trigger alert check (cron job)

**Alert Types:**
- ROI_NEGATIVE: ROI < 0
- BUDGET_THRESHOLD: > 80% budget used
- REVENUE_DROP: 20% revenue decrease
- CAMPAIGN_COMPLETED: Campaign ends

**Channels:**
- Zalo OA (với throttling)
- Email (planned)
- SMS (planned)
- Webhook (planned)

---

## 🎨 MODULE 1: CREATIVE STUDIO

### AI Content Generator
**Endpoint:** `POST /api/ai/generate`

**Content Types:**

#### Social Post
```json
{
  "type": "social_post",
  "platform": "facebook|tiktok|instagram",
  "product": "Sản phẩm ABC",
  "tone": "friendly",
  "cta": "Mua ngay",
  "hashtags": true,
  "campaignId": "xxx",
  "saveToCampaign": true
}
```

#### Email
```json
{
  "type": "email",
  "purpose": "Product launch announcement",
  "audience": "Existing customers",
  "tone": "professional",
  "includeHtml": true
}
```
**Returns:** `{ subject, body, html }`

#### Blog/SEO Content
```json
{
  "type": "blog",
  "topic": "Marketing trends 2025",
  "keywords": ["marketing", "digital", "Vietnam"],
  "wordCount": 1000,
  "tone": "chuyên nghiệp"
}
```

#### Custom Generation
```json
{
  "type": "custom",
  "prompt": "Your custom prompt here",
  "systemPrompt": "Custom system prompt (optional)"
}
```

**AI Models Used:**
- Claude 3.5 Sonnet (default)
- Optimized for Vietnamese language
- Contextual understanding of VN market

### Auto-Resize Tool
**Endpoints:**
- `POST /api/creatives/resize` - Resize image
- `GET /api/creatives/resize` - Get available dimensions

**Request:**
```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "platforms": ["facebook", "instagram", "tiktok"],
  "fit": "cover",
  "quality": 90
}
```

**Response:**
```json
{
  "original": {
    "width": 1920,
    "height": 1080,
    "size": 245678,
    "format": "jpeg"
  },
  "resized": [
    {
      "name": "Facebook Feed Post",
      "platform": "facebook",
      "width": 1200,
      "height": 630,
      "size": 98765,
      "imageBase64": "..."
    }
    // ... more variants
  ]
}
```

**Supported Platforms & Dimensions:**

**Facebook:**
- Feed Post (1200×630)
- Cover Photo (820×312)
- Story (1080×1920)
- Event Cover (1920×1005)

**Instagram:**
- Feed Square (1080×1080)
- Feed Portrait (1080×1350)
- Story/Reel (1080×1920)

**TikTok:**
- Video (1080×1920)
- Profile (200×200)

**LinkedIn:**
- Post (1200×627)
- Cover (1128×191)

**Email:**
- Header (600×200)
- Banner (600×300)

**YouTube:**
- Thumbnail (1280×720)
- Channel Cover (2560×1440)

**Fit Modes:**
- `cover`: Fill entire area, crop if needed
- `contain`: Fit inside, letterbox if needed
- `fill`: Stretch to fill
- `inside`: Resize to fit inside
- `outside`: Resize to cover outside

### Creative Management
**Endpoints:**
- `POST /api/creatives` - Create creative
- `GET /api/creatives` - List creatives với metrics

**Creative Types:**
- SOCIAL_POST: Facebook, Instagram, TikTok
- EMAIL: Email marketing
- BANNER: Display ads
- VIDEO: Video content
- LANDING_PAGE: Landing page copy
- SEO_CONTENT: Blog/SEO content

**Formats:**
- IMAGE, VIDEO, TEXT, HTML, CAROUSEL

**Tracking Metrics:**
- Impressions
- Clicks
- Conversions
- Revenue
- CTR: `(Clicks / Impressions) × 100`
- Conversion Rate: `(Conversions / Clicks) × 100`

**A/B Testing:**
- Create variants with traffic allocation
- Track performance per variant
- Mark winner variant

### Brand Asset Library
**Endpoints:**
- `POST /api/brand-assets` - Upload asset
- `GET /api/brand-assets` - List assets
- `POST /api/brand-assets/[id]/version` - Create new version

**Asset Types:**
- LOGO: Company logos
- COLOR: Brand colors (hex codes)
- FONT: Typography
- IMAGE: Brand images
- ICON: Icons and graphics
- TEMPLATE: Design templates

**Version Control:**
- Auto-increment version numbers
- Link to previous versions
- Track version history

**Metadata:**
- Usage count
- Last used date
- Tags for organization
- Public/private access control

---

## 📅 MODULE 2: CAMPAIGN ENGINE

### Campaign Calendar
**Endpoint:** `POST /api/campaign-tasks`

**Task Types:**
- FACEBOOK_ADS: Facebook advertising
- GOOGLE_ADS: Google advertising
- TIKTOK_ADS: TikTok advertising
- KOL_POST: Influencer posts
- EMAIL_BLAST: Email campaigns
- EVENT: Events and activations
- CONTENT_CREATION: Content production
- REVIEW_APPROVAL: Review cycles
- OTHER: Custom tasks

**Task Workflow:**
```
TODO → IN_PROGRESS → REVIEW → COMPLETED
                            ↓
                        CANCELLED
```

**Priority Levels:**
- LOW
- MEDIUM
- HIGH
- URGENT

**Features:**
- Start/End/Due dates
- Assign to team members (email)
- Task dependencies (dependsOn: [taskId])
- Tags and metadata
- Link to events

### Brief Template System
**Endpoints:**
- `POST /api/briefs` - Create brief
- `GET /api/briefs` - List briefs

**Brief Types:**
- KOL_BRIEF: Influencer briefs
- CREATIVE_BRIEF: Creative direction
- EVENT_BRIEF: Event planning
- CAMPAIGN_BRIEF: Campaign overview
- CUSTOM: Custom formats

**Brief Workflow:**
```
DRAFT → PENDING_APPROVAL → APPROVED
                        ↓
                    REJECTED → ARCHIVED
```

**Structure:**
```json
{
  "campaignId": "xxx",
  "title": "Summer Campaign 2025",
  "type": "KOL_BRIEF",
  "content": {
    "objective": "Increase brand awareness",
    "target_audience": "Gen Z, 18-25",
    "key_message": "Be yourself",
    "deliverables": ["3 TikTok videos", "5 Instagram posts"],
    "timeline": "June 1-30, 2025"
  },
  "attachments": ["https://..."]
}
```

### Event ROI Calculator
**Endpoints:**
- `POST /api/events` - Create event
- `GET /api/events` - List events với ROI

**Event Types:**
- WORKSHOP
- SEMINAR
- PRODUCT_LAUNCH
- NETWORKING
- CONFERENCE
- WEBINAR
- TRADE_SHOW
- POPUP_STORE
- OTHER

**ROI Calculation:**
```javascript
ROI = ((Revenue - Spent) / Spent) × 100

Additional Metrics:
- Occupancy Rate = (Registered / Max Guests) × 100
- Check-in Rate = (Checked In / Registered) × 100
- Revenue per Guest = Revenue / Checked In Count
```

**Features:**
- Budget tracking
- Guest capacity management
- Virtual + Physical events
- Location tracking (lat/long)
- QR code for event check-in

### Guest List Manager
**Endpoints:**
- `POST /api/events/[id]/guests` - Add guest(s)
- `GET /api/events/[id]/guests` - List guests

**Single Guest Add:**
```json
{
  "email": "guest@example.com",
  "name": "Nguyen Van A",
  "phone": "+84901234567",
  "company": "ABC Corp",
  "jobTitle": "Marketing Manager",
  "source": "Facebook Ads"
}
```

**Bulk Import:**
```json
{
  "guests": [
    { "email": "...", "name": "..." },
    { "email": "...", "name": "..." }
  ]
}
```

**Check-in Flow:**
1. Guest registers → personal QR code generated
2. Guest arrives → scan personal QR or event QR
3. System records check-in timestamp
4. Track session for attribution
5. Link post-event purchases to guest

**Guest Tracking:**
- Registration source
- Check-in status and time
- Session hash for attribution
- Revenue attribution per guest

---

## 🔐 Security & Privacy

### Data Protection
- **Session Hashing**: SHA-256 hash of IP + User Agent
- **Fingerprint Hashing**: Browser fingerprint hashed
- **No PII Storage**: Only aggregated data
- **City-level Location**: No precise addresses

### Authentication
- NextAuth.js với JWT sessions
- Role-based access (ADMIN, USER, VIEWER)
- Organization-level isolation

### API Security
- Session-based auth for all endpoints
- Organization verification on all queries
- Input validation với Zod schemas
- SQL injection protection (Prisma ORM)

---

## 📊 Database Schema Summary

**Total Models:** 20

**Core (MODULE 0):**
- User, Organization, Campaign
- TrackingLink, QRCode, TrackingEvent
- Integration, Alert, AlertLog

**Creative Studio (MODULE 1):**
- Creative, CreativeVariant
- AIPromptTemplate
- BrandAsset

**Campaign Engine (MODULE 2):**
- CampaignTask
- BriefTemplate, Brief
- Event, EventGuest

---

## 🚀 API Performance

**Optimizations:**
- Prisma query optimization với includes
- Indexed fields (organizationId, campaignId, status, dates)
- Pagination support (offset + limit)
- Caching ready (Redis integration prepared)

**Rate Limiting (Recommended):**
- API endpoints: 100 req/min per user
- Tracking endpoints: 1000 req/min per IP
- AI generation: 10 req/min per user

---

## 📦 Tech Stack

**Backend:**
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL

**AI & Processing:**
- Anthropic Claude API (3.5 Sonnet)
- Sharp (image processing)
- QRCode library

**External APIs:**
- Zalo OA API (notifications)
- Future: Haravan, Sapo, KiotViet APIs

**Infrastructure:**
- Docker (PostgreSQL + Redis)
- Vercel-ready deployment

---

## 🎯 Next Steps

### Module 3: Strategic Planner (Upcoming)
- Competitor analysis
- Market insights
- Budget optimization recommendations
- Campaign forecasting

### Frontend Development
- Dashboard UI với Recharts
- Drag-and-drop campaign calendar (FullCalendar.js)
- Creative preview and editor
- Brand asset browser

### Integrations
- Haravan API sync
- Sapo API sync
- KiotViet POS integration
- Facebook/Google Ads sync
- Wi-Fi provider callbacks

### Advanced Features
- ML-based attribution models
- Predictive analytics
- A/B test automation
- Multi-touch attribution

---

## 📞 Support

- **Documentation**: Full API docs in `API.md`
- **Setup Guide**: Step-by-step in `SETUP.md`
- **Database**: Schema in `prisma/schema.prisma`
- **Types**: TypeScript definitions in `types/index.ts`

---

**Built with ❤️ for Vietnamese businesses**
