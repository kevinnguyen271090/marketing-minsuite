import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateContent, generateSocialPost, generateEmail, generateBlogPost } from '@/lib/claude'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const generateSchema = z.object({
  type: z.enum(['social_post', 'email', 'blog', 'custom']),
  // Social post params
  platform: z.enum(['facebook', 'tiktok', 'instagram']).optional(),
  product: z.string().optional(),
  tone: z.string().default('friendly'),
  cta: z.string().optional(),
  hashtags: z.boolean().default(true),
  // Email params
  purpose: z.string().optional(),
  audience: z.string().optional(),
  includeHtml: z.boolean().default(true),
  // Blog params
  topic: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  wordCount: z.number().optional(),
  // Custom
  prompt: z.string().optional(),
  systemPrompt: z.string().optional(),
  // Campaign tracking
  campaignId: z.string().optional(),
  saveToCampaign: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const data = generateSchema.parse(body)

    let content: any

    // Generate based on type
    switch (data.type) {
      case 'social_post':
        if (!data.platform || !data.product) {
          return NextResponse.json(
            { error: 'Platform and product required for social post' },
            { status: 400 }
          )
        }
        content = await generateSocialPost({
          platform: data.platform,
          product: data.product,
          tone: data.tone,
          cta: data.cta,
          hashtags: data.hashtags,
        })
        break

      case 'email':
        if (!data.purpose || !data.audience) {
          return NextResponse.json(
            { error: 'Purpose and audience required for email' },
            { status: 400 }
          )
        }
        content = await generateEmail({
          purpose: data.purpose,
          audience: data.audience,
          tone: data.tone,
          includeHtml: data.includeHtml,
        })
        break

      case 'blog':
        if (!data.topic || !data.keywords) {
          return NextResponse.json(
            { error: 'Topic and keywords required for blog' },
            { status: 400 }
          )
        }
        content = await generateBlogPost({
          topic: data.topic,
          keywords: data.keywords,
          wordCount: data.wordCount,
          tone: data.tone,
        })
        break

      case 'custom':
        if (!data.prompt) {
          return NextResponse.json(
            { error: 'Prompt required for custom generation' },
            { status: 400 }
          )
        }
        const result = await generateContent({
          prompt: data.prompt,
          systemPrompt: data.systemPrompt,
        })
        content = result.content
        break

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }

    // Save to Creative if requested
    if (data.saveToCampaign && data.campaignId) {
      const creative = await prisma.creative.create({
        data: {
          organizationId: (session.user as any).organizationId,
          campaignId: data.campaignId,
          name: `AI Generated - ${data.type}`,
          type:
            data.type === 'social_post'
              ? 'SOCIAL_POST'
              : data.type === 'email'
              ? 'EMAIL'
              : data.type === 'blog'
              ? 'SEO_CONTENT'
              : 'SOCIAL_POST',
          format: data.type === 'email' ? 'HTML' : 'TEXT',
          content: typeof content === 'string' ? content : JSON.stringify(content),
          htmlContent: typeof content === 'object' && content.html ? content.html : undefined,
          generatedBy: 'ai',
          promptUsed: data.prompt || `${data.type} generation`,
          status: 'DRAFT',
        },
      })

      return NextResponse.json({
        content,
        creative: {
          id: creative.id,
          name: creative.name,
        },
      })
    }

    return NextResponse.json({ content })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
