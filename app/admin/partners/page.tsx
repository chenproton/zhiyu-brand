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
import { AdminListPage } from '@/components/admin/list-page'
import { AdminDataTable } from '@/components/admin/data-table'
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
} from '@/components/shared/status-badge'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { partners } from '@/lib/mock-data'
import {
  PARTNER_TYPE_LABELS,
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  INDUSTRIES,
} from '@/lib/types'
import type { PartnerType, CooperationStatus, CooperationRating } from '@/lib/types'

export default function PartnersListPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    type: 'all',
    status: 'all',
    rating: 'all',
    industry: 'all',
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPartner, setDeletingPartner] = useState<typeof partners[0] | null>(null)

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          partner.name.toLowerCase().includes(searchLower) ||
          partner.industry.toLowerCase().includes(searchLower) ||
          partner.region.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (filters.type !== 'all' && partner.type !== filters.type) return false
      if (filters.status !== 'all' && partner.status !== filters.status) return false
      if (filters.rating !== 'all' && partner.rating !== filters.rating) return false
      if (filters.industry !== 'all' && partner.industry !== filters.industry) return false
      return true
    })
  }, [search, filters])

  const statusStats = useMemo(() => {
    return {
      total: partners.length,
      active: partners.filter((p) => p.status === 'active').length,
      negotiating: partners.filter((p) => p.status === 'negotiating').length,
      paused: partners.filter((p) => p.status === 'paused').length,
      terminated: partners.filter((p) => p.status === 'terminated').length,
    }
  }, [partners])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      type: 'all',
      status: 'all',
      rating: 'all',
      industry: 'all',
    })
  }

  const handleDelete = (partner: typeof partners[0]) => {
    setDeletingPartner(partner)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false)
    setDeletingPartner(null)
  }

  const filterConfigs = [
    {
      key: 'type',
      label: '全部类型',
      options: Object.entries(PARTNER_TYPE_LABELS)
        .filter(([key]) => key !== 'expert')
        .map(([value, label]) => ({ value, label })),
    },
    {
      key: 'status',
      label: '全部状态',
      options: Object.entries(COOPERATION_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'rating',
      label: '全部评级',
      options: Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'industry',
      label: '全部行业',
      options: INDUSTRIES.map((industry) => ({ value: industry, label: industry })),
    },
  ]

  const stats = [
    { key: 'total', label: '全部主体', value: statusStats.total, icon: Eye, color: 'slate' as const },
    { key: 'active', label: '合作中', value: statusStats.active, icon: Eye, color: 'green' as const, filterKey: 'status', filterValue: 'active' },
    { key: 'negotiating', label: '洽谈中', value: statusStats.negotiating, icon: Eye, color: 'blue' as const, filterKey: 'status', filterValue: 'negotiating' },
    { key: 'paused', label: '已暂停', value: statusStats.paused, icon: Eye, color: 'amber' as const, filterKey: 'status', filterValue: 'paused' },
    { key: 'terminated', label: '已终止', value: statusStats.terminated, icon: Eye, color: 'red' as const, filterKey: 'status', filterValue: 'terminated' },
  ]

  const columns = [
    {
      key: 'name',
      title: '主体名称',
      render: (partner: typeof partners[0]) => (
        <Link href={`/admin/partners/${partner.id}`} className="font-medium hover:underline">
          {partner.name}
        </Link>
      ),
    },
    {
      key: 'type',
      title: '类型',
      render: (partner: typeof partners[0]) => PARTNER_TYPE_LABELS[partner.type as PartnerType],
    },
    { key: 'industry', title: '行业', render: (p: typeof partners[0]) => p.industry },
    { key: 'region', title: '地区', render: (p: typeof partners[0]) => p.region },
    {
      key: 'status',
      title: '状态',
      render: (p: typeof partners[0]) => <CooperationStatusBadge status={p.status} />,
    },
    {
      key: 'rating',
      title: '合作深度',
      render: (p: typeof partners[0]) => <CooperationRatingBadge rating={p.rating} />,
    },
    {
      key: 'updatedAt',
      title: '更新时间',
      render: (p: typeof partners[0]) => <span className="text-muted-foreground">{p.updatedAt.toLocaleDateString('zh-CN')}</span>,
    },
    {
      key: 'actions',
      title: '',
      width: 'w-[50px]',
      align: 'right' as const,
      render: (partner: typeof partners[0]) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/partners/${partner.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/partners/${partner.id}/edit`}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDelete(partner)}
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
      title="合作主体管理"
      subtitle="维护校企合作主体信息及合作状态"
      count={filteredPartners.length}
      countLabel="个合作主体"
      stats={stats}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索主体名称、行业、地区..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <Link href="/admin/partners/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            新增主体
          </Button>
        </Link>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredPartners}
        rowKey={(p) => p.id}
        emptyText="暂无符合条件的合作主体"
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除合作主体「{deletingPartner?.name}」吗？此操作不可撤销。
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
