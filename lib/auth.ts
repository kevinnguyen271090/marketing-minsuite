import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { logAuditEvent } from '@/utils/audit-logger'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // OAuth Providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true, // Link accounts with same email
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    // Credentials Provider (email/password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và password là bắt buộc')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: true,
            teamUsers: {
              include: {
                team: true
              }
            }
          }
        })

        if (!user || !user.password) {
          // Log failed login attempt
          await logAuditEvent({
            action: 'LOGIN_FAILED',
            metadata: {
              email: credentials.email,
              reason: 'Invalid credentials'
            },
            success: false,
          })
          throw new Error('Email hoặc password không đúng')
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Vui lòng xác thực email trước khi đăng nhập')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          await logAuditEvent({
            action: 'LOGIN_FAILED',
            userId: user.id,
            metadata: { reason: 'Invalid password' },
            success: false,
          })
          throw new Error('Email hoặc password không đúng')
        }

        // Log successful login
        await logAuditEvent({
          action: 'LOGIN',
          userId: user.id,
          metadata: { method: 'credentials' },
          success: true,
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          organizationId: user.organizationId,
          emailVerified: user.emailVerified,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/verify-email',
    newUser: '/onboarding', // Redirect new OAuth users to onboarding
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth sign-in
      if (account?.provider !== 'credentials') {
        // Check if email is verified for OAuth providers
        const email = user.email
        if (!email) return false

        const existingUser = await prisma.user.findUnique({
          where: { email }
        })

        // Auto-verify OAuth users
        if (existingUser && !existingUser.emailVerified) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() }
          })
        }

        // Log OAuth login
        await logAuditEvent({
          action: 'LOGIN',
          userId: existingUser?.id,
          metadata: {
            method: account.provider,
            email
          },
          success: true,
        })
      }

      return true
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.organizationId = (user as any).organizationId
        token.emailVerified = (user as any).emailVerified
      }

      // Fetch fresh user data on session update
      if (trigger === 'update' && token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: {
            teamUsers: {
              include: { team: true }
            }
          }
        })

        if (freshUser) {
          token.role = freshUser.role
          token.organizationId = freshUser.organizationId
          token.emailVerified = freshUser.emailVerified
          token.teamUsers = freshUser.teamUsers.map(tu => ({
            teamId: tu.teamId,
            role: tu.role
          }))
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).role = token.role
        (session.user as any).organizationId = token.organizationId
        (session.user as any).emailVerified = token.emailVerified
        (session.user as any).teamUsers = token.teamUsers || []
      }
      return session
    }
  },
  events: {
    async signOut({ token }) {
      // Log logout
      if (token?.id) {
        await logAuditEvent({
          action: 'LOGOUT',
          userId: token.id as string,
          success: true,
        })
      }
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
