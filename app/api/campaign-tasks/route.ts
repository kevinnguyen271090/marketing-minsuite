import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTaskSchema = z.object({
  campaignId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['FACEBOOK_ADS', 'GOOGLE_ADS', 'TIKTOK_ADS', 'KOL_POST', 'EMAIL_BLAST', 'EVENT', 'CONTENT_CREATION', 'REVIEW_APPROVAL', 'OTHER']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']).default('TODO'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  assignedToEmail: z.string().email().optional(),
  dependsOn: z.array(z.string()).default([]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
})

// GET: List campaign tasks
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {
      campaign: {
        organizationId: (session.user as any).organizationId,
      },
    }

    if (campaignId) where.campaignId = campaignId
    if (status) where.status = status
    if (type) where.type = type

    const tasks = await prisma.campaignTask.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
          },
        },
      },
      orderBy: [
        { startDate: 'asc' },
        { priority: 'desc' },
      ],
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching campaign tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create campaign task
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createTaskSchema.parse(body)

    // Verify campaign access
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: data.campaignId,
        organizationId: (session.user as any).organizationId,
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const task = await prisma.campaignTask.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating campaign task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
