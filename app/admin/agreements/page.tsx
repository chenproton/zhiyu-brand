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
import { AgreementStatusBadge } from '@/components/shared/status-badge'
import { Plus, Eye, Pencil, Trash2, FileText } from 'lucide-react'
import { agreements } from '@/lib/mock-data'
import { AGREEMENT_STATUS_LABELS } from '@/lib/types'

const AGREEMENT_TYPES = [
  '战略合作协议',
  '产学研合作协议',
  '实习实训协议',
  '人才培养协议',
  '就业合作协议',
  '课程共建协议',
  '技术服务协议',
]

export default function AgreementsListPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    status: 'all',
    type: 'all',
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingAgreement, setDeletingAgreement] = useState<typeof agreements[0] | null>(null)

  const filteredAgreements = useMemo(() => {
    return agreements.filter((agreement) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          agreement.name.toLowerCase().includes(searchLower) ||
          agreement.partnerName.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (filters.status !== 'all' && agreement.status !== filters.status) return false
      if (filters.type !== 'all' && agreement.type !== filters.type) return false
      return true
    })
  }, [search, filters])

  const statusStats = useMemo(() => {
    return {
      total: agreements.length,
      draft: agreements.filter((a) => a.status === 'draft').length,
      active: agreements.filter((a) => a.status === 'active').length,
      expired: agreements.filter((a) => a.status === 'expired').length,
      terminated: agreements.filter((a) => a.status === 'terminated').length,
    }
  }, [agreements])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      status: 'all',
      type: 'all',
    })
  }

  const handleDelete = (agreement: typeof agreements[0]) => {
    setDeletingAgreement(agreement)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false)
    setDeletingAgreement(null)
  }

  const filterConfigs = [
    {
      key: 'status',
      label: '全部状态',
      options: Object.entries(AGREEMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'type',
      label: '全部类型',
      options: AGREEMENT_TYPES.map((type) => ({ value: type, label: type })),
    },
  ]

  const stats = [
    { key: 'total', label: '全部协议', value: statusStats.total, icon: FileText, color: 'slate' as const },
    { key: 'active', label: '生效中', value: statusStats.active, icon: FileText, color: 'green' as const, filterKey: 'status', filterValue: 'active' },
    { key: 'draft', label: '草稿', value: statusStats.draft, icon: FileText, color: 'amber' as const, filterKey: 'status', filterValue: 'draft' },
    { key: 'expired', label: '已到期', value: statusStats.expired, icon: FileText, color: 'red' as const, filterKey: 'status', filterValue: 'expired' },
    { key: 'terminated', label: '已终止', value: statusStats.terminated, icon: FileText, color: 'slate' as const, filterKey: 'status', filterValue: 'terminated' },
  ]

  const isExpiringSoon = (endDate: Date) => {
    const now = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90
  }

  const columns = [
    {
      key: 'name',
      title: '协议名称',
      render: (agreement: typeof agreements[0]) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <Link href={`/admin/agreements/${agreement.id}`} className="font-medium hover:underline">
            {agreement.name}
          </Link>
        </div>
      ),
    },
    {
      key: 'partner',
      title: '合作主体',
      render: (agreement: typeof agreements[0]) => (
        <Link href={`/admin/partners/${agreement.partnerId}`} className="hover:underline">
          {agreement.partnerName}
        </Link>
      ),
    },
    { key: 'type', title: '协议类型', render: (a: typeof agreements[0]) => a.type },
    {
      key: 'startDate',
      title: '生效日期',
      render: (a: typeof agreements[0]) => a.startDate.toLocaleDateString('zh-CN'),
    },
    {
      key: 'endDate',
      title: '到期日期',
      render: (a: typeof agreements[0]) => (
        <span className={isExpiringSoon(a.endDate) ? 'text-amber-600 font-medium' : ''}>
          {a.endDate.toLocaleDateString('zh-CN')}
          {isExpiringSoon(a.endDate) && ' (即将到期)'}
        </span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (a: typeof agreements[0]) => <AgreementStatusBadge status={a.status} />,
    },
    {
      key: 'actions',
      title: '',
      width: 'w-[50px]',
      align: 'right' as const,
      render: (agreement: typeof agreements[0]) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/agreements/${agreement.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/agreements/${agreement.id}/edit`}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDelete(agreement)}
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
      title="合作协议管理"
      subtitle="维护校企合作协议及到期提醒"
      count={filteredAgreements.length}
      countLabel="份合作协议"
      stats={stats}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索协议名称、合作主体..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <Link href="/admin/agreements/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            新增协议
          </Button>
        </Link>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredAgreements}
        rowKey={(a) => a.id}
        emptyText="暂无符合条件的合作协议"
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除协议「{deletingAgreement?.name}」吗？此操作不可撤销。
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
