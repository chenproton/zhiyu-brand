"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Edit, 
  Pause, 
  Play, 
  MapPin, 
  Building2, 
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  DollarSign,
} from "lucide-react"
import { getJobById, getRecommendationsByJobId } from "@/lib/mock-data"
import { 
  JOB_STATUS_LABELS, 
  JOB_TYPE_LABELS, 
  WORK_NATURE_LABELS,
  type JobStatus 
} from "@/lib/types"

const statusColors: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  filled: "bg-blue-100 text-blue-800",
}

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

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = getJobById(id)

  if (!job) {
    notFound()
  }

  const recommendations = getRecommendationsByJobId(job.id)

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
                      ? `${job.salaryMin}-${job.salaryMax}K/月` 
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

              {job.jobBrandName && (
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm">
                    <span className="text-muted-foreground">基于岗位成果：</span>
                    <span className="font-medium">{job.jobBrandName}</span>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold">{job.headcount}</p>
                  <p className="text-sm text-muted-foreground">招聘人数</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                  <p className="text-sm text-muted-foreground">推荐人数</p>
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

          {/* 推荐学生列表 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  智能推荐毕业生 ({recommendations.length})
                </div>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => alert('生成新批次推荐功能开发中')}>
                <Sparkles className="h-4 w-4 mr-2" />
                生成新批次推荐
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无推荐记录，发布后系统将自动匹配推荐
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.slice(0, 8).map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{rec.studentName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{rec.studentName}</p>
                          <p className="text-sm text-muted-foreground">{rec.studentMajor}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.matchReasons.map((reason) => (
                              <Badge key={reason} variant="outline" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>匹配度</span>
                            <span className="font-medium text-primary">{rec.matchScore}%</span>
                          </div>
                          <Progress value={rec.matchScore} className="w-24 h-2 mt-1" />
                        </div>
                        <Badge className={recStatusColors[rec.status]}>
                          {recStatusLabels[rec.status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recommendations.length > 8 && (
                    <p className="text-center text-sm text-muted-foreground pt-2">
                      还有 {recommendations.length - 8} 条推荐记录
                    </p>
                  )}
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
