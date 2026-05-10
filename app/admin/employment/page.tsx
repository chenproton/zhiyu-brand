"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Briefcase, 
  FileText, 
  Users, 
  TrendingUp,
  Building2,
  GraduationCap,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react"
import { jobs, jobApplications, employmentStats } from "@/lib/mock-data"
import { JOB_STATUS_LABELS, APPLICATION_STATUS_LABELS } from "@/lib/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  viewed: "bg-blue-100 text-blue-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
}

export default function EmploymentPage() {
  const recentApplications = jobApplications.slice(0, 5)
  const urgentJobs = jobs.filter(j => j.isUrgent && j.status === "published")

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">就业服务管理</h1>
          <p className="text-muted-foreground">岗位发布、学生投递、信息撮合服务</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/employment/jobs/new">发布岗位</Link>
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">在招岗位</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employmentStats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              共 {employmentStats.totalJobs} 个岗位
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">投递总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employmentStats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              待处理 {employmentStats.pendingApplications} 份
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">面试中</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employmentStats.interviewCount}</div>
            <p className="text-xs text-muted-foreground">
              已发offer {employmentStats.applicationsByStatus.offer} 份
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已录用</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employmentStats.hiredCount}</div>
            <p className="text-xs text-muted-foreground">
              录用率 {employmentStats.totalApplications > 0 ? ((employmentStats.hiredCount / employmentStats.totalApplications) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 快捷入口 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/admin/employment/projects">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-base">就业项目</CardTitle>
                  <CardDescription>招聘季项目管理</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  管理招聘活动
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/employment/jobs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">岗位管理</CardTitle>
                  <CardDescription>发布和管理招聘岗位</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {employmentStats.activeJobs} 个在招岗位
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/employment/applications">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">投递管理</CardTitle>
                  <CardDescription>查看和处理学生投递</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {employmentStats.pendingApplications} 份待处理
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/employment/students">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">学生档案</CardTitle>
                  <CardDescription>管理学生求职档案</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  查看学生简历
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 最新投递 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最新投递</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/employment/applications">查看全部</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{app.studentName}</p>
                      <p className="text-xs text-muted-foreground">投递: {app.jobTitle}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[app.status]}>
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 紧急招聘 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>紧急招聘</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/employment/jobs">查看全部</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">暂无紧急招聘岗位</p>
              ) : (
                urgentJobs.map((job) => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{job.title}</p>
                          <Badge variant="destructive" className="text-xs">急招</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.partnerName}</p>
                      </div>
                      <p className="text-sm font-medium text-primary">
                        {job.salaryMin && job.salaryMax ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` : '面议'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {job.viewCount} 浏览
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {job.applicationCount} 投递
                        </span>
                      </div>
                      <span>招 {job.headcount} 人</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 投递状态分布 */}
      <Card>
        <CardHeader>
          <CardTitle>投递状态分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-7">
            {Object.entries(employmentStats.applicationsByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">
                  {APPLICATION_STATUS_LABELS[status as keyof typeof APPLICATION_STATUS_LABELS]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
