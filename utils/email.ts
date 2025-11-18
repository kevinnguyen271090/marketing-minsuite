import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send an email
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'MinSuite'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string
) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác thực email - MinSuite</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MinSuite Marketing Platform</h1>
    </div>
    <div class="content">
      <h2>Xin chào ${name || 'bạn'}!</h2>
      <p>Cảm ơn bạn đã đăng ký MinSuite. Vui lòng xác thực địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:</p>

      <div style="text-align: center;">
        <a href="${verifyUrl}" class="button">Xác thực Email</a>
      </div>

      <p>Hoặc sao chép link sau vào trình duyệt:</p>
      <p style="background: #e5e7eb; padding: 10px; border-radius: 4px; word-break: break-all;">
        ${verifyUrl}
      </p>

      <p style="color: #ef4444; margin-top: 20px;">
        <strong>Lưu ý:</strong> Link này sẽ hết hạn sau 24 giờ.
      </p>

      <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 MinSuite. Tất cả quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: 'Xác thực email - MinSuite Marketing Platform',
    html,
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu - MinSuite</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MinSuite Marketing Platform</h1>
    </div>
    <div class="content">
      <h2>Xin chào ${name || 'bạn'}!</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản MinSuite của mình. Nhấn vào nút bên dưới để tiếp tục:</p>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
      </div>

      <p>Hoặc sao chép link sau vào trình duyệt:</p>
      <p style="background: #e5e7eb; padding: 10px; border-radius: 4px; word-break: break-all;">
        ${resetUrl}
      </p>

      <p style="color: #ef4444; margin-top: 20px;">
        <strong>Lưu ý:</strong> Link này sẽ hết hạn sau 1 giờ.
      </p>

      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 MinSuite. Tất cả quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: 'Đặt lại mật khẩu - MinSuite Marketing Platform',
    html,
  })
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitationEmail(
  email: string,
  teamName: string,
  inviterName: string,
  inviteUrl: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lời mời vào team - MinSuite</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MinSuite Marketing Platform</h1>
    </div>
    <div class="content">
      <h2>Bạn được mời vào team!</h2>
      <p><strong>${inviterName}</strong> đã mời bạn tham gia team <strong>${teamName}</strong> trên MinSuite.</p>

      <div style="text-align: center;">
        <a href="${inviteUrl}" class="button">Chấp nhận lời mời</a>
      </div>

      <p>MinSuite là nền tảng marketing operations giúp bạn quản lý chiến dịch, sáng tạo nội dung, và tối ưu ROI.</p>

      <p>Nếu bạn không mong đợi lời mời này, vui lòng bỏ qua email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 MinSuite. Tất cả quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: `Lời mời vào team ${teamName} - MinSuite`,
    html,
  })
}
