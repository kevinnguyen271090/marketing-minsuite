import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { logAuditEvent } from '@/utils/audit-logger'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token là bắt buộc'),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { resetToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Check if token expired
    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) {
      return NextResponse.json(
        { error: 'Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu lại.' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    })

    // Log audit event
    await logAuditEvent({
      action: 'PASSWORD_RESET_COMPLETED',
      userId: user.id,
      metadata: { email: user.email },
      success: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Không thể đặt lại mật khẩu' },
      { status: 500 }
    )
  }
}
