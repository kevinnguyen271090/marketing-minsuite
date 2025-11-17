import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAlertSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['ROI_NEGATIVE', 'BUDGET_THRESHOLD', 'REVENUE_DROP', 'CAMPAIGN_COMPLETED', 'CUSTOM']),
  condition: z.record(z.any()),
  channels: z.array(z.enum(['ZALO', 'EMAIL', 'SMS', 'WEBHOOK'])),
  recipients: z.array(z.string()),
  throttleMinutes: z.number().default(60),
})

// GET: List all alerts for organization
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const alerts = await prisma.alert.findMany({
      where: {
        organizationId: (session.user as any).organizationId,
      },
      include: {
        _count: {
          select: {
            logs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new alert
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createAlertSchema.parse(body)

    const alert = await prisma.alert.create({
      data: {
        ...validatedData,
        organizationId: (session.user as any).organizationId,
      },
    })

    return NextResponse.json({ alert })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
