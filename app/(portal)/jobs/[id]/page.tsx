"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Briefcase,
  Heart,
  Share2,
  ExternalLink,
  Sparkles,
  LayoutGrid,
} from "lucide-react"
import { getJobById, partners, jobs } from "@/lib/mock-data"
import { 
  JOB_TYPE_LABELS, 
  WORK_NATURE_LABELS,
} from "@/lib/types"

const quickNavLinks = [
  {
    title: "产教融合",
    icon: Building2,
    links: [
      { name: "合作主体墙", href: "/partners" },
      { name: "合作项目墙", href: "/projects" },
      { name: "合作成果墙", href: "/achievements" },
      { name: "专家资源库", href: "/experts" },
      { name: "活动资讯", href: "/activities" },
    ],
  },
  {
    title: "品牌展示",
    icon: Sparkles,
    links: [
      { name: "人才品牌墙", href: "/brands/talent" },
      { name: "合作主体品牌墙", href: "/brands/partner" },
      { name: "岗位品牌墙", href: "/brands/job" },
      { name: "专业品牌墙", href: "/brands/major" },
      { name: "师资品牌墙", href: "/brands/teacher" },
      { name: "文化思政品牌墙", href: "/brands/culture" },
    ],
  },
  {
    title: "岗位大厅",
    icon: LayoutGrid,
    links: [
      { name: "岗位大厅", href: "/jobs" },
      { name: "优质毕业生推荐", href: "/brands/talent" },
    ],
  },
]

function QuickNavFooter() {
  return (
    <footer className="bg-slate-100/80 border-t border-slate-200">
      <div className="container mx-auto px-4 py-10">
        <h3 className="text-base font-semibold text-slate-800 mb-6">快捷导航</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {quickNavLinks.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="h-4 w-4 text-slate-500" />
                <h4 className="text-sm font-semibold text-slate-800">{section.title}</h4>
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

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

  const salaryText = job.salaryMin && job.salaryMax 
    ? `${job.salaryMin}-${job.salaryMax}K` 
    : '面议'

  const deadlineText = job.deadline 
    ? job.deadline.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) 
    : '长期'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50/40 to-indigo-50/20 pb-24 lg:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link 
            href="/jobs" 
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Link>
          <span className="text-base font-medium text-foreground">岗位详情</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px] items-start">
          {/* 左侧主要内容 */}
          <div className="space-y-5">
            {/* 岗位信息头部 —— BOSS 风格 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                      <span className="text-2xl sm:text-3xl font-bold text-blue-500">{salaryText}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        信息技术
                      </span>
                    </div>
                  </div>
                </div>

                {/* 桌面端操作按钮 */}
                <div className="hidden lg:flex items-center gap-4 mt-5 pt-5 border-t border-dashed border-slate-200">
                  <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="px-12 py-6 text-lg bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200" disabled={applied}>
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
                  <Button variant="outline" size="lg" className="px-10 py-6 text-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                    <Heart className="h-5 w-5 mr-2" />
                    收藏
                  </Button>
                  <Button variant="outline" size="lg" className="px-10 py-6 text-lg border-sky-200 text-sky-600 hover:bg-sky-50 hover:text-sky-700">
                    <Share2 className="h-5 w-5 mr-2" />
                    分享
                  </Button>
                </div>
              </div>
            </div>

            {/* 职位描述 */}
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-transparent">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                  <span className="w-1.5 h-5 bg-blue-500 rounded-full" />
                  职位描述
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    岗位介绍
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{job.description}</p>
                </div>
                <Separator className="bg-slate-100" />
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    岗位职责
                  </h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator className="bg-slate-100" />
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    任职要求
                  </h3>
                  <ul className="space-y-2">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 面向专业 */}
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-sky-50 to-transparent">
                <CardTitle className="text-base flex items-center gap-2 text-sky-700">
                  <span className="w-1.5 h-5 bg-sky-500 rounded-full" />
                  面向专业
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-semibold mb-2 text-slate-800">专业标签</p>
                  <div className="flex flex-wrap gap-2">
                    {job.suitableMajors.map((major) => (
                      <Badge key={major} className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">{major}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧信息 */}
          <div className="space-y-5 lg:sticky lg:top-[4.5rem]">
            {/* 公司信息 */}
            {partner && (
              <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-transparent">
                  <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                    <span className="w-1.5 h-5 bg-blue-500 rounded-full" />
                    公司信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-xl border border-blue-100 bg-blue-50">
                      <AvatarImage src={partner.logo} className="object-contain p-1" />
                      <AvatarFallback className="rounded-xl text-blue-600 font-semibold">{partner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate text-slate-800">{partner.name}</p>
                      <p className="text-sm text-slate-500 truncate">{partner.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {partner.description}
                  </p>
                  <div className="space-y-2 text-sm rounded-xl bg-slate-50 p-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">所在地区</span>
                      <span className="font-medium text-slate-700">{partner.region}</span>
                    </div>
                    {partner.employeeCount && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">企业规模</span>
                        <span className="font-medium text-slate-700">{partner.employeeCount} 人</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
                    <Link href={`/partners/${partner.id}`}>
                      查看企业详情
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 相似职位 */}
            {relatedJobs.length > 0 && (
              <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-transparent">
                  <CardTitle className="text-base flex items-center gap-2 text-indigo-700">
                    <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                    相似职位
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedJobs.map((relatedJob) => {
                    const relatedPartner = partners.find(p => p.id === relatedJob.partnerId)
                    return (
                      <Link
                        key={relatedJob.id}
                        href={`/jobs/${relatedJob.id}`}
                        className="block p-3 rounded-xl hover:bg-blue-50/50 transition-colors border border-slate-100"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8 rounded-lg border bg-slate-50">
                            <AvatarImage src={relatedPartner?.logo || relatedJob.partnerLogo} className="object-contain p-0.5" />
                            <AvatarFallback className="rounded-lg text-xs font-bold text-slate-600">{relatedJob.partnerName[0]}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-sm flex-1 min-w-0 truncate text-slate-800">{relatedJob.title}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-blue-600 font-semibold text-sm">
                            {relatedJob.salaryMin && relatedJob.salaryMax
                              ? `${relatedJob.salaryMin}-${relatedJob.salaryMax}K`
                              : '面议'}
                          </span>
                          <div className="flex items-center gap-1 overflow-hidden">
                            {["信息技术"].map((tag) => (
                              <Badge
                                key={tag}
                                className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
      </div>

      <div className="lg:hidden">
      </div>

      {/* 移动端底部操作栏 —— BOSS 风格 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 p-3 lg:hidden z-30">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Button variant="outline" size="icon" className="shrink-0 border-blue-200 text-blue-500 hover:bg-blue-50">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 border-sky-200 text-sky-500 hover:bg-sky-50">
            <Share2 className="h-5 w-5" />
          </Button>
          <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex-1 bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200" disabled={applied}>
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
        </div>
      </div>
    </div>
  )
}
