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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Send,
} from 'lucide-react'
import { jobs, jobBrands } from '@/lib/mock-data'
import {
  JOB_STATUS_LABELS,
  JOB_CATEGORY_LABELS,
  type JobStatus,
} from '@/lib/types'
import { usePartner } from '../partner-context'

const statusColors: Record<JobStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-red-100 text-red-800',
  filled: 'bg-blue-100 text-blue-800',
}

export default function PartnerJobsPage() {
  const { selectedEnterpriseId } = usePartner()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredJobs = useMemo(() => {
    if (!selectedEnterpriseId) return []
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter
      const matchesCategory =
        categoryFilter === 'all' || job.jobCategory === categoryFilter
      const matchesPartner = job.partnerId === selectedEnterpriseId
      return matchesSearch && matchesStatus && matchesCategory && matchesPartner
    })
  }, [searchTerm, statusFilter, categoryFilter, selectedEnterpriseId])

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

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(JOB_STATUS_LABELS).map(([status, label]) => {
          const count = jobs.filter(
            (j) => j.status === status && j.partnerId === selectedEnterpriseId
          ).length
          return (
            <Card
              key={status}
              className={statusFilter === status ? 'ring-2 ring-primary' : ''}
              onClick={() =>
                setStatusFilter(statusFilter === status ? 'all' : status)
              }
              style={{ cursor: 'pointer' }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          )
        })}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="岗位状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>岗位名称</TableHead>
                <TableHead>岗位类型</TableHead>
                <TableHead>薪资范围</TableHead>
                <TableHead>岗位介绍</TableHead>
                <TableHead>关联专业</TableHead>
                <TableHead>所属行业</TableHead>
                <TableHead>状态</TableHead>
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
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
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
                    <TableCell>
                      <Badge className={statusColors[job.status]}>
                        {JOB_STATUS_LABELS[job.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/partner/jobs/${job.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            编辑
                          </Link>
                        </Button>
                        {job.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePublish(job.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            发布
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(job.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
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
