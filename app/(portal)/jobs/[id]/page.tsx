"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  ArrowLeft, 
  MapPin, 
  Building2, 
  Clock,
  Briefcase,
  GraduationCap,
  DollarSign,
  Users,
  CheckCircle2,
  Heart,
  Share2,
  Calendar,
  Mail,
  Phone,
  Globe,
  ExternalLink,
} from "lucide-react"
import { getJobById, partners, jobs } from "@/lib/mock-data"
import { 
  JOB_TYPE_LABELS, 
  WORK_NATURE_LABELS,
} from "@/lib/types"

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = getJobById(id)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  if (!job) {
    notFound()
  }

  const partner = partners.find(p => p.id === job.partnerId)
  const relatedJobs = jobs.filter(j => 
    j.partnerId === job.partnerId && 
    j.id !== job.id && 
    j.status === "published"
  ).slice(0, 3)

  const handleApply = async () => {
    setIsApplying(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsApplying(false)
    setShowApplyDialog(false)
    setApplied(true)
  }

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
            返回岗位列表
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 岗位标题卡片 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={job.partnerLogo} />
                      <AvatarFallback>{job.partnerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">{job.title}</h1>
                        {job.isUrgent && <Badge variant="destructive">急招</Badge>}
                        {job.isRecommended && <Badge variant="secondary">推荐</Badge>}
                      </div>
                      <p className="text-lg text-muted-foreground mb-2">{job.partnerName}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {JOB_TYPE_LABELS[job.type]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {WORK_NATURE_LABELS[job.workNature]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {job.salaryMin && job.salaryMax 
                        ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` 
                        : '面议'}
                    </p>
                    <p className="text-sm text-muted-foreground">元/月</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg mb-6">
                  <div className="text-center">
                    <p className="text-xl font-semibold">{job.headcount}</p>
                    <p className="text-xs text-muted-foreground">招聘人数</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="text-xl font-semibold">{job.education}</p>
                    <p className="text-xs text-muted-foreground">学历要求</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="text-xl font-semibold">{job.experience}</p>
                    <p className="text-xs text-muted-foreground">经验要求</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="text-xl font-semibold">
                      {job.deadline ? job.deadline.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) : '长期'}
                    </p>
                    <p className="text-xs text-muted-foreground">截止日期</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="flex-1" disabled={applied}>
                        {applied ? "已投递" : "立即投递"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>投递简历</DialogTitle>
                        <DialogDescription>
                          您正在投递「{job.title}」岗位
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>求职信（选填）</Label>
                          <Textarea
                            placeholder="向HR介绍一下自己，说明为什么适合这个岗位..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={6}
                          />
                        </div>
                        <div className="p-3 bg-muted rounded-lg text-sm">
                          <p className="font-medium mb-1">投递须知</p>
                          <ul className="text-muted-foreground space-y-1">
                            <li>- 系统将自动附带您的在线简历</li>
                            <li>- 企业HR会在3个工作日内查看您的简历</li>
                            <li>- 您可以在「我的投递」中查看投递状态</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                          取消
                        </Button>
                        <Button onClick={handleApply} disabled={isApplying}>
                          {isApplying ? "投递中..." : "确认投递"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="lg">
                    <Heart className="h-4 w-4 mr-2" />
                    收藏
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 岗位描述 */}
            <Card>
              <CardHeader>
                <CardTitle>岗位描述</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* 岗位职责 */}
            <Card>
              <CardHeader>
                <CardTitle>岗位职责</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 任职要求 */}
            <Card>
              <CardHeader>
                <CardTitle>任职要求</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 右侧信息 */}
          <div className="space-y-6">
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

            {/* 企业信息 */}
            {partner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">企业信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={partner.logo} />
                      <AvatarFallback>{partner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {partner.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{partner.region}</span>
                    </div>
                    {partner.employeeCount && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{partner.employeeCount} 人</span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/partners/${partner.id}`}>
                      查看企业详情
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 该企业其他岗位 */}
            {relatedJobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">该企业其他岗位</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedJobs.map((relatedJob) => (
                    <Link 
                      key={relatedJob.id} 
                      href={`/jobs/${relatedJob.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm">{relatedJob.title}</p>
                      <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                        <span>
                          {relatedJob.salaryMin && relatedJob.salaryMax 
                            ? `${relatedJob.salaryMin/1000}-${relatedJob.salaryMax/1000}K` 
                            : '面议'}
                        </span>
                        <span>{JOB_TYPE_LABELS[relatedJob.type]}</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
