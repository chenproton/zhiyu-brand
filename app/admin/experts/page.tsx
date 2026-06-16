'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'
import { experts } from '@/lib/mock-data'
import { SECONDARY_COLLEGES } from '@/lib/types'
import type { Expert } from '@/lib/types'

const GENDER_LABELS: Record<string, string> = {
  male: '男',
  female: '女',
}

export default function ExpertsListPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    status: 'all',
    partnerSource: 'all',
  })
  const [activeCollegeTab, setActiveCollegeTab] = useState('全部')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingExpert, setDeletingExpert] = useState<Expert | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          expert.name.toLowerCase().includes(searchLower) ||
          (expert.title && expert.title.toLowerCase().includes(searchLower)) ||
          (expert.organization && expert.organization.toLowerCase().includes(searchLower)) ||
          (expert.partnerName && expert.partnerName.toLowerCase().includes(searchLower)) ||
          (expert.position && expert.position.toLowerCase().includes(searchLower)) ||
          (expert.education && expert.education.toLowerCase().includes(searchLower)) ||
          (expert.industryDirection && expert.industryDirection.toLowerCase().includes(searchLower)) ||
          (expert.positionDirection && expert.positionDirection.toLowerCase().includes(searchLower)) ||
          expert.specialties?.some((sp) => sp.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      if (filters.status !== 'all' && expert.status !== filters.status) return false
      if (filters.partnerSource !== 'all' && expert.partnerSource !== filters.partnerSource) return false
      if (activeCollegeTab !== '全部') {
        const colleges = expert.secondaryColleges || []
        if (!colleges.includes(activeCollegeTab)) return false
      }

      return true
    })
  }, [search, filters, refreshKey, activeCollegeTab])

  const statusStats = useMemo(() => {
    return {
      total: experts.length,
      active: experts.filter((e) => e.status === 'active').length,
      inactive: experts.filter((e) => e.status === 'inactive').length,
    }
  }, [experts, refreshKey])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      status: 'all',
      partnerSource: 'all',
    })
    setActiveCollegeTab('全部')
  }

  const handleDelete = (expert: Expert) => {
    setDeletingExpert(expert)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false)
    setDeletingExpert(null)
  }

  const handleTogglePublicDisplay = (expert: Expert) => {
    expert.isPublicDisplay = !expert.isPublicDisplay
    expert.updatedAt = new Date()
    setRefreshKey((prev) => prev + 1)
  }

  const filterConfigs = [
    {
      key: 'status',
      label: '全部状态',
      options: [
        { value: 'active', label: '启用' },
        { value: 'inactive', label: '禁用' },
      ],
    },
    {
      key: 'partnerSource',
      label: '全部来源',
      options: [
        { value: 'cooperation', label: '合作企业' },
        { value: 'third-party', label: '第三方机构' },
      ],
    },
  ]

  const stats = [
    { key: 'total', label: '全部专家', value: statusStats.total, icon: Users, color: 'slate' as const },
    { key: 'active', label: '启用', value: statusStats.active, icon: Users, color: 'green' as const, filterKey: 'status', filterValue: 'active' },
    { key: 'inactive', label: '禁用', value: statusStats.inactive, icon: Users, color: 'red' as const, filterKey: 'status', filterValue: 'inactive' },
  ]

  const columns = [
    {
      key: 'seq',
      title: '序号',
      width: 'w-16',
      align: 'center' as const,
      render: (_: Expert, index: number) => <span className="text-sm text-muted-foreground">{index + 1}</span>,
    },
    {
      key: 'display',
      title: '前台展示',
      render: (expert: Expert) => (
        <div className="flex items-center gap-2">
          <Switch checked={expert.isPublicDisplay} onCheckedChange={() => handleTogglePublicDisplay(expert)} />
          <span className={`text-sm ${expert.isPublicDisplay ? 'text-green-600' : 'text-gray-400'}`}>
            {expert.isPublicDisplay ? '展示' : '隐藏'}
          </span>
        </div>
      ),
    },
    {
      key: 'name',
      title: '姓名',
      render: (expert: Expert) => (
        <Link href={`/admin/experts/${expert.id}`} className="font-medium hover:underline">
          {expert.name}
        </Link>
      ),
    },
    {
      key: 'gender',
      title: '性别',
      render: (expert: Expert) => (
        <span className="text-muted-foreground">{expert.gender ? GENDER_LABELS[expert.gender] : '-'}</span>
      ),
    },
    {
      key: 'age',
      title: '年龄',
      render: (expert: Expert) => <span className="text-muted-foreground">{expert.age ? `${expert.age}岁` : '-'}</span>,
    },
    {
      key: 'title',
      title: '职称/职位',
      render: (expert: Expert) => <span className="text-muted-foreground max-w-[160px] truncate inline-block" title={expert.title || ''}>{expert.title || '-'}</span>,
    },
    {
      key: 'position',
      title: '任职岗位',
      render: (expert: Expert) => <span className="text-muted-foreground max-w-[160px] truncate inline-block" title={expert.position || ''}>{expert.position || '-'}</span>,
    },
    {
      key: 'organization',
      title: '所属机构',
      render: (expert: Expert) => (
        expert.organization || expert.partnerName ? (
          <span className="text-muted-foreground max-w-[160px] truncate inline-block" title={expert.organization || expert.partnerName || ''}>
            {expert.organization || expert.partnerName}
          </span>
        ) : (
          <Badge variant="secondary" className="text-xs">独立专家</Badge>
        )
      ),
    },
    {
      key: 'city',
      title: '所在城市',
      render: (expert: Expert) => <span className="text-muted-foreground">{expert.city || '-'}</span>,
    },
    {
      key: 'experience',
      title: '从业年限',
      render: (expert: Expert) => <span className="text-muted-foreground">{expert.experience ? `${expert.experience}年` : '-'}</span>,
    },
    {
      key: 'education',
      title: '教育背景',
      render: (expert: Expert) => (
        <span className="text-muted-foreground max-w-[180px] truncate inline-block" title={expert.education || ''}>
          {expert.education || '-'}
        </span>
      ),
    },
    {
      key: 'industryDirection',
      title: '行业方向',
      render: (expert: Expert) => (
        <span className="text-muted-foreground max-w-[160px] truncate inline-block" title={expert.industryDirection || ''}>
          {expert.industryDirection || '-'}
        </span>
      ),
    },
    {
      key: 'positionDirection',
      title: '岗位方向',
      render: (expert: Expert) => (
        <span className="text-muted-foreground max-w-[160px] truncate inline-block" title={expert.positionDirection || ''}>
          {expert.positionDirection || '-'}
        </span>
      ),
    },
    {
      key: 'specialties',
      title: '擅长领域',
      render: (expert: Expert) => (
        <span className="text-muted-foreground max-w-[180px] truncate inline-block" title={expert.specialties?.join('、') || ''}>
          {expert.specialties?.join('、') || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (expert: Expert) => (
        <Badge variant={expert.status === 'active' ? 'default' : 'secondary'} className="text-xs">
          {expert.status === 'active' ? '启用' : '禁用'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: 'w-[50px]',
      align: 'right' as const,
      render: (expert: Expert) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/experts/${expert.id}`}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDelete(expert)}
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
      title="专家管理"
      subtitle="维护校内外专家资源及前台展示"
      count={filteredExperts.length}
      countLabel="位专家"
      stats={stats}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索专家姓名、职称、机构、领域..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      tabs={['全部', ...SECONDARY_COLLEGES].map((c) => ({ value: c, label: c }))}
      activeTab={activeCollegeTab}
      onTabChange={setActiveCollegeTab}
      actions={
        <Link href="/admin/experts/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            新增专家
          </Button>
        </Link>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredExperts}
        rowKey={(e) => e.id}
        emptyText="暂无符合条件的专家"
        emptyIcon={<Users className="h-10 w-10" />}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除专家「{deletingExpert?.name}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
