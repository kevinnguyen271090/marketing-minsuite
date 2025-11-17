import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

/**
 * Generate a unique QR code identifier
 */
export function generateQRCode(): string {
  return `QR-${nanoid(12)}`
}

/**
 * Generate QR code image as data URL
 */
export async function generateQRCodeImage(
  data: string,
  options?: {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  }
): Promise<string> {
  try {
    const qrOptions = {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF',
      },
    }

    const dataUrl = await QRCode.toDataURL(data, qrOptions)
    return dataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  data: string,
  options?: {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  }
): Promise<string> {
  try {
    const qrOptions = {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF',
      },
      type: 'svg' as const,
    }

    const svg = await QRCode.toString(data, qrOptions)
    return svg
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

/**
 * Build QR code tracking URL
 */
export function buildQRCodeURL(
  baseUrl: string,
  qrCode: string,
  discountCode?: string
): string {
  const url = new URL(`${baseUrl}/qr/${qrCode}`)

  if (discountCode) {
    url.searchParams.set('discount', discountCode)
  }

  return url.toString()
}
