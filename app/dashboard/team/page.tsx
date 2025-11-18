'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { UserPlus, Search, Mail, MoreVertical, Shield } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Mock team members data
  const teamMembers = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'OWNER',
      avatar: '',
      lastActive: '2024-02-16',
      joinedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'ADMIN',
      avatar: '',
      lastActive: '2024-02-16',
      joinedAt: '2024-01-05',
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'MEMBER',
      avatar: '',
      lastActive: '2024-02-15',
      joinedAt: '2024-01-10',
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      role: 'MEMBER',
      avatar: '',
      lastActive: '2024-02-14',
      joinedAt: '2024-01-15',
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      role: 'VIEWER',
      avatar: '',
      lastActive: '2024-02-13',
      joinedAt: '2024-02-01',
    },
  ]

  const pendingInvites = [
    {
      id: '1',
      email: 'newuser@example.com',
      role: 'MEMBER',
      invitedBy: 'Nguyễn Văn A',
      invitedAt: '2024-02-15',
    },
  ]

  const getRoleBadge = (role: string) => {
    const config = {
      OWNER: { variant: 'destructive' as const, label: 'Owner', icon: Shield },
      ADMIN: { variant: 'default' as const, label: 'Admin', icon: Shield },
      MEMBER: { variant: 'secondary' as const, label: 'Member', icon: null },
      VIEWER: { variant: 'outline' as const, label: 'Viewer', icon: null },
    }
    const { variant, label, icon: Icon } = config[role as keyof typeof config] || config.MEMBER
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </Badge>
    )
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-500 mt-1">
              Quản lý thành viên và quyền truy cập
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Mời thành viên
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-gray-600 mt-1">Active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {teamMembers.filter(m => m.role === 'ADMIN' || m.role === 'OWNER').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Admin users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {teamMembers.filter(m => m.role === 'MEMBER').length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Regular members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Invites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingInvites.length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Awaiting acceptance</p>
            </CardContent>
          </Card>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle>Mời thành viên mới</CardTitle>
              <CardDescription>
                Gửi lời mời tham gia team qua email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input placeholder="email@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <Select defaultValue="MEMBER">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin - Full access</SelectItem>
                    <SelectItem value="MEMBER">Member - Can create & edit</SelectItem>
                    <SelectItem value="VIEWER">Viewer - Read only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi lời mời
                </Button>
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
              <CardDescription>
                Lời mời đang chờ chấp nhận
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingInvites.map(invite => (
                  <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <div>
                      <p className="font-medium text-gray-900">{invite.email}</p>
                      <p className="text-sm text-gray-500">
                        Invited by {invite.invitedBy} • {new Date(invite.invitedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getRoleBadge(invite.role)}
                      <Button variant="outline" size="sm">Resend</Button>
                      <Button variant="ghost" size="sm">Cancel</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {filteredMembers.length} members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm thành viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500">
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Last Active</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getRoleBadge(member.role)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(member.lastActive).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
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
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>View Activity</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle>🔐 Role Permissions</CardTitle>
            <CardDescription>
              Quyền hạn của từng vai trò
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-gray-900">Owner</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Full system access</li>
                <li>✓ Manage team members</li>
                <li>✓ Manage billing</li>
                <li>✓ Delete organization</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-indigo-600" />
                <h4 className="font-semibold text-gray-900">Admin</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Manage campaigns</li>
                <li>✓ Invite members</li>
                <li>✓ View analytics</li>
                <li>✓ Manage settings</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-900">Member</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Create campaigns</li>
                <li>✓ Edit assigned campaigns</li>
                <li>✓ View analytics</li>
                <li>✗ Cannot invite members</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-gray-900">Viewer</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ View campaigns</li>
                <li>✓ View analytics</li>
                <li>✗ Cannot create/edit</li>
                <li>✗ Cannot invite members</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
