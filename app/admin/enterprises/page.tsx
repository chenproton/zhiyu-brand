'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FilterBar } from '@/components/shared/filter-bar'
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
} from '@/components/shared/status-badge'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Building2, FileText, Download, Tag, Settings, FolderKanban, Award } from 'lucide-react'
import { enterprises } from '@/lib/mock-data'

import {
  ENTERPRISE_TYPE_LABELS,
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  INDUSTRIES,
} from '@/lib/types'
import type { EnterpriseType, CooperationStatus, CooperationRating } from '@/lib/types'
import CooperationTypeManager from '@/components/admin/cooperation-type-manager'
import CooperationRatingManager from '@/components/admin/cooperation-rating-manager'

export default function EnterprisesListPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    enterpriseType: 'all',
    status: 'all',
    rating: 'all',
    industry: 'all',
  })
  const [cooperationTypeDialogOpen, setCooperationTypeDialogOpen] = useState(false)
  const [cooperationRatingDialogOpen, setCooperationRatingDialogOpen] = useState(false)

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((enterprise) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          enterprise.name.toLowerCase().includes(searchLower) ||
          enterprise.industry.toLowerCase().includes(searchLower) ||
          enterprise.region.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.enterpriseType !== 'all' && enterprise.enterpriseType !== filters.enterpriseType) return false
      if (filters.status !== 'all' && enterprise.status !== filters.status) return false
      if (filters.rating !== 'all' && enterprise.rating !== filters.rating) return false
      if (filters.industry !== 'all' && enterprise.industry !== filters.industry) return false

      return true
    })
  }, [search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      enterpriseType: 'all',
      status: 'all',
      rating: 'all',
      industry: 'all',
    })
  }

  const filterConfigs = [
    {
      key: 'enterpriseType',
      label: '全部类型',
      options: Object.entries(ENTERPRISE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            共 {filteredEnterprises.length} 个企业
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCooperationRatingDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-1" />
            合作评级管理
          </Button>
          <Link href="/admin/enterprises/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新增企业
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索企业名称、行业、地区..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={filterConfigs}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业名称</TableHead>
              <TableHead>企业类型</TableHead>
              <TableHead>行业</TableHead>
              <TableHead>地区</TableHead>
              <TableHead>合作状态</TableHead>
              <TableHead>合作评级</TableHead>
              <TableHead>校企合作协议</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnterprises.length > 0 ? (
              filteredEnterprises.map((enterprise) => (
                <TableRow key={enterprise.id}>
                  <TableCell>
                    <Link
                      href={`/admin/enterprises/${enterprise.id}`}
                      className="font-medium hover:underline flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {enterprise.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      enterprise.enterpriseType === 'platform'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ENTERPRISE_TYPE_LABELS[enterprise.enterpriseType as EnterpriseType]}
                    </span>
                  </TableCell>
                  <TableCell>{enterprise.industry}</TableCell>
                  <TableCell>{enterprise.region}</TableCell>
                  <TableCell>
                    <CooperationStatusBadge status={enterprise.status} />
                  </TableCell>
                  <TableCell>
                    <CooperationRatingBadge rating={enterprise.rating} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{enterprise.agreements?.length || 0}</span>
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
                          <Link href={`/admin/enterprises/${enterprise.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/enterprises/${enterprise.id}?tab=agreements`}>
                            <FileText className="h-4 w-4 mr-2" />
                            协议管理
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/enterprises/${enterprise.id}?tab=projects`}>
                            <FolderKanban className="h-4 w-4 mr-2" />
                            合作项目管理
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/enterprises/${enterprise.id}?tab=achievements`}>
                            <Award className="h-4 w-4 mr-2" />
                            合作成果管理
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => { if (confirm('确定要删除该企业吗？')) alert('企业已删除（演示）') }}>
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
                  暂无符合条件的企业
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Cooperation Rating Dialog */}
      <Dialog open={cooperationRatingDialogOpen} onOpenChange={setCooperationRatingDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>合作评级管理</DialogTitle>
            <DialogDescription>维护合作深度评级的字典定义</DialogDescription>
          </DialogHeader>
          <CooperationRatingManager />
        </DialogContent>
      </Dialog>
    </div>
  )
}


