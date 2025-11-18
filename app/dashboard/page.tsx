import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, MousePointerClick, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  // Mock data - will be replaced with real data from API
  const stats = [
    {
      name: 'Tổng chiến dịch',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Target,
    },
    {
      name: 'Lượt click',
      value: '24,531',
      change: '+12.5%',
      changeType: 'positive',
      icon: MousePointerClick,
    },
    {
      name: 'Tỷ lệ chuyển đổi',
      value: '3.24%',
      change: '+0.5%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'Doanh thu',
      value: '₫152M',
      change: '+18.2%',
      changeType: 'positive',
      icon: DollarSign,
    },
  ]

  const recentCampaigns = [
    {
      id: 1,
      name: 'Tết 2024 - Facebook Ads',
      status: 'ACTIVE',
      clicks: 8234,
      conversions: 267,
      revenue: 45200000,
    },
    {
      id: 2,
      name: 'KOL Campaign - TikTok',
      status: 'ACTIVE',
      clicks: 12450,
      conversions: 412,
      revenue: 68500000,
    },
    {
      id: 3,
      name: 'Google Ads - Brand Awareness',
      status: 'PAUSED',
      clicks: 5621,
      conversions: 156,
      revenue: 28300000,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Chào mừng trở lại! Đây là tổng quan chiến dịch marketing của bạn.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} so với tháng trước
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Chiến dịch gần đây</CardTitle>
            <CardDescription>
              Danh sách chiến dịch đang chạy và hiệu suất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {campaign.name}
                      </h3>
                      <Badge
                        variant={campaign.status === 'ACTIVE' ? 'success' : 'secondary'}
                      >
                        {campaign.status === 'ACTIVE' ? 'Đang chạy' : 'Tạm dừng'}
                      </Badge>
                    </div>
                    <div className="flex gap-6 mt-2 text-sm text-gray-600">
                      <span>{campaign.clicks.toLocaleString()} clicks</span>
                      <span>{campaign.conversions} conversions</span>
                      <span className="text-green-600 font-medium">
                        ₫{(campaign.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Xem chi tiết →
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Tạo chiến dịch mới</CardTitle>
              <CardDescription>
                Bắt đầu chiến dịch marketing mới
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Tạo tracking link</CardTitle>
              <CardDescription>
                Tạo link theo dõi cho chiến dịch
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">AI Content Generator</CardTitle>
              <CardDescription>
                Tạo nội dung với AI
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
