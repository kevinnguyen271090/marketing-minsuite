import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis client
// If UPSTASH_REDIS_REST_URL is not set, use in-memory store for development
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : undefined

// Different rate limiters for different endpoints
export const rateLimiters = {
  // Auth endpoints: 5 requests per minute
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
        prefix: '@ratelimit/auth',
      })
    : null,

  // API endpoints: 60 requests per minute
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '1 m'),
        analytics: true,
        prefix: '@ratelimit/api',
      })
    : null,

  // Signup: 3 requests per hour (prevent abuse)
  signup: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: '@ratelimit/signup',
      })
    : null,

  // Password reset: 3 requests per hour
  passwordReset: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: '@ratelimit/password-reset',
      })
    : null,

  // Email verification: 5 requests per hour
  emailVerification: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        analytics: true,
        prefix: '@ratelimit/email-verification',
      })
    : null,
}

/**
 * Get client identifier (IP address or user ID)
 */
export function getClientIdentifier(req: Request): string {
  // Try to get IP from headers (for proxies/load balancers)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  // Fallback to a default identifier
  return 'anonymous'
}

/**
 * Check rate limit and return appropriate response
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  // If no limiter configured (development), allow all requests
  if (!limiter) {
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 60000,
    }
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier)

  return {
    success,
    limit,
    remaining,
    reset,
  }
}

/**
 * Rate limit middleware helper
 */
export async function withRateLimit(
  req: Request,
  limiterType: keyof typeof rateLimiters,
  handler: () => Promise<Response>
): Promise<Response> {
  const limiter = rateLimiters[limiterType]
  const identifier = getClientIdentifier(req)

  const { success, limit, remaining, reset } = await checkRateLimit(
    limiter,
    identifier
  )

  // Add rate limit headers to response
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', limit.toString())
  headers.set('X-RateLimit-Remaining', remaining.toString())
  headers.set('X-RateLimit-Reset', reset.toString())

  if (!success) {
    return new Response(
      JSON.stringify({
        error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.entries()),
        },
      }
    )
  }

  // Execute handler
  const response = await handler()

  // Add rate limit headers to successful response
  const newHeaders = new Headers(response.headers)
  headers.forEach((value, key) => {
    newHeaders.set(key, value)
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}
