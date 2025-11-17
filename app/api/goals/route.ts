import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateROI } from '@/utils/analytics'
import { optimizeChannelAllocation } from '@/utils/ai-planner'
import { z } from 'zod'

const createGoalSchema = z.object({
  campaignId: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['REVENUE', 'ROI', 'CONVERSIONS', 'BRAND_AWARENESS', 'ENGAGEMENT', 'CUSTOM']),
  targetRevenue: z.number().optional(),
  targetROI: z.number().optional(),
  targetConversions: z.number().optional(),
  targetImpressions: z.number().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  channelAllocations: z
    .array(
      z.object({
        channel: z.enum([
          'FACEBOOK_ADS',
          'GOOGLE_ADS',
          'TIKTOK_ADS',
          'ZALO_ADS',
          'KOL_INFLUENCER',
          'SEO_CONTENT',
          'EMAIL_MARKETING',
          'OFFLINE_EVENT',
          'TV_RADIO',
          'PRINT_MEDIA',
          'OTHER',
        ]),
        allocatedBudget: z.number(),
        allocatedPercentage: z.number(),
        targetRevenue: z.number().optional(),
        targetConversions: z.number().optional(),
      })
    )
    .optional(),
  metadata: z.record(z.any()).optional(),
})

// GET: List goals
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    const status = searchParams.get('status')

    const where: any = {
      organizationId: (session.user as any).organizationId,
    }

    if (campaignId) where.campaignId = campaignId
    if (status) where.status = status

    const goals = await prisma.goal.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
        channelAllocations: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate deviation for each goal
    const goalsWithMetrics = goals.map((goal) => {
      const deviation =
        goal.targetRevenue && goal.targetRevenue > 0
          ? ((goal.currentRevenue - goal.targetRevenue) / goal.targetRevenue) * 100
          : 0

      const progress =
        goal.targetRevenue && goal.targetRevenue > 0
          ? Math.min((goal.currentRevenue / goal.targetRevenue) * 100, 100)
          : 0

      return {
        ...goal,
        deviation,
        progress,
        isOnTrack: deviation >= -15, // Within 15% tolerance
      }
    })

    return NextResponse.json({ goals: goalsWithMetrics })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create goal with AI-optimized channel allocation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createGoalSchema.parse(body)

    // Create goal
    const goal = await prisma.goal.create({
      data: {
        organizationId: (session.user as any).organizationId,
        campaignId: data.campaignId,
        name: data.name,
        description: data.description,
        type: data.type,
        targetRevenue: data.targetRevenue,
        targetROI: data.targetROI,
        targetConversions: data.targetConversions,
        targetImpressions: data.targetImpressions,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        metadata: data.metadata,
      },
    })

    // Create channel allocations
    if (data.channelAllocations && data.channelAllocations.length > 0) {
      await prisma.channelAllocation.createMany({
        data: data.channelAllocations.map((allocation) => ({
          goalId: goal.id,
          ...allocation,
        })),
      })
    }

    // Fetch with allocations
    const goalWithAllocations = await prisma.goal.findUnique({
      where: { id: goal.id },
      include: {
        channelAllocations: true,
      },
    })

    return NextResponse.json({ goal: goalWithAllocations })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
