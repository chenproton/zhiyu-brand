'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableRowActions } from '@/components/admin/table-row-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Send,
  Bell,
  Briefcase,
  CheckCircle2,
} from 'lucide-react'
import { jobs, jobBrands, employmentProjects } from '@/lib/mock-data'
import {
  JOB_CATEGORY_LABELS,
  EMPLOYMENT_PROJECT_TYPE_LABELS,
} from '@/lib/types'
import { usePartner } from '../partner-context'

export default function PartnerJobsPage() {
  const { selectedEnterpriseId } = usePartner()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [confirmedIds, setConfirmedIds] = useState<string[]>([])
  const [publishJobId, setPublishJobId] = useState<string | null>(null)
  const [publishProjectId, setPublishProjectId] = useState<string>('')

  const partnerProjects = useMemo(() => {
    if (!selectedEnterpriseId) return []
    return employmentProjects.filter((p) =>
      p.partnerIds.includes(selectedEnterpriseId)
    )
  }, [selectedEnterpriseId])

  const invitations = useMemo(() => {
    if (!selectedEnterpriseId) return []
    return employmentProjects.filter((p) =>
      p.partnerIds.includes(selectedEnterpriseId)
    )
  }, [selectedEnterpriseId])

  const filteredJobs = useMemo(() => {
    if (!selectedEnterpriseId) return []
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || job.jobCategory === categoryFilter
      const matchesProject =
        projectFilter === 'all' || job.employmentProjectId === projectFilter
      const matchesPartner = job.partnerId === selectedEnterpriseId
      return (
        matchesSearch &&
        matchesCategory &&
        matchesProject &&
        matchesPartner
      )
    })
  }, [
    searchTerm,
    categoryFilter,
    projectFilter,
    selectedEnterpriseId,
  ])

  const handlePublish = (jobId: string) => {
    setPublishJobId(jobId)
    setPublishProjectId('')
  }

  const handleConfirmPublish = () => {
    if (!publishJobId) return
    const job = jobs.find((j) => j.id === publishJobId)
    if (job) {
      job.status = 'published'
      job.updatedAt = new Date()
      if (publishProjectId) {
        const project = employmentProjects.find((p) => p.id === publishProjectId)
        job.employmentProjectId = publishProjectId
        job.employmentProjectName = project?.name || ''
      }
    }
    setPublishJobId(null)
    setPublishProjectId('')
  }

  const handleDelete = () => {
    if (deleteId) {
      const index = jobs.findIndex((j) => j.id === deleteId)
      if (index !== -1) {
        jobs.splice(index, 1)
      }
      setDeleteId(null)
    }
  }

  const getIndustry = (job: (typeof jobs)[0]) => {
    if (job.jobCategory === 'teaching' && job.jobBrandId) {
      const brand = jobBrands.find((b) => b.id === job.jobBrandId)
      return brand?.industry || '-'
    }
    return job.industry || '-'
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">岗位管理</h1>
          <p className="text-muted-foreground">发布和管理企业招聘岗位</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => setNotifOpen(true)}
          >
            <Bell className="h-4 w-4 mr-1" />
            消息提醒
            {invitations.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                {invitations.length}
              </span>
            )}
          </Button>
          <Button asChild>
            <Link href="/partner/jobs/new">
              <Plus className="h-4 w-4 mr-2" />
              新建岗位
            </Link>
          </Button>
        </div>
      </div>

      {/* 筛选栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索岗位名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="岗位类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="teaching">教学岗位</SelectItem>
                <SelectItem value="non-teaching">非教学岗位</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 岗位列表 */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <Tabs value={projectFilter} onValueChange={setProjectFilter}>
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="all">全部</TabsTrigger>
                {partnerProjects.map((project) => (
                  <TabsTrigger key={project.id} value={project.id}>
                    {project.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>岗位名称</TableHead>
                <TableHead>就业项目</TableHead>
                <TableHead>岗位类型</TableHead>
                <TableHead>薪资范围</TableHead>
                <TableHead>岗位介绍</TableHead>
                <TableHead>面向专业</TableHead>
                <TableHead>所属行业</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    没有找到符合条件的岗位
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id} className="group">
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      {job.employmentProjectName ? (
                        <Badge variant="secondary">{job.employmentProjectName}</Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {job.jobCategory ? (
                        <Badge variant="outline">
                          {JOB_CATEGORY_LABELS[job.jobCategory]}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-primary">
                        {job.salaryMin && job.salaryMax
                          ? `${job.salaryMin}-${job.salaryMax}K`
                          : '面议'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {job.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground max-w-[120px] truncate">
                        {job.suitableMajors.join('、')}
                      </p>
                    </TableCell>
                    <TableCell>{getIndustry(job)}</TableCell>
                    <TableCell className="text-right relative">
                      <TableRowActions>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handlePublish(job.id)}
                        >
                          <Send className="mr-1 h-3 w-3" />
                          发布
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                          <Link href={`/partner/jobs/${job.id}/edit`}>
                            <Pencil className="mr-1 h-3 w-3" />
                            编辑
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                          onClick={() => setDeleteId(job.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          删除
                        </Button>
                      </TableRowActions>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>删除后无法恢复，是否继续？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 消息提醒对话框 */}
      <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>项目邀请通知</DialogTitle>
            <DialogDescription>学校邀请您参与就业项目，确认后可选择项目创建岗位</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {invitations.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                暂无新的邀请消息
              </div>
            ) : (
              invitations.map((project) => {
                const isConfirmed = confirmedIds.includes(project.id)
                return (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">{project.name}</h4>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            {EMPLOYMENT_PROJECT_TYPE_LABELS[project.type] || project.type}
                          </Badge>
                        </div>
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {project.startDate.toLocaleDateString('zh-CN')} ~ {project.endDate.toLocaleDateString('zh-CN')}
                          </span>
                          <span>面向：{project.targetStudentGroups.join('、')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {isConfirmed ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            已确认
                          </span>
                          <Button size="sm" asChild>
                            <Link href={`/partner/jobs/new?project=${project.id}`}>
                              <Briefcase className="h-3.5 w-3.5 mr-1" />
                              创建岗位
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            setConfirmedIds((prev) => [...prev, project.id])
                          }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          确认邀请
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 发布岗位选择项目对话框 */}
      <Dialog open={!!publishJobId} onOpenChange={(open) => { if (!open) { setPublishJobId(null); setPublishProjectId('') } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发布岗位</DialogTitle>
            <DialogDescription>选择要绑定的就业项目，确认后岗位将发布</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={publishProjectId} onValueChange={setPublishProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="选择就业项目（可选）" />
              </SelectTrigger>
              <SelectContent>
                {partnerProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPublishJobId(null); setPublishProjectId('') }}>取消</Button>
            <Button onClick={handleConfirmPublish}>确认发布</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
