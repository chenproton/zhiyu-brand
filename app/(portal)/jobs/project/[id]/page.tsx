"use client"

import { use, useMemo, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  Search,
  FileText,
  Eye,
} from "lucide-react"
import { getEmploymentProjectById, enterprises, jobs } from "@/lib/mock-data"
import {
  EMPLOYMENT_PROJECT_TYPE_LABELS,
  EMPLOYMENT_PROJECT_STATUS_LABELS,
  JOB_TYPE_LABELS,
  JOB_STATUS_LABELS,
} from "@/lib/types"

const statusColors: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
}

export default function EmploymentProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = getEmploymentProjectById(id)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"job" | "enterprise">("job")

  if (!project) {
    notFound()
  }

  const projectJobs = useMemo(() => {
    return jobs.filter(
      (job) => project.partnerIds.includes(job.partnerId) && job.status === "published"
    )
  }, [project])

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return projectJobs
    const term = searchTerm.toLowerCase()
    return projectJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.partnerName.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
    )
  }, [projectJobs, searchTerm])

  const enterpriseGroups = useMemo(() => {
    const map = new Map<string, { enterprise: typeof enterprises[0]; jobs: typeof projectJobs }>()
    filteredJobs.forEach((job) => {
      const enterprise = enterprises.find((e) => e.id === job.partnerId)
      if (!enterprise) return
      if (!map.has(enterprise.id)) {
        map.set(enterprise.id, { enterprise, jobs: [] })
      }
      map.get(enterprise.id)!.jobs.push(job)
    })
    return Array.from(map.values())
  }, [filteredJobs])

  const recruitmentScope = project.recruitmentScope || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            返回项目列表
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <Badge className={statusColors[project.status]}>
                    {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                  <Badge variant="outline">
                    {EMPLOYMENT_PROJECT_TYPE_LABELS[project.type]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {project.description || `就业项目，面向${project.targetStudentGroups.join('、')}学生。`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">起止时间：</span>
                {project.startDate.toLocaleDateString('zh-CN')} ~ {project.endDate.toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">岗位数：</span>
                {project.jobCount}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">参与企业：</span>
                {project.partnerIds.length} 家
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">发布单位：</span>
                {project.createdBy || '—'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">发布日期：</span>
                {project.createdAt.toLocaleDateString('zh-CN')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">招聘范围</CardTitle>
            <CardDescription>本项目面向以下二级学院、专业、年级及班级招聘</CardDescription>
          </CardHeader>
          <CardContent>
            {recruitmentScope.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无详细招聘范围数据</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>二级学院</TableHead>
                      <TableHead>专业</TableHead>
                      <TableHead>年级</TableHead>
                      <TableHead>班级</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recruitmentScope.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.secondaryCollege}</TableCell>
                        <TableCell>{item.major}</TableCell>
                        <TableCell>{item.grade}</TableCell>
                        <TableCell>{item.className}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>岗位列表</CardTitle>
                <CardDescription>本项目发布的招聘岗位</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "job" | "enterprise")}>
                  <TabsList>
                    <TabsTrigger value="job">按岗位浏览</TabsTrigger>
                    <TabsTrigger value="enterprise">按企业浏览</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索岗位名称、企业或地点..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredJobs.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                该项目暂无招聘岗位
              </div>
            ) : viewMode === "job" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {enterpriseGroups.map(({ enterprise, jobs: groupJobs }) => (
                  <div key={enterprise.id}>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={enterprise.logo} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
                          {enterprise.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm">{enterprise.name}</h4>
                        <p className="text-xs text-muted-foreground">{enterprise.industry} · {enterprise.region}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {groupJobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function JobCard({ job }: { job: typeof jobs[0] }) {
  const enterprise = enterprises.find((e) => e.id === job.partnerId)
  const logoSrc = enterprise?.logo || "/placeholder.svg?height=64&width=64"
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-3xl overflow-hidden bg-white">
        <div className="flex h-28">
          <div className="w-28 flex items-center justify-center shrink-0 border-r border-slate-100 bg-white p-4">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarImage src={logoSrc} alt={job.title} className="object-contain p-1" />
              <AvatarFallback className="rounded-xl bg-slate-100 text-slate-800 font-bold text-sm">
                {enterprise?.name?.[0] || job.partnerName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardContent className="flex-1 p-4 flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h4 className="font-bold text-slate-900 text-sm truncate">{job.title}</h4>
              <Eye className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mb-2">{job.partnerName} · {job.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {job.suitableMajors.slice(0, 2).map((major) => (
                <span key={major} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                  {major}
                </span>
              ))}
              {job.skills.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-600">
                  {job.salaryMin && job.salaryMax ? `${job.salaryMin}-${job.salaryMax}K` : '面议'}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
              </div>
              <Badge variant={job.status === "published" ? "secondary" : "outline"} className="text-[10px]">
                {JOB_STATUS_LABELS[job.status]}
              </Badge>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
