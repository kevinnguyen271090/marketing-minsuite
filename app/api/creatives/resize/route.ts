import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  resizeImageToMultipleDimensions,
  getAllDimensions,
  getDimensionsForPlatform,
  getImageMetadata,
  imageToBase64,
  base64ToBuffer,
  ImageDimension,
} from '@/utils/image'
import { z } from 'zod'

const resizeSchema = z.object({
  imageBase64: z.string(),
  platforms: z.array(z.string()).optional(),
  customDimensions: z
    .array(
      z.object({
        name: z.string(),
        width: z.number(),
        height: z.number(),
      })
    )
    .optional(),
  fit: z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).default('cover'),
  quality: z.number().min(1).max(100).default(90),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = resizeSchema.parse(body)

    // Convert base64 to buffer
    const inputBuffer = base64ToBuffer(data.imageBase64)

    // Get original metadata
    const originalMetadata = await getImageMetadata(inputBuffer)

    // Determine dimensions to resize to
    let targetDimensions: ImageDimension[] = []

    if (data.platforms && data.platforms.length > 0) {
      // Get dimensions for specified platforms
      for (const platform of data.platforms) {
        targetDimensions.push(...getDimensionsForPlatform(platform))
      }
    } else if (data.customDimensions && data.customDimensions.length > 0) {
      // Use custom dimensions
      targetDimensions = data.customDimensions.map((d) => ({
        name: d.name,
        width: d.width,
        height: d.height,
      }))
    } else {
      // Default: use all common dimensions
      targetDimensions = getAllDimensions()
    }

    // Resize to all target dimensions
    const resizedImages = await resizeImageToMultipleDimensions(
      inputBuffer,
      targetDimensions,
      {
        fit: data.fit,
        quality: data.quality,
      }
    )

    // Convert to base64 for response
    const results = await Promise.all(
      resizedImages.map(async (result) => ({
        name: result.dimension.name,
        platform: result.dimension.platform,
        width: result.dimension.width,
        height: result.dimension.height,
        size: result.size,
        sizeFormatted: formatBytes(result.size),
        imageBase64: await imageToBase64(result.buffer),
      }))
    )

    return NextResponse.json({
      original: {
        width: originalMetadata.width,
        height: originalMetadata.height,
        format: originalMetadata.format,
        size: originalMetadata.size,
        sizeFormatted: formatBytes(originalMetadata.size),
        aspectRatio: originalMetadata.aspectRatio.toFixed(2),
      },
      resized: results,
      count: results.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error resizing image:', error)
    return NextResponse.json(
      { error: 'Failed to resize image' },
      { status: 500 }
    )
  }
}

// GET: Get available dimensions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform')

    if (platform) {
      const dimensions = getDimensionsForPlatform(platform)
      return NextResponse.json({ platform, dimensions })
    }

    const allDimensions = getAllDimensions()

    // Group by platform
    const groupedByPlatform: Record<string, ImageDimension[]> = {}

    for (const dimension of allDimensions) {
      const platformKey = dimension.platform || 'other'
      if (!groupedByPlatform[platformKey]) {
        groupedByPlatform[platformKey] = []
      }
      groupedByPlatform[platformKey].push(dimension)
    }

    return NextResponse.json({
      dimensions: groupedByPlatform,
      total: allDimensions.length,
    })
  } catch (error) {
    console.error('Error fetching dimensions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
