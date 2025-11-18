import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAuditEvent } from '@/utils/audit-logger'

/**
 * GDPR Compliance: Export all user data
 * GET /api/user/export
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        campaigns: true,
        queryLogs: true,
        accounts: {
          select: {
            provider: true,
            createdAt: true,
          }
        },
        teamUsers: {
          include: {
            team: {
              select: {
                name: true,
                slug: true,
              }
            }
          }
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 100,
        },
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive fields
    const { password, resetToken, verificationToken, ...userData } = user

    // Structure exported data
    const exportedData = {
      exportDate: new Date().toISOString(),
      userData: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      accounts: userData.accounts,
      teams: userData.teamUsers.map(tu => ({
        teamName: tu.team.name,
        teamSlug: tu.team.slug,
        role: tu.role,
        joinedAt: tu.joinedAt,
      })),
      campaigns: userData.campaigns.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        createdAt: c.createdAt,
      })),
      queryLogs: userData.queryLogs.map(q => ({
        query: q.query,
        queryType: q.queryType,
        createdAt: q.createdAt,
      })),
      auditLogs: userData.auditLogs.map(a => ({
        action: a.action,
        timestamp: a.timestamp,
        success: a.success,
      })),
    }

    // Log data export
    await logAuditEvent({
      action: 'DATA_EXPORTED',
      userId,
      metadata: { timestamp: new Date().toISOString() },
      success: true,
    })

    // Return JSON file
    return new NextResponse(JSON.stringify(exportedData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="minsuite-data-export-${userId}-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
