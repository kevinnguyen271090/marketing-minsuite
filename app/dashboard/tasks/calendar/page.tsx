'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)) // February 2024
  const [viewType, setViewType] = useState('month')

  // Mock calendar events
  const events = [
    {
      id: '1',
      title: 'Launch Tết 2024 Campaign',
      type: 'LAUNCH',
      campaign: 'Tết 2024 - Facebook Ads',
      date: '2024-02-05',
      time: '09:00',
      assignee: 'Nguyễn Văn A',
      status: 'completed',
    },
    {
      id: '2',
      title: 'KOL Content Review',
      type: 'REVIEW',
      campaign: 'KOL Campaign',
      date: '2024-02-08',
      time: '14:00',
      assignee: 'Trần Thị B',
      status: 'in-progress',
    },
    {
      id: '3',
      title: 'Campaign Performance Meeting',
      type: 'MEETING',
      campaign: 'Multiple',
      date: '2024-02-12',
      time: '10:00',
      assignee: 'Team',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Q1 Budget Review',
      type: 'REVIEW',
      campaign: 'All Campaigns',
      date: '2024-02-15',
      time: '15:00',
      assignee: 'Lê Văn C',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Creative Assets Deadline',
      type: 'DEADLINE',
      campaign: 'Valentine Campaign',
      date: '2024-02-10',
      time: '17:00',
      assignee: 'Creative Team',
      status: 'in-progress',
    },
    {
      id: '6',
      title: 'Valentine Campaign Launch',
      type: 'LAUNCH',
      campaign: 'Valentine 2024',
      date: '2024-02-14',
      time: '00:00',
      assignee: 'Marketing Team',
      status: 'pending',
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEventTypeBadge = (type: string) => {
    const config = {
      LAUNCH: { variant: 'success' as const, label: 'Launch' },
      REVIEW: { variant: 'default' as const, label: 'Review' },
      MEETING: { variant: 'secondary' as const, label: 'Meeting' },
      DEADLINE: { variant: 'destructive' as const, label: 'Deadline' },
    }
    const { variant, label } = config[type as keyof typeof config] || { variant: 'outline' as const, label: type }
    return <Badge variant={variant} className="text-xs">{label}</Badge>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300'
      case 'in-progress': return 'bg-blue-100 border-blue-300'
      case 'pending': return 'bg-gray-100 border-gray-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Calendar</h1>
            <p className="text-gray-500 mt-1">
              Lịch trình và deadline các chiến dịch marketing
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Events tháng này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-gray-600 mt-1">6 events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đang进行
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-gray-600 mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sắp tới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-gray-600 mt-1">Pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hoàn thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">1</div>
              <p className="text-xs text-gray-600 mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl">
                  {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tháng</SelectItem>
                  <SelectItem value="week">Tuần</SelectItem>
                  <SelectItem value="day">Ngày</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-24 bg-gray-50 rounded-lg" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayEvents = getEventsForDate(day)
                const isToday = day === 12 && currentDate.getMonth() === 1 // Mock today as Feb 12

                return (
                  <div
                    key={day}
                    className={`min-h-24 p-2 border rounded-lg ${
                      isToday ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-indigo-600' : 'text-gray-900'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border ${getStatusColor(event.status)} cursor-pointer hover:shadow-sm`}
                          title={event.title}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>Danh sách events trong 7 ngày tới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter(e => e.status !== 'completed')
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(event => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-center min-w-12">
                        <div className="text-2xl font-bold text-indigo-600">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Th{new Date(event.date).getMonth() + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          {getEventTypeBadge(event.type)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.campaign}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {event.assignee}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={event.status === 'in-progress' ? 'default' : 'outline'}>
                      {event.status === 'in-progress' ? 'Đang tiến hành' : 'Sắp tới'}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
