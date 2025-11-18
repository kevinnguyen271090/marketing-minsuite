'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source: '',
    platform: '',
    kolsName: '',
    branch: '',
    type: 'ONLINE',
    budget: '',
    startDate: '',
    endDate: '',
  })

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create campaign')

      router.push('/dashboard/campaigns')
    } catch (error) {
      console.error(error)
      alert('Không thể tạo chiến dịch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tạo chiến dịch mới</h1>
          <p className="text-gray-500 mt-1">
            Điền thông tin để tạo chiến dịch marketing mới
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chiến dịch</CardTitle>
              <CardDescription>
                Thông tin cơ bản về chiến dịch marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campaign Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên chiến dịch *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="VD: Tết 2024 - Facebook Ads"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Mô tả ngắn về chiến dịch"
                />
              </div>

              {/* Source */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source">Source *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleChange('source', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FACEBOOK">Facebook</SelectItem>
                      <SelectItem value="TIKTOK">TikTok</SelectItem>
                      <SelectItem value="GOOGLE">Google</SelectItem>
                      <SelectItem value="KOL">KOL/Influencer</SelectItem>
                      <SelectItem value="EVENT">Event</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => handleChange('platform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FACEBOOK">Facebook</SelectItem>
                      <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                      <SelectItem value="TIKTOK">TikTok</SelectItem>
                      <SelectItem value="GOOGLE_ADS">Google Ads</SelectItem>
                      <SelectItem value="ZALO">Zalo</SelectItem>
                      <SelectItem value="YOUTUBE">YouTube</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditional: KOL Name (only show if source = KOL) */}
              {formData.source === 'KOL' && (
                <div className="space-y-2 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <Label htmlFor="kolsName">Tên KOL/Influencer *</Label>
                  <Input
                    id="kolsName"
                    value={formData.kolsName}
                    onChange={(e) => handleChange('kolsName', e.target.value)}
                    placeholder="VD: Hương Giang, Quang Đăng, ..."
                    required
                  />
                  <p className="text-sm text-indigo-600">
                    Nhập tên KOL/Influencer cho chiến dịch này
                  </p>
                </div>
              )}

              {/* Conditional: Branch (for EVENT type) */}
              {formData.source === 'EVENT' && (
                <div className="space-y-2 bg-green-50 p-4 rounded-lg border border-green-200">
                  <Label htmlFor="branch">Chi nhánh/Địa điểm</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    placeholder="VD: Landmark 81, Vincom Mega Mall, ..."
                  />
                </div>
              )}

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">Ngân sách (VNĐ)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="50000000"
                />
              </div>

              {/* Dates */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo chiến dịch'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
