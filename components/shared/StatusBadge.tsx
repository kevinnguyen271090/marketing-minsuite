/**
 * Shared StatusBadge Component
 * Replaces all getStatusBadge() functions across the app
 */

import { Badge } from '@/components/ui/badge'
import {
  CAMPAIGN_STATUS_CONFIG,
  EVENT_STATUS_CONFIG,
  BRIEF_STATUS_CONFIG,
  GOAL_STATUS_CONFIG,
  PERFORMANCE_CONFIG,
  PRIORITY_CONFIG,
  ROLE_CONFIG,
  type CampaignStatus,
  type EventStatus,
  type BriefStatus,
  type GoalStatus,
  type PerformanceLevel,
  type PriorityLevel,
  type TeamRole,
} from '@/lib/constants'

type StatusType =
  | 'campaign'
  | 'event'
  | 'brief'
  | 'goal'
  | 'performance'
  | 'priority'
  | 'role'

type StatusValue =
  | CampaignStatus
  | EventStatus
  | BriefStatus
  | GoalStatus
  | PerformanceLevel
  | PriorityLevel
  | TeamRole
  | string

interface StatusBadgeProps {
  type: StatusType
  status: StatusValue
  className?: string
}

/**
 * Universal StatusBadge component
 * Automatically picks the right config based on type
 */
export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  const config = getStatusConfig(type, status)

  if (!config) {
    // Fallback for unknown status
    return (
      <Badge variant="outline" className={className}>
        {String(status)}
      </Badge>
    )
  }

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

/**
 * Get status configuration based on type
 */
function getStatusConfig(type: StatusType, status: StatusValue) {
  switch (type) {
    case 'campaign':
      return CAMPAIGN_STATUS_CONFIG[status as CampaignStatus]

    case 'event':
      return EVENT_STATUS_CONFIG[status as EventStatus]

    case 'brief':
      return BRIEF_STATUS_CONFIG[status as BriefStatus]

    case 'goal':
      return GOAL_STATUS_CONFIG[status as GoalStatus]

    case 'performance':
      return PERFORMANCE_CONFIG[status as PerformanceLevel]

    case 'priority':
      return PRIORITY_CONFIG[status as PriorityLevel]

    case 'role':
      return ROLE_CONFIG[status as TeamRole]

    default:
      return null
  }
}

// ============================================================================
// Specialized Badge Components (for convenience)
// ============================================================================

export function CampaignStatusBadge({
  status,
  className,
}: {
  status: CampaignStatus
  className?: string
}) {
  return <StatusBadge type="campaign" status={status} className={className} />
}

export function EventStatusBadge({ status, className }: { status: EventStatus; className?: string }) {
  return <StatusBadge type="event" status={status} className={className} />
}

export function BriefStatusBadge({ status, className }: { status: BriefStatus; className?: string }) {
  return <StatusBadge type="brief" status={status} className={className} />
}

export function GoalStatusBadge({ status, className }: { status: GoalStatus; className?: string }) {
  return <StatusBadge type="goal" status={status} className={className} />
}

export function PerformanceBadge({
  level,
  className,
}: {
  level: PerformanceLevel
  className?: string
}) {
  return <StatusBadge type="performance" status={level} className={className} />
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: PriorityLevel
  className?: string
}) {
  return <StatusBadge type="priority" status={priority} className={className} />
}

export function RoleBadge({ role, className }: { role: TeamRole; className?: string }) {
  return <StatusBadge type="role" status={role} className={className} />
}
