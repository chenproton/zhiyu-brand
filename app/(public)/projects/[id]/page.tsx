import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ProjectPhaseBadge,
  ProjectPublishStatusBadge,
  MilestoneStatusBadge,
  AgreementStatusBadge,
} from "@/components/shared/status-badge"
import {
  ArrowLeft,
  FolderKanban,
  Building2,
  FileText,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  Target,
} from "lucide-react"
import { projects, partners } from "@/lib/mock-data"
import { PROJECT_PHASE_LABELS } from "@/lib/types"
import type { Partner } from "@/lib/types"

function getMilestoneIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    case 'in-progress':
      return <Clock className="h-5 w-5 text-blue-600" />
    case 'delayed':
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Circle className="h-5 w-5 text-slate-300" />
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project || project.publishStatus !== 'published') {
    notFound()
  }

  const partnerIds = project.partnerIds?.length ? project.partnerIds : [project.partnerId]
  const projectPartners = partnerIds
    .map((pid) => partners.find((p) => p.id === pid))
    .filter((p): p is Partner => !!p)

  const agreements = project.projectAgreements || []
  const achievements = project.supportingResults || []

  const progress = project.milestones.length > 0
    ? Math.round((project.milestones.filter((m) => m.status === 'completed').length / project.milestones.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-indigo-50/30">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-blue-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回列表
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200 shrink-0">
              <FolderKanban className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-2">
                {project.name}
              </h1>
              <p className="text-slate-500 text-lg">{project.type}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <ProjectPhaseBadge phase={project.phase} />
                <ProjectPublishStatusBadge status={project.publishStatus} />
                {project.rating && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    评级 {project.rating} 分
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: "里程碑进度", value: `${progress}%`, icon: Target, color: "from-blue-500 to-blue-600" },
              { label: "合作协议", value: agreements.length, icon: FileText, color: "from-violet-500 to-violet-600" },
              { label: "关联成果", value: achievements.length, icon: Award, color: "from-emerald-500 to-emerald-600" },
              { label: "合作主体", value: projectPartners.length, icon: Building2, color: "from-amber-500 to-amber-600" },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm rounded-3xl bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="rounded-2xl p-1 bg-white shadow-sm border border-slate-100">
              <TabsTrigger value="info" className="rounded-xl">项目信息</TabsTrigger>
              <TabsTrigger value="milestones" className="rounded-xl">项目里程碑 ({project.milestones.length})</TabsTrigger>
              <TabsTrigger value="agreement" className="rounded-xl">项目协议 ({agreements.length})</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl">关联成果 ({achievements.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-0 shadow-sm rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                      项目简介
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>

                <Card className="h-fit self-start border-0 shadow-sm rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                      关联信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projectPartners.length > 0 && (
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">合作主体</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {projectPartners.map((p) => (
                              <Link
                                key={p.id}
                                href={`/partners/${p.id}`}
                                className="font-medium text-slate-900 hover:text-indigo-600 transition-colors text-sm"
                              >
                                {p.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {agreements.length > 0 && (
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">项目协议</p>
                          <p className="font-semibold text-slate-900">{agreements.length} 项协议</p>
                        </div>
                      </div>
                    )}
                    {achievements.length > 0 && (
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">关联成果</p>
                          <p className="font-semibold text-slate-900">{achievements.length} 项成果</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-0 shadow-sm rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                      项目信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-xs text-slate-400 mb-1">合作类型</p>
                        <p className="font-semibold text-slate-900">{project.type}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-xs text-slate-400 mb-1">当前阶段</p>
                        <p className="font-semibold text-slate-900">{PROJECT_PHASE_LABELS[project.phase]}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-xs text-slate-400 mb-1">关联二级学院</p>
                        <p className="font-semibold text-slate-900">{project.secondaryColleges?.join('、') || '未设置'}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-xs text-slate-400 mb-1">创建时间</p>
                        <p className="font-semibold text-slate-900">{project.createdAt.toLocaleDateString('zh-CN')}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50">
                        <p className="text-xs text-slate-400 mb-1">更新时间</p>
                        <p className="font-semibold text-slate-900">{project.updatedAt.toLocaleDateString('zh-CN')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="milestones">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg">项目里程碑</CardTitle>
                  <CardDescription>跟踪项目关键节点的完成情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>总体进度</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  {project.milestones.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-slate-200" />
                      <div className="space-y-6">
                        {project.milestones.map((milestone) => (
                          <div key={milestone.id} className="relative flex gap-4">
                            <div className="relative z-10 bg-white rounded-full">{getMilestoneIcon(milestone.status)}</div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">{milestone.name}</p>
                                  <p className="text-sm text-slate-500 mt-1">{milestone.description}</p>
                                </div>
                                <MilestoneStatusBadge status={milestone.status} />
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  计划: {milestone.dueDate.toLocaleDateString('zh-CN')}
                                </span>
                                {milestone.completedDate && (
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    完成: {milestone.completedDate.toLocaleDateString('zh-CN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <Target className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>暂无里程碑数据</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agreement">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg">项目协议</CardTitle>
                  <CardDescription>项目相关的合作协议</CardDescription>
                </CardHeader>
                <CardContent>
                  {agreements.length > 0 ? (
                    <div className="space-y-4">
                      {agreements.map((agreement) => (
                        <div key={agreement.id} className="p-5 bg-slate-50 rounded-2xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <p className="font-semibold text-slate-900 text-sm">{agreement.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-[10px]">{agreement.type}</Badge>
                              <AgreementStatusBadge status={agreement.status} className="text-[10px]" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">
                            {agreement.startDate.toLocaleDateString('zh-CN')} 至 {agreement.endDate.toLocaleDateString('zh-CN')}
                          </p>
                          {agreement.attachments && agreement.attachments.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <FileText className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-400">{agreement.attachments.length} 个附件</span>
                            </div>
                          )}
                          {agreement.content && (
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{agreement.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>暂无项目协议</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg">关联成果</CardTitle>
                  <CardDescription>项目产生的合作成果</CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {achievements.map((item) => (
                        <Card key={item.id} className="border-0 shadow-sm rounded-3xl bg-slate-50">
                          <CardHeader>
                            <CardTitle className="text-base line-clamp-2">{item.name}</CardTitle>
                            <CardDescription>{item.createdAt.toLocaleDateString('zh-CN')}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                            <div className="mt-3">
                              <Badge variant="secondary">{item.type}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <Award className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>暂无关联成果</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
