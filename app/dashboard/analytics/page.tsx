'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  // Mock data
  const revenueData = [
    { date: '15/01', revenue: 12500000, spent: 4200000 },
    { date: '22/01', revenue: 18300000, spent: 5100000 },
    { date: '29/01', revenue: 22100000, spent: 6800000 },
    { date: '05/02', revenue: 19800000, spent: 7200000 },
    { date: '12/02', revenue: 25400000, spent: 8700000 },
  ]

  const sourceData = [
    { name: 'Facebook', value: 42, color: '#1877F2' },
    { name: 'TikTok', value: 28, color: '#000000' },
    { name: 'Google', value: 18, color: '#4285F4' },
    { name: 'KOL', value: 12, color: '#FF6B6B' },
  ]

  const conversionData = [
    { source: 'Facebook', conversions: 267, rate: 3.24 },
    { source: 'TikTok', conversions: 412, rate: 3.31 },
    { source: 'Google', conversions: 156, rate: 2.78 },
    { source: 'KOL', conversions: 198, rate: 4.12 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">
              Phân tích hiệu suất chiến dịch marketing
            </p>
          </div>
          <Select defaultValue="7d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">90 ngày qua</SelectItem>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫98.1M</div>
              <p className="text-xs text-green-600 mt-1">+18.2% vs tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng chi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₫32.0M</div>
              <p className="text-xs text-gray-600 mt-1">Budget: ₫50M</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ROI trung bình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">206.6%</div>
              <p className="text-xs text-green-600 mt-1">+12.4% vs tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,033</div>
              <p className="text-xs text-gray-600 mt-1">Rate: 3.35%</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu & Chi phí</CardTitle>
            <CardDescription>So sánh doanh thu và chi phí theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `₫${(value / 1000000).toFixed(1)}M`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Doanh thu"
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Chi phí"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo Source</CardTitle>
              <CardDescription>Traffic source distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion by Source */}
          <Card>
            <CardHeader>
              <CardTitle>Conversions theo Source</CardTitle>
              <CardDescription>Số lượng và tỷ lệ chuyển đổi</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversions" fill="#6366F1" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
