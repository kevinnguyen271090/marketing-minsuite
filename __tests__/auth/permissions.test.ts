import { TeamRole } from '@prisma/client'
import {
  hasPermission,
  isAdmin,
  isTeamOwner,
  canManageTeam,
  canEdit,
  isViewer,
  getHighestTeamRole,
} from '@/utils/permissions'

describe('Permissions Utility', () => {
  describe('hasPermission', () => {
    it('should allow OWNER to create campaigns', () => {
      expect(hasPermission(TeamRole.OWNER, 'CAMPAIGNS_CREATE')).toBe(true)
    })

    it('should allow ADMIN to create campaigns', () => {
      expect(hasPermission(TeamRole.ADMIN, 'CAMPAIGNS_CREATE')).toBe(true)
    })

    it('should allow MEMBER to create campaigns', () => {
      expect(hasPermission(TeamRole.MEMBER, 'CAMPAIGNS_CREATE')).toBe(true)
    })

    it('should NOT allow VIEWER to create campaigns', () => {
      expect(hasPermission(TeamRole.VIEWER, 'CAMPAIGNS_CREATE')).toBe(false)
    })

    it('should only allow OWNER to delete teams', () => {
      expect(hasPermission(TeamRole.OWNER, 'TEAM_DELETE')).toBe(true)
      expect(hasPermission(TeamRole.ADMIN, 'TEAM_DELETE')).toBe(false)
      expect(hasPermission(TeamRole.MEMBER, 'TEAM_DELETE')).toBe(false)
      expect(hasPermission(TeamRole.VIEWER, 'TEAM_DELETE')).toBe(false)
    })

    it('should allow OWNER and ADMIN to manage billing', () => {
      expect(hasPermission(TeamRole.OWNER, 'BILLING_MANAGE')).toBe(true)
      expect(hasPermission(TeamRole.ADMIN, 'BILLING_MANAGE')).toBe(false)
    })

    it('should allow all roles to view analytics', () => {
      expect(hasPermission(TeamRole.OWNER, 'ANALYTICS_VIEW')).toBe(true)
      expect(hasPermission(TeamRole.ADMIN, 'ANALYTICS_VIEW')).toBe(true)
      expect(hasPermission(TeamRole.MEMBER, 'ANALYTICS_VIEW')).toBe(true)
      expect(hasPermission(TeamRole.VIEWER, 'ANALYTICS_VIEW')).toBe(true)
    })

    it('should return false for null or undefined role', () => {
      expect(hasPermission(null, 'CAMPAIGNS_CREATE')).toBe(false)
      expect(hasPermission(undefined, 'CAMPAIGNS_CREATE')).toBe(false)
    })
  })

  describe('isTeamOwner', () => {
    it('should return true for OWNER role', () => {
      expect(isTeamOwner(TeamRole.OWNER)).toBe(true)
    })

    it('should return false for non-OWNER roles', () => {
      expect(isTeamOwner(TeamRole.ADMIN)).toBe(false)
      expect(isTeamOwner(TeamRole.MEMBER)).toBe(false)
      expect(isTeamOwner(TeamRole.VIEWER)).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(isTeamOwner(null)).toBe(false)
      expect(isTeamOwner(undefined)).toBe(false)
    })
  })

  describe('canManageTeam', () => {
    it('should return true for OWNER and ADMIN', () => {
      expect(canManageTeam(TeamRole.OWNER)).toBe(true)
      expect(canManageTeam(TeamRole.ADMIN)).toBe(true)
    })

    it('should return false for MEMBER and VIEWER', () => {
      expect(canManageTeam(TeamRole.MEMBER)).toBe(false)
      expect(canManageTeam(TeamRole.VIEWER)).toBe(false)
    })
  })

  describe('canEdit', () => {
    it('should return true for OWNER, ADMIN, and MEMBER', () => {
      expect(canEdit(TeamRole.OWNER)).toBe(true)
      expect(canEdit(TeamRole.ADMIN)).toBe(true)
      expect(canEdit(TeamRole.MEMBER)).toBe(true)
    })

    it('should return false for VIEWER', () => {
      expect(canEdit(TeamRole.VIEWER)).toBe(false)
    })
  })

  describe('isViewer', () => {
    it('should return true only for VIEWER role', () => {
      expect(isViewer(TeamRole.VIEWER)).toBe(true)
      expect(isViewer(TeamRole.MEMBER)).toBe(false)
      expect(isViewer(TeamRole.ADMIN)).toBe(false)
      expect(isViewer(TeamRole.OWNER)).toBe(false)
    })
  })

  describe('getHighestTeamRole', () => {
    it('should return OWNER if user has owner role in any team', () => {
      const teamUsers = [
        { role: TeamRole.MEMBER },
        { role: TeamRole.OWNER },
        { role: TeamRole.VIEWER },
      ]
      expect(getHighestTeamRole(teamUsers)).toBe(TeamRole.OWNER)
    })

    it('should return ADMIN if no owner role exists', () => {
      const teamUsers = [
        { role: TeamRole.MEMBER },
        { role: TeamRole.ADMIN },
        { role: TeamRole.VIEWER },
      ]
      expect(getHighestTeamRole(teamUsers)).toBe(TeamRole.ADMIN)
    })

    it('should return MEMBER if no owner or admin roles exist', () => {
      const teamUsers = [
        { role: TeamRole.MEMBER },
        { role: TeamRole.VIEWER },
      ]
      expect(getHighestTeamRole(teamUsers)).toBe(TeamRole.MEMBER)
    })

    it('should return VIEWER if only viewer roles exist', () => {
      const teamUsers = [
        { role: TeamRole.VIEWER },
        { role: TeamRole.VIEWER },
      ]
      expect(getHighestTeamRole(teamUsers)).toBe(TeamRole.VIEWER)
    })

    it('should return null for empty array', () => {
      expect(getHighestTeamRole([])).toBe(null)
    })
  })
})
