'use client'

import { useState, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, X, Search, Link2, Eye, Pencil, Upload, FileText } from 'lucide-react'
import Link from 'next/link'
import { achievements } from '@/lib/mock-data'
import { SECONDARY_COLLEGES } from '@/lib/types'

const ACHIEVEMENT_TYPE_LABELS: Record<string, string> = {
  job: '岗位',
  scene: '场景',
  course: '课程',
  custom: '自定义',
}

const TYPE_TABS: { value: string; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'job', label: '岗位' },
  { value: 'scene', label: '场景' },
  { value: 'course', label: '课程' },
]

const SOURCE_TABS = [
  { value: 'mine', label: '我的' },
  { value: 'joint', label: '共建' },
  { value: 'public', label: '公共' },
] as const

interface AchievementItem {
  id: string
  name: string
  type: string
  description: string
  createdAt: Date
  attachments?: string[]
  secondaryColleges?: string[]
}

interface AchievementManagerProps {
  items: AchievementItem[]
  onChange: (items: AchievementItem[]) => void
  title?: string
  description?: string
}

export function AchievementManager({
  items,
  onChange,
  title = '成果管理',
  description = '添加自定义成果或引用成果库中的成果',
}: AchievementManagerProps) {
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('mine')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [customForm, setCustomForm] = useState({
    name: '',
    type: '',
    description: '',
    attachments: [] as string[],
    secondaryColleges: [] as string[],
  })

  const filteredAchievements = useMemo(() => {
    let result = achievements
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter)
    }
    // 模拟来源筛选
    result = result.filter((a) => {
      const hash = a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const sourceMap: Record<number, string> = { 0: 'mine', 1: 'joint', 2: 'public' }
      return sourceMap[hash % 3] === sourceFilter
    })
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((a) =>
        a.name.toLowerCase().includes(s) ||
        a.type.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s)
      )
    }
    return result
  }, [search, typeFilter, sourceFilter])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files).map((f) => f.name)
    setCustomForm((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newFiles],
    }))
    e.target.value = ''
  }

  const handleRemoveAttachment = (index: number) => {
    setCustomForm((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }))
  }

  const addCustom = () => {
    if (!customForm.name.trim()) return
    const item: AchievementItem = {
      id: `custom_${Date.now()}`,
      name: customForm.name.trim(),
      type: customForm.type.trim() || '自定义',
      description: customForm.description.trim(),
      createdAt: new Date(),
      attachments: customForm.attachments,
      secondaryColleges: customForm.secondaryColleges.length > 0 ? customForm.secondaryColleges : undefined,
    }
    onChange([...items, item])
    setCustomForm({ name: '', type: '', description: '', attachments: [], secondaryColleges: [] })
    setCustomDialogOpen(false)
  }

  const removeItem = (id: string) => {
    onChange(items.filter((r) => r.id !== id))
  }

  const toggleAchievement = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleLink = () => {
    if (selectedIds.size === 0) {
      alert('请先选择要引用的成果')
      return
    }
    const newItems: AchievementItem[] = []
    selectedIds.forEach((id) => {
      const ach = achievements.find((a) => a.id === id)
      if (ach && !items.some((r) => r.id === ach.id)) {
        newItems.push({
          id: ach.id,
          name: ach.name,
          type: ACHIEVEMENT_TYPE_LABELS[ach.type] || ach.type,
          description: ach.description,
          createdAt: ach.createdAt,
        })
      }
    })
    onChange([...items, ...newItems])
    setLinkDialogOpen(false)
    setSelectedIds(new Set())
    setSearch('')
    setTypeFilter('all')
    setSourceFilter('mine')
  }

  return (
    <>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setCustomDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          添加自定义成果
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setLinkDialogOpen(true)}>
          <Link2 className="h-4 w-4 mr-1" />
          引用成果库
        </Button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => {
            const libraryAch = achievements.find((a) => a.id === item.id)
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.name}</p>
                    <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {libraryAch && (
                    libraryAch.type === 'custom' ? (
                      <>
                        <Link href={`/admin/achievements/${item.id}`}>
                          <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => alert("编辑功能开发中")}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                      </>
                    ) : (
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => alert('跳转到对应系统中查看')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )
                  )}
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 添加自定义成果弹窗 */}
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>添加自定义成果</DialogTitle>
            <DialogDescription>填写自定义成果信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>成果名称 *</Label>
              <Input
                value={customForm.name}
                onChange={(e) => setCustomForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入成果名称"
              />
            </div>
            <div className="space-y-2">
              <Label>成果类型</Label>
              <Input
                value={customForm.type}
                onChange={(e) => setCustomForm((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="如：岗位、场景、课程"
              />
            </div>
            <div className="space-y-2">
              <Label>关联二级学院</Label>
              <div className="flex flex-wrap gap-2">
                {SECONDARY_COLLEGES.map((college) => (
                  <Badge
                    key={college}
                    variant={customForm.secondaryColleges.includes(college) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() =>
                      setCustomForm((prev) => ({
                        ...prev,
                        secondaryColleges: prev.secondaryColleges.includes(college)
                          ? prev.secondaryColleges.filter((c) => c !== college)
                          : [...prev.secondaryColleges, college],
                      }))
                    }
                  >
                    {college}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">点击标签进行选择，支持多选</p>
            </div>
            <div className="space-y-2">
              <Label>成果描述</Label>
              <Textarea
                value={customForm.description}
                onChange={(e) => setCustomForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="请输入成果描述"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>成果佐证材料上传</Label>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg hover:bg-muted transition-colors"
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">点击上传附件</span>
              </button>
              {customForm.attachments && customForm.attachments.length > 0 && (
                <div className="space-y-2">
                  {customForm.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{file}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="ml-2 hover:text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomDialogOpen(false)}>取消</Button>
            <Button onClick={addCustom} disabled={!customForm.name.trim()}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 引用成果库弹窗 */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[900px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>引用成果库</DialogTitle>
            <DialogDescription>搜索并选择要引用的合作成果（岗位、场景、课程）</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* 一级分类：全部/岗位/场景/课程 */}
            <div className="flex gap-2">
              {TYPE_TABS.map((tab) => (
                <Button
                  key={tab.value}
                  variant={typeFilter === tab.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索成果名称、类型、描述..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 二级分类：我的/共建/公共 */}
            <div className="flex gap-2 border-t pt-3">
              {SOURCE_TABS.map((tab) => (
                <Button
                  key={tab.value}
                  variant={sourceFilter === tab.value ? 'secondary' : 'ghost'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSourceFilter(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* 成果列表 */}
            {filteredAchievements.length > 0 ? (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {filteredAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleAchievement(achievement.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(achievement.id)}
                      onCheckedChange={() => toggleAchievement(achievement.id)}
                      className="mt-0.5 pointer-events-none"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <Badge variant="secondary" className="text-[10px]">
                          {ACHIEVEMENT_TYPE_LABELS[achievement.type] || achievement.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">未找到匹配的成果</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setLinkDialogOpen(false); setSelectedIds(new Set()); setSearch(''); setTypeFilter('all'); setSourceFilter('mine') }}>
              取消
            </Button>
            <Button onClick={handleLink} disabled={selectedIds.size === 0}>
              引用 ({selectedIds.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
