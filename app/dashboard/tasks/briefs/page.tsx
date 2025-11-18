'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Plus, Search, Calendar, User, Target } from 'lucide-react'

export default function BriefsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock briefs data
  const briefs = [
    {
      id: '1',
      title: 'Tết 2024 - Facebook Ads Campaign',
      campaign: 'Tết 2024 - Facebook Ads',
      status: 'APPROVED',
      priority: 'HIGH',
      dueDate: '2024-01-30',
      createdBy: 'Nguyễn Văn A',
      createdAt: '2024-01-10',
      objectives: 'Tăng awareness và drive sales trong dịp Tết',
      budget: 50000000,
      targetAudience: 'Nam/Nữ 25-45, có thu nhập cao',
      kpis: ['ROI > 150%', 'Conversions > 250', 'CTR > 3%'],
    },
    {
      id: '2',
      title: 'KOL Partnership - Hương Giang',
      campaign: 'KOL Campaign',
      status: 'IN_REVIEW',
      priority: 'MEDIUM',
      dueDate: '2024-02-15',
      createdBy: 'Trần Thị B',
      createdAt: '2024-01-25',
      objectives: 'Tăng brand awareness qua KOL collaboration',
      budget: 30000000,
      targetAudience: 'Female 18-35, quan tâm beauty',
      kpis: ['Engagement rate > 4%', 'Reach > 500K', 'Conversions > 400'],
    },
    {
      id: '3',
      title: 'Valentine 2024 Campaign',
      campaign: 'Valentine 2024',
      status: 'DRAFT',
      priority: 'HIGH',
      dueDate: '2024-02-10',
      createdBy: 'Lê Văn C',
      createdAt: '2024-02-01',
      objectives: 'Tối đa hóa sales trong dịp Valentine',
      budget: 40000000,
      targetAudience: 'Nam/Nữ 20-40, đang có quan hệ',
      kpis: ['Revenue > 100M', 'ROI > 180%', 'Orders > 800'],
    },
    {
      id: '4',
      title: 'Google Ads - Retargeting Q1',
      campaign: 'Google Ads - Q1 2024',
      status: 'REJECTED',
      priority: 'LOW',
      dueDate: '2024-02-20',
      createdBy: 'Phạm Thị D',
      createdAt: '2024-01-15',
      objectives: 'Retargeting users đã visit website',
      budget: 20000000,
      targetAudience: 'Website visitors, chưa convert',
      kpis: ['CVR > 2.5%', 'CPA < 500K', 'ROAS > 2.0'],
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      APPROVED: { variant: 'success' as const, label: 'Đã duyệt' },
      IN_REVIEW: { variant: 'default' as const, label: 'Đang duyệt' },
      DRAFT: { variant: 'secondary' as const, label: 'Nháp' },
      REJECTED: { variant: 'destructive' as const, label: 'Từ chối' },
    }
    const { variant, label } = config[status as keyof typeof config] || { variant: 'outline' as const, label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const config = {
      HIGH: { variant: 'destructive' as const, label: 'Cao' },
      MEDIUM: { variant: 'default' as const, label: 'Trung bình' },
      LOW: { variant: 'secondary' as const, label: 'Thấp' },
    }
    const { variant, label } = config[priority as keyof typeof config] || { variant: 'outline' as const, label: priority }
    return <Badge variant={variant}>{label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return `₫${(amount / 1000000).toFixed(0)}M`
  }

  const filteredBriefs = briefs.filter(brief => {
    const matchesSearch = brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || brief.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Briefs</h1>
            <p className="text-gray-500 mt-1">
              Quản lý brief và yêu cầu cho các chiến dịch marketing
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Brief mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Briefs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{briefs.length}</div>
              <p className="text-xs text-gray-600 mt-1">Tất cả briefs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đã duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {briefs.filter(b => b.status === 'APPROVED').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đang duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {briefs.filter(b => b.status === 'IN_REVIEW').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">In Review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Nháp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {briefs.filter(b => b.status === 'DRAFT').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Draft</p>
            </CardContent>
          </Card>
        </div>

        {/* Briefs List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Briefs</CardTitle>
            <CardDescription>
              {filteredBriefs.length} briefs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm brief..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="IN_REVIEW">Đang duyệt</SelectItem>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Briefs Grid */}
            <div className="space-y-4">
              {filteredBriefs.map((brief) => (
                <Card key={brief.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <Link
                            href={`/dashboard/tasks/briefs/${brief.id}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600"
                          >
                            {brief.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {brief.campaign}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(brief.status)}
                        {getPriorityBadge(brief.priority)}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Objectives:</p>
                        <p className="text-sm text-gray-600">{brief.objectives}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Target Audience:</p>
                        <p className="text-sm text-gray-600">{brief.targetAudience}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Key KPIs:</p>
                      <div className="flex flex-wrap gap-2">
                        {brief.kpis.map((kpi, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            <Target className="h-3 w-3 mr-1" />
                            {kpi}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(brief.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {brief.createdBy}
                        </span>
                        <span className="font-medium text-indigo-600">
                          Budget: {formatCurrency(brief.budget)}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/tasks/briefs/${brief.id}`}>
                          Xem chi tiết →
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBriefs.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Không tìm thấy brief nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brief Templates */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle>📝 Brief Templates</CardTitle>
            <CardDescription>
              Sử dụng templates có sẵn để tạo brief nhanh hơn
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <button className="text-left p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all">
              <p className="font-medium text-gray-900 mb-1">Facebook Ads Campaign</p>
              <p className="text-sm text-gray-600">Template cho FB ads với full targeting</p>
            </button>
            <button className="text-left p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all">
              <p className="font-medium text-gray-900 mb-1">KOL Partnership</p>
              <p className="text-sm text-gray-600">Template cho KOL collaboration</p>
            </button>
            <button className="text-left p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all">
              <p className="font-medium text-gray-900 mb-1">Event Marketing</p>
              <p className="text-sm text-gray-600">Template cho event campaigns</p>
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
