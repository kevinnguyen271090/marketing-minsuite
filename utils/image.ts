import sharp from 'sharp'

export interface ImageDimension {
  name: string
  width: number
  height: number
  platform?: string
}

/**
 * Predefined social media image dimensions
 */
export const SOCIAL_MEDIA_DIMENSIONS: Record<string, ImageDimension[]> = {
  facebook: [
    { name: 'Facebook Feed Post', width: 1200, height: 630, platform: 'facebook' },
    { name: 'Facebook Cover Photo', width: 820, height: 312, platform: 'facebook' },
    { name: 'Facebook Story', width: 1080, height: 1920, platform: 'facebook' },
    { name: 'Facebook Event Cover', width: 1920, height: 1005, platform: 'facebook' },
  ],
  instagram: [
    { name: 'Instagram Feed Square', width: 1080, height: 1080, platform: 'instagram' },
    { name: 'Instagram Feed Portrait', width: 1080, height: 1350, platform: 'instagram' },
    { name: 'Instagram Story', width: 1080, height: 1920, platform: 'instagram' },
    { name: 'Instagram Reel Cover', width: 1080, height: 1920, platform: 'instagram' },
  ],
  tiktok: [
    { name: 'TikTok Video', width: 1080, height: 1920, platform: 'tiktok' },
    { name: 'TikTok Profile', width: 200, height: 200, platform: 'tiktok' },
  ],
  linkedin: [
    { name: 'LinkedIn Post', width: 1200, height: 627, platform: 'linkedin' },
    { name: 'LinkedIn Cover', width: 1128, height: 191, platform: 'linkedin' },
  ],
  email: [
    { name: 'Email Header', width: 600, height: 200, platform: 'email' },
    { name: 'Email Banner', width: 600, height: 300, platform: 'email' },
  ],
  youtube: [
    { name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'youtube' },
    { name: 'YouTube Channel Cover', width: 2560, height: 1440, platform: 'youtube' },
  ],
}

/**
 * Get all available dimensions
 */
export function getAllDimensions(): ImageDimension[] {
  return Object.values(SOCIAL_MEDIA_DIMENSIONS).flat()
}

/**
 * Get dimensions for specific platform
 */
export function getDimensionsForPlatform(platform: string): ImageDimension[] {
  return SOCIAL_MEDIA_DIMENSIONS[platform] || []
}

/**
 * Resize image buffer to specific dimensions
 */
export async function resizeImage(
  inputBuffer: Buffer,
  width: number,
  height: number,
  options?: {
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
    background?: string
    quality?: number
  }
): Promise<Buffer> {
  const {
    fit = 'cover',
    background = '#FFFFFF',
    quality = 90,
  } = options || {}

  return await sharp(inputBuffer)
    .resize(width, height, {
      fit,
      background,
    })
    .jpeg({ quality })
    .toBuffer()
}

/**
 * Resize image to multiple dimensions
 */
export async function resizeImageToMultipleDimensions(
  inputBuffer: Buffer,
  dimensions: ImageDimension[],
  options?: {
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
    background?: string
    quality?: number
  }
): Promise<
  Array<{
    dimension: ImageDimension
    buffer: Buffer
    size: number
  }>
> {
  const results = []

  for (const dimension of dimensions) {
    const buffer = await resizeImage(
      inputBuffer,
      dimension.width,
      dimension.height,
      options
    )

    results.push({
      dimension,
      buffer,
      size: buffer.length,
    })
  }

  return results
}

/**
 * Get image metadata
 */
export async function getImageMetadata(inputBuffer: Buffer): Promise<{
  width: number
  height: number
  format: string
  size: number
  aspectRatio: number
}> {
  const metadata = await sharp(inputBuffer).metadata()

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: inputBuffer.length,
    aspectRatio: metadata.width && metadata.height ? metadata.width / metadata.height : 0,
  }
}

/**
 * Optimize image for web
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options?: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  }
): Promise<Buffer> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 85 } = options || {}

  return await sharp(inputBuffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality, progressive: true })
    .toBuffer()
}

/**
 * Convert image to base64
 */
export async function imageToBase64(
  inputBuffer: Buffer,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  return `data:${mimeType};base64,${inputBuffer.toString('base64')}`
}

/**
 * Convert base64 to buffer
 */
export function base64ToBuffer(base64: string): Buffer {
  const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }

  return Buffer.from(matches[2], 'base64')
}

/**
 * Add watermark to image
 */
export async function addWatermark(
  inputBuffer: Buffer,
  watermarkBuffer: Buffer,
  options?: {
    gravity?: 'northwest' | 'northeast' | 'southwest' | 'southeast' | 'center'
    opacity?: number
  }
): Promise<Buffer> {
  const { gravity = 'southeast', opacity = 0.5 } = options || {}

  // Resize watermark to 10% of image width
  const imageMetadata = await sharp(inputBuffer).metadata()
  const watermarkWidth = Math.floor((imageMetadata.width || 1000) * 0.1)

  const resizedWatermark = await sharp(watermarkBuffer)
    .resize(watermarkWidth, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer()

  return await sharp(inputBuffer)
    .composite([
      {
        input: resizedWatermark,
        gravity,
        blend: 'over',
      },
    ])
    .toBuffer()
}

/**
 * Create image thumbnail
 */
export async function createThumbnail(
  inputBuffer: Buffer,
  size: number = 200
): Promise<Buffer> {
  return await sharp(inputBuffer)
    .resize(size, size, {
      fit: 'cover',
    })
    .jpeg({ quality: 80 })
    .toBuffer()
}
