'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Link xác thực không hợp lệ')
      return
    }

    // Verify token
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage('Email đã được xác thực thành công!')
          // Redirect to login after 3 seconds
          setTimeout(() => router.push('/login?verified=true'), 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Xác thực thất bại')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Đã xảy ra lỗi khi xác thực email')
      })
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {status === 'loading' && 'Đang xác thực...'}
            {status === 'success' && '✓ Xác thực thành công'}
            {status === 'error' && '✗ Xác thực thất bại'}
          </CardTitle>
          <CardDescription className="text-center">
            {message || 'Vui lòng đợi trong giây lát'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-6xl">✓</div>
              <p className="text-sm text-gray-600">
                Đang chuyển đến trang đăng nhập...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="text-red-600 text-6xl">✗</div>
              <Button asChild>
                <Link href="/login">Quay lại đăng nhập</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
