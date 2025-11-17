import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateROI, calculateCAC, calculateConversionRate, calculateROAS, calculateBudgetUsage } from '@/utils/analytics'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get campaign with analytics
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        organizationId: (session.user as any).organizationId,
      },
      include: {
        trackingLinks: true,
        qrCodes: true,
        events: {
          where: {
            timestamp: {
              gte: campaign?.startDate || undefined,
              lte: campaign?.endDate || undefined,
            },
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Calculate analytics
    const totalClicks = campaign.trackingLinks.reduce((sum, link) => sum + link.clicks, 0)
    const totalScans = campaign.qrCodes.reduce((sum, qr) => sum + qr.scans, 0)
    const totalConversions = campaign.trackingLinks.reduce((sum, link) => sum + link.conversions, 0) +
                             campaign.qrCodes.reduce((sum, qr) => sum + qr.conversions, 0)

    const roi = calculateROI(campaign.revenue, campaign.spent)
    const cac = calculateCAC(campaign.spent, totalConversions)
    const conversionRate = calculateConversionRate(totalConversions, totalClicks + totalScans)
    const roas = calculateROAS(campaign.revenue, campaign.spent)
    const budgetUsage = campaign.budget ? calculateBudgetUsage(campaign.spent, campaign.budget) : null

    // Get event breakdown
    const eventsByType = await prisma.trackingEvent.groupBy({
      by: ['type'],
      where: { campaignId: id },
      _count: { id: true },
      _sum: { revenue: true },
    })

    // Get events over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const eventsOverTime = await prisma.$queryRaw<Array<{
      date: Date
      clicks: bigint
      conversions: bigint
      revenue: number
    }>>`
      SELECT
        DATE(timestamp) as date,
        COUNT(CASE WHEN type IN ('CLICK', 'SCAN') THEN 1 END) as clicks,
        COUNT(CASE WHEN type = 'CONVERSION' THEN 1 END) as conversions,
        COALESCE(SUM(revenue), 0) as revenue
      FROM tracking_events
      WHERE campaign_id = ${id}
        AND timestamp >= ${thirtyDaysAgo}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `

    // Get top performing tracking links
    const topLinks = campaign.trackingLinks
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(link => ({
        id: link.id,
        shortCode: link.shortCode,
        clicks: link.clicks,
        conversions: link.conversions,
        conversionRate: calculateConversionRate(link.conversions, link.clicks),
      }))

    // Get top performing QR codes
    const topQRCodes = campaign.qrCodes
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 5)
      .map(qr => ({
        id: qr.id,
        name: qr.name,
        location: qr.location,
        scans: qr.scans,
        conversions: qr.conversions,
        revenue: qr.revenue,
        conversionRate: calculateConversionRate(qr.conversions, qr.scans),
      }))

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        type: campaign.type,
        budget: campaign.budget,
        spent: campaign.spent,
        revenue: campaign.revenue,
      },
      metrics: {
        roi,
        cac,
        conversionRate,
        roas,
        budgetUsage,
        totalClicks,
        totalScans,
        totalConversions,
        totalEvents: campaign.events.length,
      },
      eventsByType: eventsByType.map(e => ({
        type: e.type,
        count: Number(e._count.id),
        revenue: e._sum.revenue || 0,
      })),
      eventsOverTime: eventsOverTime.map(e => ({
        date: e.date,
        clicks: Number(e.clicks),
        conversions: Number(e.conversions),
        revenue: e.revenue,
      })),
      topLinks,
      topQRCodes,
    })
  } catch (error) {
    console.error('Error fetching campaign analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
