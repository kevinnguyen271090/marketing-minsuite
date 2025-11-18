'use client'

import { useSession } from 'next-auth/react'
import { TeamRole } from '@prisma/client'
import { hasPermission, Permission } from '@/utils/permissions'
import { ReactNode } from 'react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: TeamRole[]
  permission?: Permission
  teamId?: string
  fallback?: ReactNode
  redirect?: string
}

/**
 * RoleGuard component to conditionally render content based on user's role
 *
 * Usage:
 * ```tsx
 * <RoleGuard allowedRoles={[TeamRole.OWNER, TeamRole.ADMIN]}>
 *   <DeleteButton />
 * </RoleGuard>
 *
 * <RoleGuard permission="CAMPAIGNS_DELETE">
 *   <DeleteCampaignButton />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  children,
  allowedRoles,
  permission,
  teamId,
  fallback = null,
  redirect,
}: RoleGuardProps) {
  const { data: session, status } = useSession()

  // Loading state
  if (status === 'loading') {
    return <>{fallback}</>
  }

  // Not authenticated
  if (!session?.user) {
    if (redirect) {
      window.location.href = redirect
      return null
    }
    return <>{fallback}</>
  }

  const user = session.user as any

  // Check permission-based access
  if (permission) {
    // Get user's role for specific team
    let userTeamRole: TeamRole | null = null

    if (teamId && user.teamUsers) {
      const teamUser = user.teamUsers.find((tu: any) => tu.teamId === teamId)
      userTeamRole = teamUser?.role || null
    } else if (user.teamUsers?.length > 0) {
      // Use first team's role if no specific team specified
      userTeamRole = user.teamUsers[0].role
    }

    if (!hasPermission(userTeamRole, permission)) {
      return <>{fallback}</>
    }

    return <>{children}</>
  }

  // Check role-based access
  if (allowedRoles) {
    let userTeamRole: TeamRole | null = null

    if (teamId && user.teamUsers) {
      const teamUser = user.teamUsers.find((tu: any) => tu.teamId === teamId)
      userTeamRole = teamUser?.role || null
    } else if (user.teamUsers?.length > 0) {
      userTeamRole = user.teamUsers[0].role
    }

    if (!userTeamRole || !allowedRoles.includes(userTeamRole)) {
      return <>{fallback}</>
    }

    return <>{children}</>
  }

  // If no restrictions specified, render children
  return <>{children}</>
}

/**
 * Hook to check if user has permission
 */
export function usePermission(permission: Permission, teamId?: string): boolean {
  const { data: session } = useSession()

  if (!session?.user) return false

  const user = session.user as any
  let userTeamRole: TeamRole | null = null

  if (teamId && user.teamUsers) {
    const teamUser = user.teamUsers.find((tu: any) => tu.teamId === teamId)
    userTeamRole = teamUser?.role || null
  } else if (user.teamUsers?.length > 0) {
    userTeamRole = user.teamUsers[0].role
  }

  return hasPermission(userTeamRole, permission)
}

/**
 * Hook to check if user has specific role
 */
export function useRole(teamId?: string): TeamRole | null {
  const { data: session } = useSession()

  if (!session?.user) return null

  const user = session.user as any

  if (teamId && user.teamUsers) {
    const teamUser = user.teamUsers.find((tu: any) => tu.teamId === teamId)
    return teamUser?.role || null
  }

  if (user.teamUsers?.length > 0) {
    return user.teamUsers[0].role
  }

  return null
}

/**
 * Unauthorized component (shown when user doesn't have permission)
 */
export function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Không có quyền truy cập
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn không có quyền để xem hoặc thực hiện hành động này.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Quay về Dashboard
        </a>
      </div>
    </div>
  )
}
