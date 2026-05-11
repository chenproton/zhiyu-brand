import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ProjectPhaseBadge,
  ProjectPublishStatusBadge,
  MilestoneStatusBadge,
} from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  Send,
  EyeOff,
  FolderKanban,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Award,
} from 'lucide-react'
import { getProjectById, getPartnerById, getAgreementById, getAchievementsByPartnerId } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS, PROJECT_PUBLISH_STATUS_LABELS } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = getProjectById(id)

  if (!project) {
    notFound()
  }

  const partner = project.partnerId ? getPartnerById(project.partnerId) : null
  const agreement = project.agreementId ? getAgreementById(project.agreementId) : null
  const achievements = getAchievementsByPartnerId(project.partnerId).filter(a => a.projectId === project.id)

  // Calculate milestone progress
  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length
  const totalMilestones = project.milestones.length
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  // Get milestone status icon
  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'delayed':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  return (
    <div>
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-muted-foreground">{project.type}</p>
              <div className="flex items-center gap-2 mt-2">
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
          <div className="flex items-center gap-2">
            {project.publishStatus === 'draft' ? (
              <Button
                variant="default"
                onClick={() => {
                  project.publishStatus = 'published'
                  project.updatedAt = new Date()
                  window.location.reload()
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                发布项目
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  project.publishStatus = 'draft'
                  project.updatedAt = new Date()
                  window.location.reload()
                }}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                撤销发布
              </Button>
            )}
            <Link href={`/admin/projects/${id}/edit`}>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                编辑项目
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-2">整体进度</p>
                <div className="flex items-center gap-4">
                  <Progress value={progress} className="flex-1 h-3" />
                  <span className="text-2xl font-bold">{progress}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  已完成 {completedMilestones} / {totalMilestones} 个里程碑
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">项目周期</p>
                <p className="font-medium">
                  {project.startDate.toLocaleDateString('zh-CN')}
                </p>
                <p className="text-sm text-muted-foreground">
                  至 {project.endDate.toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">项目预算</p>
                <p className="text-2xl font-bold">
                  {project.budget ? `¥${(project.budget / 10000).toFixed(1)}万` : '未设置'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList>
            <TabsTrigger value="milestones">里程碑（进展）</TabsTrigger>
            <TabsTrigger value="info">项目信息</TabsTrigger>
            <TabsTrigger value="agreement">项目协议</TabsTrigger>
            <TabsTrigger value="achievements">关联成果 ({achievements.length})</TabsTrigger>
            <TabsTrigger value="activities">联盟活动</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">项目里程碑</CardTitle>
                <CardDescription>跟踪项目关键节点的完成情况</CardDescription>
              </CardHeader>
              <CardContent>
                {project.milestones.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-gray-200" />

                    <div className="space-y-6">
                      {project.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="relative flex gap-4">
                          {/* Icon */}
                          <div className="relative z-10 bg-white">
                            {getMilestoneIcon(milestone.status)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{milestone.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {milestone.description}
                                </p>
                              </div>
                              <MilestoneStatusBadge status={milestone.status} />
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                计划: {milestone.dueDate.toLocaleDateString('zh-CN')}
                              </span>
                              {milestone.completedDate && (
                                <span className="flex items-center gap-1 text-green-600">
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
                  <div className="text-center py-8 text-muted-foreground">
                    暂无里程碑数据
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">项目简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">关联信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {partner && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">合作主体</p>
                        <Link
                          href={`/admin/partners/${partner.id}`}
                          className="font-medium hover:underline"
                        >
                          {partner.name}
                        </Link>
                      </div>
                    </div>
                  )}

                  {agreement && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">关联协议</p>
                        <Link
                          href={`/admin/agreements/${agreement.id}`}
                          className="font-medium hover:underline"
                        >
                          {agreement.name}
                        </Link>
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">关联成果</p>
                        <p className="font-medium">{achievements.length} 项成果</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">项目信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">项目类型</p>
                      <p className="font-medium">{project.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">当前阶段</p>
                      <p className="font-medium">{PROJECT_PHASE_LABELS[project.phase]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">创建时间</p>
                      <p className="font-medium">{project.createdAt.toLocaleDateString('zh-CN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">更新时间</p>
                      <p className="font-medium">{project.updatedAt.toLocaleDateString('zh-CN')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agreement">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">项目合作协议</CardTitle>
                  <CardDescription>该项目关联的合作协议</CardDescription>
                </div>
                <Button size="sm">关联协议</Button>
              </CardHeader>
              <CardContent>
                {agreement ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Link
                          href={`/admin/agreements/${agreement.id}`}
                          className="font-medium hover:underline"
                        >
                          {agreement.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {agreement.type} · 有效期至 {agreement.endDate.toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无关联协议
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">关联合作成果</CardTitle>
                  <CardDescription>该项目产生的合作成果</CardDescription>
                </div>
                <Button size="sm">关联成果</Button>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.publishDate.toLocaleDateString('zh-CN')} 发布
                          </p>
                        </div>
                        <Badge variant="secondary">{achievement.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无关联成果
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">联盟活动</CardTitle>
                  <CardDescription>与该项目相关的联盟活动</CardDescription>
                </div>
                <Button size="sm">关联活动</Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  暂无关联活动
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outputs">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">预期成果</CardTitle>
                <CardDescription>项目计划产出的成果</CardDescription>
              </CardHeader>
              <CardContent>
                {project.outputs && project.outputs.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.outputs.map((output, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{output}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无预期成果
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
