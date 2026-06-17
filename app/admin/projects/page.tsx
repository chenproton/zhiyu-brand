'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TableRowActions } from '@/components/admin/table-row-actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { AdminListPage } from '@/components/admin/list-page'
import { AdminDataTable } from '@/components/admin/data-table'
import { ProjectPhaseBadge } from '@/components/shared/status-badge'
import { Plus, Eye, Pencil, Trash2, FolderKanban, Tag, Folder, Play, CheckCircle, Archive, XCircle } from 'lucide-react'
import { projects, enterprises } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS, SECONDARY_COLLEGES } from '@/lib/types'
import type { ProjectPhase } from '@/lib/types'
import CooperationTypeManager from '@/components/admin/cooperation-type-manager'
import { PublicDisplaySwitch } from '@/components/shared/public-display-switch'

const PROJECT_TYPES = [
  '人才培养项目',
  '技术研发项目',
  '基地建设项目',
  '技能竞赛项目',
  '创新创业项目',
  '师资培训项目',
  '课程开发项目',
]

export default function ProjectsListPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    phase: 'all',
    type: 'all',
    publishStatus: 'all',
  })
  const [cooperationTypeDialogOpen, setCooperationTypeDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeCollegeTab, setActiveCollegeTab] = useState('全部')

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.partnerName.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (filters.phase !== 'all' && project.phase !== filters.phase) return false
      if (filters.type !== 'all' && project.type !== filters.type) return false
      if (filters.publishStatus !== 'all' && project.publishStatus !== filters.publishStatus) return false
      if (activeCollegeTab !== '全部') {
        const colleges = project.secondaryColleges || []
        if (!colleges.includes(activeCollegeTab)) return false
      }
      return true
    })
  }, [search, filters, refreshKey, activeCollegeTab])

  const phaseStats = useMemo(() => {
    return {
      initiation: projects.filter((p) => p.phase === 'initiation').length,
      execution: projects.filter((p) => p.phase === 'execution').length,
      acceptance: projects.filter((p) => p.phase === 'acceptance').length,
      closure: projects.filter((p) => p.phase === 'closure').length,
      archived: projects.filter((p) => p.phase === 'archived').length,
      terminated: projects.filter((p) => p.phase === 'terminated').length,
    }
  }, [projects, refreshKey])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      phase: 'all',
      type: 'all',
      publishStatus: 'all',
    })
    setActiveCollegeTab('全部')
  }

  const handleTogglePublicDisplay = (project: typeof projects[0]) => {
    const enterprise = enterprises.find((e) => e.id === project.partnerId)
    if (!enterprise) return
    enterprise.isPublicDisplay = !enterprise.isPublicDisplay
    enterprise.updatedAt = new Date()
    setRefreshKey((prev) => prev + 1)
  }

  const getMilestoneProgress = (milestones: typeof projects[0]['milestones']) => {
    if (!milestones || milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.status === 'completed').length
    return Math.round((completed / milestones.length) * 100)
  }

  const filterConfigs = [
    {
      key: 'phase',
      label: '全部阶段',
      options: Object.entries(PROJECT_PHASE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'type',
      label: '全部类型',
      options: PROJECT_TYPES.map((type) => ({ value: type, label: type })),
    },
  ]

  const stats = [
    { key: 'initiation', label: '立项阶段', value: phaseStats.initiation, icon: ClipboardListIcon, color: 'blue' as const, filterKey: 'phase', filterValue: 'initiation' },
    { key: 'execution', label: '执行阶段', value: phaseStats.execution, icon: Play, color: 'indigo' as const, filterKey: 'phase', filterValue: 'execution' },
    { key: 'acceptance', label: '验收阶段', value: phaseStats.acceptance, icon: CheckCircle, color: 'purple' as const, filterKey: 'phase', filterValue: 'acceptance' },
    { key: 'closure', label: '结项阶段', value: phaseStats.closure, icon: Folder, color: 'green' as const, filterKey: 'phase', filterValue: 'closure' },
    { key: 'archived', label: '已归档', value: phaseStats.archived, icon: Archive, color: 'slate' as const, filterKey: 'phase', filterValue: 'archived' },
    { key: 'terminated', label: '已终止', value: phaseStats.terminated, icon: XCircle, color: 'red' as const, filterKey: 'phase', filterValue: 'terminated' },
  ]

  const columns = [
    {
      key: 'name',
      title: '项目名称',
      render: (project: typeof projects[0]) => (
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <Link href={`/admin/projects/${project.id}`} className="font-medium hover:underline">
            {project.name}
          </Link>
        </div>
      ),
    },
    {
      key: 'display',
      title: '前台展示',
      render: (project: typeof projects[0]) => {
        const enterprise = enterprises.find((e) => e.id === project.partnerId)
        return (
          <PublicDisplaySwitch
            checked={enterprise?.isPublicDisplay ?? true}
            onChange={() => handleTogglePublicDisplay(project)}
          />
        )
      },
    },
    {
      key: 'partner',
      title: '合作主体',
      render: (project: typeof projects[0]) => (
        <Link href={`/admin/partners/${project.partnerId}`} className="hover:underline">
          {project.partnerName}
        </Link>
      ),
    },
    {
      key: 'type',
      title: '合作类型',
      render: (p: typeof projects[0]) => p.type,
    },
    {
      key: 'dateRange',
      title: '起止时间',
      render: (p: typeof projects[0]) => (
        <div className="text-sm">
          <div>{p.startDate.toLocaleDateString('zh-CN')}</div>
          <div className="text-muted-foreground">至 {p.endDate.toLocaleDateString('zh-CN')}</div>
        </div>
      ),
    },
    {
      key: 'progress',
      title: '里程碑进度',
      render: (p: typeof projects[0]) => {
        const progress = getMilestoneProgress(p.milestones)
        return (
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-20 h-2" />
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        )
      },
    },
    {
      key: 'phase',
      title: '阶段',
      render: (p: typeof projects[0]) => <ProjectPhaseBadge phase={p.phase} />,
    },
    { key: 'createdBy', title: '创建人', render: (p: typeof projects[0]) => <span className="text-sm">{p.createdBy || '-'}</span> },
    { key: 'createdAt', title: '创建时间', render: (p: typeof projects[0]) => <span className="text-sm">{p.createdAt.toLocaleDateString('zh-CN')}</span> },
    { key: 'updatedAt', title: '更新时间', render: (p: typeof projects[0]) => <span className="text-sm">{p.updatedAt.toLocaleDateString('zh-CN')}</span> },
    {
      key: 'actions',
      title: '',
      width: 'w-[50px]',
      align: 'right' as const,
      render: (project: typeof projects[0]) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/projects/${project.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600">
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <AdminListPage
      title="合作项目管理"
      subtitle="跟踪项目全生命周期与里程碑进展"
      count={filteredProjects.length}
      countLabel="个合作项目"
      stats={stats}
      statsColumns={6}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索项目名称、合作主体..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      tabs={['全部', ...SECONDARY_COLLEGES].map((c) => ({ value: c, label: c }))}
      activeTab={activeCollegeTab}
      onTabChange={setActiveCollegeTab}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setCooperationTypeDialogOpen(true)}>
            <Tag className="h-4 w-4 mr-1" />
            合作类型管理
          </Button>
          <Link href="/admin/projects/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新增项目
            </Button>
          </Link>
        </>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredProjects}
        rowKey={(p) => p.id}
        emptyText="暂无符合条件的合作项目"
      />

      <Dialog open={cooperationTypeDialogOpen} onOpenChange={setCooperationTypeDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>合作类型管理</DialogTitle>
            <DialogDescription>维护平台合作类型字典与分类体系</DialogDescription>
          </DialogHeader>
          <CooperationTypeManager />
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}

function ClipboardListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  )
}
