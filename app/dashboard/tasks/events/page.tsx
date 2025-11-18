'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, MapPin, Users, DollarSign, Search, Plus, BarChart3 } from 'lucide-react'

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock events data
  const events = [
    {
      id: '1',
      name: 'Tết 2024 - Popup Store Landmark 81',
      type: 'POPUP_STORE',
      status: 'COMPLETED',
      location: 'Landmark 81, Q. Bình Thạnh',
      startDate: '2024-01-20',
      endDate: '2024-02-05',
      budget: 80000000,
      spent: 75000000,
      revenue: 245000000,
      attendees: 12450,
      conversions: 856,
      roi: 226.7,
    },
    {
      id: '2',
      name: 'Valentine Fair - Vincom Mega Mall',
      type: 'FAIR',
      status: 'ONGOING',
      location: 'Vincom Mega Mall, Q.2',
      startDate: '2024-02-10',
      endDate: '2024-02-14',
      budget: 60000000,
      spent: 32000000,
      revenue: 89000000,
      attendees: 5620,
      conversions: 412,
      roi: 178.1,
    },
    {
      id: '3',
      name: 'Product Launch - Crescent Mall',
      type: 'PRODUCT_LAUNCH',
      status: 'PLANNED',
      location: 'Crescent Mall, Q.7',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      budget: 100000000,
      spent: 0,
      revenue: 0,
      attendees: 0,
      conversions: 0,
      roi: 0,
    },
    {
      id: '4',
      name: 'Summer Sale - Aeon Mall',
      type: 'PROMOTION',
      status: 'PLANNED',
      location: 'Aeon Mall Tân Phú',
      startDate: '2024-04-15',
      endDate: '2024-04-30',
      budget: 120000000,
      spent: 0,
      revenue: 0,
      attendees: 0,
      conversions: 0,
      roi: 0,
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      COMPLETED: { variant: 'success' as const, label: 'Hoàn thành' },
      ONGOING: { variant: 'default' as const, label: 'Đang diễn ra' },
      PLANNED: { variant: 'secondary' as const, label: 'Đã lên kế hoạch' },
      CANCELLED: { variant: 'destructive' as const, label: 'Đã hủy' },
    }
    const { variant, label } = config[status as keyof typeof config] || { variant: 'outline' as const, label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getEventTypeBadge = (type: string) => {
    const labels = {
      POPUP_STORE: 'Popup Store',
      FAIR: 'Fair/Hội chợ',
      PRODUCT_LAUNCH: 'Product Launch',
      PROMOTION: 'Khuyến mãi',
      WORKSHOP: 'Workshop',
      CONFERENCE: 'Hội nghị',
    }
    return <Badge variant="outline">{labels[type as keyof typeof labels] || type}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return `₫${(amount / 1000000).toFixed(1)}M`
  }

  const calculateDaysLeft = (startDate: string) => {
    const days = Math.ceil((new Date(startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} ngày nữa` : 'Đã bắt đầu'
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Marketing</h1>
            <p className="text-gray-500 mt-1">
              Quản lý và theo dõi các sự kiện marketing offline
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Event mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-gray-600 mt-1">Tất cả events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(events.reduce((sum, e) => sum + e.revenue, 0))}
              </div>
              <p className="text-xs text-gray-600 mt-1">Từ events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {(events.filter(e => e.roi > 0).reduce((sum, e) => sum + e.roi, 0) / events.filter(e => e.roi > 0).length).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">Trung bình</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Attendees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce((sum, e) => sum + e.attendees, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Người tham dự</p>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Events</CardTitle>
            <CardDescription>
              {filteredEvents.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm event..."
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
                  <SelectItem value="PLANNED">Đã lên kế hoạch</SelectItem>
                  <SelectItem value="ONGOING">Đang diễn ra</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Events Grid */}
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.startDate).toLocaleDateString('vi-VN')} - {new Date(event.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(event.status)}
                        {getEventTypeBadge(event.type)}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-5 py-4 border-y border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Budget</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(event.budget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Spent</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(event.spent)}
                        </p>
                        {event.budget > 0 && (
                          <p className="text-xs text-gray-500">
                            {((event.spent / event.budget) * 100).toFixed(0)}%
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Revenue</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(event.revenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Attendees</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ROI</p>
                        <p className={`text-sm font-medium ${event.roi > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          {event.roi > 0 ? `${event.roi.toFixed(1)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4">
                      {event.status === 'PLANNED' ? (
                        <span className="text-sm text-gray-600">
                          Bắt đầu: {calculateDaysLeft(event.startDate)}
                        </span>
                      ) : event.status === 'ONGOING' ? (
                        <span className="text-sm text-blue-600 font-medium">
                          🔴 Đang diễn ra
                        </span>
                      ) : (
                        <span className="text-sm text-gray-600">
                          Conversions: {event.conversions}
                        </span>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                          Xem chi tiết →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Không tìm thấy event nào</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Event ROI Calculator
            </CardTitle>
            <CardDescription>
              Tính toán ROI dự kiến cho event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Budget (VNĐ)
                </label>
                <Input type="number" placeholder="50000000" className="bg-white" />
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Expected Revenue (VNĐ)
                </label>
                <Input type="number" placeholder="150000000" className="bg-white" />
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  ROI dự kiến
                </label>
                <div className="text-2xl font-bold text-green-600">200%</div>
              </div>
            </div>
            <Button className="mt-4 w-full md:w-auto">
              Tính toán ROI
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
