import { generateContent } from '@/lib/claude'

/**
 * Simulate scenario với AI predictions
 */
export async function simulateScenario(params: {
  currentMetrics: {
    revenue: number
    spent: number
    conversions: number
    roi: number
  }
  changes: Record<string, number> // e.g., { "tiktok_budget": +20, "facebook_budget": -10 }
  historicalData?: any[]
}): Promise<{
  predictions: {
    estimatedRevenue: number
    estimatedSpent: number
    estimatedROI: number
    estimatedConversions: number
  }
  confidence: number
  reasoning: string
}> {
  const prompt = `Bạn là chuyên gia phân tích marketing. Dựa trên dữ liệu hiện tại và thay đổi dự kiến, hãy dự đoán kết quả.

**DỮ LIỆU HIỆN TẠI:**
- Doanh thu: ${params.currentMetrics.revenue.toLocaleString()} VND
- Chi phí: ${params.currentMetrics.spent.toLocaleString()} VND
- ROI: ${params.currentMetrics.roi.toFixed(2)}%
- Chuyển đổi: ${params.currentMetrics.conversions}

**THAY ĐỔI DỰ KIẾN:**
${Object.entries(params.changes)
  .map(([key, value]) => `- ${key}: ${value > 0 ? '+' : ''}${value}%`)
  .join('\n')}

${
  params.historicalData && params.historicalData.length > 0
    ? `**DỮ LIỆU LỊCH SỬ:**\n${JSON.stringify(params.historicalData, null, 2)}`
    : ''
}

Hãy trả về dự đoán theo format JSON sau (chỉ JSON, không giải thích thêm):
{
  "estimatedRevenue": <số>,
  "estimatedSpent": <số>,
  "estimatedROI": <số>,
  "estimatedConversions": <số>,
  "confidence": <0-100>,
  "reasoning": "<giải thích ngắn gọn về dự đoán>"
}`

  const result = await generateContent({
    prompt,
    systemPrompt:
      'Bạn là chuyên gia phân tích marketing với kinh nghiệm về thị trường Việt Nam. Trả về JSON hợp lệ.',
    temperature: 0.3, // Lower temperature for more consistent predictions
  })

  try {
    // Extract JSON from response
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      predictions: {
        estimatedRevenue: parsed.estimatedRevenue,
        estimatedSpent: parsed.estimatedSpent,
        estimatedROI: parsed.estimatedROI,
        estimatedConversions: parsed.estimatedConversions,
      },
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
    throw new Error('Failed to parse AI predictions')
  }
}

/**
 * Forecast resource needs với AI
 */
export async function forecastResources(params: {
  campaignType: string
  budget: number
  timeline: {
    startDate: Date
    endDate: Date
  }
  channels: string[]
  complexity: 'simple' | 'medium' | 'complex'
}): Promise<{
  estimatedHours: number
  requiredHeadcount: number
  estimatedCost: number
  roles: Record<string, number> // hours per role
  shouldHireAgency: boolean
  shouldHireFreelancer: boolean
  recommendations: string[]
  confidence: number
}> {
  const durationDays = Math.ceil(
    (params.timeline.endDate.getTime() - params.timeline.startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const prompt = `Bạn là chuyên gia quản lý dự án marketing. Dự báo nhu cầu nhân sự cho chiến dịch sau:

**THÔNG TIN CHIẾN DỊCH:**
- Loại: ${params.campaignType}
- Ngân sách: ${params.budget.toLocaleString()} VND
- Thời gian: ${durationDays} ngày
- Kênh: ${params.channels.join(', ')}
- Độ phức tạp: ${params.complexity}

Trả về dự báo theo format JSON (chỉ JSON):
{
  "estimatedHours": <tổng số giờ>,
  "requiredHeadcount": <số người cần>,
  "estimatedCost": <chi phí nhân sự VND>,
  "roles": {
    "designer": <số giờ>,
    "copywriter": <số giờ>,
    "video_editor": <số giờ>,
    "social_media_manager": <số giờ>,
    "project_manager": <số giờ>
  },
  "shouldHireAgency": <true/false>,
  "shouldHireFreelancer": <true/false>,
  "recommendations": ["<đề xuất 1>", "<đề xuất 2>"],
  "confidence": <0-100>
}`

  const result = await generateContent({
    prompt,
    systemPrompt: 'Bạn là chuyên gia quản lý dự án marketing. Trả về JSON hợp lệ.',
    temperature: 0.3,
  })

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')

    const parsed = JSON.parse(jsonMatch[0])

    return {
      estimatedHours: parsed.estimatedHours,
      requiredHeadcount: parsed.requiredHeadcount,
      estimatedCost: parsed.estimatedCost,
      roles: parsed.roles,
      shouldHireAgency: parsed.shouldHireAgency,
      shouldHireFreelancer: parsed.shouldHireFreelancer,
      recommendations: parsed.recommendations,
      confidence: parsed.confidence,
    }
  } catch (error) {
    console.error('Error parsing resource forecast:', error)
    throw new Error('Failed to parse resource forecast')
  }
}

/**
 * Optimize goal allocation across channels
 */
export async function optimizeChannelAllocation(params: {
  totalBudget: number
  goal: 'revenue' | 'conversions' | 'awareness'
  channels: Array<{
    name: string
    currentBudget: number
    currentROI: number
    currentConversions: number
  }>
}): Promise<{
  optimizedAllocations: Array<{
    channel: string
    recommendedBudget: number
    recommendedPercentage: number
    expectedROI: number
    reasoning: string
  }>
  totalExpectedROI: number
  confidence: number
}> {
  const prompt = `Bạn là chuyên gia tối ưu ngân sách marketing. Phân bổ ngân sách tối ưu cho các kênh.

**MỤC TIÊU:** ${params.goal === 'revenue' ? 'Tối đa hóa doanh thu' : params.goal === 'conversions' ? 'Tối đa hóa chuyển đổi' : 'Tăng nhận diện thương hiệu'}
**TỔNG NGÂN SÁCH:** ${params.totalBudget.toLocaleString()} VND

**HIỆU SUẤT HIỆN TẠI:**
${params.channels
  .map(
    (ch) =>
      `- ${ch.name}: ${ch.currentBudget.toLocaleString()} VND, ROI: ${ch.currentROI.toFixed(2)}%, Conversions: ${ch.currentConversions}`
  )
  .join('\n')}

Trả về phân bổ tối ưu theo JSON:
{
  "optimizedAllocations": [
    {
      "channel": "<tên kênh>",
      "recommendedBudget": <số VND>,
      "recommendedPercentage": <% của tổng budget>,
      "expectedROI": <%>,
      "reasoning": "<lý do>"
    }
  ],
  "totalExpectedROI": <%>,
  "confidence": <0-100>
}`

  const result = await generateContent({
    prompt,
    systemPrompt:
      'Bạn là chuyên gia tối ưu ngân sách marketing cho thị trường Việt Nam. Trả về JSON hợp lệ.',
    temperature: 0.3,
  })

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error parsing optimization:', error)
    throw new Error('Failed to parse optimization')
  }
}
