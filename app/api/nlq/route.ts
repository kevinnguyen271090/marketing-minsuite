import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseNaturalLanguageQuery, answerQueryWithData } from '@/utils/nlq'
import { z } from 'zod'

const querySchema = z.object({
  query: z.string().min(3),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { query } = querySchema.parse(body)

    const startTime = Date.now()

    // Get available campaigns for context
    const campaigns = await prisma.campaign.findMany({
      where: {
        organizationId: (session.user as any).organizationId,
      },
      select: {
        id: true,
        name: true,
      },
      take: 50,
    })

    // Parse query
    const parsedQuery = await parseNaturalLanguageQuery(query, {
      availableCampaigns: campaigns,
      availableMetrics: ['revenue', 'roi', 'conversions', 'clicks', 'spent'],
    })

    let finalResponse = parsedQuery.response
    let dataFetched: any = null

    // Execute query if needed
    if (parsedQuery.queryType === 'METRIC_QUERY' && parsedQuery.entities.campaigns) {
      // Fetch campaign data
      const campaignData = await prisma.campaign.findMany({
        where: {
          organizationId: (session.user as any).organizationId,
          name: {
            in: parsedQuery.entities.campaigns,
          },
        },
        include: {
          trackingLinks: true,
          qrCodes: true,
        },
      })

      dataFetched = campaignData

      // Generate natural language answer
      finalResponse = await answerQueryWithData({
        question: query,
        data: campaignData,
        context: 'Dữ liệu chiến dịch marketing',
      })
    }

    const responseTime = Date.now() - startTime

    // Log query
    await prisma.queryLog.create({
      data: {
        organizationId: (session.user as any).organizationId,
        userId: (session.user as any).id,
        query,
        queryType: parsedQuery.queryType,
        response: finalResponse,
        responseTime,
        tokensUsed: 0, // TODO: track from Claude API
        modelUsed: 'claude-3-5-sonnet-20241022',
        confidence: parsedQuery.confidence,
        intent: parsedQuery.intent,
        entities: parsedQuery.entities,
        sqlGenerated: parsedQuery.sql,
        apisCalled: dataFetched ? ['campaigns'] : [],
      },
    })

    return NextResponse.json({
      query,
      response: finalResponse,
      queryType: parsedQuery.queryType,
      entities: parsedQuery.entities,
      confidence: parsedQuery.confidence,
      responseTime,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error processing NLQ:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}
