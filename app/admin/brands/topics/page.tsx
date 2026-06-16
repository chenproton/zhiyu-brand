'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminPageHeader } from '@/components/admin/page-header'
import { AdminFilterBar } from '@/components/admin/filter-bar'
import { LayoutTemplate, Eye, Plus, Edit, Trash2, FileText, Image, Video, Link2 } from 'lucide-react'
import { FakeRichTextEditor } from '@/components/shared/fake-rich-text-editor'
import { brandTopics } from '@/lib/mock-data'
import { BRAND_STATUS_LABELS } from '@/lib/types'
import type { BrandTopic, BrandStatus } from '@/lib/types'

const layoutLabels: Record<string, string> = {
  grid: '网格布局',
  timeline: '时间线布局',
  magazine: '杂志布局',
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const emptyForm = {
  name: '',
  theme: '',
  description: '',
  layout: 'grid' as BrandTopic['layout'],
  isRecommended: false,
  status: 'draft' as BrandStatus,
}

export default function BrandTopicsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    status: 'all',
  })
  const [topics, setTopics] = useState<BrandTopic[]>([...brandTopics])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<BrandTopic | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    return topics.filter((topic) => {
      if (search && !topic.name.toLowerCase().includes(search.toLowerCase())) return false
      if (filters.status !== 'all' && topic.status !== filters.status) return false
      return true
    })
  }, [search, filters, topics])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({ status: 'all' })
  }

  const filterConfigs = [
    {
      key: 'status',
      label: '全部状态',
      options: [
        { value: 'draft', label: '草稿' },
        { value: 'pending', label: '待审核' },
        { value: 'published', label: '已发布' },
        { value: 'archived', label: '已归档' },
      ],
    },
  ]

  function openAddDialog() {
    setEditingTopic(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEditDialog(topic: BrandTopic) {
    setEditingTopic(topic)
    setForm({
      name: topic.name,
      theme: topic.theme,
      description: topic.description,
      layout: topic.layout,
      isRecommended: topic.isRecommended,
      status: topic.status,
    })
    setDialogOpen(true)
  }

  function handleSave() {
    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) =>
          t.id === editingTopic.id
            ? { ...t, ...form, updatedAt: new Date() }
            : t
        )
      )
    } else {
      const newTopic: BrandTopic = {
        id: generateId('bt'),
        name: form.name,
        theme: form.theme,
        description: form.description,
        layout: form.layout,
        content: [],
        relatedBrands: [],
        isRecommended: form.isRecommended,
        status: form.status,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTopics((prev) => [...prev, newTopic])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    if (confirm('确定要删除该专题页吗？')) {
      setTopics((prev) => prev.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="品牌专题页管理"
        subtitle="创建与运营品牌专题展示页"
        count={filtered.length}
        countLabel="个专题页"
        actions={
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-1" />
            新建专题页
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <AdminFilterBar
            searchPlaceholder="搜索专题名称..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={filterConfigs}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

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
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(topic)}>
                  <Edit className="h-4 w-4 mr-1" />
                  编辑
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={() => handleDelete(topic.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTopic ? '编辑专题页' : '新建专题页'}</DialogTitle>
            <DialogDescription>
              {editingTopic ? '修改品牌专题页信息' : '填写信息并创建新的品牌专题页'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bt-name">专题名称</Label>
              <Input
                id="bt-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="请输入专题名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bt-theme">主题</Label>
              <Input
                id="bt-theme"
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
                placeholder="请输入主题"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bt-desc">描述</Label>
              <FakeRichTextEditor
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="请输入专题描述"
                minHeight="120px"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bt-layout">布局</Label>
              <Select
                value={form.layout}
                onValueChange={(v) => setForm({ ...form, layout: v as BrandTopic['layout'] })}
              >
                <SelectTrigger id="bt-layout">
                  <SelectValue placeholder="选择布局" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">网格布局</SelectItem>
                  <SelectItem value="timeline">时间线布局</SelectItem>
                  <SelectItem value="magazine">杂志布局</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="bt-recommended"
                checked={form.isRecommended}
                onCheckedChange={(v) => setForm({ ...form, isRecommended: v })}
              />
              <Label htmlFor="bt-recommended">首页推荐</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bt-status">状态</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as BrandStatus })}
              >
                <SelectTrigger id="bt-status">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
