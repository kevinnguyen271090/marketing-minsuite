import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateQRCode, generateQRCodeImage } from '@/utils/qrcode'
import { calculateROI } from '@/utils/analytics'
import { z } from 'zod'

const createEventSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['WORKSHOP', 'SEMINAR', 'PRODUCT_LAUNCH', 'NETWORKING', 'CONFERENCE', 'WEBINAR', 'TRADE_SHOW', 'POPUP_STORE', 'OTHER']),
  location: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isVirtual: z.boolean().default(false),
  virtualUrl: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  budget: z.number().optional(),
  maxGuests: z.number().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
})

// GET: List events
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const upcoming = searchParams.get('upcoming')

    const where: any = {
      organizationId: (session.user as any).organizationId,
    }

    if (type) where.type = type
    if (upcoming === 'true') {
      where.startDate = {
        gte: new Date(),
      }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        _count: {
          select: {
            guests: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    })

    // Calculate ROI for each event
    const eventsWithROI = events.map((event) => ({
      ...event,
      roi: calculateROI(event.revenue, event.spent),
      occupancy: event.maxGuests
        ? (event.registeredCount / event.maxGuests) * 100
        : null,
      checkInRate: event.registeredCount
        ? (event.checkedInCount / event.registeredCount) * 100
        : 0,
    }))

    return NextResponse.json({ events: eventsWithROI })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create event
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createEventSchema.parse(body)

    // Generate QR code for check-in
    const qrCode = generateQRCode()
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const checkInUrl = `${baseUrl}/events/check-in/${qrCode}`
    const qrImageDataUrl = await generateQRCodeImage(checkInUrl, {
      width: 400,
    })

    const event = await prisma.event.create({
      data: {
        ...data,
        organizationId: (session.user as any).organizationId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        qrCode,
      },
    })

    return NextResponse.json({
      event,
      qrCodeImage: qrImageDataUrl,
      checkInUrl,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
