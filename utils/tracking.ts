import { nanoid } from 'nanoid'
import crypto from 'crypto'

/**
 * Generate a unique short code for tracking links
 */
export function generateShortCode(length: number = 8): string {
  return nanoid(length)
}

/**
 * Build UTM parameters for tracking URLs
 */
export function buildUTMParams(params: {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}): string {
  const searchParams = new URLSearchParams()

  if (params.source) searchParams.set('utm_source', params.source)
  if (params.medium) searchParams.set('utm_medium', params.medium)
  if (params.campaign) searchParams.set('utm_campaign', params.campaign)
  if (params.term) searchParams.set('utm_term', params.term)
  if (params.content) searchParams.set('utm_content', params.content)

  return searchParams.toString()
}

/**
 * Create a tracking URL with UTM parameters
 */
export function createTrackingURL(
  baseUrl: string,
  shortCode: string,
  utmParams?: string
): string {
  const trackingUrl = `${baseUrl}/t/${shortCode}`

  if (utmParams) {
    return `${trackingUrl}?${utmParams}`
  }

  return trackingUrl
}

/**
 * Hash session info for privacy (IP + User Agent)
 */
export function hashSession(ip: string, userAgent: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(`${ip}:${userAgent}`)
  return hash.digest('hex')
}

/**
 * Create browser fingerprint hash
 */
export function hashFingerprint(data: {
  userAgent: string
  language?: string
  timezone?: string
  screen?: string
}): string {
  const hash = crypto.createHash('sha256')
  const fingerprint = [
    data.userAgent,
    data.language || '',
    data.timezone || '',
    data.screen || ''
  ].join(':')

  hash.update(fingerprint)
  return hash.digest('hex')
}

/**
 * Parse device type from user agent
 */
export function parseDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet'
  }

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile'
  }

  return 'desktop'
}

/**
 * Extract browser info from user agent
 */
export function parseBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (ua.includes('edg/')) return 'Edge'
  if (ua.includes('chrome/')) return 'Chrome'
  if (ua.includes('safari/') && !ua.includes('chrome')) return 'Safari'
  if (ua.includes('firefox/')) return 'Firefox'
  if (ua.includes('opera/') || ua.includes('opr/')) return 'Opera'

  return 'Unknown'
}

/**
 * Extract OS from user agent
 */
export function parseOS(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac os')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS'

  return 'Unknown'
}
