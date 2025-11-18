'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Copy, ExternalLink, BarChart3 } from 'lucide-react'

export default function TrackingLinksPage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatorForm, setGeneratorForm] = useState({
    campaignId: '',
    targetUrl: '',
    source: '',
    platform: '',
    kolsName: '',
    branch: '',
  })
  const [generatedLink, setGeneratedLink] = useState('')

  // Mock data
  const trackingLinks = [
    {
      id: '1',
      shortCode: 'tet2024-fb',
      targetUrl: 'https://example.com/tet-sale',
      source: 'FACEBOOK',
      platform: 'FACEBOOK',
      campaignName: 'Tết 2024 - Facebook Ads',
      clicks: 8234,
      conversions: 267,
      revenue: 45200000,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      shortCode: 'kol-huonggiang',
      targetUrl: 'https://example.com/products',
      source: 'KOL',
      platform: 'TIKTOK',
      kolsName: 'Hương Giang',
      campaignName: 'KOL Campaign - Hương Giang',
      clicks: 12450,
      conversions: 412,
      revenue: 68500000,
      createdAt: '2024-02-01',
    },
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock generation
    const shortCode = `${generatorForm.source.toLowerCase()}-${Date.now().toString(36)}`
    const link = `${window.location.origin}/l/${shortCode}`
    setGeneratedLink(link)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Đã copy link!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tracking Links</h1>
            <p className="text-gray-500 mt-1">
              Tạo và quản lý link theo dõi chiến dịch
            </p>
          </div>
          <Button onClick={() => setShowGenerator(!showGenerator)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo link mới
          </Button>
        </div>

        {/* Link Generator */}
        {showGenerator && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle>Tạo Tracking Link</CardTitle>
              <CardDescription>
                Tạo link theo dõi với UTM parameters và source tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Chiến dịch</Label>
                    <Select
                      value={generatorForm.campaignId}
                      onValueChange={(v) => setGeneratorForm(prev => ({ ...prev, campaignId: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chiến dịch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tết 2024 - Facebook Ads</SelectItem>
                        <SelectItem value="2">KOL Campaign - Hương Giang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target URL *</Label>
                    <Input
                      value={generatorForm.targetUrl}
                      onChange={(e) => setGeneratorForm(prev => ({ ...prev, targetUrl: e.target.value }))}
                      placeholder="https://example.com/products"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Source *</Label>
                    <Select
                      value={generatorForm.source}
                      onValueChange={(v) => setGeneratorForm(prev => ({ ...prev, source: v }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACEBOOK">Facebook</SelectItem>
                        <SelectItem value="TIKTOK">TikTok</SelectItem>
                        <SelectItem value="GOOGLE">Google</SelectItem>
                        <SelectItem value="KOL">KOL</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={generatorForm.platform}
                      onValueChange={(v) => setGeneratorForm(prev => ({ ...prev, platform: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACEBOOK">Facebook</SelectItem>
                        <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                        <SelectItem value="TIKTOK">TikTok</SelectItem>
                        <SelectItem value="GOOGLE_ADS">Google Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {generatorForm.source === 'KOL' && (
                  <div className="space-y-2">
                    <Label>Tên KOL</Label>
                    <Input
                      value={generatorForm.kolsName}
                      onChange={(e) => setGeneratorForm(prev => ({ ...prev, kolsName: e.target.value }))}
                      placeholder="VD: Hương Giang"
                    />
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Tạo Link
                </Button>

                {generatedLink && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Label className="text-green-800">Link đã tạo:</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input value={generatedLink} readOnly className="bg-white" />
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => copyToClipboard(generatedLink)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Links Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Tracking Links</CardTitle>
            <CardDescription>{trackingLinks.length} links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {link.shortCode}
                      </code>
                      <Badge variant="secondary">{link.source}</Badge>
                      {link.kolsName && (
                        <Badge variant="outline">KOL: {link.kolsName}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Campaign: {link.campaignName}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>{link.clicks.toLocaleString()} clicks</span>
                      <span>{link.conversions} conversions</span>
                      <span className="text-green-600 font-medium">
                        ₫{(link.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${window.location.origin}/l/${link.shortCode}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
