'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, TrendingUp, TrendingDown, Link as LinkIcon } from 'lucide-react'

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id

  // Mock data
  const campaign = {
    id: campaignId,
    name: 'Tết 2024 - Facebook Ads',
    description: 'Chiến dịch quảng cáo Facebook cho dịp Tết Nguyên Đán 2024',
    source: 'FACEBOOK',
    platform: 'FACEBOOK',
    status: 'ACTIVE',
    type: 'ONLINE',
    budget: 50000000,
    spent: 32000000,
    revenue: 85000000,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    createdAt: '2024-01-10',
  }

  const metrics = {
    impressions: 245000,
    clicks: 8234,
    conversions: 267,
    conversionRate: 3.24,
    ctr: 3.36,
    cpc: 3885,
    roi: 165.6,
    roas: 265.6,
  }

  const trackingLinks = [
    { id: '1', shortCode: 'tet2024-fb-1', clicks: 4521, conversions: 142 },
    { id: '2', shortCode: 'tet2024-fb-2', clicks: 2987, conversions: 89 },
    { id: '3', shortCode: 'tet2024-fb-3', clicks: 726, conversions: 36 },
  ]

  const formatCurrency = (amount: number) => {
    return `₫${(amount / 1000000).toFixed(1)}M`
  }

  const getStatusBadge = (status: string) => {
    const variants = { ACTIVE: 'success', PAUSED: 'warning', COMPLETED: 'secondary', DRAFT: 'outline' } as const
    const labels = { ACTIVE: 'Đang chạy', PAUSED: 'Tạm dừng', COMPLETED: 'Hoàn thành', DRAFT: 'Nháp' }
    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/campaigns">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                {getStatusBadge(campaign.status)}
              </div>
              <p className="text-gray-500 mt-1">{campaign.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/campaigns/${campaignId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>

        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chiến dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="text-lg font-semibold">{campaign.source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Platform</p>
                <p className="text-lg font-semibold">{campaign.platform}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại</p>
                <p className="text-lg font-semibold">{campaign.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="text-sm">{campaign.startDate} → {campaign.endDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Revenue */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Ngân sách</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(campaign.budget)}</div>
              <p className="text-sm text-gray-500 mt-1">
                Đã chi: {formatCurrency(campaign.spent)} ({((campaign.spent / campaign.budget) * 100).toFixed(1)}%)
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(campaign.revenue)}</div>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +18.2% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.roi.toFixed(1)}%</div>
              <p className="text-sm text-gray-500 mt-1">
                ROAS: {metrics.roas.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất</CardTitle>
            <CardDescription>Các chỉ số quan trọng của chiến dịch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Impressions</p>
                <p className="text-2xl font-bold">{metrics.impressions.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">Clicks</p>
                <p className="text-2xl font-bold">{metrics.clicks.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">CTR: {metrics.ctr}%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Conversions</p>
                <p className="text-2xl font-bold">{metrics.conversions}</p>
                <p className="text-xs text-green-600 mt-1">Rate: {metrics.conversionRate}%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">CPC</p>
                <p className="text-2xl font-bold">₫{metrics.cpc.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tracking Links</CardTitle>
                <CardDescription>{trackingLinks.length} links đang hoạt động</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/dashboard/tracking-links">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Xem tất cả
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trackingLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {link.shortCode}
                    </code>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>{link.clicks.toLocaleString()} clicks</span>
                      <span>{link.conversions} conversions</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Chi tiết</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
