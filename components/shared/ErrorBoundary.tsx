/**
 * Error Boundary Component
 * Catches and handles React component errors gracefully
 */

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-lg w-full border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-900">Đã xảy ra lỗi</CardTitle>
              <CardDescription className="text-red-700">
                Có lỗi xảy ra khi hiển thị nội dung này
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-mono text-red-900 break-all">{error.message}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onReset} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tải lại trang
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ bộ phận hỗ trợ.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Minimal error fallback for smaller components
 */
export function MinimalErrorFallback({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
      <p className="text-sm text-red-900">{message || 'Có lỗi xảy ra khi tải dữ liệu'}</p>
    </div>
  )
}

/**
 * Hook for error boundary in function components
 * Note: This doesn't actually catch errors, just provides error state management
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error('Error:', error)
    setError(error)
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, resetError }
}
