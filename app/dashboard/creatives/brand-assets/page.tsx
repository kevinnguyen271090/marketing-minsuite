'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Image, FileText, Palette, Download, FolderOpen, Plus } from 'lucide-react'

export default function BrandAssetsPage() {
  const [selectedFolder, setSelectedFolder] = useState('all')

  const folders = [
    { id: 'all', name: 'Tất cả Assets', count: 156, icon: FolderOpen },
    { id: 'logos', name: 'Logos', count: 24, icon: Image },
    { id: 'colors', name: 'Brand Colors', count: 8, icon: Palette },
    { id: 'fonts', name: 'Fonts', count: 12, icon: FileText },
    { id: 'templates', name: 'Templates', count: 45, icon: Image },
    { id: 'guidelines', name: 'Guidelines', count: 6, icon: FileText },
  ]

  const brandColors = [
    { name: 'Primary', hex: '#6366F1', rgb: 'rgb(99, 102, 241)', usage: 'Main brand color' },
    { name: 'Secondary', hex: '#8B5CF6', rgb: 'rgb(139, 92, 246)', usage: 'Accent color' },
    { name: 'Success', hex: '#10B981', rgb: 'rgb(16, 185, 129)', usage: 'Success states' },
    { name: 'Warning', hex: '#F59E0B', rgb: 'rgb(245, 158, 11)', usage: 'Warning states' },
    { name: 'Error', hex: '#EF4444', rgb: 'rgb(239, 68, 68)', usage: 'Error states' },
    { name: 'Dark', hex: '#1F2937', rgb: 'rgb(31, 41, 55)', usage: 'Text primary' },
    { name: 'Gray', hex: '#6B7280', rgb: 'rgb(107, 114, 128)', usage: 'Text secondary' },
    { name: 'Light', hex: '#F9FAFB', rgb: 'rgb(249, 250, 251)', usage: 'Backgrounds' },
  ]

  const logos = [
    { id: '1', name: 'Logo Primary', format: 'SVG', size: '2400x800', color: 'Color' },
    { id: '2', name: 'Logo White', format: 'SVG', size: '2400x800', color: 'White' },
    { id: '3', name: 'Logo Black', format: 'SVG', size: '2400x800', color: 'Black' },
    { id: '4', name: 'Logo Icon', format: 'SVG', size: '800x800', color: 'Color' },
    { id: '5', name: 'Logo Square', format: 'PNG', size: '1000x1000', color: 'Color' },
    { id: '6', name: 'Logo Horizontal', format: 'PNG', size: '3000x800', color: 'Color' },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Assets</h1>
            <p className="text-gray-500 mt-1">
              Quản lý tài sản thương hiệu và brand guidelines
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Asset
          </Button>
        </div>

        {/* Folders */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => {
            const Icon = folder.icon
            return (
              <Card
                key={folder.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedFolder === folder.id ? 'border-indigo-500 bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      selectedFolder === folder.id ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        selectedFolder === folder.id ? 'text-indigo-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-sm text-gray-500">{folder.count} items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Brand Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Brand Colors
            </CardTitle>
            <CardDescription>
              Bảng màu chính thức của thương hiệu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {brandColors.map((color) => (
                <div
                  key={color.name}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-24 w-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="p-4">
                    <p className="font-medium text-gray-900 mb-1">{color.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{color.usage}</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="w-full text-left p-2 bg-gray-50 rounded text-xs font-mono hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-500">HEX:</span> {color.hex}
                      </button>
                      <button
                        onClick={() => copyToClipboard(color.rgb)}
                        className="w-full text-left p-2 bg-gray-50 rounded text-xs font-mono hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-500">RGB:</span> {color.rgb}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo Variations
            </CardTitle>
            <CardDescription>
              Logo chính thức với các phiên bản khác nhau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {logos.map((logo) => (
                <Card key={logo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b">
                    <div className="text-gray-400 text-center">
                      <Image className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-xs">{logo.name}</p>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{logo.name}</h3>
                      <Badge variant="outline">{logo.format}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{logo.size}</span>
                      <span>{logo.color}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Typography
            </CardTitle>
            <CardDescription>
              Font chữ chính thức của thương hiệu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Inter</h3>
                <Badge>Primary Font</Badge>
              </div>
              <div className="space-y-3">
                <div className="font-bold text-3xl">The quick brown fox jumps over the lazy dog</div>
                <div className="font-semibold text-2xl">The quick brown fox jumps over the lazy dog</div>
                <div className="font-medium text-xl">The quick brown fox jumps over the lazy dog</div>
                <div className="font-normal text-base">The quick brown fox jumps over the lazy dog</div>
                <div className="font-light text-sm">The quick brown fox jumps over the lazy dog</div>
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                <Download className="mr-2 h-4 w-4" />
                Download Font Family
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle>📘 Brand Guidelines</CardTitle>
            <CardDescription>
              Hướng dẫn sử dụng tài sản thương hiệu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-2">Logo Usage</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Luôn giữ khoảng trống tối thiểu xung quanh logo</li>
                <li>Không thay đổi màu sắc logo ngoài các phiên bản được phê duyệt</li>
                <li>Không biến dạng, xoay hoặc thêm hiệu ứng vào logo</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-2">Color Guidelines</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Sử dụng Primary color cho CTA và các element quan trọng</li>
                <li>Secondary color cho accent và decoration</li>
                <li>Đảm bảo contrast ratio tối thiểu 4.5:1 cho text</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-2">Typography Rules</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Sử dụng Inter cho tất cả digital content</li>
                <li>Heading size từ 24px trở lên, body text từ 14px</li>
                <li>Line height tối thiểu 1.5 cho body text</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
