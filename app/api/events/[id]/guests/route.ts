import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateQRCode, generateQRCodeImage } from '@/utils/qrcode'
import { z } from 'zod'

const addGuestSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

const bulkAddGuestsSchema = z.object({
  guests: z.array(addGuestSchema),
})

// GET: List event guests
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

    // Verify event access
    const event = await prisma.event.findFirst({
      where: {
        id,
        organizationId: (session.user as any).organizationId,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const guests = await prisma.eventGuest.findMany({
      where: { eventId: id },
      orderBy: { registeredAt: 'desc' },
    })

    return NextResponse.json({ guests })
  } catch (error) {
    console.error('Error fetching event guests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Add guest(s) to event
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Verify event access
    const event = await prisma.event.findFirst({
      where: {
        id,
        organizationId: (session.user as any).organizationId,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const body = await req.json()

    // Check if bulk or single add
    const isBulk = Array.isArray(body.guests)

    if (isBulk) {
      // Bulk add
      const data = bulkAddGuestsSchema.parse(body)

      const guestsToCreate = await Promise.all(
        data.guests.map(async (guestData) => {
          const qrCode = generateQRCode()
          return {
            ...guestData,
            eventId: id,
            qrCode,
          }
        })
      )

      const guests = await prisma.eventGuest.createMany({
        data: guestsToCreate,
        skipDuplicates: true,
      })

      // Update event registered count
      await prisma.event.update({
        where: { id },
        data: {
          registeredCount: {
            increment: guests.count,
          },
        },
      })

      return NextResponse.json({
        message: `Added ${guests.count} guests`,
        count: guests.count,
      })
    } else {
      // Single add
      const guestData = addGuestSchema.parse(body)

      // Generate personal QR code for check-in
      const qrCode = generateQRCode()
      const baseUrl = process.env.APP_URL || 'http://localhost:3000'
      const checkInUrl = `${baseUrl}/events/check-in/${event.qrCode}?guest=${qrCode}`
      const qrImageDataUrl = await generateQRCodeImage(checkInUrl, {
        width: 300,
      })

      const guest = await prisma.eventGuest.create({
        data: {
          ...guestData,
          eventId: id,
          qrCode,
        },
      })

      // Update event registered count
      await prisma.event.update({
        where: { id },
        data: {
          registeredCount: {
            increment: 1,
          },
        },
      })

      return NextResponse.json({
        guest,
        qrCodeImage: qrImageDataUrl,
        checkInUrl,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding event guest:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
