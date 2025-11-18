import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logAuditEvent } from '@/utils/audit-logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ' },
        { status: 400 }
      )
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Check if token expired
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.json(
        { error: 'Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email đã được xác thực trước đó' },
        { status: 200 }
      )
    }

    // Verify email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null
      }
    })

    // Log audit event
    await logAuditEvent({
      action: 'EMAIL_VERIFIED',
      userId: user.id,
      metadata: { email: user.email },
      success: true,
    })

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/login?verified=true', req.url)
    )
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Không thể xác thực email' },
      { status: 500 }
    )
  }
}
