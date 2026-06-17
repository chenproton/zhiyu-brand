'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableRowActions } from '@/components/admin/table-row-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminListPage } from '@/components/admin/list-page'
import { AdminDataTable } from '@/components/admin/data-table'
import { Calendar, Briefcase, FileText, Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { employmentProjects } from '@/lib/mock-data'
import { EMPLOYMENT_PROJECT_TYPE_LABELS, EMPLOYMENT_PROJECT_STATUS_LABELS } from '@/lib/types'

const statusColors: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
}

export default function EmploymentProjectsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    type: 'all',
    status: 'all',
  })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return employmentProjects.filter((ep) => {
      if (search && !ep.name.toLowerCase().includes(search.toLowerCase())) return false
      if (filters.type !== 'all' && ep.type !== filters.type) return false
      if (filters.status !== 'all' && ep.status !== filters.status) return false
      return true
    })
  }, [search, filters])

  const handleDelete = () => {
    if (deleteId) {
      const index = employmentProjects.findIndex((ep) => ep.id === deleteId)
      if (index !== -1) {
        employmentProjects.splice(index, 1)
      }
      setDeleteId(null)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({ type: 'all', status: 'all' })
  }

  const filterConfigs = [
    {
      key: 'type',
      label: '全部类型',
      options: [
        { value: 'spring', label: '春季招聘' },
        { value: 'autumn', label: '秋季招聘' },
        { value: '定向招聘', label: '定向招聘' },
        { value: 'order', label: '订单班招聘' },
        { value: 'other', label: '其他' },
      ],
    },
    {
      key: 'status',
      label: '全部状态',
      options: [
        { value: 'preparing', label: '筹备中' },
        { value: 'ongoing', label: '进行中' },
        { value: 'ended', label: '已结束' },
      ],
    },
  ]

  const stats = [
    { key: 'preparing', label: '筹备中', value: employmentProjects.filter((ep) => ep.status === 'preparing').length, icon: Calendar, color: 'amber' as const, filterKey: 'status', filterValue: 'preparing' },
    { key: 'ongoing', label: '进行中', value: employmentProjects.filter((ep) => ep.status === 'ongoing').length, icon: Briefcase, color: 'green' as const, filterKey: 'status', filterValue: 'ongoing' },
    { key: 'totalJobs', label: '岗位总数', value: employmentProjects.reduce((sum, ep) => sum + ep.jobCount, 0), icon: FileText, color: 'blue' as const },
  ]

  const columns = [
    { key: 'name', title: '项目名称', render: (ep: typeof employmentProjects[0]) => <span className="font-medium">{ep.name}</span> },
    { key: 'type', title: '类型', render: (ep: typeof employmentProjects[0]) => EMPLOYMENT_PROJECT_TYPE_LABELS[ep.type] },
    { key: 'target', title: '面向学生', render: (ep: typeof employmentProjects[0]) => ep.targetStudentGroups.join('、') },
    {
      key: 'dateRange',
      title: '时间范围',
      render: (ep: typeof employmentProjects[0]) => (
        <div className="text-sm text-muted-foreground">
          {ep.startDate.toLocaleDateString('zh-CN')} ~ {ep.endDate.toLocaleDateString('zh-CN')}
        </div>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (ep: typeof employmentProjects[0]) => (
        <Badge className={statusColors[ep.status]}>{EMPLOYMENT_PROJECT_STATUS_LABELS[ep.status]}</Badge>
      ),
    },
    {
      key: 'jobs',
      title: '岗位',
      render: (ep: typeof employmentProjects[0]) => (
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-3.5 w-3.5" />
          {ep.jobCount}
        </div>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: 'w-[50px]',
      align: 'right' as const,
      render: (ep: typeof employmentProjects[0]) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/jobs/project/${ep.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/employment/projects/${ep.id}`}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => setDeleteId(ep.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  const deletingProject = employmentProjects.find((ep) => ep.id === deleteId)

  return (
    <AdminListPage
      title="就业项目管理"
      subtitle="春招/秋招/定向招聘/其他的项目化管理"
      count={filtered.length}
      countLabel="个项目"
      stats={stats}
      statsColumns={3}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索项目名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <Button asChild size="sm">
          <Link href="/admin/employment/projects/new">
            <Plus className="h-4 w-4 mr-1" />
            新建项目
          </Link>
        </Button>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filtered}
        rowKey={(ep) => ep.id}
        emptyText="暂无就业项目"
      />

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>删除后无法恢复，是否继续？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
