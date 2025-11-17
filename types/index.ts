// Campaign types
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
export type CampaignType = 'ONLINE' | 'OFFLINE' | 'HYBRID'

export interface Campaign {
  id: string
  name: string
  slug: string
  description?: string
  status: CampaignStatus
  type: CampaignType
  budget?: number
  spent: number
  revenue: number
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Tracking types
export interface TrackingLink {
  id: string
  shortCode: string
  campaignId: string
  targetUrl: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  clicks: number
  conversions: number
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface QRCode {
  id: string
  code: string
  campaignId: string
  name: string
  type: 'DISCOUNT' | 'CHECKIN' | 'SURVEY' | 'REDIRECT'
  discountCode?: string
  discountValue?: number
  discountType?: 'PERCENTAGE' | 'FIXED'
  location?: string
  latitude?: number
  longitude?: number
  targetUrl?: string
  scans: number
  conversions: number
  revenue: number
  imageUrl?: string
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Event types
export type EventType = 'CLICK' | 'SCAN' | 'PAGE_VIEW' | 'CONVERSION' | 'PURCHASE' | 'LEAD' | 'SIGNUP'

export interface TrackingEvent {
  id: string
  type: EventType
  campaignId?: string
  trackingLinkId?: string
  qrCodeId?: string
  sessionHash?: string
  fingerprintHash?: string
  deviceType?: string
  browser?: string
  os?: string
  city?: string
  country: string
  referrer?: string
  landingPage?: string
  revenue?: number
  conversionValue?: number
  metadata?: Record<string, any>
  timestamp: Date
}

// Analytics types
export interface CampaignAnalytics {
  campaign: {
    id: string
    name: string
    status: CampaignStatus
    type: CampaignType
    budget?: number
    spent: number
    revenue: number
  }
  metrics: {
    roi: number
    cac: number
    conversionRate: number
    roas: number
    budgetUsage?: number
    totalClicks: number
    totalScans: number
    totalConversions: number
    totalEvents: number
  }
  eventsByType: Array<{
    type: EventType
    count: number
    revenue: number
  }>
  eventsOverTime: Array<{
    date: Date
    clicks: number
    conversions: number
    revenue: number
  }>
  topLinks: Array<{
    id: string
    shortCode: string
    clicks: number
    conversions: number
    conversionRate: number
  }>
  topQRCodes: Array<{
    id: string
    name: string
    location?: string
    scans: number
    conversions: number
    revenue: number
    conversionRate: number
  }>
}

// Alert types
export type AlertType = 'ROI_NEGATIVE' | 'BUDGET_THRESHOLD' | 'REVENUE_DROP' | 'CAMPAIGN_COMPLETED' | 'CUSTOM'
export type AlertChannel = 'ZALO' | 'EMAIL' | 'SMS' | 'WEBHOOK'
export type AlertStatus = 'SENT' | 'FAILED' | 'THROTTLED'

export interface Alert {
  id: string
  organizationId: string
  name: string
  type: AlertType
  condition: Record<string, any>
  channels: AlertChannel[]
  recipients: string[]
  throttleMinutes: number
  lastTriggeredAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Integration types
export type IntegrationType =
  | 'HARAVAN'
  | 'SAPO'
  | 'KIOTVIET'
  | 'ZALO_OA'
  | 'FACEBOOK_ADS'
  | 'GOOGLE_ADS'
  | 'TIKTOK_ADS'
  | 'WIFI_PROVIDER'
  | 'CUSTOM'

export interface Integration {
  id: string
  organizationId: string
  type: IntegrationType
  name: string
  isActive: boolean
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
}

// User types
export type UserRole = 'ADMIN' | 'USER' | 'VIEWER'

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  organizationId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  domain?: string
  settings?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
