'use client'

import { useState, useMemo, useRef } from 'react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { FilterBar } from '@/components/shared/filter-bar'
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
} from '@/components/shared/status-badge'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Building2, FileText, Download, Tag, Settings, FolderKanban, Award, Upload, Users } from 'lucide-react'
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
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importStep, setImportStep] = useState<'upload' | 'preview'>('upload')
  const [importedData, setImportedData] = useState<{ enterprises: any[]; experts: any[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          <Button variant="outline" size="sm" onClick={() => { setImportDialogOpen(true); setImportStep('upload') }}>
            <Upload className="h-4 w-4 mr-1" />
            导入商城企业
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
              <TableHead>创建人</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
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
                    <span className="text-sm">{enterprise.createdBy || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{enterprise.createdAt.toLocaleDateString('zh-CN')}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{enterprise.updatedAt.toLocaleDateString('zh-CN')}</span>
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
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
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

      {/* Import Platform Enterprises Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={(open) => { setImportDialogOpen(open); if (!open) { setImportStep('upload'); setImportedData(null) } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>导入商城企业</DialogTitle>
            <DialogDescription>
              {importStep === 'upload' ? '上传企业数据文件，系统将自动解析并导入企业及其关联的专家列表' : '预览解析结果，确认后完成导入'}
            </DialogDescription>
          </DialogHeader>

          {importStep === 'upload' ? (
            <div className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // 模拟解析
                    setTimeout(() => {
                      setImportedData({
                        enterprises: [
                          { name: '示例平台企业A', industry: '信息技术', region: '苏州', expertsCount: 3 },
                          { name: '示例平台企业B', industry: '智能制造', region: '南京', expertsCount: 2 },
                        ],
                        experts: [
                          { name: '张三', title: '技术总监', enterprise: '示例平台企业A' },
                          { name: '李四', title: '产品经理', enterprise: '示例平台企业A' },
                          { name: '王五', title: '算法专家', enterprise: '示例平台企业A' },
                          { name: '赵六', title: '生产主管', enterprise: '示例平台企业B' },
                          { name: '孙七', title: '质量工程师', enterprise: '示例平台企业B' },
                        ],
                      })
                      setImportStep('preview')
                    }, 800)
                  }
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              />
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">点击上传或拖拽文件到此处</p>
                <p className="text-xs text-muted-foreground mt-1">支持 .xlsx, .xls, .csv, .json 格式</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <p className="font-medium">导入说明：</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>文件需包含企业基本信息（名称、行业、地区等）</li>
                  <li>如包含专家信息，将同时导入到专家资源库</li>
                  <li>重复的企业将根据统一社会信用代码去重</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {importedData && (
                <>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      待导入企业（{importedData.enterprises.length} 家）
                    </h4>
                    <div className="border rounded-lg divide-y">
                      {importedData.enterprises.map((ent, idx) => (
                        <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="font-medium">{ent.name}</span>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{ent.industry}</span>
                            <span>·</span>
                            <span>{ent.region}</span>
                            <Badge variant="secondary" className="text-xs">{ent.expertsCount} 位专家</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      待导入专家（{importedData.experts.length} 位）
                    </h4>
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {importedData.experts.map((exp, idx) => (
                        <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span>{exp.name}</span>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{exp.title}</span>
                            <span>·</span>
                            <span className="text-xs">{exp.enterprise}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            {importStep === 'preview' && (
              <>
                <Button variant="outline" onClick={() => setImportStep('upload')}>
                  重新上传
                </Button>
                <Button onClick={() => { alert('导入成功（演示）'); setImportDialogOpen(false); setImportStep('upload'); setImportedData(null) }}>
                  确认导入
                </Button>
              </>
            )}
            {importStep === 'upload' && (
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                取消
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


