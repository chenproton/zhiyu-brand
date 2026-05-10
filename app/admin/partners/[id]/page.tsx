import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
  AgreementStatusBadge,
  ProjectPhaseBadge,
  ExpertRatingBadge,
} from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  FolderKanban,
  Award,
} from 'lucide-react'
import {
  getPartnerById,
  getAgreementsByPartnerId,
  getProjectsByPartnerId,
  getExpertsByPartnerId,
  getAchievementsByPartnerId,
} from '@/lib/mock-data'
import { PARTNER_TYPE_LABELS, COOPERATION_TYPES } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PartnerDetailPage({ params }: PageProps) {
  const { id } = await params
  const partner = getPartnerById(id)

  if (!partner) {
    notFound()
  }

  const agreements = getAgreementsByPartnerId(id)
  const projects = getProjectsByPartnerId(id)
  const experts = getExpertsByPartnerId(id)
  const achievements = getAchievementsByPartnerId(id)

  return (
    <div>
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/partners">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
              <p className="text-muted-foreground">
                {PARTNER_TYPE_LABELS[partner.type]} · {partner.industry}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <CooperationStatusBadge status={partner.status} />
                <CooperationRatingBadge rating={partner.rating} />
              </div>
            </div>
          </div>
          <Link href={`/admin/partners/${id}/edit`}>
            <Button>
              <Pencil className="h-4 w-4 mr-2" />
              编辑信息
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{agreements.length}</p>
                  <p className="text-xs text-muted-foreground">合作协议</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-xs text-muted-foreground">合作项目</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{experts.length}</p>
                  <p className="text-xs text-muted-foreground">专家资源</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                  <p className="text-xs text-muted-foreground">合作成果</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="agreements">合作协议 ({agreements.length})</TabsTrigger>
            <TabsTrigger value="projects">合作项目 ({projects.length})</TabsTrigger>
            <TabsTrigger value="experts">专家资源 ({experts.length})</TabsTrigger>
            <TabsTrigger value="achievements">合作成果 ({achievements.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">主体简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">联系信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {partner.contactPerson && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">联系人：{partner.contactPerson}</span>
                    </div>
                  )}
                  {partner.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{partner.contactPhone}</span>
                    </div>
                  )}
                  {partner.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{partner.contactEmail}</span>
                    </div>
                  )}
                  {partner.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{partner.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">合作类型</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {partner.cooperationTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">其他信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">成立年份</span>
                    <span className="text-sm">{partner.establishedYear || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">员工规模</span>
                    <span className="text-sm">{partner.employeeCount?.toLocaleString() || '-'} 人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">创建时间</span>
                    <span className="text-sm">{partner.createdAt.toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">更新时间</span>
                    <span className="text-sm">{partner.updatedAt.toLocaleDateString('zh-CN')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agreements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">合作协议</CardTitle>
                  <CardDescription>与该主体签订的所有合作协议</CardDescription>
                </div>
                <Link href={`/admin/agreements/new?partnerId=${id}`}>
                  <Button size="sm">新增协议</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {agreements.length > 0 ? (
                  <div className="space-y-4">
                    {agreements.map((agreement) => (
                      <div
                        key={agreement.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
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
                        <AgreementStatusBadge status={agreement.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无合作协议
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">合作项目</CardTitle>
                  <CardDescription>与该主体开展的所有合作项目</CardDescription>
                </div>
                <Link href={`/admin/projects/new?partnerId=${id}`}>
                  <Button size="sm">新增项目</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="font-medium hover:underline"
                          >
                            {project.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {project.type} · {project.startDate.toLocaleDateString('zh-CN')} - {project.endDate.toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <ProjectPhaseBadge phase={project.phase} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无合作项目
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experts">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专家资源</CardTitle>
                <CardDescription>来自该主体的专家资源</CardDescription>
              </CardHeader>
              <CardContent>
                {experts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {experts.map((expert) => (
                      <div
                        key={expert.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/experts/${expert.id}`}
                              className="font-medium hover:underline"
                            >
                              {expert.name}
                            </Link>
                            <ExpertRatingBadge rating={expert.rating} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {expert.title} · {expert.field}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {expert.roles.slice(0, 3).map((role) => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无专家资源
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">合作成果</CardTitle>
                <CardDescription>与该主体合作产生的成果</CardDescription>
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
                    暂无合作成果
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
