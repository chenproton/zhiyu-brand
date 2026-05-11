'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LayoutTemplate, Eye, Plus, FileText, Image, Video, Link2 } from 'lucide-react'
import { brandTopics } from '@/lib/mock-data'
import { BRAND_STATUS_LABELS } from '@/lib/types'

const layoutLabels: Record<string, string> = {
  grid: '网格布局',
  timeline: '时间线布局',
  magazine: '杂志布局',
}

export default function BrandTopicsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    return brandTopics.filter((topic) => {
      if (search && !topic.name.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'all' && topic.status !== statusFilter) return false
      return true
    })
  }, [search, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">品牌专题页管理</h1>
          <p className="text-muted-foreground">创建与运营品牌专题展示页</p>
        </div>
        <Button onClick={() => alert('新建专题页功能开发中')}>
          <Plus className="h-4 w-4 mr-2" />
          新建专题页
        </Button>
      </div>

      {/* 筛选 */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="搜索专题名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="发布状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="archived">已归档</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 专题列表 */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{topic.name}</CardTitle>
                  <CardDescription className="mt-1">{topic.theme}</CardDescription>
                </div>
                <div className="flex gap-1">
                  {topic.isRecommended && (
                    <Badge variant="secondary" className="text-xs">首页推荐</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {BRAND_STATUS_LABELS[topic.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <LayoutTemplate className="h-4 w-4" />
                  {layoutLabels[topic.layout]}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {topic.viewCount} 次浏览
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {topic.content.map((item, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {item.type === 'text' && <FileText className="h-3 w-3 mr-1" />}
                    {item.type === 'image' && <Image className="h-3 w-3 mr-1" />}
                    {item.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                    {item.type === 'link' && <Link2 className="h-3 w-3 mr-1" />}
                    {item.type === 'text' ? '文本' : item.type === 'image' ? '图片' : item.type === 'video' ? '视频' : '链接'}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('预览功能开发中')}>
                  <Eye className="h-4 w-4 mr-1" />
                  预览
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('编辑功能开发中')}>
                  编辑
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
