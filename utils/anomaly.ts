/**
 * Anomaly Detection Utilities
 * Sử dụng statistical methods để phát hiện bất thường
 */

export interface TimeSeriesDataPoint {
  timestamp: Date
  value: number
}

export interface AnomalyDetectionResult {
  isAnomaly: boolean
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  deviationPercent: number
  expectedValue: number
  actualValue: number
  zscore?: number
}

/**
 * Calculate mean (trung bình)
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

/**
 * Calculate standard deviation (độ lệch chuẩn)
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2))
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
  return Math.sqrt(variance)
}

/**
 * Calculate Z-score
 * Z-score = (value - mean) / stdDev
 */
function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0
  return (value - mean) / stdDev
}

/**
 * Detect anomaly using Z-score method
 * Threshold: |z| > 2 = anomaly
 */
export function detectAnomalyZScore(
  historicalData: number[],
  currentValue: number,
  options?: {
    threshold?: number // Default: 2
  }
): AnomalyDetectionResult {
  const threshold = options?.threshold || 2

  const mean = calculateMean(historicalData)
  const stdDev = calculateStdDev(historicalData, mean)
  const zscore = calculateZScore(currentValue, mean, stdDev)

  const isAnomaly = Math.abs(zscore) > threshold
  const deviationPercent = mean !== 0 ? ((currentValue - mean) / mean) * 100 : 0

  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
  if (Math.abs(zscore) > 4) severity = 'CRITICAL'
  else if (Math.abs(zscore) > 3) severity = 'HIGH'
  else if (Math.abs(zscore) > 2) severity = 'MEDIUM'

  return {
    isAnomaly,
    severity,
    deviationPercent,
    expectedValue: mean,
    actualValue: currentValue,
    zscore,
  }
}

/**
 * Detect anomaly using percentage change method
 * Good for sudden spikes/drops
 */
export function detectAnomalyPercentageChange(
  previousValue: number,
  currentValue: number,
  options?: {
    dropThreshold?: number // Default: -20%
    spikeThreshold?: number // Default: +50%
  }
): AnomalyDetectionResult {
  const dropThreshold = options?.dropThreshold || -20
  const spikeThreshold = options?.spikeThreshold || 50

  const percentChange =
    previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

  const isAnomaly = percentChange < dropThreshold || percentChange > spikeThreshold

  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
  if (Math.abs(percentChange) > 80) severity = 'CRITICAL'
  else if (Math.abs(percentChange) > 50) severity = 'HIGH'
  else if (Math.abs(percentChange) > 30) severity = 'MEDIUM'

  return {
    isAnomaly,
    severity,
    deviationPercent: percentChange,
    expectedValue: previousValue,
    actualValue: currentValue,
  }
}

/**
 * Detect anomaly using moving average
 */
export function detectAnomalyMovingAverage(
  historicalData: number[],
  currentValue: number,
  options?: {
    windowSize?: number // Default: 7 days
    threshold?: number // Default: 30%
  }
): AnomalyDetectionResult {
  const windowSize = options?.windowSize || 7
  const threshold = options?.threshold || 30

  // Calculate moving average for last N points
  const recentData = historicalData.slice(-windowSize)
  const movingAverage = calculateMean(recentData)

  const deviationPercent =
    movingAverage !== 0 ? ((currentValue - movingAverage) / movingAverage) * 100 : 0

  const isAnomaly = Math.abs(deviationPercent) > threshold

  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
  if (Math.abs(deviationPercent) > 80) severity = 'CRITICAL'
  else if (Math.abs(deviationPercent) > 50) severity = 'HIGH'
  else if (Math.abs(deviationPercent) > 30) severity = 'MEDIUM'

  return {
    isAnomaly,
    severity,
    deviationPercent,
    expectedValue: movingAverage,
    actualValue: currentValue,
  }
}

/**
 * Comprehensive anomaly detection
 * Combines multiple methods for better accuracy
 */
