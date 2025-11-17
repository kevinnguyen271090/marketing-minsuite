import Anthropic from '@anthropic-ai/sdk'

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export interface GenerateContentParams {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
  model?: string
}

export interface GenerateContentResult {
  content: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
  model: string
}

/**
 * Generate content using Claude API
 */
export async function generateContent(
  params: GenerateContentParams
): Promise<GenerateContentResult> {
  try {
    const {
      prompt,
      systemPrompt = 'Bạn là chuyên gia marketing Việt Nam, chuyên viết content cho các kênh digital.',
      maxTokens = 2000,
      temperature = 0.7,
      model = 'claude-3-5-sonnet-20241022',
    } = params

    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract text content
    const content = message.content
      .filter((block) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n\n')

    return {
      content,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
      model: message.model,
    }
  } catch (error) {
    console.error('Error generating content with Claude:', error)
    throw new Error('Failed to generate content')
  }
}

/**
 * Generate social media post
 */
export async function generateSocialPost(params: {
  platform: 'facebook' | 'tiktok' | 'instagram'
  product: string
  tone: string
  cta?: string
  hashtags?: boolean
}): Promise<string> {
  const { platform, product, tone, cta, hashtags = true } = params

  const platformGuides = {
    facebook: 'Bài post Facebook nên dài 1-3 đoạn, có câu hỏi tương tác, emoji phù hợp.',
    tiktok: 'Caption TikTok ngắn gọn (100-150 ký tự), trendy, có hook mạnh.',
    instagram: 'Caption Instagram có câu chuyện, emoji, line breaks để dễ đọc.',
  }

  const prompt = `Viết một bài post ${platform} về sản phẩm/dịch vụ: "${product}"

Yêu cầu:
- Tone: ${tone}
${cta ? `- Call-to-action: ${cta}` : ''}
${hashtags ? `- Kèm 5-10 hashtags phù hợp` : ''}
- ${platformGuides[platform]}

Chỉ trả về nội dung bài post, không cần giải thích thêm.`

  const result = await generateContent({
    prompt,
    systemPrompt: `Bạn là copywriter chuyên nghiệp về thị trường Việt Nam. Viết content tự nhiên, gần gũi nhưng chuyên nghiệp. Hiểu văn hóa và xu hướng social media Việt.`,
    temperature: 0.8,
  })

  return result.content
}

/**
 * Generate email content
 */
export async function generateEmail(params: {
  purpose: string
  audience: string
  tone: string
  includeHtml?: boolean
}): Promise<{ subject: string; body: string; html?: string }> {
  const { purpose, audience, tone, includeHtml = true } = params

  const prompt = `Viết một email marketing với:
- Mục đích: ${purpose}
- Đối tượng: ${audience}
- Tone: ${tone}

Yêu cầu format:
SUBJECT: [Viết subject line hấp dẫn, 40-50 ký tự]

BODY:
[Nội dung email với cấu trúc:
- Opening hook
- Body giải thích giá trị
- Clear CTA
- Signature]

${includeHtml ? 'HTML:\n[HTML version với styling cơ bản]' : ''}

Chỉ trả về theo format trên.`

  const result = await generateContent({
    prompt,
    temperature: 0.7,
  })

  // Parse response
  const lines = result.content.split('\n')
  let subject = ''
  let body = ''
  let html = ''
  let currentSection = ''

  for (const line of lines) {
    if (line.startsWith('SUBJECT:')) {
      subject = line.replace('SUBJECT:', '').trim()
      currentSection = 'subject'
    } else if (line.startsWith('BODY:')) {
      currentSection = 'body'
    } else if (line.startsWith('HTML:')) {
      currentSection = 'html'
    } else if (line.trim()) {
      if (currentSection === 'body') {
        body += line + '\n'
      } else if (currentSection === 'html') {
        html += line + '\n'
      }
    }
  }

  return {
    subject: subject || 'Email Subject',
    body: body.trim(),
    html: includeHtml ? html.trim() : undefined,
  }
}

/**
 * Generate SEO blog content
 */
export async function generateBlogPost(params: {
  topic: string
  keywords: string[]
  wordCount?: number
  tone?: string
}): Promise<string> {
  const { topic, keywords, wordCount = 1000, tone = 'chuyên nghiệp nhưng dễ hiểu' } = params

  const prompt = `Viết một bài blog SEO về chủ đề: "${topic}"

Yêu cầu:
- Độ dài: ~${wordCount} từ
- Tone: ${tone}
- Tích hợp tự nhiên các keywords: ${keywords.join(', ')}
- Cấu trúc:
  * Tiêu đề H1 hấp dẫn
  * Introduction hook
  * 3-5 sections với H2
  * Conclusion với CTA
- Tối ưu cho SEO Việt Nam

Viết bài hoàn chỉnh với định dạng Markdown.`

  const result = await generateContent({
    prompt,
    maxTokens: Math.min(wordCount * 2, 4000),
    temperature: 0.7,
  })

  return result.content
}

/**
 * Apply prompt template với variables
 */
export function applyPromptTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let prompt = template

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    prompt = prompt.replace(regex, value)
  }

  return prompt
}
