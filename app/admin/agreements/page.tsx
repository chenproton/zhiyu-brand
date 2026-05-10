'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FilterBar } from '@/components/shared/filter-bar'
import { AgreementStatusBadge } from '@/components/shared/status-badge'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, FileText } from 'lucide-react'
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

  const filteredAgreements = useMemo(() => {
    return agreements.filter((agreement) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          agreement.name.toLowerCase().includes(searchLower) ||
          agreement.partnerName.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== 'all' && agreement.status !== filters.status) return false

      // Type filter
      if (filters.type !== 'all' && agreement.type !== filters.type) return false

      return true
    })
  }, [search, filters])

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

  const filterConfigs = [
    {
      key: 'status',
      label: '全部状态',
      options: Object.entries(AGREEMENT_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: 'type',
      label: '全部类型',
      options: AGREEMENT_TYPES.map((type) => ({ value: type, label: type })),
    },
  ]

  // Check if agreement is expiring soon (within 90 days)
  const isExpiringSoon = (endDate: Date) => {
    const now = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90
  }

  return (
    <>
      <AdminHeader title="合作协议管理" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground">
              共 {filteredAgreements.length} 份合作协议
            </p>
          </div>
          <Link href="/admin/agreements/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增协议
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <FilterBar
              searchPlaceholder="搜索协议名称、合作主体..."
              searchValue={search}
              onSearchChange={setSearch}
              filters={filterConfigs}
              filterValues={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>协议名称</TableHead>
                <TableHead>合作主体</TableHead>
                <TableHead>协议类型</TableHead>
                <TableHead>生效日期</TableHead>
                <TableHead>到期日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgreements.length > 0 ? (
                filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={`/admin/agreements/${agreement.id}`}
                          className="font-medium hover:underline"
                        >
                          {agreement.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/partners/${agreement.partnerId}`}
                        className="hover:underline"
                      >
                        {agreement.partnerName}
                      </Link>
                    </TableCell>
                    <TableCell>{agreement.type}</TableCell>
                    <TableCell>
                      {agreement.startDate.toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell>
                      <span className={isExpiringSoon(agreement.endDate) ? 'text-amber-600 font-medium' : ''}>
                        {agreement.endDate.toLocaleDateString('zh-CN')}
                        {isExpiringSoon(agreement.endDate) && ' (即将到期)'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <AgreementStatusBadge status={agreement.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/agreements/${agreement.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/agreements/${agreement.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              编辑
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    暂无符合条件的合作协议
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </>
  )
}
