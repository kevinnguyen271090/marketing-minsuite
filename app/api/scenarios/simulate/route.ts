import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { simulateScenario } from '@/utils/ai-planner'
import { z } from 'zod'

const simulateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  baseCampaignId: z.string().optional(),
  type: z.enum(['BUDGET_CHANGE', 'CHANNEL_MIX', 'TIMING_CHANGE', 'AUDIENCE_CHANGE', 'CREATIVE_CHANGE', 'CUSTOM']),
  parameters: z.record(z.any()),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = simulateSchema.parse(body)

    // Get current metrics if base campaign provided
    let currentMetrics = {
      revenue: 0,
      spent: 0,
      conversions: 0,
      roi: 0,
    }

    if (data.baseCampaignId) {
      const campaign = await prisma.campaign.findFirst({
        where: {
          id: data.baseCampaignId,
          organizationId: (session.user as any).organizationId,
        },
      })

      if (campaign) {
        currentMetrics = {
          revenue: campaign.revenue,
          spent: campaign.spent,
          conversions: 0, // TODO: calculate from events
          roi: campaign.revenue > 0 && campaign.spent > 0
            ? ((campaign.revenue - campaign.spent) / campaign.spent) * 100
            : 0,
        }
      }
    }

    // Run AI simulation
    const simulation = await simulateScenario({
      currentMetrics,
      changes: data.parameters,
    })

    // Save scenario
    const scenario = await prisma.scenario.create({
      data: {
        organizationId: (session.user as any).organizationId,
        baseCampaignId: data.baseCampaignId,
        name: data.name,
        description: data.description,
        type: data.type,
        parameters: data.parameters,
        predictions: simulation.predictions,
        confidence: simulation.confidence,
        status: 'SIMULATED',
        modelUsed: 'claude-3-5-sonnet-20241022',
        metadata: {
          reasoning: simulation.reasoning,
        },
      },
    })

    return NextResponse.json({
      scenario,
      simulation,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error simulating scenario:', error)
    return NextResponse.json(
      { error: 'Failed to simulate scenario' },
      { status: 500 }
    )
  }
}
