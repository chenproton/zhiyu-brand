"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableRowActions } from "@/components/admin/table-row-actions"
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import {
  Plus,
  Eye,
  Edit,
  Pause,
  Play,
  Trash2,
  MapPin,
  Building2,
  Sparkles,
} from "lucide-react"
import { jobs, jobRecommendations, enterprises } from "@/lib/mock-data"
import { JOB_STATUS_LABELS, JOB_TYPE_LABELS, type JobStatus } from "@/lib/types"

const statusColors: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  filled: "bg-blue-100 text-blue-800",
}

const PARTNER_FILTER_KEY = "employment_partner_filter"

export default function JobsPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    status: "all",
    type: "all",
  })
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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.partnerName.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filters.status === "all" || job.status === filters.status
      const matchesType = filters.type === "all" || job.type === filters.type
      const matchesPartner = partnerFilter === "all" || job.partnerId === partnerFilter
      return matchesSearch && matchesStatus && matchesType && matchesPartner
    })
  }, [search, filters, partnerFilter])

  const getRecommendationCount = (jobId: string) => {
    return jobRecommendations.filter((r) => r.jobId === jobId).length
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ status: "all", type: "all" })
  }

  const filterConfigs = [
    {
      key: "status",
      label: "全部状态",
      options: Object.entries(JOB_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: "type",
      label: "全部类型",
      options: Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    },
  ]

  const stats = Object.entries(JOB_STATUS_LABELS).map(([status, label]) => ({
    key: status,
    label,
    value: jobs.filter((j) => j.status === status && (partnerFilter === "all" || j.partnerId === partnerFilter)).length,
    filterKey: "status",
    filterValue: status,
  }))

  const columns = [
    {
      key: "jobInfo",
      title: "岗位信息",
      width: "w-[280px]",
      render: (job: typeof jobs[0]) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{job.title}</p>
            {job.isUrgent && <Badge variant="destructive" className="text-xs">急招</Badge>}
            {job.isRecommended && <Badge variant="secondary" className="text-xs">推荐</Badge>}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            {job.location}
            {job.jobBrandName && (
              <>
                <span className="mx-1">·</span>
                <span>基于: {job.jobBrandName}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "partner",
      title: "企业",
      render: (job: typeof jobs[0]) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{job.partnerName}</span>
        </div>
      ),
    },
    {
      key: "salary",
      title: "薪资",
      render: (job: typeof jobs[0]) => (
        <span className="text-sm font-medium text-primary">
          {job.salaryMin && job.salaryMax ? `${job.salaryMin}-${job.salaryMax}K` : "面议"}
        </span>
      ),
    },
    {
      key: "status",
      title: "状态",
      render: (job: typeof jobs[0]) => (
        <Badge className={statusColors[job.status]}>{JOB_STATUS_LABELS[job.status]}</Badge>
      ),
    },
    {
      key: "views",
      title: "浏览/推荐",
      align: "center" as const,
      render: (job: typeof jobs[0]) => (
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {job.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {getRecommendationCount(job.id)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (job: typeof jobs[0]) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/employment/jobs/${job.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert("编辑岗位功能开发中")}>
            <Edit className="mr-1 h-3 w-3" />
            编辑
          </Button>
          {job.status === "published" ? (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert("暂停招聘功能开发中")}>
              <Pause className="mr-1 h-3 w-3" />
              暂停
            </Button>
          ) : job.status === "paused" ? (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert("恢复招聘功能开发中")}>
              <Play className="mr-1 h-3 w-3" />
              恢复
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => alert("删除岗位功能开发中")}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <AdminListPage
      title="岗位管理"
      subtitle="基于岗位成果发布和管理招聘岗位"
      count={filteredJobs.length}
      countLabel="个岗位"
      stats={stats}
      statsColumns={5}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索岗位名称或企业..."
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
          <Button asChild size="sm">
            <Link href="/admin/employment/jobs/new">
              <Plus className="h-4 w-4 mr-1" />
              发布岗位
            </Link>
          </Button>
        </>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredJobs}
        rowKey={(j) => j.id}
        emptyText="没有找到符合条件的岗位"
      />
    </AdminListPage>
  )
}
