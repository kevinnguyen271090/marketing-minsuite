import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateQRCode, generateQRCodeImage, buildQRCodeURL } from '@/utils/qrcode'
import { z } from 'zod'

const createQRSchema = z.object({
  campaignId: z.string(),
  name: z.string(),
  type: z.enum(['DISCOUNT', 'CHECKIN', 'SURVEY', 'REDIRECT']),
  discountCode: z.string().optional(),
  discountValue: z.number().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  targetUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
})

// GET: List all QR codes for a campaign
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

    const qrCodes = await prisma.qRCode.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ qrCodes })
  } catch (error) {
    console.error('Error fetching QR codes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new QR code
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createQRSchema.parse(body)

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

    // Generate unique QR code
    let code: string
    let exists = true

    while (exists) {
      code = generateQRCode()
      const existing = await prisma.qRCode.findUnique({
        where: { code },
      })
      exists = !!existing
    }

    // Build QR code URL
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const qrUrl = buildQRCodeURL(baseUrl, code!, validatedData.discountCode)

    // Generate QR code image
    const qrImageDataUrl = await generateQRCodeImage(qrUrl, {
      width: 400,
      margin: 2,
    })

    // Create QR code record
    const qrCode = await prisma.qRCode.create({
      data: {
        code: code!,
        campaignId: validatedData.campaignId,
        name: validatedData.name,
        type: validatedData.type,
        discountCode: validatedData.discountCode,
        discountValue: validatedData.discountValue,
        discountType: validatedData.discountType,
        location: validatedData.location,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        targetUrl: validatedData.targetUrl,
        imageUrl: qrImageDataUrl,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        metadata: validatedData.metadata,
      },
    })

    return NextResponse.json({
      qrCode: {
        ...qrCode,
        qrUrl,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
