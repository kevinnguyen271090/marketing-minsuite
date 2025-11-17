import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateShortCode, buildUTMParams, createTrackingURL } from '@/utils/tracking'
import { z } from 'zod'

const createLinkSchema = z.object({
  campaignId: z.string(),
  targetUrl: z.string().url(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// GET: List all tracking links for a campaign
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
    }

    // Check if user has access to this campaign
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        organizationId: (session.user as any).organizationId,
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const trackingLinks = await prisma.trackingLink.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ trackingLinks })
  } catch (error) {
    console.error('Error fetching tracking links:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new tracking link
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createLinkSchema.parse(body)

    // Check if user has access to this campaign
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: validatedData.campaignId,
        organizationId: (session.user as any).organizationId,
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Generate unique short code
    let shortCode: string
    let exists = true

    while (exists) {
      shortCode = generateShortCode()
      const existing = await prisma.trackingLink.findUnique({
        where: { shortCode },
      })
      exists = !!existing
    }

    // Create tracking link
    const trackingLink = await prisma.trackingLink.create({
      data: {
        shortCode: shortCode!,
        campaignId: validatedData.campaignId,
        targetUrl: validatedData.targetUrl,
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        utmTerm: validatedData.utmTerm,
        utmContent: validatedData.utmContent,
        metadata: validatedData.metadata,
      },
    })

    // Build the full tracking URL
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const utmParams = buildUTMParams({
      source: validatedData.utmSource,
      medium: validatedData.utmMedium,
      campaign: validatedData.utmCampaign,
      term: validatedData.utmTerm,
      content: validatedData.utmContent,
    })

    const trackingUrl = createTrackingURL(baseUrl, shortCode!, utmParams)

    return NextResponse.json({
      trackingLink: {
        ...trackingLink,
        trackingUrl,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating tracking link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
