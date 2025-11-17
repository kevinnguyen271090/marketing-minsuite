import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { forecastResources } from '@/utils/ai-planner'
import { z } from 'zod'

const forecastSchema = z.object({
  campaignId: z.string().optional(),
  campaignType: z.string(),
  budget: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  channels: z.array(z.string()),
  complexity: z.enum(['simple', 'medium', 'complex']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = forecastSchema.parse(body)

    // Run AI forecast
    const forecast = await forecastResources({
      campaignType: data.campaignType,
      budget: data.budget,
      timeline: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      channels: data.channels,
      complexity: data.complexity,
    })

    // Save forecast
    const resourceForecast = await prisma.resourceForecast.create({
      data: {
        organizationId: (session.user as any).organizationId,
        campaignId: data.campaignId,
        forecastDate: new Date(data.startDate),
        periodType: 'MONTH',
        estimatedHours: forecast.estimatedHours,
        requiredHeadcount: forecast.requiredHeadcount,
        estimatedCost: forecast.estimatedCost,
        roles: forecast.roles,
        recommendations: forecast.recommendations,
        shouldHireAgency: forecast.shouldHireAgency,
        shouldHireFreelancer: forecast.shouldHireFreelancer,
        confidence: forecast.confidence,
        modelUsed: 'claude-3-5-sonnet-20241022',
      },
    })

    return NextResponse.json({
      forecast: resourceForecast,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error forecasting resources:', error)
    return NextResponse.json(
      { error: 'Failed to forecast resources' },
      { status: 500 }
    )
  }
}
