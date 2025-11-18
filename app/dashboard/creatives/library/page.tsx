'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Image, Video, FileText, Search, BarChart3, Copy, Download, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function CreativeLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPerformance, setFilterPerformance] = useState('all')

  // Mock creative data
  const creatives = [
    {
      id: '1',
      name: 'Tết 2024 - Flash Sale Banner',
      type: 'IMAGE',
      format: 'jpg',
      size: '1200x628',
      campaign: 'Tết 2024 - Facebook Ads',
      platform: 'FACEBOOK',
      performance: 'excellent',
      impressions: 245000,
      clicks: 8234,
      ctr: 3.36,
      conversions: 267,
      createdAt: '2024-01-15',
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: '2',
      name: 'KOL Video - Product Review',
      type: 'VIDEO',
      format: 'mp4',
      size: '1080x1920',
      campaign: 'KOL Campaign - Hương Giang',
      platform: 'TIKTOK',
      performance: 'good',
      impressions: 412000,
      clicks: 12450,
      ctr: 3.02,
      conversions: 412,
      createdAt: '2024-02-01',
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: '3',
      name: 'Google Display Ad - Retargeting',
      type: 'IMAGE',
      format: 'png',
      size: '728x90',
      campaign: 'Google Ads - Brand Awareness',
      platform: 'GOOGLE_ADS',
      performance: 'average',
      impressions: 156000,
      clicks: 5621,
      ctr: 3.60,
      conversions: 156,
      createdAt: '2024-01-20',
      thumbnail: '/api/placeholder/300/200',
    },
    {
      id: '4',
      name: 'Email Header - Newsletter',
      type: 'IMAGE',
      format: 'png',
      size: '600x200',
      campaign: 'Email Marketing Q1',
      platform: 'EMAIL',
      performance: 'excellent',
      impressions: 45000,
      clicks: 2340,
      ctr: 5.20,
      conversions: 189,
      createdAt: '2024-02-05',
      thumbnail: '/api/placeholder/300/200',
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-4 w-4" />
      case 'VIDEO':
        return <Video className="h-4 w-4" />
      case 'TEXT':
        return <FileText className="h-4 w-4" />
      default:
        return <Image className="h-4 w-4" />
    }
  }

  const getPerformanceBadge = (performance: string) => {
    const config = {
      excellent: { variant: 'success' as const, label: 'Xuất sắc' },
      good: { variant: 'default' as const, label: 'Tốt' },
      average: { variant: 'secondary' as const, label: 'Trung bình' },
      poor: { variant: 'destructive' as const, label: 'Kém' },
    }
    const { variant, label } = config[performance as keyof typeof config] || config.average
    return <Badge variant={variant}>{label}</Badge>
  }

  const filteredCreatives = creatives.filter(creative => {
    const matchesSearch = creative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creative.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || creative.type === filterType
    const matchesPerformance = filterPerformance === 'all' || creative.performance === filterPerformance
    return matchesSearch && matchesType && matchesPerformance
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creative Library</h1>
          <p className="text-gray-500 mt-1">
            Quản lý và phân tích hiệu suất creative assets
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Creatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-green-600 mt-1">+12 tháng này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. CTR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.54%</div>
              <p className="text-xs text-green-600 mt-1">+0.8% vs tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">5.20%</div>
              <p className="text-xs text-gray-600 mt-1">Email Header</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                A/B Tests Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-600 mt-1">3 completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Creative Assets</CardTitle>
            <CardDescription>
              {filteredCreatives.length} assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm creative..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="IMAGE">Hình ảnh</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPerformance} onValueChange={setFilterPerformance}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Hiệu suất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="excellent">Xuất sắc</SelectItem>
                  <SelectItem value="good">Tốt</SelectItem>
                  <SelectItem value="average">Trung bình</SelectItem>
                  <SelectItem value="poor">Kém</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid View */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCreatives.map((creative) => (
                <Card key={creative.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100">
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="bg-white/90">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white/90">
                        {getTypeIcon(creative.type)}
                        <span className="ml-1">{creative.format.toUpperCase()}</span>
                      </Badge>
                    </div>
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      {creative.type === 'VIDEO' ? (
                        <Video className="h-16 w-16" />
                      ) : (
                        <Image className="h-16 w-16" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <CardContent className="pt-4">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {creative.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {creative.campaign}
                      </p>
                    </div>

                    {/* Performance */}
                    <div className="flex items-center justify-between mb-3">
                      {getPerformanceBadge(creative.performance)}
                      <span className="text-sm font-medium text-gray-700">
                        CTR: {creative.ctr}%
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Impressions</p>
                        <p className="text-sm font-medium text-gray-900">
                          {(creative.impressions / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Clicks</p>
                        <p className="text-sm font-medium text-gray-900">
                          {creative.clicks.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Conv.</p>
                        <p className="text-sm font-medium text-green-600">
                          {creative.conversions}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCreatives.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không tìm thấy creative nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
