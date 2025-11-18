import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/utils/email'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { logAuditEvent } from '@/utils/audit-logger'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      // Still return success but don't send email
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi'
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    })

    // Send email
    await sendPasswordResetEmail(email, resetToken, user.name || undefined)

    // Log audit event
    await logAuditEvent({
      action: 'PASSWORD_RESET_REQUESTED',
      userId: user.id,
      metadata: { email },
      success: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Không thể xử lý yêu cầu' },
      { status: 500 }
    )
  }
}
