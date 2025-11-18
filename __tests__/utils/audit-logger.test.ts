/**
 * @jest-environment node
 */

import { logAuditEvent, getUserAuditLogs, getEntityAuditLogs } from '@/utils/audit-logger'
import { AuditAction } from '@prisma/client'

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}))

const { prisma } = require('@/lib/prisma')

describe('Audit Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('logAuditEvent', () => {
    it('should create audit log with all parameters', async () => {
      const mockAuditLog = {
        id: 'test-id',
        action: AuditAction.LOGIN,
        userId: 'user-123',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        metadata: { test: 'data' },
        success: true,
        timestamp: new Date(),
      }

      prisma.auditLog.create.mockResolvedValue(mockAuditLog)

      await logAuditEvent({
        action: AuditAction.LOGIN,
        userId: 'user-123',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        metadata: { test: 'data' },
        success: true,
      })

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: AuditAction.LOGIN,
          userId: 'user-123',
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
          metadata: { test: 'data' },
          success: true,
          entity: undefined,
          entityId: undefined,
          changes: undefined,
          errorMessage: undefined,
        },
      })
    })

    it('should default success to true', async () => {
      await logAuditEvent({
        action: AuditAction.CAMPAIGN_CREATED,
        userId: 'user-123',
      })

      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            success: true,
          }),
        })
      )
    })

    it('should handle errors gracefully', async () => {
      prisma.auditLog.create.mockRejectedValue(new Error('Database error'))

      // Should not throw
      await expect(
        logAuditEvent({
          action: AuditAction.LOGIN_FAILED,
          userId: 'user-123',
        })
      ).resolves.not.toThrow()
    })
  })

  describe('getUserAuditLogs', () => {
    it('should fetch audit logs for specific user', async () => {
      const mockLogs = [
        { id: '1', action: AuditAction.LOGIN, userId: 'user-123' },
        { id: '2', action: AuditAction.LOGOUT, userId: 'user-123' },
      ]

      prisma.auditLog.findMany.mockResolvedValue(mockLogs)

      const result = await getUserAuditLogs('user-123', 50)

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { timestamp: 'desc' },
        take: 50,
      })

      expect(result).toEqual(mockLogs)
    })

    it('should use default limit of 100', async () => {
      prisma.auditLog.findMany.mockResolvedValue([])

      await getUserAuditLogs('user-123')

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        })
      )
    })
  })

  describe('getEntityAuditLogs', () => {
    it('should fetch audit logs for specific entity', async () => {
      const mockLogs = [
        {
          id: '1',
          action: AuditAction.CAMPAIGN_CREATED,
          entity: 'Campaign',
          entityId: 'campaign-123',
        },
      ]

      prisma.auditLog.findMany.mockResolvedValue(mockLogs)

      const result = await getEntityAuditLogs('Campaign', 'campaign-123', 25)

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
        where: { entity: 'Campaign', entityId: 'campaign-123' },
        orderBy: { timestamp: 'desc' },
        take: 25,
      })

      expect(result).toEqual(mockLogs)
    })
  })
})
