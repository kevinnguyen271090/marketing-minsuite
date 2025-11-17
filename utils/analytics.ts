/**
 * Calculate ROI (Return on Investment)
 * ROI = ((Revenue - Cost) / Cost) * 100
 */
export function calculateROI(revenue: number, spent: number): number {
  if (spent === 0) return 0
  return ((revenue - spent) / spent) * 100
}

/**
 * Calculate CAC (Customer Acquisition Cost)
 * CAC = Total Marketing Spend / Number of New Customers
 */
export function calculateCAC(spent: number, conversions: number): number {
  if (conversions === 0) return 0
  return spent / conversions
}

/**
 * Calculate conversion rate
 * Conversion Rate = (Conversions / Total Clicks) * 100
 */
export function calculateConversionRate(conversions: number, totalClicks: number): number {
  if (totalClicks === 0) return 0
  return (conversions / totalClicks) * 100
}

/**
 * Calculate average order value
 */
export function calculateAOV(revenue: number, orders: number): number {
  if (orders === 0) return 0
  return revenue / orders
}

/**
 * Calculate ROAS (Return on Ad Spend)
 * ROAS = Revenue / Ad Spend
 */
export function calculateROAS(revenue: number, spent: number): number {
  if (spent === 0) return 0
  return revenue / spent
}

/**
 * Calculate LTV (Customer Lifetime Value) - simplified version
 * LTV = Average Order Value * Purchase Frequency * Customer Lifespan
 */
export function calculateLTV(
  averageOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): number {
  return averageOrderValue * purchaseFrequency * customerLifespan
}

/**
 * Calculate budget usage percentage
 */
export function calculateBudgetUsage(spent: number, budget: number): number {
  if (budget === 0) return 0
  return (spent / budget) * 100
}

/**
 * Check if campaign needs alert
 */
export function checkCampaignAlerts(campaign: {
  revenue: number
  spent: number
  budget: number | null
}): {
  roiNegative: boolean
  budgetExceeded: boolean
  budgetWarning: boolean
} {
  const roi = calculateROI(campaign.revenue, campaign.spent)
  const budgetUsage = campaign.budget ? calculateBudgetUsage(campaign.spent, campaign.budget) : 0

  return {
    roiNegative: roi < 0,
    budgetExceeded: budgetUsage > 100,
    budgetWarning: budgetUsage > 80 && budgetUsage <= 100,
  }
}

/**
 * Format currency (VND)
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}
