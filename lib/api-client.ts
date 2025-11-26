/**
 * API Client
 * Centralized HTTP client with error handling, retries, and type safety
 */

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
  retries?: number
  timeout?: number
}

interface APIResponse<T> {
  data: T | null
  error: APIError | null
  status: number
}

interface APIError {
  message: string
  code?: string
  status: number
  details?: any
}

class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Main request method
   */
  private async request<T>(
    method: HTTPMethod,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const { params, retries = 0, timeout = 30000, ...fetchOptions } = config

    // Build URL with query params
    const url = this.buildURL(endpoint, params)

    // Build request options
    const options: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    }

    // Execute request with retry logic
    let lastError: APIError | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options, timeout)
        const result = await this.handleResponse<T>(response)
        return result
      } catch (error) {
        lastError = this.normalizeError(error, 0)

        // Don't retry on client errors (4xx)
        if (lastError.status >= 400 && lastError.status < 500) {
          break
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000)
        }
      }
    }

    return {
      data: null,
      error: lastError,
      status: lastError?.status || 0,
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('GET', endpoint, config)
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('POST', endpoint, {
      ...config,
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('PUT', endpoint, {
      ...config,
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('PATCH', endpoint, {
      ...config,
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', endpoint, config)
  }

  // ============================================================================
  // Private helper methods
  // ============================================================================

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL || window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Handle response
   */
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    const status = response.status

    // Try to parse JSON response
    let data: any
    try {
      const text = await response.text()
      data = text ? JSON.parse(text) : null
    } catch {
      data = null
    }

    // Handle success
    if (response.ok) {
      return {
        data: data as T,
        error: null,
        status,
      }
    }

    // Handle error
    const error: APIError = {
      message: data?.message || data?.error || response.statusText || 'Request failed',
      code: data?.code,
      status,
      details: data,
    }

    return {
      data: null,
      error,
      status,
    }
  }

  /**
   * Normalize error to APIError format
   */
  private normalizeError(error: any, status: number = 0): APIError {
    if (error.name === 'AbortError') {
      return {
        message: 'Request timeout',
        code: 'TIMEOUT',
        status: 408,
      }
    }

    return {
      message: error.message || 'Network error',
      code: error.code || 'NETWORK_ERROR',
      status: status || 0,
      details: error,
    }
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL)

// Export types
export type { APIResponse, APIError, RequestConfig }
