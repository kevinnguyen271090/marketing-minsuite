'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Send, BarChart3, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là AI Copilot của MinSuite. Tôi có thể giúp bạn:\n\n• Phân tích hiệu suất chiến dịch\n• Đưa ra gợi ý tối ưu hóa\n• Dự báo xu hướng\n• Trả lời câu hỏi về dữ liệu marketing\n\nBạn muốn hỏi điều gì?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQueries = [
    {
      icon: BarChart3,
      text: 'Chiến dịch nào đang hoạt động tốt nhất?',
      category: 'Performance',
    },
    {
      icon: TrendingUp,
      text: 'ROI trung bình của tháng này so với tháng trước?',
      category: 'Analytics',
    },
    {
      icon: AlertCircle,
      text: 'Có chiến dịch nào cần điều chỉnh không?',
      category: 'Optimization',
    },
    {
      icon: Lightbulb,
      text: 'Gợi ý cải thiện conversion rate',
      category: 'Suggestions',
    },
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    // Mock AI response - replace with actual API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(input),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsThinking(false)
    }, 1500)
  }

  const getMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('chiến dịch') && lowerQuery.includes('tốt nhất')) {
      return `Dựa trên dữ liệu hiện tại, đây là top 3 chiến dịch hoạt động tốt nhất:\n\n1. **KOL Campaign - Hương Giang**\n   • ROI: 144.6%\n   • Conversions: 412\n   • Revenue: ₫68.5M\n   • Đánh giá: Excellent ✨\n\n2. **Tết 2024 - Facebook Ads**\n   • ROI: 165.6%\n   • Conversions: 267\n   • Revenue: ₫85.0M\n   • Đánh giá: Very Good 🎯\n\n3. **Google Ads - Brand Awareness**\n   • ROI: 57.2%\n   • Conversions: 156\n   • Revenue: ₫28.3M\n   • Đánh giá: Good 📊\n\n💡 **Gợi ý:** Tăng budget cho chiến dịch Facebook Ads vì có ROI cao nhất!`
    }

    if (lowerQuery.includes('roi') || lowerQuery.includes('so với')) {
      return `📊 **Phân tích ROI tháng này:**\n\n• ROI trung bình: **206.6%**\n• So với tháng trước: **+12.4%** ↗️\n• Xu hướng: Tăng trưởng tích cực\n\n**Chi tiết theo source:**\n• Facebook: 165.6% (+8.2%)\n• KOL: 144.6% (+15.3%)\n• Google: 57.2% (+5.1%)\n\n✅ **Kết luận:** Hiệu suất tốt, đặc biệt là KOL marketing đang có mức tăng trưởng mạnh.`
    }

    if (lowerQuery.includes('điều chỉnh') || lowerQuery.includes('cần')) {
      return `⚠️ **Cảnh báo & Đề xuất điều chỉnh:**\n\n1. **Google Ads - Brand Awareness**\n   • Status: PAUSED\n   • Vấn đề: ROI thấp (57.2%)\n   • Đề xuất: \n     - Tối ưu lại keywords\n     - Điều chỉnh target audience\n     - A/B test ad copy\n\n2. **Facebook Ads Campaign**\n   • Spent: 64% of budget\n   • Đề xuất: Chuẩn bị tăng budget để tận dụng momentum\n\n💰 **Budget recommendation:** Shift 20% budget từ Google sang Facebook/KOL campaigns.`
    }

    if (lowerQuery.includes('conversion') || lowerQuery.includes('chuyển đổi')) {
      return `💡 **Gợi ý cải thiện Conversion Rate:**\n\n**Hiện tại:**\n• Average CVR: 3.35%\n• Best performing: KOL (4.12%)\n• Lowest: Google (2.78%)\n\n**Đề xuất hành động:**\n\n1. **Landing Page Optimization**\n   • Giảm thời gian load xuống < 2s\n   • A/B test CTA buttons\n   • Tối ưu mobile experience\n\n2. **Audience Targeting**\n   • Tạo lookalike audience từ KOL campaign\n   • Retargeting người đã click nhưng chưa convert\n\n3. **Creative Testing**\n   • Test 3-5 ad variations mỗi tuần\n   • Sử dụng video content (CVR cao hơn 2x)\n\n4. **Offer Optimization**\n   • Limited-time offers\n   • Free shipping threshold\n   • Bundle deals\n\n📈 **Expected impact:** CVR có thể tăng 25-40% trong 2 tuần.`
    }

    return `Tôi đã hiểu câu hỏi của bạn về "${query}".\n\nĐể trả lời chính xác hơn, tôi cần phân tích dữ liệu thực tế từ:\n• Chiến dịch đang chạy\n• Lịch sử performance\n• Budget allocation\n• Market trends\n\nBạn có thể hỏi cụ thể hơn về:\n• Performance của chiến dịch cụ thể\n• ROI và revenue metrics\n• Optimization suggestions\n• Budget recommendations`
  }

  const handleSuggestedQuery = (query: string) => {
    setInput(query)
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            AI Copilot
          </h1>
          <p className="text-gray-500 mt-1">
            Trợ lý AI thông minh cho marketing operations
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 grid gap-4 lg:grid-cols-4">
          {/* Main Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Chat với AI</CardTitle>
              <CardDescription>
                Hỏi bất kỳ điều gì về chiến dịch marketing của bạn
              </CardDescription>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-600">AI Copilot</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                      <span className="text-sm text-gray-600">AI đang suy nghĩ...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi AI Copilot..."
                  className="flex-1"
                  disabled={isThinking}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isThinking}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Sidebar - Suggested Queries */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">💡 Câu hỏi gợi ý</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQueries.map((query, index) => {
                  const Icon = query.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuery(query.text)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 mt-0.5" />
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {query.category}
                          </Badge>
                          <p className="text-sm text-gray-700">
                            {query.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-sm">✨ Tính năng AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Phân tích real-time</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Gợi ý tối ưu hóa</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Dự báo xu hướng</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Cảnh báo anomaly</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
