'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TableRowActions } from '@/components/admin/table-row-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { AdminListPage } from '@/components/admin/list-page'
import { AdminDataTable } from '@/components/admin/data-table'
import { Plus, Eye, Edit, Trash2, Award } from 'lucide-react'
import { achievements } from '@/lib/mock-data'
import { SECONDARY_COLLEGES } from '@/lib/types'
import type { Achievement } from '@/lib/types'
import { PublicDisplaySwitch } from '@/components/shared/public-display-switch'

export default function AchievementsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeCollegeTab, setActiveCollegeTab] = useState('全部')

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          achievement.name.toLowerCase().includes(searchLower) ||
          achievement.description?.toLowerCase().includes(searchLower) ||
          achievement.partnerName?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (activeCollegeTab !== '全部') {
        const colleges = achievement.secondaryColleges || []
        if (!colleges.includes(activeCollegeTab)) return false
      }
      return true
    })
  }, [search, refreshKey, activeCollegeTab])

  const statusStats = useMemo(() => {
    return {
      total: achievements.length,
      draft: achievements.filter((a) => a.status === 'draft').length,
      published: achievements.filter((a) => a.status === 'published').length,
      archived: achievements.filter((a) => a.status === 'archived').length,
    }
  }, [achievements, refreshKey])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({})
    setActiveCollegeTab('全部')
  }

  const handleDeleteClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false)
    setSelectedAchievement(null)
  }

  const handleTogglePublicDisplay = (achievement: Achievement) => {
    achievement.isPublicDisplay = !(achievement.isPublicDisplay ?? true)
    achievement.updatedAt = new Date()
    setRefreshKey((prev) => prev + 1)
  }

  const stats = [
    { key: 'total', label: '全部成果', value: statusStats.total, icon: Award, color: 'slate' as const },
    { key: 'draft', label: '草稿', value: statusStats.draft, icon: Award, color: 'amber' as const },
    { key: 'published', label: '已发布', value: statusStats.published, icon: Award, color: 'green' as const },
    { key: 'archived', label: '已归档', value: statusStats.archived, icon: Award, color: 'slate' as const },
  ]

  const columns = [
    {
      key: 'name',
      title: '成果名称',
      render: (achievement: Achievement) => (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <Link href={`/admin/achievements/${achievement.id}`} className="font-medium hover:underline">
            {achievement.name}
          </Link>
        </div>
      ),
    },
    {
      key: 'display',
      title: '前台展示',
      render: (achievement: Achievement) => (
        <PublicDisplaySwitch
          checked={achievement.isPublicDisplay ?? true}
          onChange={() => handleTogglePublicDisplay(achievement)}
        />
      ),
    },
    { key: 'partner', title: '关联主体', render: (a: Achievement) => <span className="text-sm">{a.partnerName || '-'}</span> },
    { key: 'project', title: '关联项目', render: (a: Achievement) => <span className="text-sm">{a.projectName || '-'}</span> },
    { key: 'createdBy', title: '创建人', render: (a: Achievement) => <span className="text-sm">{a.createdBy || '-'}</span> },
    {
      key: 'publishDate',
      title: '发布时间',
      render: (a: Achievement) => <span className="text-sm">{a.publishDate.toLocaleDateString('zh-CN')}</span>,
    },
    {
      key: 'actions',
      title: '',
      width: 'w-[50px]',
      align: 'right' as const,
      render: (achievement: Achievement) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/achievements/${achievement.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/achievements/${achievement.id}/edit`}>
              <Edit className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDeleteClick(achievement)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <AdminListPage
      title="成果管理"
      subtitle="维护校企合作成果及前台展示"
      count={filteredAchievements.length}
      countLabel="个成果"
      stats={stats}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索成果名称、描述..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={[]}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      tabs={['全部', ...SECONDARY_COLLEGES].map((c) => ({ value: c, label: c }))}
      activeTab={activeCollegeTab}
      onTabChange={setActiveCollegeTab}
      actions={
        <Button asChild size="sm">
          <Link href="/admin/achievements/new">
            <Plus className="h-4 w-4 mr-1" />
            新增成果
          </Link>
        </Button>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredAchievements}
        rowKey={(a) => a.id}
        emptyText="暂无成果数据"
        emptyIcon={<Award className="h-10 w-10" />}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除成果「{selectedAchievement?.name}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
