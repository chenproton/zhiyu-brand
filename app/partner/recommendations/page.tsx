"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Sparkles, Eye, Building2, Briefcase } from "lucide-react"
import { jobRecommendations, jobs, studentProfiles } from "@/lib/mock-data"
import { usePartner } from "../partner-context"

const recStatusLabels: Record<string, string> = {
  pending: "待查看",
  viewed: "已查看",
  contacted: "已联系",
  hired: "已录用",
  rejected: "不合适",
}

const recStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  viewed: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-gray-100 text-gray-800",
}

export default function PartnerRecommendationsPage() {
  const { selectedEnterpriseId } = usePartner()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const [selectedRec, setSelectedRec] = useState<typeof jobRecommendations[0] | null>(null)

  const filtered = useMemo(() => {
    if (!selectedEnterpriseId) return []
    return jobRecommendations.filter((rec) => {
      const matchesSearch =
        rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || rec.status === statusFilter
      const matchesJob = jobFilter === "all" || rec.jobId === jobFilter
      const matchesPartner = rec.partnerId === selectedEnterpriseId
      return matchesSearch && matchesStatus && matchesJob && matchesPartner
    })
  }, [searchTerm, statusFilter, jobFilter, selectedEnterpriseId])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      viewed: 0,
      contacted: 0,
      hired: 0,
      rejected: 0,
    }
    jobRecommendations.forEach((rec) => {
      if (rec.partnerId === selectedEnterpriseId) {
        counts[rec.status] = (counts[rec.status] || 0) + 1
      }
    })
    return counts
  }, [selectedEnterpriseId])

  const partnerJobs = useMemo(() => {
    if (!selectedEnterpriseId) return []
    return jobs.filter((j) => j.partnerId === selectedEnterpriseId)
  }, [selectedEnterpriseId])

  const selectedStudent = selectedRec
    ? studentProfiles.find((s) => s.id === selectedRec.studentId)
    : null

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">就业推荐</h1>
          <p className="text-muted-foreground">
            基于岗位需求与学生画像的智能匹配推荐
          </p>
        </div>
        <Button onClick={() => alert('批量生成推荐功能开发中')}>
          <Sparkles className="h-4 w-4 mr-2" />
          批量生成推荐
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(recStatusLabels).map(([status, label]) => {
          const count = statusCounts[status] || 0
          return (
            <Card
              key={status}
              className={`cursor-pointer transition-all ${
                statusFilter === status ? "ring-2 ring-primary" : ""
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === status ? "all" : status)
              }
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
                placeholder="搜索学生姓名或岗位..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="推荐状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.entries(recStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="筛选岗位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部岗位</SelectItem>
                {partnerJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 推荐列表 */}
      <Card>
        <CardHeader>
          <CardTitle>推荐列表</CardTitle>
          <CardDescription>
            共 {filtered.length} 条推荐记录，按匹配度排序
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>学生信息</TableHead>
                <TableHead>推荐岗位</TableHead>
                <TableHead>匹配度</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>批次</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    没有找到符合条件的推荐记录
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{rec.studentName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{rec.studentName}</p>
                          <p className="text-xs text-muted-foreground">
                            {rec.studentMajor}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/partner/jobs/${rec.jobId}`}
                        className="hover:underline font-medium"
                      >
                        {rec.jobTitle}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={rec.matchScore}
                          className="w-16 h-2"
                        />
                        <span className="text-sm font-medium">
                          {rec.matchScore}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={recStatusColors[rec.status]}>
                        {recStatusLabels[rec.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {rec.batchNo}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRec(rec)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 推荐详情弹窗 */}
      <Dialog
        open={!!selectedRec}
        onOpenChange={(open) => !open && setSelectedRec(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>推荐详情</DialogTitle>
            <DialogDescription>岗位需求与学生画像的匹配分析</DialogDescription>
          </DialogHeader>
          {selectedRec && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {selectedRec.studentName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedRec.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRec.studentMajor}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-primary">
                    {selectedRec.matchScore}%
                  </p>
                  <p className="text-xs text-muted-foreground">匹配度</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">推荐岗位</h4>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedRec.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedRec.partnerName}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">匹配原因</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRec.matchReasons.map((reason) => (
                    <Badge key={reason} variant="secondary">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">推荐批次</p>
                  <p className="font-medium">{selectedRec.batchNo}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">当前状态</p>
                  <Badge className={recStatusColors[selectedRec.status]}>
                    {recStatusLabels[selectedRec.status]}
                  </Badge>
                </div>
              </div>

              {selectedStudent && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">学生档案</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">期望薪资</span>
                      <span>{selectedStudent.expectedSalary || "未填写"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">期望地点</span>
                      <span>{selectedStudent.expectedLocation || "未填写"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">技能标签</span>
                      <span>{selectedStudent.skills.slice(0, 4).join("、")}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedRec(null)}>
                  关闭
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => alert('标记为已联系功能开发中')}
                  disabled={selectedRec.status !== 'pending'}
                >
                  标记为已联系
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
