"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { TableRowActions } from "@/components/admin/table-row-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import { Sparkles, Eye, Building2, Briefcase } from "lucide-react"
import { jobRecommendations, jobs, studentProfiles, enterprises } from "@/lib/mock-data"

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

const PARTNER_FILTER_KEY = "employment_partner_filter"

export default function RecommendationsPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    status: "all",
    job: "all",
  })
  const [selectedRec, setSelectedRec] = useState<typeof jobRecommendations[0] | null>(null)
  const [partnerFilter, setPartnerFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(PARTNER_FILTER_KEY) || "all"
    }
    return "all"
  })

  const handlePartnerChange = (value: string) => {
    setPartnerFilter(value)
    if (typeof window !== "undefined") {
      localStorage.setItem(PARTNER_FILTER_KEY, value)
    }
  }

  const filtered = useMemo(() => {
    return jobRecommendations.filter((rec) => {
      const matchesSearch =
        rec.studentName.toLowerCase().includes(search.toLowerCase()) ||
        rec.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        rec.partnerName.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filters.status === "all" || rec.status === filters.status
      const matchesJob = filters.job === "all" || rec.jobId === filters.job
      const matchesPartner = partnerFilter === "all" || rec.partnerId === partnerFilter
      return matchesSearch && matchesStatus && matchesJob && matchesPartner
    })
  }, [search, filters, partnerFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      viewed: 0,
      contacted: 0,
      hired: 0,
      rejected: 0,
    }
    jobRecommendations.forEach((rec) => {
      if (partnerFilter === "all" || rec.partnerId === partnerFilter) {
        counts[rec.status] = (counts[rec.status] || 0) + 1
      }
    })
    return counts
  }, [partnerFilter])

  const partnerJobs = useMemo(() => {
    if (partnerFilter === "all") return jobs
    return jobs.filter((j) => j.partnerId === partnerFilter)
  }, [partnerFilter])

  const selectedStudent = selectedRec
    ? studentProfiles.find((s) => s.id === selectedRec.studentId)
    : null

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ status: "all", job: "all" })
  }

  const filterConfigs = [
    {
      key: "status",
      label: "全部状态",
      options: Object.entries(recStatusLabels).map(([value, label]) => ({ value, label })),
    },
    {
      key: "job",
      label: "全部岗位",
      options: partnerJobs.map((job) => ({ value: job.id, label: job.title })),
    },
  ]

  const stats = Object.entries(recStatusLabels).map(([status, label]) => ({
    key: status,
    label,
    value: statusCounts[status] || 0,
    filterKey: "status",
    filterValue: status,
  }))

  const columns = [
    {
      key: "student",
      title: "学生信息",
      render: (rec: typeof jobRecommendations[0]) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{rec.studentName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{rec.studentName}</p>
            <p className="text-xs text-muted-foreground">{rec.studentMajor}</p>
          </div>
        </div>
      ),
    },
    {
      key: "job",
      title: "推荐岗位",
      render: (rec: typeof jobRecommendations[0]) => (
        <Link href={`/admin/employment/jobs/${rec.jobId}`} className="hover:underline font-medium">
          {rec.jobTitle}
        </Link>
      ),
    },
    { key: "partner", title: "企业", render: (rec: typeof jobRecommendations[0]) => <span className="text-sm">{rec.partnerName}</span> },
    {
      key: "matchScore",
      title: "匹配度",
      render: (rec: typeof jobRecommendations[0]) => (
        <div className="flex items-center gap-2">
          <Progress value={rec.matchScore} className="w-16 h-2" />
          <span className="text-sm font-medium">{rec.matchScore}%</span>
        </div>
      ),
    },
    {
      key: "status",
      title: "状态",
      render: (rec: typeof jobRecommendations[0]) => (
        <Badge className={recStatusColors[rec.status]}>{recStatusLabels[rec.status]}</Badge>
      ),
    },
    { key: "batch", title: "批次", render: (rec: typeof jobRecommendations[0]) => <span className="text-xs text-muted-foreground">{rec.batchNo}</span> },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (rec: typeof jobRecommendations[0]) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedRec(rec)}>
            <Eye className="mr-1 h-3 w-3" />
            查看
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => alert("标记为已联系功能开发中")}
            disabled={rec.status !== "pending"}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            标记联系
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <AdminListPage
      title="就业推荐"
      subtitle="基于岗位需求与学生画像的智能匹配推荐"
      count={filtered.length}
      countLabel="条推荐"
      stats={stats}
      statsColumns={5}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索学生姓名、岗位或企业..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <>
          <Select value={partnerFilter} onValueChange={handlePartnerChange}>
            <SelectTrigger className="w-[220px]">
              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="选择企业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部企业</SelectItem>
              {enterprises.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => alert("批量生成推荐功能开发中")}>
            <Sparkles className="h-4 w-4 mr-1" />
            批量生成推荐
          </Button>
        </>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filtered}
        rowKey={(r) => r.id}
        emptyText="没有找到符合条件的推荐记录"
      />

      <Dialog open={!!selectedRec} onOpenChange={(open) => !open && setSelectedRec(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>推荐详情</DialogTitle>
            <DialogDescription>岗位需求与学生画像的匹配分析</DialogDescription>
          </DialogHeader>
          {selectedRec && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">{selectedRec.studentName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedRec.studentName}</p>
                  <p className="text-sm text-muted-foreground">{selectedRec.studentMajor}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-primary">{selectedRec.matchScore}%</p>
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
                    <span className="text-sm text-muted-foreground">{selectedRec.partnerName}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">匹配原因</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRec.matchReasons.map((reason) => (
                    <Badge key={reason} variant="secondary">{reason}</Badge>
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
                  <Badge className={recStatusColors[selectedRec.status]}>{recStatusLabels[selectedRec.status]}</Badge>
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
                  onClick={() => alert("标记为已联系功能开发中")}
                  disabled={selectedRec.status !== "pending"}
                >
                  标记为已联系
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
