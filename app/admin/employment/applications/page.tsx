"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Calendar,
  FileText,
  Download,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react"
import { jobApplications, jobs } from "@/lib/mock-data"
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/types"

const statusColors: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  viewed: "bg-blue-100 text-blue-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
}

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jobFilter, setJobFilter] = useState<string>("all")

  const filteredApplications = useMemo(() => {
    return jobApplications.filter((app) => {
      const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || app.status === statusFilter
      const matchesJob = jobFilter === "all" || app.jobId === jobFilter
      return matchesSearch && matchesStatus && matchesJob
    })
  }, [searchTerm, statusFilter, jobFilter])

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">投递管理</h1>
        <p className="text-muted-foreground">查看和处理学生的岗位投递</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        {Object.entries(APPLICATION_STATUS_LABELS).map(([status, label]) => {
          const count = jobApplications.filter(a => a.status === status).length
          return (
            <Card 
              key={status} 
              className={`cursor-pointer transition-all ${statusFilter === status ? "ring-2 ring-primary" : ""}`}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            >
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
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
                placeholder="搜索学生姓名、岗位或企业..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="投递状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="筛选岗位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部岗位</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 投递列表 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">学生信息</TableHead>
                <TableHead>投递岗位</TableHead>
                <TableHead>企业</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>投递时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    没有找到符合条件的投递记录
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{app.studentName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.studentName}</p>
                          <p className="text-xs text-muted-foreground">{app.studentMajor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/employment/jobs/${app.jobId}`} className="hover:underline">
                        {app.jobTitle}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{app.partnerName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[app.status]}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {app.appliedAt.toLocaleDateString('zh-CN')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert('查看详情功能开发中')}>
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('查看简历功能开发中')}>
                            <FileText className="h-4 w-4 mr-2" />
                            查看简历
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {app.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => alert('标记为已查看功能开发中')}>
                                <Eye className="h-4 w-4 mr-2" />
                                标记为已查看
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => alert('安排面试功能开发中')}>
                                <Calendar className="h-4 w-4 mr-2" />
                                安排面试
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => alert('不合适功能开发中')}>
                                <XCircle className="h-4 w-4 mr-2" />
                                不合适
                              </DropdownMenuItem>
                            </>
                          )}
                          {app.status === "viewed" && (
                            <>
                              <DropdownMenuItem onClick={() => alert('安排面试功能开发中')}>
                                <Calendar className="h-4 w-4 mr-2" />
                                安排面试
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => alert('不合适功能开发中')}>
                                <XCircle className="h-4 w-4 mr-2" />
                                不合适
                              </DropdownMenuItem>
                            </>
                          )}
                          {app.status === "interview" && (
                            <>
                              <DropdownMenuItem onClick={() => alert('发送Offer功能开发中')}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                发送Offer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => alert('面试未通过功能开发中')}>
                                <XCircle className="h-4 w-4 mr-2" />
                                面试未通过
                              </DropdownMenuItem>
                            </>
                          )}
                          {app.status === "offer" && (
                            <DropdownMenuItem onClick={() => alert('确认入职功能开发中')}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              确认入职
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => alert('联系学生功能开发中')}>
                            <Phone className="h-4 w-4 mr-2" />
                            联系学生
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
