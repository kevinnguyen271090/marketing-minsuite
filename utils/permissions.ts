import { TeamRole, UserRole } from '@prisma/client'

/**
 * Define granular permissions for different resources
 */
export const PERMISSIONS = {
  // Campaign permissions
  CAMPAIGNS_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER],
  CAMPAIGNS_CREATE: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  CAMPAIGNS_EDIT: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  CAMPAIGNS_DELETE: [TeamRole.OWNER, TeamRole.ADMIN],

  // Creative permissions
  CREATIVES_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER],
  CREATIVES_CREATE: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  CREATIVES_EDIT: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  CREATIVES_DELETE: [TeamRole.OWNER, TeamRole.ADMIN],

  // Team permissions
  TEAM_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER],
  TEAM_EDIT: [TeamRole.OWNER, TeamRole.ADMIN],
  TEAM_INVITE: [TeamRole.OWNER, TeamRole.ADMIN],
  TEAM_REMOVE_MEMBER: [TeamRole.OWNER, TeamRole.ADMIN],
  TEAM_DELETE: [TeamRole.OWNER],

  // Billing permissions
  BILLING_VIEW: [TeamRole.OWNER, TeamRole.ADMIN],
  BILLING_MANAGE: [TeamRole.OWNER],

  // Settings permissions
  SETTINGS_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  SETTINGS_EDIT: [TeamRole.OWNER, TeamRole.ADMIN],

  // Analytics permissions
  ANALYTICS_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER],
  ANALYTICS_EXPORT: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],

  // Integration permissions
  INTEGRATIONS_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  INTEGRATIONS_MANAGE: [TeamRole.OWNER, TeamRole.ADMIN],

  // AI features
  AI_GENERATE: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  AI_SCENARIOS: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],

  // Brand assets
  BRAND_ASSETS_VIEW: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER],
  BRAND_ASSETS_UPLOAD: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER],
  BRAND_ASSETS_DELETE: [TeamRole.OWNER, TeamRole.ADMIN],
} as const

export type Permission = keyof typeof PERMISSIONS

/**
 * Check if a team role has a specific permission
 */
export function hasPermission(
  teamRole: TeamRole | null | undefined,
  permission: Permission
): boolean {
  if (!teamRole) return false

  const allowedRoles = PERMISSIONS[permission]
  return allowedRoles.includes(teamRole)
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN
}

/**
 * Check if user is team owner
 */
export function isTeamOwner(teamRole: TeamRole | null | undefined): boolean {
  return teamRole === TeamRole.OWNER
}

/**
 * Check if user can manage team (owner or admin)
 */
export function canManageTeam(teamRole: TeamRole | null | undefined): boolean {
  if (!teamRole) return false
  return [TeamRole.OWNER, TeamRole.ADMIN].includes(teamRole)
}

/**
 * Check if user can edit resource
 */
export function canEdit(teamRole: TeamRole | null | undefined): boolean {
  if (!teamRole) return false
  return [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.MEMBER].includes(teamRole)
}

/**
 * Check if user can only view (read-only)
 */
export function isViewer(teamRole: TeamRole | null | undefined): boolean {
  return teamRole === TeamRole.VIEWER
}

/**
 * Get user's highest role across all teams
 */
export function getHighestTeamRole(
  teamUsers: Array<{ role: TeamRole }>
): TeamRole | null {
  if (!teamUsers.length) return null

  // Role hierarchy: OWNER > ADMIN > MEMBER > VIEWER
  if (teamUsers.some(tu => tu.role === TeamRole.OWNER)) return TeamRole.OWNER
  if (teamUsers.some(tu => tu.role === TeamRole.ADMIN)) return TeamRole.ADMIN
  if (teamUsers.some(tu => tu.role === TeamRole.MEMBER)) return TeamRole.MEMBER
  return TeamRole.VIEWER
}

/**
 * Filter permissions by role
 */
export function getPermissionsByRole(role: TeamRole): Permission[] {
  return Object.entries(PERMISSIONS)
    .filter(([_, allowedRoles]) => allowedRoles.includes(role))
    .map(([permission]) => permission as Permission)
}

/**
 * Check multiple permissions at once (AND logic)
 */
export function hasAllPermissions(
  teamRole: TeamRole | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.every(permission => hasPermission(teamRole, permission))
}

/**
 * Check multiple permissions at once (OR logic)
 */
export function hasAnyPermission(
  teamRole: TeamRole | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(teamRole, permission))
}
