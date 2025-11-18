import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logAuditEvent } from '@/utils/audit-logger'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required for account deletion'),
  confirmText: z.string().refine(
    (val) => val === 'DELETE MY ACCOUNT',
    { message: 'Please type "DELETE MY ACCOUNT" to confirm' }
  ),
})

/**
 * GDPR Compliance: Delete user account and all associated data
 * DELETE /api/user/delete
 */
export async function DELETE(req: NextRequest) {
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

    // Parse request body
    const body = await req.json()
    const { password, confirmText } = deleteAccountSchema.parse(body)

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamUsers: {
          include: {
            team: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify password
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 403 }
        )
      }
    }

    // Check if user is the only owner of any teams
    const ownedTeams = user.teamUsers.filter(tu => tu.role === 'OWNER')

    for (const teamUser of ownedTeams) {
      const teamMembersCount = await prisma.teamUser.count({
        where: { teamId: teamUser.teamId }
      })

      // If user is the only member or there are other owners
      const otherOwners = await prisma.teamUser.count({
        where: {
          teamId: teamUser.teamId,
          role: 'OWNER',
          userId: { not: userId }
        }
      })

      if (teamMembersCount > 1 && otherOwners === 0) {
        return NextResponse.json(
          {
            error: `You are the only owner of team "${teamUser.team.name}". Please transfer ownership or delete the team first.`
          },
          { status: 400 }
        )
      }
    }

    // Log before deletion
    await logAuditEvent({
      action: 'DATA_DELETED',
      userId,
      metadata: {
        email: user.email,
        deletedAt: new Date().toISOString(),
      },
      success: true,
    })

    // Delete user (cascade will handle related data)
    // Note: Prisma will automatically delete related records based on onDelete: Cascade
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
