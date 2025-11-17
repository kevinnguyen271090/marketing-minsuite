import { generateContent } from '@/lib/claude'

/**
 * Natural Language Query Processor
 * Xử lý câu hỏi bằng tiếng Việt tự nhiên
 */

export interface NLQResult {
  intent: string
  queryType:
    | 'METRIC_QUERY'
    | 'COMPARISON'
    | 'ANOMALY_CHECK'
    | 'RECOMMENDATION'
    | 'REPORT_GENERATION'
    | 'GENERAL'
  entities: {
    campaigns?: string[]
    metrics?: string[]
    dateRange?: {
      start: string
      end: string
    }
    channels?: string[]
  }
  sql?: string
  response: string
  confidence: number
}

/**
 * Parse natural language query
 */
export async function parseNaturalLanguageQuery(
  query: string,
  context?: {
    availableCampaigns?: Array<{ id: string; name: string }>
    availableMetrics?: string[]
  }
): Promise<NLQResult> {
  const contextInfo = context
    ? `
**CONTEXT:**
- Chiến dịch: ${context.availableCampaigns?.map((c) => `${c.name} (ID: ${c.id})`).join(', ')}
- Metrics: ${context.availableMetrics?.join(', ')}
`
    : ''

  const prompt = `Bạn là AI assistant chuyên phân tích câu hỏi marketing.

**CÂU HỎI:** "${query}"

${contextInfo}

Hãy phân tích câu hỏi và trả về JSON theo format:
{
  "intent": "<mục đích của câu hỏi>",
  "queryType": "<METRIC_QUERY|COMPARISON|ANOMALY_CHECK|RECOMMENDATION|REPORT_GENERATION|GENERAL>",
  "entities": {
    "campaigns": ["<tên/ID chiến dịch nếu có>"],
    "metrics": ["<metric như revenue, roi, clicks>"],
    "dateRange": {
      "start": "<YYYY-MM-DD hoặc 'last_7_days', 'this_month'>",
      "end": "<YYYY-MM-DD hoặc 'today'>"
    },
    "channels": ["<kênh marketing nếu có>"]
  },
  "sql": "<SQL query nếu cần truy vấn database, null nếu không>",
  "response": "<câu trả lời ngắn gọn hoặc hướng dẫn>",
  "confidence": <0-100>
}

Chỉ trả về JSON hợp lệ, không giải thích thêm.`

  const result = await generateContent({
    prompt,
    systemPrompt:
      'Bạn là AI assistant chuyên phân tích marketing queries. Hiểu tiếng Việt tự nhiên. Trả về JSON hợp lệ.',
    temperature: 0.3,
  })

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')

    const parsed = JSON.parse(jsonMatch[0])

    return {
      intent: parsed.intent,
      queryType: parsed.queryType,
      entities: parsed.entities,
      sql: parsed.sql,
      response: parsed.response,
      confidence: parsed.confidence,
    }
  } catch (error) {
    console.error('Error parsing NLQ:', error)
    return {
      intent: 'unknown',
      queryType: 'GENERAL',
      entities: {},
      response: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể diễn đạt lại không?',
      confidence: 0,
    }
  }
}

/**
 * Generate insight summary from data
 */
export async function generateInsightSummary(params: {
  campaignName: string
  metrics: {
    revenue: number
    spent: number
    roi: number
    conversions: number
    clicks: number
  }
  period: string
  comparisonData?: {
    previousRevenue: number
    previousROI: number
  }
}): Promise<{
  title: string
  summary: string
  recommendations: string[]
  actionItems: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    action: string
  }>
}> {
  const { campaignName, metrics, period, comparisonData } = params

  const prompt = `Bạn là chuyên gia phân tích marketing. Viết báo cáo insight cho chiến dịch.

**CHIẾN DỊCH:** ${campaignName}
**THỜI GIAN:** ${period}

**METRICS:**
- Doanh thu: ${metrics.revenue.toLocaleString()} VND
- Chi phí: ${metrics.spent.toLocaleString()} VND
- ROI: ${metrics.roi.toFixed(2)}%
- Chuyển đổi: ${metrics.conversions}
- Clicks: ${metrics.clicks}

${
  comparisonData
    ? `**SO SÁNH:**
- Doanh thu trước: ${comparisonData.previousRevenue.toLocaleString()} VND
- ROI trước: ${comparisonData.previousROI.toFixed(2)}%`
    : ''
}

Viết insight report theo JSON:
{
  "title": "<tiêu đề ngắn gọn>",
  "summary": "<tóm tắt 2-3 câu về hiệu suất, highlight điểm nổi bật>",
  "recommendations": [
    "<đề xuất 1>",
    "<đề xuất 2>",
    "<đề xuất 3>"
  ],
  "actionItems": [
    {
      "priority": "HIGH|MEDIUM|LOW",
      "action": "<hành động cụ thể>"
    }
  ]
}

Chỉ trả về JSON.`

  const result = await generateContent({
    prompt,
    systemPrompt:
      'Bạn là chuyên gia marketing analytics cho thị trường Việt Nam. Viết insights thực tế, actionable. Trả về JSON hợp lệ.',
    temperature: 0.7,
  })

  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error generating insight:', error)
    throw new Error('Failed to generate insight summary')
  }
}

/**
 * Answer natural language question with data
 */
export async function answerQueryWithData(params: {
  question: string
  data: any
  context?: string
}): Promise<string> {
  const prompt = `Bạn là AI assistant marketing. Trả lời câu hỏi dựa trên dữ liệu.

**CÂU HỎI:** ${params.question}

${params.context ? `**CONTEXT:** ${params.context}` : ''}

**DỮ LIỆU:**
\`\`\`json
${JSON.stringify(params.data, null, 2)}
\`\`\`

Trả lời câu hỏi một cách ngắn gọn, dễ hiểu, có số liệu cụ thể. Viết bằng tiếng Việt tự nhiên.`

  const result = await generateContent({
    prompt,
    systemPrompt:
      'Bạn là AI assistant thân thiện, chuyên giải thích dữ liệu marketing cho người Việt. Trả lời ngắn gọn, dễ hiểu.',
    temperature: 0.5,
  })

  return result.content
}
