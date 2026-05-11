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
  AgreementStatusBadge,
} from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  FolderKanban,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Award,
  Users,
} from 'lucide-react'
import { getProjectById, getPartnerById, getAgreementById, getAchievementsByPartnerId } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'
import ProjectActionBar from './project-action-bar'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = getProjectById(id)

  if (!project) {
    notFound()
  }

  const mainPartner = project.partnerId ? getPartnerById(project.partnerId) : null
  const agreement = project.agreementId ? getAgreementById(project.agreementId) : null
  const achievements = getAchievementsByPartnerId(project.partnerId).filter(a => a.projectId === project.id)

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length
  const totalMilestones = project.milestones.length
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

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

  const partnerIds = project.partnerIds?.length ? project.partnerIds : [project.partnerId]
  const partners = partnerIds.map((pid) => getPartnerById(pid)).filter(Boolean)

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

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
          <ProjectActionBar projectId={project.id} publishStatus={project.publishStatus} />
          <Link href={`/admin/projects/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              编辑项目
            </Button>
          </Link>
        </div>
      </div>

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

      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList>
          <TabsTrigger value="milestones">里程碑（进展）</TabsTrigger>
          <TabsTrigger value="info">项目信息</TabsTrigger>
          <TabsTrigger value="agreement">项目协议</TabsTrigger>
          <TabsTrigger value="achievements">关联成果 ({achievements.length})</TabsTrigger>
          <TabsTrigger value="supportingResults">配套成果 ({project.supportingResults?.length || 0})</TabsTrigger>
          <TabsTrigger value="phases">项目阶段 ({project.phases?.length || 0})</TabsTrigger>
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
                  <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="relative flex gap-4">
                        <div className="relative z-10 bg-white">
                          {getMilestoneIcon(milestone.status)}
                        </div>
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
                {partners.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">合作主体</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {partners.map((p) => (
                          <Link key={p!.id} href={`/admin/partners/${p!.id}`} className="font-medium hover:underline text-sm">
                            {p!.name}
                          </Link>
                        ))}
                      </div>
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
              <Button size="sm" onClick={() => alert('关联协议功能开发中')}>关联协议</Button>
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
              <Button size="sm" onClick={() => alert('关联成果功能开发中')}>关联成果</Button>
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

        <TabsContent value="supportingResults">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">配套成果</CardTitle>
                <CardDescription>项目的配套产出成果</CardDescription>
              </div>
              <Button size="sm" onClick={() => alert('关联成果功能开发中')}>关联成果</Button>
            </CardHeader>
            <CardContent>
              {project.supportingResults && project.supportingResults.length > 0 ? (
                <div className="space-y-4">
                  {project.supportingResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-muted-foreground">{result.type} · {result.description}</p>
                      </div>
                      <Badge variant="secondary">{result.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无配套成果</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">项目阶段与进展</CardTitle>
                <CardDescription>项目各阶段的进度跟踪</CardDescription>
              </div>
              <Button size="sm" onClick={() => alert('新增阶段功能开发中')}>新增阶段</Button>
            </CardHeader>
            <CardContent>
              {project.phases && project.phases.length > 0 ? (
                <div className="space-y-4">
                  {project.phases.map((phase) => (
                    <div key={phase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{phase.name}</p>
                          <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'}>
                            {phase.status === 'completed' ? '已完成' : phase.status === 'in-progress' ? '进行中' : phase.status === 'delayed' ? '延期' : '待开始'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {phase.startDate.toLocaleDateString('zh-CN')} {phase.endDate ? `至 ${phase.endDate.toLocaleDateString('zh-CN')}` : ''}
                        </p>
                      </div>
                      {phase.progress !== undefined && (
                        <div className="w-32">
                          <Progress value={phase.progress} className="h-2" />
                          <p className="text-xs text-right text-muted-foreground mt-1">{phase.progress}%</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无阶段数据</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
