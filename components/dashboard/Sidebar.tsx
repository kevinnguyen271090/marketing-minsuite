'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Target,
  Lightbulb,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
  Link as LinkIcon,
  QrCode,
  Palette,
  Users,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Chiến dịch',
    href: '/dashboard/campaigns',
    icon: Target,
  },
  {
    name: 'Tracking Links',
    href: '/dashboard/tracking-links',
    icon: LinkIcon,
  },
  {
    name: 'QR Codes',
    href: '/dashboard/qr-codes',
    icon: QrCode,
  },
  {
    name: 'Creative Studio',
    href: '/dashboard/creatives',
    icon: Palette,
    children: [
      { name: 'AI Generator', href: '/dashboard/creatives/ai-generator' },
      { name: 'Thư viện', href: '/dashboard/creatives/library' },
      { name: 'Brand Assets', href: '/dashboard/creatives/brand-assets' },
    ]
  },
  {
    name: 'Campaign Engine',
    href: '/dashboard/tasks',
    icon: Calendar,
    children: [
      { name: 'Lịch chiến dịch', href: '/dashboard/tasks/calendar' },
      { name: 'Briefs', href: '/dashboard/tasks/briefs' },
      { name: 'Sự kiện', href: '/dashboard/tasks/events' },
    ]
  },
  {
    name: 'Strategic Planner',
    href: '/dashboard/goals',
    icon: Lightbulb,
    children: [
      { name: 'Mục tiêu', href: '/dashboard/goals' },
      { name: 'Kịch bản', href: '/dashboard/goals/scenarios' },
      { name: 'Dự báo nguồn lực', href: '/dashboard/goals/forecasts' },
    ]
  },
  {
    name: 'AI Copilot',
    href: '/dashboard/ai',
    icon: Sparkles,
    children: [
      { name: 'Truy vấn', href: '/dashboard/ai/query' },
      { name: 'Insights', href: '/dashboard/ai/insights' },
      { name: 'Anomalies', href: '/dashboard/ai/anomalies' },
    ]
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    name: 'Cài đặt',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">MinSuite</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )}
                />
                {item.name}
              </Link>

              {/* Sub-navigation */}
              {item.children && isActive && (
                <div className="ml-11 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block px-3 py-2 text-sm rounded-md transition-colors',
                        pathname === child.href
                          ? 'text-white bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-400">
          MinSuite v0.1.0
        </div>
      </div>
    </div>
  )
}
