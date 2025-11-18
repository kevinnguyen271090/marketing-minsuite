import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/utils/email'
import { randomBytes } from 'crypto'
import { z } from 'zod'

const sendVerificationSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = sendVerificationSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng với email này' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email đã được xác thực' },
        { status: 400 }
      )
    }

    // Generate verification token (32 bytes = 64 hex chars)
    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires
      }
    })

    // Send email
    await sendVerificationEmail(email, verificationToken, user.name || undefined)

    return NextResponse.json({
      success: true,
      message: 'Email xác thực đã được gửi'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: 'Không thể gửi email xác thực' },
      { status: 500 }
    )
  }
}
