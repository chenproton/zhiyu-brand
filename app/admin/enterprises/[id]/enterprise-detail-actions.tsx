'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Link2, Search, Save, X } from 'lucide-react'
import { partners, projects } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'
import type { Achievement, ProjectPhase, ProjectSupportingResult, ProjectAgreement, ProjectPhaseItem } from '@/lib/types'
import { SupportingResultsTab } from '../../projects/_components/supporting-results-tab'

const PROJECT_TYPES = [
  '人才培养项目',
  '技术研发项目',
  '基地建设项目',
  '技能竞赛项目',
  '创新创业项目',
  '师资培训项目',
  '课程开发项目',
]

export function NewProjectButton({ defaultPartnerIds }: { defaultPartnerIds?: string[] }) {
  const router = useRouter()

  const handleClick = () => {
    const params = new URLSearchParams()
    if (defaultPartnerIds && defaultPartnerIds.length > 0) {
      defaultPartnerIds.forEach((id) => params.append('partnerId', id))
    }
    router.push(`/admin/projects/new?${params.toString()}`)
  }

  return (
    <Button size="sm" onClick={handleClick}>
      <Plus className="h-4 w-4 mr-1" />
      新增项目
    </Button>
  )
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

export function LinkAchievementButton({ availableAchievements }: { availableAchievements: Achievement[] }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('mine')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let result = availableAchievements
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
  }, [search, typeFilter, sourceFilter, availableAchievements])

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleLink = () => {
    if (selectedIds.size === 0) {
      alert('请先选择要关联的成果')
      return
    }
    alert(`已关联 ${selectedIds.size} 项成果（演示）`)
    setOpen(false)
    setSelectedIds(new Set())
    setSearch('')
    setTypeFilter('all')
    setSourceFilter('mine')
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Link2 className="h-4 w-4 mr-1" />
        关联成果
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[900px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>关联合作成果</DialogTitle>
            <DialogDescription>搜索并选择要关联到该企业的合作成果</DialogDescription>
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

            {filtered.length > 0 ? (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {filtered.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggle(achievement.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(achievement.id)}
                      onCheckedChange={() => toggle(achievement.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <Badge variant="secondary" className="text-[10px]">{achievement.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {achievement.publishDate.toLocaleDateString('zh-CN')} 发布 · {achievement.status === 'published' ? '已发布' : '草稿'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {search || typeFilter !== 'all' ? '未找到匹配的成果' : '暂无可关联的成果'}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedIds.size} 项
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); setSelectedIds(new Set()); setSearch(''); setTypeFilter('all'); setSourceFilter('mine') }}>
                  取消
                </Button>
                <Button size="sm" onClick={handleLink} disabled={selectedIds.size === 0}>
                  确认关联
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
