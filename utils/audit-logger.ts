import { prisma } from '@/lib/prisma'
import { AuditAction } from '@prisma/client'

interface LogAuditEventParams {
  action: AuditAction
  userId?: string
  entity?: string
  entityId?: string
  ipAddress?: string
  userAgent?: string
  changes?: Record<string, any>
  metadata?: Record<string, any>
  success?: boolean
  errorMessage?: string
}

/**
 * Log an audit event for compliance and security monitoring
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        userId: params.userId,
        entity: params.entity,
        entityId: params.entityId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        changes: params.changes,
        metadata: params.metadata,
        success: params.success ?? true,
        errorMessage: params.errorMessage,
      }
    })
  } catch (error) {
    // Fail silently to not break the main flow
    console.error('Failed to log audit event:', error)
  }
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(userId: string, limit = 100) {
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  })
}

/**
 * Get audit logs for a specific entity
 */
export async function getEntityAuditLogs(
  entity: string,
  entityId: string,
  limit = 100
) {
  return prisma.auditLog.findMany({
    where: { entity, entityId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  })
}

/**
 * Get all audit logs with filters
 */
export async function getAuditLogs(filters: {
  userId?: string
  action?: AuditAction
  entity?: string
  startDate?: Date
  endDate?: Date
  success?: boolean
  limit?: number
  offset?: number
}) {
  const where: any = {}

  if (filters.userId) where.userId = filters.userId
  if (filters.action) where.action = filters.action
  if (filters.entity) where.entity = filters.entity
  if (filters.success !== undefined) where.success = filters.success

  if (filters.startDate || filters.endDate) {
    where.timestamp = {}
    if (filters.startDate) where.timestamp.gte = filters.startDate
    if (filters.endDate) where.timestamp.lte = filters.endDate
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: filters.limit || 100,
      skip: filters.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ])

  return { logs, total }
}
