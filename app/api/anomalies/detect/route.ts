import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { detectCampaignAnomalies, describeAnomaly } from '@/utils/anomaly'
import { z } from 'zod'

const detectSchema = z.object({
  campaignId: z.string().optional(),
  checkAll: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { campaignId, checkAll } = detectSchema.parse(body)

    const where: any = {
      organizationId: (session.user as any).organizationId,
      status: 'ACTIVE',
    }

    if (campaignId) where.id = campaignId

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        trackingLinks: true,
        qrCodes: true,
      },
    })

    const detectedAnomalies = []

    for (const campaign of campaigns) {
      // Get historical data (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const historicalEvents = await prisma.trackingEvent.groupBy({
        by: ['timestamp'],
        where: {
          campaignId: campaign.id,
          timestamp: {
            gte: thirtyDaysAgo,
          },
        },
        _sum: {
          revenue: true,
        },
        _count: {
          id: true,
        },
      })

      // Build historical metrics
      const historicalMetrics = historicalEvents.map((e) => ({
        timestamp: e.timestamp,
        metrics: {
          revenue: e._sum.revenue || 0,
          spent: campaign.spent / 30, // Daily average
          conversions: 0,
          clicks: 0,
          roi: 0,
        },
      }))

      // Current metrics
      const currentMetrics = {
        revenue: campaign.revenue,
        spent: campaign.spent,
        conversions: 0,
        clicks: campaign.trackingLinks.reduce((sum, link) => sum + link.clicks, 0),
        roi: campaign.revenue > 0 && campaign.spent > 0
          ? ((campaign.revenue - campaign.spent) / campaign.spent) * 100
          : 0,
      }

      // Detect anomalies
      const anomalies = detectCampaignAnomalies(historicalMetrics, currentMetrics)

      // Save detected anomalies
      for (const [metric, result] of Object.entries(anomalies)) {
        const description = describeAnomaly(metric, result)

        const anomaly = await prisma.anomaly.create({
          data: {
            organizationId: (session.user as any).organizationId,
            campaignId: campaign.id,
            title: description.title,
            description: description.description,
            type: metric.includes('revenue')
              ? result.actualValue > result.expectedValue ? 'REVENUE_SPIKE' : 'REVENUE_DROP'
              : 'CUSTOM',
            severity: result.severity,
            metric,
            expectedValue: result.expectedValue,
            actualValue: result.actualValue,
            deviationPercent: result.deviationPercent,
            timeRangeStart: thirtyDaysAgo,
            timeRangeEnd: new Date(),
            possibleCauses: [],
            status: 'OPEN',
          },
        })

        detectedAnomalies.push(anomaly)
      }
    }

    return NextResponse.json({
      campaignsChecked: campaigns.length,
      anomaliesDetected: detectedAnomalies.length,
      anomalies: detectedAnomalies,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error detecting anomalies:', error)
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    )
  }
}
