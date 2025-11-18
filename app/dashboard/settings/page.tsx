'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { User, Bell, Lock, CreditCard, Globe, Save } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Quản lý cài đặt tài khoản và tổ chức
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        defaultValue={session?.user?.name || ''}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={session?.user?.email || ''}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Công ty</Label>
                    <Input id="company" placeholder="Tên công ty" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="+84 xxx xxx xxx" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="asia-ho-chi-minh">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia-ho-chi-minh">Asia/Ho Chi Minh (GMT+7)</SelectItem>
                        <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                        <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Quản lý cách bạn nhận thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Nhận email khi có cập nhật quan trọng</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Campaign Alerts</p>
                      <p className="text-sm text-gray-500">Cảnh báo khi campaign có vấn đề</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Budget Alerts</p>
                      <p className="text-sm text-gray-500">Thông báo khi budget gần đạt giới hạn</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Reports</p>
                      <p className="text-sm text-gray-500">Báo cáo tổng hợp hàng tuần</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5" />
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Cập nhật mật khẩu của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Mật khẩu mới</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Đổi mật khẩu</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Tăng cường bảo mật tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">2FA Status</p>
                        <p className="text-sm text-gray-500">Chưa kích hoạt</p>
                      </div>
                      <Button variant="outline">Kích hoạt 2FA</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>
                      Quản lý gói dịch vụ của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Professional Plan</p>
                        <p className="text-sm text-gray-500">₫2,000,000 / tháng</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>✓ Unlimited campaigns</p>
                      <p>✓ Advanced analytics</p>
                      <p>✓ AI features</p>
                      <p>✓ Priority support</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Nâng cấp</Button>
                      <Button variant="outline">Hủy đăng ký</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Quản lý phương thức thanh toán
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Visa •••• 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/2025</p>
                          </div>
                        </div>
                        <Badge variant="outline">Default</Badge>
                      </div>
                    </div>
                    <Button variant="outline">Thêm phương thức mới</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'integrations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Kết nối với các nền tảng khác
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Facebook Ads</p>
                        <p className="text-sm text-gray-500">Kết nối với Facebook Business Manager</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Google Ads</p>
                        <p className="text-sm text-gray-500">Đồng bộ campaigns từ Google Ads</p>
                      </div>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">TikTok Ads</p>
                        <p className="text-sm text-gray-500">Quản lý TikTok advertising</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
