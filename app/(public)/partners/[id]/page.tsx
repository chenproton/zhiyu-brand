import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
  AgreementStatusBadge,
  ProjectPhaseBadge,
  AchievementTypeBadge,
} from "@/components/shared/status-badge"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  FileText,
  Star,
  Award,
  Image as ImageIcon,
  Calendar,
} from "lucide-react"
import {
  getEnterpriseById,
  getProjectsByPartnerId,
  getAchievementsByPartnerId,
} from "@/lib/mock-data"
import { ENTERPRISE_TYPE_LABELS } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}

export default async function PartnerDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { tab } = await searchParams
  const enterprise = getEnterpriseById(id)

  if (!enterprise) {
    notFound()
  }

  const projects = getProjectsByPartnerId(id)
  const achievements = getAchievementsByPartnerId(id)

  const validTabs = ["info", "agreements", "projects", "achievements"]
  const defaultTab = validTabs.includes(tab || "") ? tab : "info"

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/partners">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回列表
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 shrink-0">
              <Building2 className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-2">
                {enterprise.name}
              </h1>
              <p className="text-slate-500 text-lg">
                {ENTERPRISE_TYPE_LABELS[enterprise.enterpriseType]} · {enterprise.industry}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <CooperationStatusBadge status={enterprise.status} />
                <CooperationRatingBadge rating={enterprise.rating} />
                <Badge variant="outline" className={`text-xs ${enterprise.isPublicDisplay ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {enterprise.isPublicDisplay ? '前台展示' : '前台隐藏'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: "合作协议", value: enterprise.agreements?.length || 0, icon: FileText, color: "from-blue-500 to-blue-600" },
              { label: "合作项目", value: projects.length, icon: Award, color: "from-violet-500 to-violet-600" },
              { label: "合作成果", value: achievements.length, icon: Star, color: "from-emerald-500 to-emerald-600" },
              { label: "成立年份", value: enterprise.establishedYear || "-", icon: Calendar, color: "from-amber-500 to-amber-600" },
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

          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="rounded-2xl p-1 bg-white shadow-sm border border-slate-100">
              <TabsTrigger value="info" className="rounded-xl">基本信息</TabsTrigger>
              <TabsTrigger value="agreements" className="rounded-xl">合作协议 ({enterprise.agreements?.length || 0})</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl">合作项目 ({projects.length})</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl">合作成果 ({achievements.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-0 shadow-sm rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
                      企业简介
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600 leading-relaxed">{enterprise.description}</p>

                    <div className="border-t pt-6">
                      <h4 className="text-sm font-semibold text-slate-900 mb-4">其他信息</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">企业类型</p>
                          <p className="text-sm font-semibold text-slate-900">{ENTERPRISE_TYPE_LABELS[enterprise.enterpriseType]}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">统一社会信用代码</p>
                          <p className="text-sm font-semibold text-slate-900">{enterprise.unifiedSocialCreditCode || "-"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">成立年份</p>
                          <p className="text-sm font-semibold text-slate-900">{enterprise.establishedYear || "-"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">员工规模</p>
                          <p className="text-sm font-semibold text-slate-900">{enterprise.employeeCount?.toLocaleString() || "-"} 人</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">创建时间</p>
                          <p className="text-sm font-semibold text-slate-900">{enterprise.createdAt.toLocaleDateString("zh-CN")}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">更新时间</p>
                          <p className="text-sm font-semibold text-slate-900">{enterprise.updatedAt.toLocaleDateString("zh-CN")}</p>
                        </div>
                        <div className="col-span-2 md:col-span-3 p-4 rounded-2xl bg-slate-50">
                          <p className="text-xs text-slate-400 mb-1">关联二级学院</p>
                          <p className="text-sm font-semibold text-slate-900">{enterprise.secondaryColleges?.join("、") || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm rounded-3xl h-fit self-start">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
                      联系信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enterprise.contactPerson && (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-700">联系人：{enterprise.contactPerson}</span>
                      </div>
                    )}
                    {enterprise.contactPhone && (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{enterprise.contactPhone}</span>
                      </div>
                    )}
                    {enterprise.contactEmail && (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{enterprise.contactEmail}</span>
                      </div>
                    )}
                    {enterprise.address && (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{enterprise.address}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {enterprise.intellectualPropertyPhotos && enterprise.intellectualPropertyPhotos.length > 0 && (
                  <Card className="lg:col-span-3 border-0 shadow-sm rounded-3xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
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
                              className="w-48 h-60 object-cover rounded-2xl border border-slate-100 shadow-sm"
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
                  <Card className="lg:col-span-3 border-0 shadow-sm rounded-3xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        企业荣誉资质
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {enterprise.qualificationPhotos.map((photo, index) => (
                          <div key={index} className="flex flex-col gap-2 w-48">
                            <img
                              src={photo.url}
                              alt={photo.name || `资质证明 ${index + 1}`}
                              className="w-48 h-60 object-cover rounded-2xl border border-slate-100 shadow-sm"
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
                  <Card className="lg:col-span-3 border-0 shadow-sm rounded-3xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
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
                            className="w-48 h-60 object-cover rounded-2xl border border-slate-100 shadow-sm"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="agreements">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg">企业合作协议</CardTitle>
                  <CardDescription>与该企业的所有合作协议</CardDescription>
                </CardHeader>
                <CardContent>
                  {enterprise.agreements && enterprise.agreements.length > 0 ? (
                    <div className="space-y-4">
                      {enterprise.agreements.map((agreement) => (
                        <div
                          key={agreement.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl gap-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">{agreement.name}</p>
                            <p className="text-sm text-slate-500">
                              {agreement.type} · 有效期至 {agreement.endDate.toLocaleDateString("zh-CN")}
                            </p>
                          </div>
                          <AgreementStatusBadge status={agreement.status} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>暂无合作协议</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg">合作项目</CardTitle>
                  <CardDescription>与该企业开展的所有合作项目</CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl gap-3"
                        >
                          <div>
                            <Link
                              href={`/projects/${project.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                            >
                              {project.name}
                            </Link>
                            <p className="text-sm text-slate-500">
                              {project.type} · {project.startDate.toLocaleDateString("zh-CN")} - {project.endDate.toLocaleDateString("zh-CN")}
                            </p>
                          </div>
                          <ProjectPhaseBadge phase={project.phase} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <Award className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>暂无合作项目</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg">合作成果</CardTitle>
                  <CardDescription>与该企业合作产生的成果</CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl gap-3"
                        >
                          <div>
                            <Link
                              href={`/achievements/${achievement.id}`}
                              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                            >
                              {achievement.name}
                            </Link>
                            <p className="text-sm text-slate-500">
                              {achievement.publishDate.toLocaleDateString("zh-CN")} 发布
                            </p>
                          </div>
                          <AchievementTypeBadge type={achievement.type} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <Star className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>暂无合作成果</p>
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
