/**
 * Application constants
 * Centralizes all constant values to ensure consistency
 */

import type { Badge } from '@/components/ui/badge'

// ============================================================================
// CAMPAIGN CONSTANTS
// ============================================================================

export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const

export type CampaignStatus = typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS]

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [CAMPAIGN_STATUS.ACTIVE]: { label: 'Đang chạy', variant: 'success' },
  [CAMPAIGN_STATUS.PAUSED]: { label: 'Tạm dừng', variant: 'warning' },
  [CAMPAIGN_STATUS.COMPLETED]: { label: 'Hoàn thành', variant: 'secondary' },
  [CAMPAIGN_STATUS.DRAFT]: { label: 'Nháp', variant: 'outline' },
  [CAMPAIGN_STATUS.ARCHIVED]: { label: 'Đã lưu trữ', variant: 'outline' },
}

// ============================================================================
// SOURCE & PLATFORM CONSTANTS
// ============================================================================

export const SOURCES = {
  FACEBOOK: 'FACEBOOK',
  TIKTOK: 'TIKTOK',
  GOOGLE: 'GOOGLE',
  KOL: 'KOL',
  EVENT: 'EVENT',
} as const

export type Source = typeof SOURCES[keyof typeof SOURCES]

export const SOURCE_LABELS: Record<Source, string> = {
  [SOURCES.FACEBOOK]: 'Facebook',
  [SOURCES.TIKTOK]: 'TikTok',
  [SOURCES.GOOGLE]: 'Google',
  [SOURCES.KOL]: 'KOL',
  [SOURCES.EVENT]: 'Event',
}

export const PLATFORMS = {
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  TIKTOK: 'TIKTOK',
  GOOGLE_ADS: 'GOOGLE_ADS',
  YOUTUBE: 'YOUTUBE',
  ZALO: 'ZALO',
} as const

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS]

export const PLATFORM_LABELS: Record<Platform, string> = {
  [PLATFORMS.FACEBOOK]: 'Facebook',
  [PLATFORMS.INSTAGRAM]: 'Instagram',
  [PLATFORMS.TIKTOK]: 'TikTok',
  [PLATFORMS.GOOGLE_ADS]: 'Google Ads',
  [PLATFORMS.YOUTUBE]: 'YouTube',
  [PLATFORMS.ZALO]: 'Zalo',
}

// ============================================================================
// TEAM & ROLE CONSTANTS
// ============================================================================

export const TEAM_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
} as const

export type TeamRole = typeof TEAM_ROLES[keyof typeof TEAM_ROLES]

export const ROLE_CONFIG: Record<
  TeamRole,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [TEAM_ROLES.OWNER]: { label: 'Owner', variant: 'destructive' },
  [TEAM_ROLES.ADMIN]: { label: 'Admin', variant: 'default' },
  [TEAM_ROLES.MEMBER]: { label: 'Member', variant: 'secondary' },
  [TEAM_ROLES.VIEWER]: { label: 'Viewer', variant: 'outline' },
}

// ============================================================================
// EVENT & BRIEF STATUS
// ============================================================================

export const EVENT_STATUS = {
  PLANNED: 'PLANNED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS]

export const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [EVENT_STATUS.PLANNED]: { label: 'Đã lên kế hoạch', variant: 'secondary' },
  [EVENT_STATUS.ONGOING]: { label: 'Đang diễn ra', variant: 'default' },
  [EVENT_STATUS.COMPLETED]: { label: 'Hoàn thành', variant: 'success' },
  [EVENT_STATUS.CANCELLED]: { label: 'Đã hủy', variant: 'destructive' },
}

export const BRIEF_STATUS = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

export type BriefStatus = typeof BRIEF_STATUS[keyof typeof BRIEF_STATUS]

export const BRIEF_STATUS_CONFIG: Record<
  BriefStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [BRIEF_STATUS.DRAFT]: { label: 'Nháp', variant: 'secondary' },
  [BRIEF_STATUS.IN_REVIEW]: { label: 'Đang duyệt', variant: 'default' },
  [BRIEF_STATUS.APPROVED]: { label: 'Đã duyệt', variant: 'success' },
  [BRIEF_STATUS.REJECTED]: { label: 'Từ chối', variant: 'destructive' },
}

// ============================================================================
// GOAL STATUS
// ============================================================================

export const GOAL_STATUS = {
  EXCEEDING: 'EXCEEDING',
  ON_TRACK: 'ON_TRACK',
  AT_RISK: 'AT_RISK',
  BEHIND: 'BEHIND',
} as const

export type GoalStatus = typeof GOAL_STATUS[keyof typeof GOAL_STATUS]

export const GOAL_STATUS_CONFIG: Record<
  GoalStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [GOAL_STATUS.EXCEEDING]: { label: 'Vượt mục tiêu', variant: 'success' },
  [GOAL_STATUS.ON_TRACK]: { label: 'Đúng tiến độ', variant: 'default' },
  [GOAL_STATUS.AT_RISK]: { label: 'Rủi ro', variant: 'destructive' },
  [GOAL_STATUS.BEHIND]: { label: 'Chậm tiến độ', variant: 'secondary' },
}

// ============================================================================
// CREATIVE PERFORMANCE
// ============================================================================

export const PERFORMANCE_LEVELS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  AVERAGE: 'average',
  POOR: 'poor',
} as const

export type PerformanceLevel = typeof PERFORMANCE_LEVELS[keyof typeof PERFORMANCE_LEVELS]

export const PERFORMANCE_CONFIG: Record<
  PerformanceLevel,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [PERFORMANCE_LEVELS.EXCELLENT]: { label: 'Xuất sắc', variant: 'success' },
  [PERFORMANCE_LEVELS.GOOD]: { label: 'Tốt', variant: 'default' },
  [PERFORMANCE_LEVELS.AVERAGE]: { label: 'Trung bình', variant: 'secondary' },
  [PERFORMANCE_LEVELS.POOR]: { label: 'Kém', variant: 'destructive' },
}

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

export const PRIORITY_LEVELS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const

export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS]

export const PRIORITY_CONFIG: Record<
  PriorityLevel,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }
> = {
  [PRIORITY_LEVELS.HIGH]: { label: 'Cao', variant: 'destructive' },
  [PRIORITY_LEVELS.MEDIUM]: { label: 'Trung bình', variant: 'default' },
  [PRIORITY_LEVELS.LOW]: { label: 'Thấp', variant: 'secondary' },
}

// ============================================================================
// DATE RANGE OPTIONS
// ============================================================================

export const DATE_RANGES = {
  '7d': { label: '7 ngày', days: 7 },
  '30d': { label: '30 ngày', days: 30 },
  '90d': { label: '90 ngày', days: 90 },
  all: { label: 'Tất cả', days: null },
} as const

export type DateRangeKey = keyof typeof DATE_RANGES

// ============================================================================
// PAGINATION
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// ============================================================================
// ROI THRESHOLDS
// ============================================================================

export const ROI_THRESHOLDS = {
  EXCELLENT: 150, // > 150%
  GOOD: 100, // 100-150%
  AVERAGE: 50, // 50-100%
  POOR: 0, // < 50%
} as const

// ============================================================================
// BUDGET WARNING THRESHOLDS
// ============================================================================

export const BUDGET_THRESHOLDS = {
  CRITICAL: 90, // 90%+ used
  WARNING: 70, // 70-90% used
  SAFE: 0, // < 70% used
} as const
