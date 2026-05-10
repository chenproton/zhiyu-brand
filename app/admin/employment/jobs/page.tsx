"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Pause,
  Play,
  Trash2,
  FileText,
  MapPin,
  Building2,
} from "lucide-react"
import { jobs } from "@/lib/mock-data"
import { JOB_STATUS_LABELS, JOB_TYPE_LABELS, type JobStatus, type JobType } from "@/lib/types"

const statusColors: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  filled: "bg-blue-100 text-blue-800",
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      const matchesType = typeFilter === "all" || job.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchTerm, statusFilter, typeFilter])

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">岗位管理</h1>
          <p className="text-muted-foreground">发布和管理招聘岗位信息</p>
        </div>
        <Button asChild>
          <Link href="/admin/employment/jobs/new">
            <Plus className="h-4 w-4 mr-2" />
            发布岗位
          </Link>
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(JOB_STATUS_LABELS).map(([status, label]) => {
          const count = jobs.filter(j => j.status === status).length
          return (
            <Card key={status} className={statusFilter === status ? "ring-2 ring-primary" : ""}>
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
                placeholder="搜索岗位名称或企业..."
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
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="岗位类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
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
                <TableHead className="w-[300px]">岗位信息</TableHead>
                <TableHead>企业</TableHead>
                <TableHead>薪资</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-center">浏览/投递</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    没有找到符合条件的岗位
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{job.title}</p>
                          {job.isUrgent && <Badge variant="destructive" className="text-xs">急招</Badge>}
                          {job.isRecommended && <Badge variant="secondary" className="text-xs">推荐</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.partnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-primary">
                        {job.salaryMin && job.salaryMax 
                          ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` 
                          : '面议'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{JOB_TYPE_LABELS[job.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[job.status]}>
                        {JOB_STATUS_LABELS[job.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {job.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {job.applicationCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/employment/jobs/${job.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑岗位
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/employment/applications?jobId=${job.id}`}>
                              <FileText className="h-4 w-4 mr-2" />
                              查看投递
                            </Link>
                          </DropdownMenuItem>
                          {job.status === "published" ? (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              暂停招聘
                            </DropdownMenuItem>
                          ) : job.status === "paused" ? (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              恢复招聘
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除岗位
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
