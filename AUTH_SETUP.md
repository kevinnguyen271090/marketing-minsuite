# Authentication & Security Setup Guide

This guide explains how to set up the complete authentication and security system for MinSuite.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Environment Variables](#environment-variables)
3. [OAuth Setup](#oauth-setup)
4. [Email Configuration](#email-configuration)
5. [Rate Limiting](#rate-limiting)
6. [Database Migration](#database-migration)
7. [Testing](#testing)
8. [Security Checklist](#security-checklist)

---

## Features Overview

MinSuite includes enterprise-grade authentication with:

### ✅ Authentication Methods
- **Email/Password** with bcrypt hashing
- **Google OAuth 2.0**
- **GitHub OAuth**
- **Facebook OAuth** (optional)

### ✅ Email Flows
- **Email Verification** - Required before login
- **Password Reset** - Token-based with 1-hour expiry
- **Team Invitations** - Invite users to teams

### ✅ Multi-Tenancy
- **Teams** - Organizations can have multiple teams
- **Role-Based Access Control (RBAC)**
  - `OWNER` - Full control, can delete team
  - `ADMIN` - Manage team, invite members
  - `MEMBER` - Create and edit resources
  - `VIEWER` - Read-only access

### ✅ Security Features
- **Rate Limiting** - Prevents brute-force attacks
- **CORS/CSRF Protection** - Secure API endpoints
- **Audit Logging** - Track all user actions
- **Protected Routes** - Middleware-based auth
- **Secure Cookies** - HttpOnly, SameSite, Secure flags

### ✅ Compliance
- **GDPR** - Data export and deletion endpoints
- **Vietnam Data Laws** - User consent tracking
- **Audit Trail** - Full activity logs

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/minsuite"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"  # Production: https://yourdomain.com
NEXTAUTH_SECRET="your-secret-key-min-32-characters"

# Generate secret with:
openssl rand -base64 32
```

### OAuth Providers (at least one recommended)

See [OAuth Setup](#oauth-setup) section for detailed instructions.

### Email (required for verification/reset)

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"  # Not your regular password!
SMTP_FROM_NAME="MinSuite"
SMTP_FROM_EMAIL="noreply@minsuite.vn"
```

### Rate Limiting (optional but recommended)

```bash
# Without this, uses in-memory rate limiting (not recommended for production)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

---

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`:

```bash
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
```

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret
5. Add to `.env`:

```bash
GITHUB_CLIENT_ID="Iv1.abc123..."
GITHUB_CLIENT_SECRET="abc123def456..."
```

### Facebook OAuth (Optional)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app → Choose "Consumer"
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook`
5. Add to `.env`:

```bash
FACEBOOK_CLIENT_ID="123456789012345"
FACEBOOK_CLIENT_SECRET="abc123..."
```

---

## Email Configuration

### Gmail Setup (Recommended for Development)

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - 2-Step Verification → App passwords
   - Select "Mail" and generate
3. Use the 16-character password in `.env`:

```bash
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="abcd efgh ijkl mnop"  # Remove spaces
```

### Production Email Services

For production, use dedicated email services:

- **SendGrid** - Reliable, good free tier
- **AWS SES** - Cheap, scalable
- **Mailgun** - Easy setup
- **Postmark** - High deliverability

Update SMTP settings accordingly:

```bash
# SendGrid example
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="SG.abc123..."
```

---

## Rate Limiting

### Development (In-Memory)

No setup needed! Rate limiting works out of the box with in-memory storage.

**Limits:**
- Auth endpoints: 5 req/min
- API endpoints: 60 req/min
- Signup: 3 req/hour
- Password reset: 3 req/hour

### Production (Upstash Redis)

1. Sign up at [Upstash](https://console.upstash.com/)
2. Create a new Redis database
3. Copy REST URL and token to `.env`:

```bash
UPSTASH_REDIS_REST_URL="https://abc-123.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXR..."
```

---

## Database Migration

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Run Migrations

```bash
npx prisma migrate dev --name add-auth-security
```

This creates tables for:
- Users (with email verification fields)
- Accounts (OAuth providers)
- Sessions
- Teams & TeamUsers
- AuditLogs
- VerificationTokens

### 3. Verify Schema

```bash
npx prisma studio
```

Opens database GUI at `http://localhost:5555`

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Files

- `__tests__/auth/permissions.test.ts` - RBAC tests
- `__tests__/utils/audit-logger.test.ts` - Audit logging tests

### Manual Testing Checklist

- [ ] Email/password signup
- [ ] Email verification flow
- [ ] Login with email/password
- [ ] Google OAuth login
- [ ] GitHub OAuth login
- [ ] Password reset flow
- [ ] Protected route access
- [ ] Permission-based UI rendering
- [ ] Rate limiting (try 6+ requests in 1 min)
- [ ] Audit log creation
- [ ] Data export
- [ ] Account deletion

---

## Security Checklist

### Before Production

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Set `NEXTAUTH_URL` to your production domain (HTTPS)
- [ ] Use production email service (not Gmail)
- [ ] Enable Upstash Redis for rate limiting
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS `ALLOWED_ORIGIN` to your domain
- [ ] Review and customize rate limits in `lib/rate-limit.ts`
- [ ] Set up SSL/TLS certificates
- [ ] Enable CSP headers (optional, see `next.config.ts`)
- [ ] Test OAuth callbacks with production URLs
- [ ] Set up monitoring for audit logs
- [ ] Configure backup strategy for database
- [ ] Review team deletion policies

### Ongoing Security

- [ ] Regularly rotate `NEXTAUTH_SECRET`
- [ ] Monitor audit logs for suspicious activity
- [ ] Review and update dependencies (`npm audit`)
- [ ] Test password reset flow monthly
- [ ] Verify email deliverability
- [ ] Check rate limiting effectiveness
- [ ] Review RBAC permissions quarterly

---

## API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth endpoints |
| `/api/auth/send-verification` | POST | Send verification email |
| `/api/auth/verify-email` | GET | Verify email with token |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |

### User Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/export` | GET | Export user data (GDPR) |
| `/api/user/delete` | DELETE | Delete account (GDPR) |

---

## Troubleshooting

### Email not sending

**Issue:** Verification emails not arriving

**Solutions:**
1. Check SMTP credentials in `.env`
2. For Gmail: Verify App Password is correct
3. Check spam folder
4. Verify `SMTP_FROM_EMAIL` is valid
5. Check server logs: `console.log` in `utils/email.ts`

### OAuth redirect error

**Issue:** "Redirect URI mismatch"

**Solutions:**
1. Verify callback URL matches exactly in OAuth provider settings
2. Check `NEXTAUTH_URL` in `.env`
3. For production: Use HTTPS, not HTTP
4. Clear browser cache and try again

### Rate limiting not working

**Issue:** Can make unlimited requests

**Solutions:**
1. Check if `UPSTASH_REDIS_REST_URL` is set (optional)
2. In development, in-memory rate limiting is used
3. Verify middleware is running: check response headers for `X-RateLimit-*`

### Database migration errors

**Issue:** Prisma migrate fails

**Solutions:**
1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Drop and recreate database if needed:
   ```bash
   dropdb minsuite
   createdb minsuite
   npx prisma migrate dev
   ```

---

## Architecture

### Authentication Flow

```
User → Login Page
  ↓
NextAuth Credentials Provider
  ↓
Verify email/password + emailVerified
  ↓
Create JWT session
  ↓
Set secure cookie
  ↓
Redirect to dashboard
```

### OAuth Flow

```
User → Click "Login with Google"
  ↓
Redirect to Google OAuth
  ↓
User authorizes
  ↓
Callback to /api/auth/callback/google
  ↓
Create/link account
  ↓
Auto-verify email
  ↓
Create session
  ↓
Redirect to dashboard/onboarding
```

### Email Verification Flow

```
User signs up
  ↓
Generate verification token (32 bytes)
  ↓
Send email with link
  ↓
User clicks link
  ↓
Verify token + check expiry
  ↓
Set emailVerified = now()
  ↓
Redirect to login
```

---

## Next Steps

After setting up authentication:

1. **Create first user:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/signup
   ```

2. **Create a team:**
   - Use Prisma Studio or API
   - Assign yourself as OWNER

3. **Test permissions:**
   - Create test users with different roles
   - Verify RoleGuard components work

4. **Customize email templates:**
   - Edit `utils/email.ts`
   - Add your branding

5. **Set up monitoring:**
   - Review `/api/audit-logs` endpoint
   - Set up alerts for failed logins

---

## Support

For issues or questions:
- Check [Next.js Docs](https://nextjs.org/docs)
- Check [NextAuth.js Docs](https://next-auth.js.org/)
- Check [Prisma Docs](https://www.prisma.io/docs)
- Review audit logs in database

---

**Last Updated:** 2025-11-18
