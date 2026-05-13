'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ProjectPhaseBadge,
  ProjectPublishStatusBadge,
} from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  FolderKanban,
  Building2,
  FileText,
  Award,
} from 'lucide-react'
import { projects, partners } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS, SECONDARY_COLLEGES } from '@/lib/types'
import type { Project } from '@/lib/types'
import ProjectActionBar from './project-action-bar'
import { ProjectMilestoneManager, ProjectAgreementManager, ProjectAchievementManager } from './project-detail-actions'

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const p = projects.find((proj) => proj.id === id)
    if (!p) {
      setNotFound(true)
      return
    }
    setProject(p)
  }, [id])

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">项目不存在</h1>
        <p className="text-muted-foreground mb-6">该项目可能已被删除或 ID 不正确</p>
        <Link href="/admin/projects">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>
    )
  }

  if (!project) {
    return <div className="text-center py-20 text-muted-foreground">加载中...</div>
  }

  const partnerIds = project.partnerIds?.length ? project.partnerIds : [project.partnerId]
  const projectPartners = partnerIds.map((pid) => partners.find((p) => p.id === pid)).filter(Boolean)

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length
  const totalMilestones = project.milestones.length
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

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

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">项目信息</TabsTrigger>
          <TabsTrigger value="milestones">项目里程碑 ({project.milestones.length})</TabsTrigger>
          <TabsTrigger value="agreement">项目协议 ({(project.projectAgreements || []).length})</TabsTrigger>
          <TabsTrigger value="achievements">关联成果 ({(project.supportingResults || []).length})</TabsTrigger>
        </TabsList>

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
                {projectPartners.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">合作主体</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {projectPartners.map((p) => (
                          <Link key={p!.id} href={`/admin/partners/${p!.id}`} className="font-medium hover:underline text-sm">
                            {p!.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(project.projectAgreements || []).length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">项目协议</p>
                      <p className="font-medium">{(project.projectAgreements || []).length} 项协议</p>
                    </div>
                  </div>
                )}
                {(project.supportingResults || []).length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">关联成果</p>
                      <p className="font-medium">{(project.supportingResults || []).length} 项成果</p>
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
                <div className="grid md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">合作类型</p>
                    <p className="font-medium">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">当前阶段</p>
                    <p className="font-medium">{PROJECT_PHASE_LABELS[project.phase]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">关联二级学院</p>
                    <p className="font-medium">{project.secondaryCollege || '未设置'}</p>
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

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">项目里程碑</CardTitle>
              <CardDescription>跟踪项目关键节点的完成情况</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectMilestoneManager
                projectId={project.id}
                milestones={project.milestones}
                onChange={(milestones) => {
                  setProject((prev) => prev ? { ...prev, milestones, updatedAt: new Date() } : prev)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreement">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">项目协议</CardTitle>
              <CardDescription>管理项目相关的合作协议</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectAgreementManager
                projectId={project.id}
                agreements={project.projectAgreements || []}
                onChange={(agreements) => {
                  setProject((prev) => prev ? { ...prev, projectAgreements: agreements, updatedAt: new Date() } : prev)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">关联成果</CardTitle>
              <CardDescription>管理项目产生的合作成果</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectAchievementManager
                projectId={project.id}
                items={project.supportingResults || []}
                onChange={(items) => {
                  setProject((prev) => prev ? { ...prev, supportingResults: items, updatedAt: new Date() } : prev)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
