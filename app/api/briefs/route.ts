import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createBriefSchema = z.object({
  campaignId: z.string(),
  templateId: z.string().optional(),
  title: z.string(),
  type: z.enum(['KOL_BRIEF', 'CREATIVE_BRIEF', 'EVENT_BRIEF', 'CAMPAIGN_BRIEF', 'CUSTOM']),
  content: z.record(z.any()),
  attachments: z.array(z.string()).default([]),
})

// GET: List briefs
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: any = {
      campaign: {
        organizationId: (session.user as any).organizationId,
      },
    }

    if (campaignId) where.campaignId = campaignId
    if (type) where.type = type
    if (status) where.status = status

    const briefs = await prisma.brief.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ briefs })
  } catch (error) {
    console.error('Error fetching briefs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create brief
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createBriefSchema.parse(body)

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

    const brief = await prisma.brief.create({
      data: {
        ...data,
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

    return NextResponse.json({ brief })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating brief:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
