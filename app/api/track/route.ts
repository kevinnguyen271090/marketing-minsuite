import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashSession, hashFingerprint, parseDeviceType, parseBrowser, parseOS } from '@/utils/tracking'
import { z } from 'zod'

const trackEventSchema = z.object({
  type: z.enum(['CLICK', 'SCAN', 'PAGE_VIEW', 'CONVERSION', 'PURCHASE', 'LEAD', 'SIGNUP']),
  campaignId: z.string().optional(),
  trackingLinkId: z.string().optional(),
  qrCodeId: z.string().optional(),
  revenue: z.number().optional(),
  conversionValue: z.number().optional(),
  referrer: z.string().optional(),
  landingPage: z.string().optional(),
  fingerprint: z.object({
    language: z.string().optional(),
    timezone: z.string().optional(),
    screen: z.string().optional(),
  }).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = trackEventSchema.parse(body)

    // Get request metadata
    const userAgent = req.headers.get('user-agent') || ''
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                req.headers.get('x-real-ip') ||
                'unknown'

    // Parse device info
    const deviceType = parseDeviceType(userAgent)
    const browser = parseBrowser(userAgent)
    const os = parseOS(userAgent)

    // Hash session for privacy
    const sessionHash = hashSession(ip, userAgent)

    // Hash fingerprint if provided
    let fingerprintHash: string | undefined
    if (validatedData.fingerprint) {
      fingerprintHash = hashFingerprint({
        userAgent,
        ...validatedData.fingerprint,
      })
    }

    // Create tracking event
    const event = await prisma.trackingEvent.create({
      data: {
        type: validatedData.type,
        campaignId: validatedData.campaignId,
        trackingLinkId: validatedData.trackingLinkId,
        qrCodeId: validatedData.qrCodeId,
        sessionHash,
        fingerprintHash,
        deviceType,
        browser,
        os,
        referrer: validatedData.referrer,
        landingPage: validatedData.landingPage,
        revenue: validatedData.revenue,
        conversionValue: validatedData.conversionValue,
        metadata: validatedData.metadata,
      },
    })

    // Update counters
    if (validatedData.type === 'CLICK' && validatedData.trackingLinkId) {
      await prisma.trackingLink.update({
        where: { id: validatedData.trackingLinkId },
        data: { clicks: { increment: 1 } },
      })
    }

    if (validatedData.type === 'SCAN' && validatedData.qrCodeId) {
      await prisma.qRCode.update({
        where: { id: validatedData.qrCodeId },
        data: { scans: { increment: 1 } },
      })
    }

    if (validatedData.type === 'CONVERSION') {
      if (validatedData.trackingLinkId) {
        await prisma.trackingLink.update({
          where: { id: validatedData.trackingLinkId },
          data: { conversions: { increment: 1 } },
        })
      }

      if (validatedData.qrCodeId) {
        await prisma.qRCode.update({
          where: { id: validatedData.qrCodeId },
          data: { conversions: { increment: 1 } },
        })
      }
    }

    // Update campaign revenue
    if (validatedData.revenue && validatedData.campaignId) {
      await prisma.campaign.update({
        where: { id: validatedData.campaignId },
        data: { revenue: { increment: validatedData.revenue } },
      })

      if (validatedData.qrCodeId) {
        await prisma.qRCode.update({
          where: { id: validatedData.qrCodeId },
          data: { revenue: { increment: validatedData.revenue } },
        })
      }
    }

    return NextResponse.json({
      success: true,
      eventId: event.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
