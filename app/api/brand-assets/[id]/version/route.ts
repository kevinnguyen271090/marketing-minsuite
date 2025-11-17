import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createVersionSchema = z.object({
  fileUrl: z.string().optional(),
  value: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// POST: Create new version of asset
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

    // Get current asset
    const currentAsset = await prisma.brandAsset.findFirst({
      where: {
        id,
        organizationId: (session.user as any).organizationId,
      },
    })

    if (!currentAsset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const body = await req.json()
    const data = createVersionSchema.parse(body)

    // Create new version
    const newVersion = await prisma.brandAsset.create({
      data: {
        organizationId: currentAsset.organizationId,
        name: currentAsset.name,
        type: currentAsset.type,
        category: currentAsset.category,
        fileUrl: data.fileUrl || currentAsset.fileUrl,
        value: data.value || currentAsset.value,
        fontFamily: currentAsset.fontFamily,
        hexColor: currentAsset.hexColor,
        fileSize: currentAsset.fileSize,
        mimeType: currentAsset.mimeType,
        version: currentAsset.version + 1,
        previousVersionId: currentAsset.id,
        description: data.description || currentAsset.description,
        tags: currentAsset.tags,
        isPublic: currentAsset.isPublic,
        metadata: data.metadata || currentAsset.metadata,
      },
    })

    return NextResponse.json({
      asset: newVersion,
      message: `Created version ${newVersion.version}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating asset version:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
