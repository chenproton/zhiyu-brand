"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, 
  Edit, 
  Pause, 
  Play, 
  MapPin, 
  Building2, 
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
} from "lucide-react"
import { getJobById, getApplicationsByJobId } from "@/lib/mock-data"
import { 
  JOB_STATUS_LABELS, 
  JOB_TYPE_LABELS, 
  WORK_NATURE_LABELS,
  APPLICATION_STATUS_LABELS,
  type JobStatus 
} from "@/lib/types"

const statusColors: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  filled: "bg-blue-100 text-blue-800",
}

const appStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  viewed: "bg-blue-100 text-blue-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = getJobById(id)

  if (!job) {
    notFound()
  }

  const applications = getApplicationsByJobId(job.id)

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/employment/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            {job.isUrgent && <Badge variant="destructive">急招</Badge>}
            {job.isRecommended && <Badge variant="secondary">推荐</Badge>}
          </div>
          <p className="text-muted-foreground">{job.partnerName}</p>
        </div>
        <div className="flex gap-2">
          {job.status === "published" ? (
            <Button variant="outline" onClick={() => alert('暂停招聘功能开发中')}>
              <Pause className="h-4 w-4 mr-2" />
              暂停招聘
            </Button>
          ) : job.status === "paused" ? (
            <Button variant="outline" onClick={() => alert('恢复招聘功能开发中')}>
              <Play className="h-4 w-4 mr-2" />
              恢复招聘
            </Button>
          ) : null}
          <Button onClick={() => alert('编辑岗位功能开发中')}>
            <Edit className="h-4 w-4 mr-2" />
            编辑岗位
          </Button>
        </div>
      </div>

      {/* 岗位信息卡片 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>岗位信息</CardTitle>
                <Badge className={statusColors[job.status]}>
                  {JOB_STATUS_LABELS[job.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-primary text-lg">
                    {job.salaryMin && job.salaryMax 
                      ? `${job.salaryMin/1000}-${job.salaryMax/1000}K/月` 
                      : '薪资面议'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{JOB_TYPE_LABELS[job.type]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{WORK_NATURE_LABELS[job.workNature]}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">{job.headcount}</p>
                  <p className="text-sm text-muted-foreground">招聘人数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{job.viewCount}</p>
                  <p className="text-sm text-muted-foreground">浏览次数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{job.applicationCount}</p>
                  <p className="text-sm text-muted-foreground">投递人数</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">岗位描述</h4>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">岗位职责</h4>
                <ul className="space-y-1">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">任职要求</h4>
                <ul className="space-y-1">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 投递列表 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>投递记录 ({applications.length})</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/employment/applications?jobId=${job.id}`}>
                  查看全部
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无投递记录
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{app.studentName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{app.studentName}</p>
                          <p className="text-sm text-muted-foreground">{app.studentMajor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {app.appliedAt.toLocaleDateString('zh-CN')}
                        </span>
                        <Badge className={appStatusColors[app.status]}>
                          {APPLICATION_STATUS_LABELS[app.status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧信息 */}
        <div className="space-y-6">
          {/* 要求信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">招聘要求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">学历要求</span>
                <span className="text-sm font-medium">{job.education}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">经验要求</span>
                <span className="text-sm font-medium">{job.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">截止日期</span>
                <span className="text-sm font-medium">
                  {job.deadline ? job.deadline.toLocaleDateString('zh-CN') : '长期有效'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 适合专业 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">适合专业</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.suitableMajors.map((major) => (
                  <Badge key={major} variant="outline">{major}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 技能要求 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">技能要求</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 福利待遇 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">福利待遇</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit) => (
                  <Badge key={benefit} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 联系方式 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">联系方式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {job.contactPerson && (
                <p><span className="text-muted-foreground">联系人：</span>{job.contactPerson}</p>
              )}
              {job.contactPhone && (
                <p><span className="text-muted-foreground">电话：</span>{job.contactPhone}</p>
              )}
              {job.contactEmail && (
                <p><span className="text-muted-foreground">邮箱：</span>{job.contactEmail}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
