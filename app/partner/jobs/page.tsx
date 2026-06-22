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
} from 'lucide-react'
import { jobs, jobBrands, employmentProjects } from '@/lib/mock-data'
import {
  JOB_CATEGORY_LABELS,
} from '@/lib/types'
import { usePartner } from '../partner-context'

export default function PartnerJobsPage() {
  const { selectedEnterpriseId } = usePartner()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const partnerProjects = useMemo(() => {
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
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      job.status = 'published'
      job.updatedAt = new Date()
    }
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
        <Button asChild>
          <Link href="/partner/jobs/new">
            <Plus className="h-4 w-4 mr-2" />
            新建岗位
          </Link>
        </Button>
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
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                          <Link href={`/partner/jobs/${job.id}/edit`}>
                            <Pencil className="mr-1 h-3 w-3" />
                            编辑
                          </Link>
                        </Button>
                        {job.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handlePublish(job.id)}
                          >
                            <Send className="mr-1 h-3 w-3" />
                            发布
                          </Button>
                        )}
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
    </div>
  )
}
