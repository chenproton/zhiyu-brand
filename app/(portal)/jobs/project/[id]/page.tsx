"use client"

import { useState, use, useMemo } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase,
  Users,
  Calendar,
  Building2,
  Search,
} from "lucide-react"
import { getEmploymentProjectById, enterprises, jobs } from "@/lib/mock-data"
import { 
  EMPLOYMENT_PROJECT_TYPE_LABELS, 
  EMPLOYMENT_PROJECT_STATUS_LABELS,
  JOB_TYPE_LABELS,
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

  if (!project) {
    notFound()
  }

  // 获取项目关联的企业
  const projectEnterprises = useMemo(() => {
    return project.partnerIds
      .map((pid) => enterprises.find((e) => e.id === pid))
      .filter(Boolean)
  }, [project])

  // 获取这些企业发布的岗位
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
        job.skills.some((s) => s.toLowerCase().includes(term))
    )
  }, [projectJobs, searchTerm])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        {/* 项目信息卡片 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <Badge className={statusColors[project.status]}>
                    {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
                  </Badge>
                  <Badge variant="outline">
                    {EMPLOYMENT_PROJECT_TYPE_LABELS[project.type]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  面向{project.targetStudentGroups.join('、')}学生
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {project.startDate.toLocaleDateString('zh-CN')} ~ {project.endDate.toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {project.jobCount} 个岗位
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {project.applicationCount} 人投递
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {project.partnerIds.length} 家合作企业
              </div>
            </div>

            {project.description && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {project.description}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* 左侧：企业列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">参与企业</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectEnterprises.map((enterprise) => (
                  <div key={enterprise!.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={enterprise!.logo} />
                      <AvatarFallback>{enterprise!.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{enterprise!.name}</p>
                      <p className="text-xs text-muted-foreground">{enterprise!.industry}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：岗位列表 */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                岗位合集
                <span className="text-base font-normal text-muted-foreground ml-2">
                  ({filteredJobs.length})
                </span>
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索岗位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  该项目暂无招聘岗位
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-5">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={job.partnerLogo} />
                            <AvatarFallback>{job.partnerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">{job.partnerName}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {JOB_TYPE_LABELS[job.type]}
                              </span>
                              <span>招 {job.headcount} 人</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {job.salaryMin && job.salaryMax 
                              ? `${job.salaryMin}-${job.salaryMax}K` 
                              : '面议'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.education} | {job.experience}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
