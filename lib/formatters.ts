/**
 * Shared formatting utilities
 * Centralizes all formatting logic to ensure consistency across the app
 */

/**
 * Format currency in Vietnamese Dong
 * @param amount - Amount in VND
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "₫50.0M")
 */
export function formatCurrency(amount: number, decimals: number = 1): string {
  if (amount === 0) return '₫0'

  // Format in millions for large amounts
  if (Math.abs(amount) >= 1000000) {
    return `₫${(amount / 1000000).toFixed(decimals)}M`
  }

  // Format in thousands for medium amounts
  if (Math.abs(amount) >= 1000) {
    return `₫${(amount / 1000).toFixed(decimals)}K`
  }

  // Format normally for small amounts
  return `₫${amount.toLocaleString('vi-VN')}`
}

/**
 * Format date in Vietnamese locale
 * @param date - Date string or Date object
 * @param format - 'short' | 'long' | 'relative'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    return formatRelativeDate(dateObj)
  }

  if (format === 'long') {
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // short format (default)
  return dateObj.toLocaleDateString('vi-VN')
}

/**
 * Format relative date (e.g., "2 ngày trước", "1 giờ trước")
 */
function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 7) {
    return formatDate(date, 'short')
  }
  if (diffDays > 0) {
    return `${diffDays} ngày trước`
  }
  if (diffHours > 0) {
    return `${diffHours} giờ trước`
  }
  if (diffMins > 0) {
    return `${diffMins} phút trước`
  }
  return 'Vừa xong'
}

/**
 * Format percentage
 * @param value - Percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "165.6%")
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format number with locale
 * @param value - Number to format
 * @returns Formatted string with thousands separator
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN')
}

/**
 * Format ROI with color coding
 * @param roi - ROI percentage
 * @returns Object with formatted value and color class
 */
export function formatROI(roi: number): { value: string; colorClass: string } {
  return {
    value: formatPercent(roi, 1),
    colorClass: roi > 100 ? 'text-green-600' : roi > 0 ? 'text-yellow-600' : 'text-red-600',
  }
}

/**
 * Format budget usage percentage
 * @param spent - Amount spent
 * @param budget - Total budget
 * @returns Object with percentage and color class
 */
export function formatBudgetUsage(spent: number, budget: number): {
  percentage: number
  percentageStr: string
  colorClass: string
} {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0

  let colorClass = 'bg-green-500'
  if (percentage >= 90) {
    colorClass = 'bg-red-500'
  } else if (percentage >= 70) {
    colorClass = 'bg-yellow-500'
  }

  return {
    percentage,
    percentageStr: `${percentage.toFixed(0)}%`,
    colorClass,
  }
}

/**
 * Format conversion rate
 * @param conversions - Number of conversions
 * @param total - Total events (clicks, scans, etc)
 * @returns Formatted conversion rate string
 */
export function formatConversionRate(conversions: number, total: number): string {
  if (total === 0) return '0%'
  const rate = (conversions / total) * 100
  return formatPercent(rate, 2)
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Format file size
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
