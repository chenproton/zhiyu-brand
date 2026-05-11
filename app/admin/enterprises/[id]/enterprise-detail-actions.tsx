'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Link2, Search } from 'lucide-react'
import type { Achievement } from '@/lib/types'

export function NewProjectButton() {
  return (
    <Button size="sm" asChild>
      <Link href="/admin/projects/new">
        <Plus className="h-4 w-4 mr-1" />
        新增项目
      </Link>
    </Button>
  )
}

export function LinkAchievementButton({ availableAchievements }: { availableAchievements: Achievement[] }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (!search) return availableAchievements
    const s = search.toLowerCase()
    return availableAchievements.filter((a) =>
      a.name.toLowerCase().includes(s) ||
      a.type.toLowerCase().includes(s) ||
      a.description.toLowerCase().includes(s)
    )
  }, [search, availableAchievements])

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索成果名称、类型、描述..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
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
                {search ? '未找到匹配的成果' : '暂无可关联的成果'}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedIds.size} 项
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
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
