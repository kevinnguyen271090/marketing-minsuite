import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Find tracking link
    const trackingLink = await prisma.trackingLink.findUnique({
      where: { shortCode: code },
      include: { campaign: true },
    })

    if (!trackingLink) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Track click event (fire and forget)
    fetch(`${req.nextUrl.origin}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'CLICK',
        campaignId: trackingLink.campaignId,
        trackingLinkId: trackingLink.id,
        referrer: req.headers.get('referer'),
        landingPage: trackingLink.targetUrl,
      }),
    }).catch(console.error)

    // Build target URL with UTM parameters
    const targetUrl = new URL(trackingLink.targetUrl)
    const { searchParams } = new URL(req.url)

    // Add UTM params from tracking link
    if (trackingLink.utmSource) targetUrl.searchParams.set('utm_source', trackingLink.utmSource)
    if (trackingLink.utmMedium) targetUrl.searchParams.set('utm_medium', trackingLink.utmMedium)
    if (trackingLink.utmCampaign) targetUrl.searchParams.set('utm_campaign', trackingLink.utmCampaign)
    if (trackingLink.utmTerm) targetUrl.searchParams.set('utm_term', trackingLink.utmTerm)
    if (trackingLink.utmContent) targetUrl.searchParams.set('utm_content', trackingLink.utmContent)

    // Forward any additional query params
    searchParams.forEach((value, key) => {
      if (!key.startsWith('utm_')) {
        targetUrl.searchParams.set(key, value)
      }
    })

    // Redirect to target URL
    return NextResponse.redirect(targetUrl.toString())
  } catch (error) {
    console.error('Error in tracking redirect:', error)
    return NextResponse.redirect(new URL('/', req.url))
  }
}
