'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - will be replaced with API call
  const campaigns = [
    {
      id: '1',
      name: 'Tết 2024 - Facebook Ads',
      source: 'FACEBOOK',
      platform: 'FACEBOOK',
      status: 'ACTIVE',
      budget: 50000000,
      spent: 32000000,
      revenue: 85000000,
      roi: 165.6,
      clicks: 8234,
      conversions: 267,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'KOL Campaign - Hương Giang',
      source: 'KOL',
      platform: 'TIKTOK',
      kolsName: 'Hương Giang',
      status: 'ACTIVE',
      budget: 30000000,
      spent: 28000000,
      revenue: 68500000,
      roi: 144.6,
      clicks: 12450,
      conversions: 412,
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'Google Ads - Brand Awareness',
      source: 'GOOGLE',
      platform: 'GOOGLE_ADS',
      status: 'PAUSED',
      budget: 25000000,
      spent: 18000000,
      revenue: 28300000,
      roi: 57.2,
      clicks: 5621,
      conversions: 156,
      createdAt: '2024-01-20',
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'success',
      PAUSED: 'warning',
      COMPLETED: 'secondary',
      DRAFT: 'outline',
      ARCHIVED: 'outline',
    } as const

    const labels = {
      ACTIVE: 'Đang chạy',
      PAUSED: 'Tạm dừng',
      COMPLETED: 'Hoàn thành',
      DRAFT: 'Nháp',
      ARCHIVED: 'Đã lưu trữ',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return `₫${(amount / 1000000).toFixed(1)}M`
  }

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chiến dịch</h1>
            <p className="text-gray-500 mt-1">
              Quản lý tất cả chiến dịch marketing của bạn
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              Tạo chiến dịch
            </Link>
          </Button>
        </div>

        {/* Search and filters */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách chiến dịch</CardTitle>
            <CardDescription>
              {filteredCampaigns.length} chiến dịch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm chiến dịch..."
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
                    <th className="px-4 py-3">Tên chiến dịch</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Ngân sách</th>
                    <th className="px-4 py-3 text-right">Đã chi</th>
                    <th className="px-4 py-3 text-right">Doanh thu</th>
                    <th className="px-4 py-3 text-right">ROI</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <Link
                            href={`/dashboard/campaigns/${campaign.id}`}
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {campaign.name}
                          </Link>
                          {campaign.kolsName && (
                            <p className="text-sm text-gray-500">
                              KOL: {campaign.kolsName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {campaign.source}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {campaign.platform}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">
                        {formatCurrency(campaign.budget)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">
                        {formatCurrency(campaign.spent)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-green-600">
                        {formatCurrency(campaign.revenue)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`text-sm font-medium ${campaign.roi > 100 ? 'text-green-600' : 'text-red-600'}`}>
                          {campaign.roi.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/campaigns/${campaign.id}`}>
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCampaigns.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Không tìm thấy chiến dịch nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
