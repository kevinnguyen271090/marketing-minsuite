import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAssetSchema = z.object({
  name: z.string(),
  type: z.enum(['LOGO', 'COLOR', 'FONT', 'IMAGE', 'ICON', 'TEMPLATE']),
  category: z.string().optional(),
  fileUrl: z.string().optional(),
  value: z.string().optional(),
  fontFamily: z.string().optional(),
  hexColor: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})

// GET: List brand assets
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const where: any = {
      organizationId: (session.user as any).organizationId,
    }

    if (type) where.type = type
    if (category) where.category = category

    const assets = await prisma.brandAsset.findMany({
      where,
      include: {
        previousVersion: {
          select: {
            id: true,
            name: true,
            version: true,
          },
        },
        versions: {
          select: {
            id: true,
            name: true,
            version: true,
            createdAt: true,
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Error fetching brand assets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create brand asset
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createAssetSchema.parse(body)

    const asset = await prisma.brandAsset.create({
      data: {
        ...data,
        organizationId: (session.user as any).organizationId,
      },
    })

    return NextResponse.json({ asset })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating brand asset:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
