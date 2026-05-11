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
import { Progress } from '@/components/ui/progress'
import { FilterBar } from '@/components/shared/filter-bar'
import { ProjectPhaseBadge, ProjectPublishStatusBadge } from '@/components/shared/status-badge'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, FolderKanban, Send, EyeOff, Tag } from 'lucide-react'
import { projects } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS, PROJECT_PUBLISH_STATUS_LABELS } from '@/lib/types'
import type { ProjectPhase, ProjectPublishStatus } from '@/lib/types'
import CooperationTypeManager from '@/components/admin/cooperation-type-manager'

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
      return true
    })
  }, [search, filters])

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
    {
      key: 'publishStatus',
      label: '全部状态',
      options: [
        { value: 'draft', label: '草稿' },
        { value: 'published', label: '已发布' },
      ],
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            共 {filteredProjects.length} 个合作项目
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索项目名称、合作主体..."
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
              <TableHead>项目名称</TableHead>
              <TableHead>合作主体</TableHead>
              <TableHead>项目类型</TableHead>
              <TableHead>起止时间</TableHead>
              <TableHead>里程碑进度</TableHead>
              <TableHead>阶段</TableHead>
              <TableHead>发布状态</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const progress = getMilestoneProgress(project.milestones)
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="font-medium hover:underline"
                        >
                          {project.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/partners/${project.partnerId}`}
                        className="hover:underline"
                      >
                        {project.partnerName}
                      </Link>
                    </TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell className="text-sm">
                      <div>
                        {project.startDate.toLocaleDateString('zh-CN')}
                      </div>
                      <div className="text-muted-foreground">
                        至 {project.endDate.toLocaleDateString('zh-CN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProjectPhaseBadge phase={project.phase} />
                    </TableCell>
                    <TableCell>
                      <ProjectPublishStatusBadge status={project.publishStatus} />
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
                            <Link href={`/admin/projects/${project.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              编辑
                            </Link>
                          </DropdownMenuItem>
                          {project.publishStatus === 'draft' ? (
                            <DropdownMenuItem
                              onClick={() => {
                                project.publishStatus = 'published'
                                project.updatedAt = new Date()
                                window.location.reload()
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              发布
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                project.publishStatus = 'draft'
                                project.updatedAt = new Date()
                                window.location.reload()
                              }}
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              撤销发布
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  暂无符合条件的合作项目
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Cooperation Type Dialog */}
      <Dialog open={cooperationTypeDialogOpen} onOpenChange={setCooperationTypeDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>合作类型管理</DialogTitle>
            <DialogDescription>维护平台合作类型字典与分类体系</DialogDescription>
          </DialogHeader>
          <CooperationTypeManager />
        </DialogContent>
      </Dialog>
    </div>
  )
}
