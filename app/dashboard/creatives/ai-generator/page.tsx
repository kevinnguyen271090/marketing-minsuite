'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, Download, RefreshCw } from 'lucide-react'

export default function AIGeneratorPage() {
  const [formData, setFormData] = useState({
    contentType: '',
    platform: '',
    tone: '',
    topic: '',
    keywords: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string[]>([])

  const contentTypes = [
    { value: 'ad-copy', label: 'Ad Copy' },
    { value: 'social-post', label: 'Social Media Post' },
    { value: 'email', label: 'Email Campaign' },
    { value: 'product-description', label: 'Product Description' },
    { value: 'blog-post', label: 'Blog Post' },
  ]

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'google', label: 'Google Ads' },
  ]

  const tones = [
    { value: 'professional', label: 'Chuyên nghiệp' },
    { value: 'friendly', label: 'Thân thiện' },
    { value: 'persuasive', label: 'Thuyết phục' },
    { value: 'casual', label: 'Thoải mái' },
    { value: 'urgent', label: 'Cấp bách' },
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Mock AI generation - replace with actual API call
    setTimeout(() => {
      const mockResults = [
        `🎯 ${formData.topic} - Giải pháp hoàn hảo cho bạn!\n\n✨ Khám phá ngay hôm nay và nhận ưu đãi đặc biệt 30%\n\n👉 Click để tìm hiểu thêm!`,
        `Bạn đang tìm kiếm ${formData.topic}?\n\n💡 Chúng tôi có giải pháp tốt nhất dành cho bạn\n✅ Chất lượng hàng đầu\n✅ Giá cả cạnh tranh\n✅ Hỗ trợ 24/7\n\nĐặt hàng ngay để nhận quà tặng!`,
        `${formData.topic.toUpperCase()} - Không thể bỏ lỡ!\n\nChương trình khuyến mãi HOT:\n🔥 Giảm giá lên đến 50%\n🎁 Quà tặng hấp dẫn\n⚡ Giao hàng nhanh chóng\n\nChỉ còn số lượng có hạn!`,
      ]
      setGeneratedContent(mockResults)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Show toast notification
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Content Generator</h1>
          <p className="text-gray-500 mt-1">
            Tạo nội dung marketing chuyên nghiệp với AI
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Generator Form */}
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Tạo nội dung mới
              </CardTitle>
              <CardDescription>
                Nhập thông tin và để AI tạo nội dung cho bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Type */}
              <div className="space-y-2">
                <Label htmlFor="contentType">Loại nội dung *</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(v) => handleChange('contentType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại nội dung" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(v) => handleChange('platform', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tone giọng điệu *</Label>
                <Select
                  value={formData.tone}
                  onValueChange={(v) => handleChange('tone', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map(tone => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic">Chủ đề/Sản phẩm *</Label>
                <Input
                  id="topic"
                  placeholder="VD: Giày thể thao Nike Air Max"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="keywords"
                  placeholder="VD: giảm giá, chất lượng cao, miễn phí vận chuyển"
                  value={formData.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!formData.contentType || !formData.platform || !formData.tone || !formData.topic || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tạo nội dung
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Results */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kết quả tạo</CardTitle>
                <CardDescription>
                  {generatedContent.length > 0
                    ? `${generatedContent.length} phiên bản được tạo`
                    : 'Nội dung sẽ hiển thị ở đây'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Chưa có nội dung nào được tạo</p>
                    <p className="text-sm">Điền form bên trái và click "Tạo nội dung"</p>
                  </div>
                ) : (
                  generatedContent.map((content, index) => (
                    <Card key={index} className="border-gray-200 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline">Phiên bản {index + 1}</Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(content)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {content}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Templates */}
            {generatedContent.length === 0 && (
              <Card className="border-indigo-100 bg-indigo-50">
                <CardHeader>
                  <CardTitle className="text-sm">💡 Gợi ý Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full text-left p-3 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 transition-colors">
                    <p className="font-medium text-sm text-gray-900">Flash Sale Ad</p>
                    <p className="text-xs text-gray-500">Tạo quảng cáo giảm giá nhanh</p>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 transition-colors">
                    <p className="font-medium text-sm text-gray-900">Product Launch</p>
                    <p className="text-xs text-gray-500">Ra mắt sản phẩm mới</p>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 transition-colors">
                    <p className="font-medium text-sm text-gray-900">Seasonal Campaign</p>
                    <p className="text-xs text-gray-500">Chiến dịch theo mùa/sự kiện</p>
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
