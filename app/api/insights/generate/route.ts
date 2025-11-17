import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInsightSummary } from '@/utils/nlq'
import { calculateROI } from '@/utils/analytics'
import { z } from 'zod'

const generateInsightSchema = z.object({
  campaignId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { campaignId } = generateInsightSchema.parse(body)

    // Get campaign data
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        organizationId: (session.user as any).organizationId,
      },
      include: {
        trackingLinks: true,
        qrCodes: true,
        events: {
          take: 100,
          orderBy: { timestamp: 'desc' },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Calculate metrics
    const totalClicks = campaign.trackingLinks.reduce((sum, link) => sum + link.clicks, 0)
    const totalConversions =
      campaign.trackingLinks.reduce((sum, link) => sum + link.conversions, 0) +
      campaign.qrCodes.reduce((sum, qr) => sum + qr.conversions, 0)

    const roi = calculateROI(campaign.revenue, campaign.spent)

    // Generate AI insight
    const insight = await generateInsightSummary({
      campaignName: campaign.name,
      metrics: {
        revenue: campaign.revenue,
        spent: campaign.spent,
        roi,
        conversions: totalConversions,
        clicks: totalClicks,
      },
      period: `${campaign.startDate?.toLocaleDateString() || ''} - ${campaign.endDate?.toLocaleDateString() || 'hiện tại'}`,
    })

    // Save insight
    const savedInsight = await prisma.insight.create({
      data: {
        organizationId: (session.user as any).organizationId,
        campaignId,
        title: insight.title,
        summary: insight.summary,
        type: roi > 100 ? 'PERFORMANCE_IMPROVEMENT' : roi < 0 ? 'PERFORMANCE_DECLINE' : 'CUSTOM',
        severity: roi < 0 ? 'CRITICAL' : roi > 200 ? 'HIGH' : 'MEDIUM',
        dataSnapshot: {
          revenue: campaign.revenue,
          spent: campaign.spent,
          roi,
          conversions: totalConversions,
          clicks: totalClicks,
        },
        recommendations: insight.recommendations.join('\n'),
        actionItems: insight.actionItems,
        modelUsed: 'claude-3-5-sonnet-20241022',
        confidence: 85,
      },
    })

    return NextResponse.json({
      insight: savedInsight,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error generating insight:', error)
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}
