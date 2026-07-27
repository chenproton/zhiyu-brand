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
import { Calendar, Briefcase, FileText, Plus, Pencil, Trash2, Eye, Send, Check } from 'lucide-react'
import { employmentProjects, enterprises } from '@/lib/mock-data'
import { EMPLOYMENT_PROJECT_TYPE_LABELS, EMPLOYMENT_PROJECT_STATUS_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteProjectId, setInviteProjectId] = useState<string | null>(null)
  const [selectedEnterpriseIds, setSelectedEnterpriseIds] = useState<string[]>([])
  const [enterpriseCollegeFilter, setEnterpriseCollegeFilter] = useState('全部')

  const availableColleges = useMemo(() => {
    const set = new Set<string>()
    enterprises.forEach((e) => {
      e.secondaryColleges?.forEach((c) => set.add(c))
    })
    return ['全部', ...Array.from(set).sort()]
  }, [])

  const filteredEnterprises = useMemo(() => {
    if (enterpriseCollegeFilter === '全部') return enterprises
    return enterprises.filter((e) => e.secondaryColleges?.includes(enterpriseCollegeFilter))
  }, [enterpriseCollegeFilter])

  const toggleEnterprise = (id: string) => {
    setSelectedEnterpriseIds((current) =>
      current.includes(id) ? current.filter((eid) => eid !== id) : [...current, id]
    )
  }

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
            className="h-7 px-2 text-xs"
            onClick={() => {
              setSelectedEnterpriseIds(ep.partnerIds || [])
              setEnterpriseCollegeFilter('全部')
              setInviteProjectId(ep.id)
              setInviteDialogOpen(true)
            }}
          >
            <Send className="mr-1 h-3 w-3" />
            邀请企业
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

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>邀请企业</DialogTitle>
            <DialogDescription>选择要邀请参与该项目的企业</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 md:grid-cols-[1fr_1fr]">
            <div className="rounded-md border">
              <div className="p-2 border-b">
                <div className="text-sm font-medium mb-2">企业</div>
                <div className="flex flex-wrap gap-1.5">
                  {availableColleges.map((college) => (
                    <button
                      key={college}
                      type="button"
                      onClick={() => setEnterpriseCollegeFilter(college)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        enterpriseCollegeFilter === college
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {college}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filteredEnterprises
                  .filter((e) => !selectedEnterpriseIds.includes(e.id))
                  .map((enterprise) => (
                    <div
                      key={enterprise.id}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => toggleEnterprise(enterprise.id)}
                    >
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          selectedEnterpriseIds.includes(enterprise.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        )}
                      >
                        {selectedEnterpriseIds.includes(enterprise.id) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      <span className="text-sm">{enterprise.name}</span>
                    </div>
                  ))}
                {filteredEnterprises.filter((e) => !selectedEnterpriseIds.includes(e.id)).length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">无可选企业</div>
                )}
              </div>
            </div>
            <div className="rounded-md border">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <span className="text-sm font-medium">已选企业（{selectedEnterpriseIds.length}）</span>
                {selectedEnterpriseIds.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEnterpriseIds([])}>
                    清空
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {selectedEnterpriseIds.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">暂无选择</div>
                ) : (
                  selectedEnterpriseIds.map((id) => {
                    const enterprise = enterprises.find((e) => e.id === id)
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between rounded px-3 py-2 text-sm hover:bg-muted"
                      >
                        <span>{enterprise?.name}</span>
                        <button
                          onClick={() => toggleEnterprise(id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>取消</Button>
            <Button
              disabled={selectedEnterpriseIds.length === 0}
              onClick={() => {
                if (inviteProjectId) {
                  const ep = employmentProjects.find((p) => p.id === inviteProjectId)
                  if (ep) ep.partnerIds = [...selectedEnterpriseIds]
                }
                setInviteDialogOpen(false)
              }}
            >
              确认邀请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