export function detectAnomaly(
  historicalData: TimeSeriesDataPoint[],
  currentValue: number,
  metric: string = 'value'
): AnomalyDetectionResult {
  if (historicalData.length < 2) {
    return {
      isAnomaly: false,
      severity: 'LOW',
      deviationPercent: 0,
      expectedValue: currentValue,
      actualValue: currentValue,
    }
  }

  const values = historicalData.map((d) => d.value)

  // Method 1: Z-score
  const zscoreResult = detectAnomalyZScore(values, currentValue)

  // Method 2: Moving average (last 7 data points)
  const maResult = detectAnomalyMovingAverage(values, currentValue)

  // Method 3: Percentage change from previous
  const previousValue = values[values.length - 1]
  const percentResult = detectAnomalyPercentageChange(previousValue, currentValue)

  // Combine results - if 2 or more methods detect anomaly, it's an anomaly
  const detectionCount = [zscoreResult, maResult, percentResult].filter(
    (r) => r.isAnomaly
  ).length

  const isAnomaly = detectionCount >= 2

  // Use highest severity
  const severities = [zscoreResult.severity, maResult.severity, percentResult.severity]
  const severity = severities.includes('CRITICAL')
    ? 'CRITICAL'
    : severities.includes('HIGH')
    ? 'HIGH'
    : severities.includes('MEDIUM')
    ? 'MEDIUM'
    : 'LOW'

  return {
    isAnomaly,
    severity,
    deviationPercent: zscoreResult.deviationPercent,
    expectedValue: zscoreResult.expectedValue,
    actualValue: currentValue,
    zscore: zscoreResult.zscore,
  }
}

/**
 * Check for anomalies in campaign metrics
 */
export interface CampaignMetrics {
  revenue: number
  spent: number
  conversions: number
  clicks: number
  roi: number
}

export interface CampaignAnomalies {
  revenue?: AnomalyDetectionResult
  spent?: AnomalyDetectionResult
  conversions?: AnomalyDetectionResult
  clicks?: AnomalyDetectionResult
  roi?: AnomalyDetectionResult
}

export function detectCampaignAnomalies(
  historicalMetrics: Array<{ timestamp: Date; metrics: CampaignMetrics }>,
  currentMetrics: CampaignMetrics
): CampaignAnomalies {
  const anomalies: CampaignAnomalies = {}

  // Check each metric
  const metricsToCheck: Array<keyof CampaignMetrics> = [
    'revenue',
    'spent',
    'conversions',
    'clicks',
    'roi',
  ]

  for (const metricName of metricsToCheck) {
    const historicalData = historicalMetrics.map((h) => ({
      timestamp: h.timestamp,
      value: h.metrics[metricName],
    }))

    const result = detectAnomaly(historicalData, currentMetrics[metricName], metricName)

    if (result.isAnomaly) {
      anomalies[metricName] = result
    }
  }

  return anomalies
}

/**
 * Generate human-readable anomaly description
 */
export function describeAnomaly(
  metric: string,
  result: AnomalyDetectionResult
): {
  title: string
  description: string
} {
  const direction = result.actualValue > result.expectedValue ? 'tăng' : 'giảm'
  const absPercent = Math.abs(result.deviationPercent).toFixed(1)

  const metricNames: Record<string, string> = {
    revenue: 'Doanh thu',
    spent: 'Chi phí',
    conversions: 'Chuyển đổi',
    clicks: 'Lượt click',
    roi: 'ROI',
  }

  const metricName = metricNames[metric] || metric

  return {
    title: `${metricName} ${direction} bất thường ${absPercent}%`,
    description: `${metricName} ${direction} từ ${result.expectedValue.toLocaleString()} lên ${result.actualValue.toLocaleString()} (${direction} ${absPercent}%). Đây là mức ${result.severity.toLowerCase()} so với xu hướng trước đó.`,
  }
}
