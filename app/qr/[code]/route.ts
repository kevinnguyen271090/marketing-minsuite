import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Find QR code
    const qrCode = await prisma.qRCode.findUnique({
      where: { code },
      include: { campaign: true },
    })

    if (!qrCode || !qrCode.isActive) {
      return NextResponse.json(
        { error: 'QR code không tồn tại hoặc đã hết hạn' },
        { status: 404 }
      )
    }

    // Check expiration
    if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
      return NextResponse.json(
        { error: 'QR code đã hết hạn' },
        { status: 410 }
      )
    }

    // Track scan event (fire and forget)
    fetch(`${req.nextUrl.origin}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'SCAN',
        campaignId: qrCode.campaignId,
        qrCodeId: qrCode.id,
        referrer: req.headers.get('referer'),
        landingPage: qrCode.targetUrl,
        metadata: {
          qrCodeName: qrCode.name,
          qrCodeLocation: qrCode.location,
        },
      }),
    }).catch(console.error)

    // If there's a target URL, redirect
    if (qrCode.targetUrl) {
      const targetUrl = new URL(qrCode.targetUrl)

      // Add discount code if present
      if (qrCode.discountCode) {
        targetUrl.searchParams.set('discount', qrCode.discountCode)
      }

      return NextResponse.redirect(targetUrl.toString())
    }

    // Otherwise, return QR code info (for check-in, survey types)
    return NextResponse.json({
      success: true,
      qrCode: {
        code: qrCode.code,
        name: qrCode.name,
        type: qrCode.type,
        discountCode: qrCode.discountCode,
        discountValue: qrCode.discountValue,
        discountType: qrCode.discountType,
        location: qrCode.location,
      },
    })
  } catch (error) {
    console.error('Error in QR redirect:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
