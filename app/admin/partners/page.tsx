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
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
} from '@/components/shared/status-badge'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
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

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          partner.name.toLowerCase().includes(searchLower) ||
          partner.industry.toLowerCase().includes(searchLower) ||
          partner.region.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Type filter
      if (filters.type !== 'all' && partner.type !== filters.type) return false

      // Status filter
      if (filters.status !== 'all' && partner.status !== filters.status) return false

      // Rating filter
      if (filters.rating !== 'all' && partner.rating !== filters.rating) return false

      // Industry filter
      if (filters.industry !== 'all' && partner.industry !== filters.industry) return false

      return true
    })
  }, [search, filters])

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
      options: Object.entries(COOPERATION_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: 'rating',
      label: '全部评级',
      options: Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: 'industry',
      label: '全部行业',
      options: INDUSTRIES.map((industry) => ({ value: industry, label: industry })),
    },
  ]

  return (
    <>
      <AdminHeader title="合作主体管理" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground">
              共 {filteredPartners.length} 个合作主体
            </p>
          </div>
          <Link href="/admin/partners/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增主体
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <FilterBar
              searchPlaceholder="搜索主体名称、行业、地区..."
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
                <TableHead>主体名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>地区</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>合作深度</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <Link
                        href={`/admin/partners/${partner.id}`}
                        className="font-medium hover:underline"
                      >
                        {partner.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {PARTNER_TYPE_LABELS[partner.type as PartnerType]}
                    </TableCell>
                    <TableCell>{partner.industry}</TableCell>
                    <TableCell>{partner.region}</TableCell>
                    <TableCell>
                      <CooperationStatusBadge status={partner.status} />
                    </TableCell>
                    <TableCell>
                      <CooperationRatingBadge rating={partner.rating} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {partner.updatedAt.toLocaleDateString('zh-CN')}
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
                            <Link href={`/admin/partners/${partner.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/partners/${partner.id}/edit`}>
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无符合条件的合作主体
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
