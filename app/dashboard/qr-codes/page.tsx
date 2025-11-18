'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { QrCode, Download, Copy, BarChart3, Plus, Search } from 'lucide-react'

export default function QRCodesPage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [generatorForm, setGeneratorForm] = useState({
    name: '',
    url: '',
    source: '',
    campaign: '',
    size: '300',
    format: 'png',
  })
  const [generatedQR, setGeneratedQR] = useState('')

  // Mock data
  const qrCodes = [
    {
      id: '1',
      name: 'Tết 2024 - Facebook Ads QR',
      campaign: 'Tết 2024 - Facebook Ads',
      source: 'FACEBOOK',
      url: 'https://minsuite.com/l/fb-tet2024',
      scans: 1247,
      conversions: 89,
      createdAt: '2024-01-15',
      lastScan: '2024-02-15',
    },
    {
      id: '2',
      name: 'KOL Campaign - Store Poster',
      campaign: 'KOL Campaign - Hương Giang',
      source: 'KOL',
      url: 'https://minsuite.com/l/kol-hg-poster',
      scans: 2134,
      conversions: 156,
      createdAt: '2024-02-01',
      lastScan: '2024-02-16',
    },
    {
      id: '3',
      name: 'Event - Landmark 81',
      campaign: 'Event Marketing - Q1 2024',
      source: 'EVENT',
      url: 'https://minsuite.com/l/event-lm81',
      scans: 856,
      conversions: 67,
      createdAt: '2024-02-05',
      lastScan: '2024-02-16',
    },
  ]

  const handleGeneratorChange = (field: string, value: string) => {
    setGeneratorForm(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = () => {
    // Mock QR generation - in production, use QR library or API
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=${generatorForm.size}x${generatorForm.size}&data=${encodeURIComponent(generatorForm.url)}`
    setGeneratedQR(qrData)
  }

  const handleDownload = () => {
    // In production, trigger actual download
    window.open(generatedQR, '_blank')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredQRCodes = qrCodes.filter(qr =>
    qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.campaign.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
            <p className="text-gray-500 mt-1">
              Tạo và quản lý QR codes cho chiến dịch marketing
            </p>
          </div>
          <Button onClick={() => setShowGenerator(!showGenerator)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo QR Code
          </Button>
        </div>

        {/* QR Generator */}
        {showGenerator && (
          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-600" />
                Tạo QR Code mới
              </CardTitle>
              <CardDescription>
                Tạo QR code cho tracking link hoặc landing page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-name">Tên QR Code *</Label>
                    <Input
                      id="qr-name"
                      placeholder="VD: Event Tết 2024 - Poster"
                      value={generatorForm.name}
                      onChange={(e) => handleGeneratorChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-url">URL đích *</Label>
                    <Input
                      id="qr-url"
                      placeholder="https://..."
                      value={generatorForm.url}
                      onChange={(e) => handleGeneratorChange('url', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Có thể là tracking link hoặc landing page
                    </p>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="qr-source">Source</Label>
                      <Select
                        value={generatorForm.source}
                        onValueChange={(v) => handleGeneratorChange('source', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FACEBOOK">Facebook</SelectItem>
                          <SelectItem value="TIKTOK">TikTok</SelectItem>
                          <SelectItem value="KOL">KOL</SelectItem>
                          <SelectItem value="EVENT">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qr-campaign">Chiến dịch</Label>
                      <Select
                        value={generatorForm.campaign}
                        onValueChange={(v) => handleGeneratorChange('campaign', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chiến dịch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Tết 2024 - Facebook Ads</SelectItem>
                          <SelectItem value="2">KOL Campaign</SelectItem>
                          <SelectItem value="3">Event Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="qr-size">Kích thước (px)</Label>
                      <Select
                        value={generatorForm.size}
                        onValueChange={(v) => handleGeneratorChange('size', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="200">200x200</SelectItem>
                          <SelectItem value="300">300x300</SelectItem>
                          <SelectItem value="500">500x500</SelectItem>
                          <SelectItem value="1000">1000x1000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qr-format">Format</Label>
                      <Select
                        value={generatorForm.format}
                        onValueChange={(v) => handleGeneratorChange('format', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="svg">SVG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!generatorForm.name || !generatorForm.url}
                    className="w-full"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Tạo QR Code
                  </Button>
                </div>

                {/* Preview */}
                <div className="flex flex-col items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
                  {generatedQR ? (
                    <div className="space-y-4 text-center">
                      <img
                        src={generatedQR}
                        alt="Generated QR Code"
                        className="w-64 h-64 mx-auto border-4 border-white shadow-lg rounded-lg"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button onClick={handleDownload} variant="default">
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(generatorForm.url)}
                          variant="outline"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {generatorForm.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCode className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>QR Code sẽ hiển thị ở đây</p>
                      <p className="text-sm">Điền form và click "Tạo QR Code"</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Codes List */}
        <Card>
          <CardHeader>
            <CardTitle>QR Codes đã tạo</CardTitle>
            <CardDescription>
              {filteredQRCodes.length} QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm QR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500">
                    <th className="px-4 py-3">Tên QR Code</th>
                    <th className="px-4 py-3">Chiến dịch</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3 text-right">Scans</th>
                    <th className="px-4 py-3 text-right">Conversions</th>
                    <th className="px-4 py-3 text-right">CVR</th>
                    <th className="px-4 py-3">Scan cuối</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredQRCodes.map((qr) => {
                    const cvr = ((qr.conversions / qr.scans) * 100).toFixed(2)
                    return (
                      <tr key={qr.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                              <QrCode className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {qr.name}
                              </p>
                              <p className="text-sm text-gray-500 font-mono">
                                {qr.url}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {qr.campaign}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline">{qr.source}</Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {qr.scans.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-green-600">
                            {qr.conversions.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-gray-700">
                            {cvr}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-500">
                            {new Date(qr.lastScan).toLocaleDateString('vi-VN')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredQRCodes.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Không tìm thấy QR code nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
