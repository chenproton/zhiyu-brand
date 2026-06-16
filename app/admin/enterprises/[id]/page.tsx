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
} from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  FileText,
  Star,
  Award,
  Image,
  Plus,
} from 'lucide-react'
import { AddAgreementButton, AgreementDetailButton } from './enterprise-action-bar'
import { getEnterpriseById, getProjectsByPartnerId, getAchievementsByPartnerId } from '@/lib/mock-data'
import { ENTERPRISE_TYPE_LABELS } from '@/lib/types'
import { NewProjectButton } from './enterprise-detail-actions'
import { ItemPublicDisplaySwitch } from './item-public-display-switch'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function EnterpriseDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { tab } = await searchParams
  const enterprise = getEnterpriseById(id)

  if (!enterprise) {
    notFound()
  }

  const projects = getProjectsByPartnerId(id)
  const achievements = getAchievementsByPartnerId(id)

  const validTabs = ['info', 'agreements', 'projects', 'achievements']
  const defaultTab = validTabs.includes(tab || '') ? tab : 'info'

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/enterprises">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      {enterprise.coverImage && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 h-48 md:h-64">
          <img
            src={enterprise.coverImage}
            alt={`${enterprise.name} 封面图`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
            {enterprise.logo ? (
              <img src={enterprise.logo} alt={enterprise.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{enterprise.name}</h1>
            <p className="text-muted-foreground">
              {ENTERPRISE_TYPE_LABELS[enterprise.enterpriseType]} · {enterprise.industry}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <CooperationStatusBadge status={enterprise.status} />
              <CooperationRatingBadge rating={enterprise.rating} />
            </div>
          </div>
        </div>
        <Link href={`/admin/enterprises/${id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            编辑信息
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enterprise.agreements?.length || 0}</p>
                <p className="text-xs text-muted-foreground">合作协议</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
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
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{achievements.length}</p>
                <p className="text-xs text-muted-foreground">合作成果</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="agreements">合作协议 ({enterprise.agreements?.length || 0})</TabsTrigger>
          <TabsTrigger value="projects">合作项目 ({projects.length})</TabsTrigger>
          <TabsTrigger value="achievements">合作成果 ({achievements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 基本信息 - merged card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 企业简介 section */}
                <div>
                  <h4 className="text-sm font-medium mb-2">企业简介</h4>
                  <p className="text-gray-600 leading-relaxed">{enterprise.description}</p>
                </div>

                {/* divider + 其他信息 */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">其他信息</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">企业类型</p>
                      <p className="text-sm font-medium">{ENTERPRISE_TYPE_LABELS[enterprise.enterpriseType]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">统一社会信用代码</p>
                      <p className="text-sm font-medium">{enterprise.unifiedSocialCreditCode || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">成立年份</p>
                      <p className="text-sm font-medium">{enterprise.establishedYear || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">员工规模</p>
                      <p className="text-sm font-medium">{enterprise.employeeCount?.toLocaleString() || '-'} 人</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">创建时间</p>
                      <p className="text-sm font-medium">{enterprise.createdAt.toLocaleDateString('zh-CN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">更新时间</p>
                      <p className="text-sm font-medium">{enterprise.updatedAt.toLocaleDateString('zh-CN')}</p>
                    </div>
                    <div className="col-span-2 md:col-span-3">
                      <p className="text-xs text-muted-foreground mb-1">关联二级学院</p>
                      <p className="text-sm font-medium">{enterprise.secondaryColleges?.join('、') || '-'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 联系信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enterprise.contactPerson && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">联系人：{enterprise.contactPerson}</span>
                  </div>
                )}
                {enterprise.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{enterprise.contactPhone}</span>
                  </div>
                )}
                {enterprise.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{enterprise.contactEmail}</span>
                  </div>
                )}
                {enterprise.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{enterprise.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 企业形象 */}
            {(enterprise.logo || enterprise.coverImage) && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    企业形象
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {enterprise.logo && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">企业 Logo</p>
                        <img
                          src={enterprise.logo}
                          alt={`${enterprise.name} Logo`}
                          className="w-24 h-24 object-cover rounded-xl border"
                        />
                      </div>
                    )}
                    {enterprise.coverImage && (
                      <div className="space-y-2 flex-1">
                        <p className="text-xs text-muted-foreground">企业封面图</p>
                        <img
                          src={enterprise.coverImage}
                          alt={`${enterprise.name} 封面图`}
                          className="w-full max-w-md h-40 object-cover rounded-xl border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photo cards */}
            {enterprise.businessLicensePhotos && enterprise.businessLicensePhotos.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    营业执照
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {enterprise.businessLicensePhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`营业执照 ${index + 1}`}
                        className="w-48 h-60 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {enterprise.intellectualPropertyPhotos && enterprise.intellectualPropertyPhotos.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    知识产权
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {enterprise.intellectualPropertyPhotos.map((photo, index) => (
                      <div key={index} className="flex flex-col gap-2 w-48">
                        <img
                          src={photo.url}
                          alt={photo.name || `知识产权 ${index + 1}`}
                          className="w-48 h-60 object-cover rounded-lg border"
                        />
                        {photo.name && (
                          <span className="text-sm text-slate-700 text-center">{photo.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {enterprise.qualificationPhotos && enterprise.qualificationPhotos.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    企业资质证明材料
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {enterprise.qualificationPhotos.map((photo, index) => (
                      <div key={index} className="flex flex-col gap-2 w-48">
                        <img
                          src={photo.url}
                          alt={photo.name || `资质证明 ${index + 1}`}
                          className="w-48 h-60 object-cover rounded-lg border"
                        />
                        {photo.name && (
                          <span className="text-sm text-slate-700 text-center">{photo.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {enterprise.coverPhotos && enterprise.coverPhotos.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    企业展示封面
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {enterprise.coverPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`展示封面 ${index + 1}`}
                        className="w-48 h-60 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="agreements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-3">
                  企业合作协议
                </CardTitle>
                <CardDescription>与该企业的所有合作协议</CardDescription>
              </div>
              <AddAgreementButton />
            </CardHeader>
            <CardContent>
              {enterprise.agreements && enterprise.agreements.length > 0 ? (
                <div className="space-y-4">
                  {enterprise.agreements.map((agreement) => (
                    <div
                      key={agreement.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{agreement.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {agreement.type} · 有效期至 {agreement.endDate.toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AgreementStatusBadge status={agreement.status} />
                        <ItemPublicDisplaySwitch
                          defaultChecked={agreement.isPublicDisplay}
                          onChange={undefined}
                        />
                        <AgreementDetailButton agreement={agreement} />
                      </div>
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
                <CardTitle className="text-base flex items-center gap-3">
                  合作项目
                </CardTitle>
                <CardDescription>与该企业开展的所有合作项目</CardDescription>
              </div>
              <NewProjectButton defaultPartnerIds={[enterprise.id.replace('e', 'p')]} />
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
                      <div className="flex items-center gap-2">
                        <ItemPublicDisplaySwitch
                          defaultChecked={project.isPublicDisplay}
                          onChange={undefined}
                        />
                        <Link href={`/admin/projects/${project.id}`}>
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                        </Link>
                      </div>
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

        <TabsContent value="achievements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-3">
                  合作成果
                </CardTitle>
                <CardDescription>与该企业合作产生的成果</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/achievements/new">
                  <Plus className="h-4 w-4 mr-1" />
                  新增成果
                </Link>
              </Button>
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
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{achievement.type}</Badge>
                        <ItemPublicDisplaySwitch
                          defaultChecked={achievement.isPublicDisplay ?? true}
                          onChange={undefined}
                        />
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
