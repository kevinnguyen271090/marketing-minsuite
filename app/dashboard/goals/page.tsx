'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Target, Plus, TrendingUp, DollarSign, Users, BarChart3, AlertCircle } from 'lucide-react'

export default function GoalsPage() {
  const [timeframe, setTimeframe] = useState('q1-2024')

  // Mock goals data
  const goals = [
    {
      id: '1',
      title: 'Revenue Goal Q1 2024',
      metric: 'REVENUE',
      target: 500000000,
      current: 334000000,
      progress: 66.8,
      status: 'ON_TRACK',
      deadline: '2024-03-31',
      owner: 'Marketing Team',
      subGoals: [
        { name: 'Facebook Ads Revenue', target: 200000000, current: 145000000 },
        { name: 'KOL Revenue', target: 150000000, current: 112000000 },
        { name: 'Google Ads Revenue', target: 100000000, current: 48000000 },
        { name: 'Event Revenue', target: 50000000, current: 29000000 },
      ],
    },
    {
      id: '2',
      title: 'Customer Acquisition Q1',
      metric: 'CUSTOMERS',
      target: 5000,
      current: 2856,
      progress: 57.1,
      status: 'AT_RISK',
      deadline: '2024-03-31',
      owner: 'Growth Team',
      subGoals: [
        { name: 'Organic Customers', target: 2000, current: 1245 },
        { name: 'Paid Ads Customers', target: 2000, current: 1156 },
        { name: 'Referral Customers', target: 1000, current: 455 },
      ],
    },
    {
      id: '3',
      title: 'Average ROI Target',
      metric: 'ROI',
      target: 200,
      current: 206.6,
      progress: 103.3,
      status: 'EXCEEDING',
      deadline: '2024-03-31',
      owner: 'Performance Team',
      subGoals: [
        { name: 'Facebook ROI', target: 150, current: 165.6 },
        { name: 'KOL ROI', target: 130, current: 144.6 },
        { name: 'Google ROI', target: 100, current: 57.2 },
      ],
    },
    {
      id: '4',
      title: 'Marketing Efficiency (CPA)',
      metric: 'CPA',
      target: 500000,
      current: 612000,
      progress: 81.7,
      status: 'AT_RISK',
      deadline: '2024-03-31',
      owner: 'Operations Team',
      subGoals: [
        { name: 'Facebook CPA', target: 450000, current: 520000 },
        { name: 'KOL CPA', target: 400000, current: 680000 },
        { name: 'Google CPA', target: 600000, current: 635000 },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      EXCEEDING: { variant: 'success' as const, label: 'Vượt mục tiêu', icon: TrendingUp },
      ON_TRACK: { variant: 'default' as const, label: 'Đúng tiến độ', icon: Target },
      AT_RISK: { variant: 'destructive' as const, label: 'Rủi ro', icon: AlertCircle },
      BEHIND: { variant: 'secondary' as const, label: 'Chậm tiến độ', icon: AlertCircle },
    }
    const { variant, label, icon: Icon } = config[status as keyof typeof config] || config.ON_TRACK
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getMetricIcon = (metric: string) => {
    const icons = {
      REVENUE: DollarSign,
      CUSTOMERS: Users,
      ROI: TrendingUp,
      CPA: BarChart3,
    }
    const Icon = icons[metric as keyof typeof icons] || Target
    return <Icon className="h-5 w-5" />
  }

  const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
      case 'REVENUE':
      case 'CPA':
        return `₫${(value / 1000000).toFixed(1)}M`
      case 'ROI':
        return `${value.toFixed(1)}%`
      case 'CUSTOMERS':
        return value.toLocaleString()
      default:
        return value.toString()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic Goals</h1>
            <p className="text-gray-500 mt-1">
              Theo dõi và quản lý mục tiêu chiến lược marketing
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2024">Q1 2024</SelectItem>
                <SelectItem value="q2-2024">Q2 2024</SelectItem>
                <SelectItem value="q3-2024">Q3 2024</SelectItem>
                <SelectItem value="q4-2024">Q4 2024</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm Goal
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-gray-600 mt-1">Active goals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                On Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {goals.filter(g => g.status === 'ON_TRACK').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Goals on track</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Exceeding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.status === 'EXCEEDING').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Above target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {goals.filter(g => g.status === 'AT_RISK').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg ${
                      goal.status === 'EXCEEDING' ? 'bg-green-100' :
                      goal.status === 'ON_TRACK' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      {getMetricIcon(goal.metric)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Owner: {goal.owner} • Deadline: {new Date(goal.deadline).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatMetricValue(goal.metric, goal.current)}
                      </span>
                      <span className="text-sm text-gray-500">
                        / {formatMetricValue(goal.metric, goal.target)}
                      </span>
                    </div>
                    <span className={`text-lg font-semibold ${
                      goal.progress >= 100 ? 'text-green-600' :
                      goal.progress >= 70 ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {goal.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        goal.progress >= 100 ? 'bg-green-500' :
                        goal.progress >= 70 ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Sub-goals */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Sub-goals breakdown:</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {goal.subGoals.map((subGoal, index) => {
                      const subProgress = (subGoal.current / subGoal.target) * 100
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {subGoal.name}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {subProgress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{formatMetricValue(goal.metric, subGoal.current)}</span>
                            <span>/ {formatMetricValue(goal.metric, subGoal.target)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: `${Math.min(subProgress, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Gợi ý tối ưu hóa để đạt mục tiêu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-medium text-gray-900 mb-2">⚠️ Customer Acquisition at Risk</h4>
              <p className="text-sm text-gray-600 mb-2">
                Goal đang chậm tiến độ (57.1%). Cần tăng 2,144 customers trong 45 ngày còn lại.
              </p>
              <p className="text-sm font-medium text-amber-600">
                💡 Đề xuất: Tăng budget cho Referral program thêm ₫20M để đạt target
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-medium text-gray-900 mb-2">⚠️ Marketing Efficiency (CPA) at Risk</h4>
              <p className="text-sm text-gray-600 mb-2">
                CPA hiện tại (₫612K) cao hơn target (₫500K). Cần tối ưu ₫112K.
              </p>
              <p className="text-sm font-medium text-amber-600">
                💡 Đề xuất: Pause Google Ads campaigns với CPA > ₫700K, focus vào Facebook
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-gray-900 mb-2">✅ ROI Target Exceeding</h4>
              <p className="text-sm text-gray-600 mb-2">
                ROI đang vượt target (206.6% vs 200%). Tuyệt vời!
              </p>
              <p className="text-sm font-medium text-green-600">
                💡 Đề xuất: Scale up các campaigns có ROI > 150% để maximize revenue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
