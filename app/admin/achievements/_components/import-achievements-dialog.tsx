'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Search, Link2 } from 'lucide-react'
import { achievements } from '@/lib/mock-data'
import { ACHIEVEMENT_TYPE_LABELS } from '@/lib/types'
import type { AchievementType } from '@/lib/types'

const TYPE_TABS: { value: AchievementType | 'all'; label: string }[] = [
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

export function ImportAchievementsButton() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AchievementType | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('mine')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let result = achievements
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter)
    }
    // 模拟来源筛选：按 id 取模分配来源
    result = result.filter((a) => {
      const hash = a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const sourceMap: Record<number, string> = { 0: 'mine', 1: 'joint', 2: 'public' }
      return sourceMap[hash % 3] === sourceFilter
    })
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((a) =>
        a.name.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s)
      )
    }
    return result
  }, [search, typeFilter, sourceFilter])

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleImport = () => {
    if (selectedIds.size === 0) {
      alert('请先选择要引用的成果')
      return
    }
    alert(`已引用 ${selectedIds.size} 项成果（演示）`)
    setOpen(false)
    setSelectedIds(new Set())
    setSearch('')
    setTypeFilter('all')
    setSourceFilter('all')
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Link2 className="h-4 w-4 mr-2" />
        引用成果
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[900px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>引用成果</DialogTitle>
            <DialogDescription>从成果库中选择要引用的成果</DialogDescription>
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
                placeholder="搜索成果名称、描述..."
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
            {filtered.length > 0 ? (
              <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
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
                        <Badge variant="secondary" className="text-[10px]">
                          {ACHIEVEMENT_TYPE_LABELS[achievement.type]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                      {achievement.partnerName && (
                        <p className="text-xs text-muted-foreground mt-0.5">{achievement.partnerName}</p>
                      )}
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
            <Button variant="outline" onClick={() => { setOpen(false); setSelectedIds(new Set()); setSearch(''); setTypeFilter('all'); setSourceFilter('mine') }}>
              取消
            </Button>
            <Button onClick={handleImport} disabled={selectedIds.size === 0}>
              引用 ({selectedIds.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
