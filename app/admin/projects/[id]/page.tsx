'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectPhaseBadge } from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  FolderKanban,
  Building2,
  FileText,
  Award,
  Plus,
} from 'lucide-react'
import { projects, partners, achievements } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'
import type { Project } from '@/lib/types'
import { ProjectMilestoneManager, ProjectAgreementManager } from './project-detail-actions'

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
  const projectAchievements = achievements.filter((a) => a.projectId === project.id)

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
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              编辑项目
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">项目信息</TabsTrigger>
          <TabsTrigger value="milestones">项目里程碑 ({project.milestones.length})</TabsTrigger>
          <TabsTrigger value="agreement">项目协议 ({(project.projectAgreements || []).length})</TabsTrigger>
          <TabsTrigger value="achievements">关联成果 ({projectAchievements.length})</TabsTrigger>
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
                {projectAchievements.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">关联成果</p>
                      <p className="font-medium">{projectAchievements.length} 项成果</p>
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
                    <p className="font-medium">{project.secondaryColleges?.join('、') || '未设置'}</p>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">关联成果</CardTitle>
                <CardDescription>管理项目产生的合作成果</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/achievements/new">
                  <Plus className="h-4 w-4 mr-1" />
                  新增成果
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projectAchievements.length > 0 ? (
                <div className="space-y-4">
                  {projectAchievements.map((achievement) => (
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
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/achievements/${achievement.id}`}>
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                        </Link>
                        <Link href={`/admin/achievements/${achievement.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3 w-3 mr-1" />
                            编辑
                          </Button>
                        </Link>
                      </div>
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
      </Tabs>
    </div>
  )
}
