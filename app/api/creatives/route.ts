import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCreativeSchema = z.object({
  campaignId: z.string().optional(),
  name: z.string(),
  type: z.enum(['SOCIAL_POST', 'EMAIL', 'BANNER', 'VIDEO', 'LANDING_PAGE', 'SEO_CONTENT']),
  format: z.enum(['IMAGE', 'VIDEO', 'TEXT', 'HTML', 'CAROUSEL']),
  content: z.string().optional(),
  htmlContent: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
})

// GET: List creatives
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
      organizationId: (session.user as any).organizationId,
    }

    if (campaignId) where.campaignId = campaignId
    if (type) where.type = type
    if (status) where.status = status

    const creatives = await prisma.creative.findMany({
      where,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: true,
        _count: {
          select: {
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate CTR for each creative
    const creativesWithMetrics = creatives.map((creative) => {
      const ctr = creative.impressions > 0 ? (creative.clicks / creative.impressions) * 100 : 0
      const conversionRate =
        creative.clicks > 0 ? (creative.conversions / creative.clicks) * 100 : 0
      const roi =
        creative.revenue > 0 && creative.impressions > 0
          ? ((creative.revenue - creative.impressions * 0.01) / (creative.impressions * 0.01)) * 100
          : 0

      return {
        ...creative,
        metrics: {
          ctr: ctr.toFixed(2),
          conversionRate: conversionRate.toFixed(2),
          roi: roi.toFixed(2),
        },
      }
    })

    return NextResponse.json({ creatives: creativesWithMetrics })
  } catch (error) {
    console.error('Error fetching creatives:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create creative
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createCreativeSchema.parse(body)

    // Verify campaign access if campaignId provided
    if (data.campaignId) {
      const campaign = await prisma.campaign.findFirst({
        where: {
          id: data.campaignId,
          organizationId: (session.user as any).organizationId,
        },
      })

      if (!campaign) {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        )
      }
    }

    const creative = await prisma.creative.create({
      data: {
        ...data,
        organizationId: (session.user as any).organizationId,
        generatedBy: 'manual',
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

    return NextResponse.json({ creative })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating creative:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
