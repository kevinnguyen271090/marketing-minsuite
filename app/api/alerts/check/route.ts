import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { zaloClient } from '@/lib/zalo'
import { checkCampaignAlerts, calculateROI, calculateBudgetUsage, formatVND } from '@/utils/analytics'

/**
 * Check and trigger alerts for all active campaigns
 * This endpoint should be called by a cron job
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all active campaigns
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        organization: {
          include: {
            alerts: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    })

    const results: any[] = []

    for (const campaign of campaigns) {
      const alerts = checkCampaignAlerts(campaign)

      // Check ROI negative alert
      if (alerts.roiNegative) {
        const roiAlerts = campaign.organization.alerts.filter(
          a => a.type === 'ROI_NEGATIVE'
        )

        for (const alert of roiAlerts) {
          // Check throttling
          if (
            alert.lastTriggeredAt &&
            new Date().getTime() - alert.lastTriggeredAt.getTime() <
              alert.throttleMinutes * 60 * 1000
          ) {
            continue
          }

          // Send alerts via configured channels
          const roi = calculateROI(campaign.revenue, campaign.spent)

          for (const channel of alert.channels) {
            if (channel === 'ZALO') {
              for (const recipient of alert.recipients) {
                await zaloClient.sendCampaignAlert(recipient, campaign.name, 'ROI_NEGATIVE', {
                  roi: roi.toFixed(2),
                  spent: formatVND(campaign.spent),
                  revenue: formatVND(campaign.revenue),
                })
              }
            }
          }

          // Update last triggered time
          await prisma.alert.update({
            where: { id: alert.id },
            data: { lastTriggeredAt: new Date() },
          })

          // Log alert
          await prisma.alertLog.create({
            data: {
              alertId: alert.id,
              status: 'SENT',
              message: `ROI negative alert sent for campaign ${campaign.name}`,
            },
          })

          results.push({
            campaign: campaign.name,
            alertType: 'ROI_NEGATIVE',
            status: 'sent',
          })
        }
      }

      // Check budget threshold alert
      if (alerts.budgetWarning || alerts.budgetExceeded) {
        const budgetAlerts = campaign.organization.alerts.filter(
          a => a.type === 'BUDGET_THRESHOLD'
        )

        for (const alert of budgetAlerts) {
          // Check throttling
          if (
            alert.lastTriggeredAt &&
            new Date().getTime() - alert.lastTriggeredAt.getTime() <
              alert.throttleMinutes * 60 * 1000
          ) {
            continue
          }

          const budgetUsage = campaign.budget
            ? calculateBudgetUsage(campaign.spent, campaign.budget)
            : 0

          // Check condition
          const threshold = (alert.condition as any).threshold || 80
          if (budgetUsage < threshold) continue

          // Send alerts
          for (const channel of alert.channels) {
            if (channel === 'ZALO') {
              for (const recipient of alert.recipients) {
                await zaloClient.sendCampaignAlert(
                  recipient,
                  campaign.name,
                  'BUDGET_THRESHOLD',
                  {
                    budgetUsage: budgetUsage.toFixed(2),
                    budget: formatVND(campaign.budget || 0),
                    spent: formatVND(campaign.spent),
                    remaining: formatVND((campaign.budget || 0) - campaign.spent),
                  }
                )
              }
            }
          }

          // Update and log
          await prisma.alert.update({
            where: { id: alert.id },
            data: { lastTriggeredAt: new Date() },
          })

          await prisma.alertLog.create({
            data: {
              alertId: alert.id,
              status: 'SENT',
              message: `Budget threshold alert sent for campaign ${campaign.name}`,
            },
          })

          results.push({
            campaign: campaign.name,
            alertType: 'BUDGET_THRESHOLD',
            status: 'sent',
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      alertsChecked: campaigns.length,
      alertsSent: results.length,
      results,
    })
  } catch (error) {
    console.error('Error checking alerts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
