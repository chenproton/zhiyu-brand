import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Award,
  Building2,
  FolderKanban,
  FileText,
  ArrowLeft,
  Calendar,
  Users,
  Handshake,
  Layers,
  BookOpen,
  Briefcase,
  ImageIcon,
} from 'lucide-react'
import { getAchievementById, partners, projects } from '@/lib/mock-data'
import { ACHIEVEMENT_TYPE_LABELS } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicAchievementDetailPage({ params }: PageProps) {
  const { id } = await params
  const achievement = getAchievementById(id)

  if (!achievement) {
    notFound()
  }

  const achievementPartners = (achievement.partnerIds?.length
    ? achievement.partnerIds
    : achievement.partnerId
      ? [achievement.partnerId]
      : []
  ).map((pid) => partners.find((p) => p.id === pid)).filter(Boolean)

  const relatedProject = achievement.projectId
    ? projects.find((p) => p.id === achievement.projectId)
    : null

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-6">
            <Link href="/achievements">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-3">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回成果列表
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-5 md:items-start">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                {achievement.name}
              </h1>
              <p className="text-sm text-slate-500">ID: {achievement.id}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-white border border-slate-100 p-1 rounded-xl h-auto">
              <TabsTrigger
                value="info"
                className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
              >
                基本信息
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
              >
                成果佐证材料 ({(achievement.attachments || []).length})
              </TabsTrigger>
              <TabsTrigger
                value="scenes"
                className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
              >
                关联实践场景 ({(achievement.relatedScenes || []).length})
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
              >
                关联数字课程 ({(achievement.relatedCourses || []).length})
              </TabsTrigger>
              <TabsTrigger
                value="positions"
                className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
              >
                关联职业岗位 ({(achievement.relatedPositions || []).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                      <CardTitle className="text-base font-semibold text-slate-900">成果简介</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-slate-700 leading-7 text-[15px]">{achievement.description}</p>
                    </CardContent>
                  </Card>

                  {achievement.citationReason && (
                    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                          <Handshake className="h-4 w-4 text-emerald-600" />
                          引用原因 / 核心亮点
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div
                          className="text-slate-700 leading-7 prose prose-sm max-w-none prose-ul:my-3 prose-li:my-1"
                          dangerouslySetInnerHTML={{ __html: achievement.citationReason }}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {achievement.coverImage && (
                    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-emerald-600" />
                          成果封面
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-100 max-w-md">
                          <img
                            src={achievement.coverImage}
                            alt="成果封面"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {(achievement.ownerPersons?.length || 0) > 0 || (achievement.coBuilders?.length || 0) > 0 ? (
                    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-600" />
                          人员信息
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-5">
                        {(achievement.ownerPersons?.length || 0) > 0 && (
                          <div>
                            <p className="text-sm text-slate-500 mb-2.5">成果归属人</p>
                            <div className="flex flex-wrap gap-2">
                              {achievement.ownerPersons?.map((person) => (
                                <Badge
                                  key={person}
                                  variant="secondary"
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-normal px-2.5 py-1"
                                >
                                  {person}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {(achievement.coBuilders?.length || 0) > 0 && (
                          <div>
                            <p className="text-sm text-slate-500 mb-2.5">成果共建人</p>
                            <div className="flex flex-wrap gap-2">
                              {achievement.coBuilders?.map((person) => (
                                <Badge
                                  key={person}
                                  variant="secondary"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-normal px-2.5 py-1"
                                >
                                  {person}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                      <CardTitle className="text-base font-semibold text-slate-900">关联信息</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                      {achievementPartners.length > 0 && (
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">合作企业</p>
                            <div className="flex flex-col gap-0.5">
                              {achievementPartners.map((p) => (
                                <Link
                                  key={p!.id}
                                  href={`/partners/${p!.id}`}
                                  className="font-medium text-slate-900 hover:text-emerald-600 transition-colors text-sm"
                                >
                                  {p!.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {relatedProject && (
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                            <FolderKanban className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400 mb-0.5">归属项目</p>
                            <Link
                              href={`/projects/${relatedProject.id}`}
                              className="font-medium text-slate-900 hover:text-emerald-600 transition-colors text-sm"
                            >
                              {relatedProject.name}
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                      <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        成果信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm text-slate-500">成果类型</span>
                        <span className="text-sm font-medium text-slate-900">
                          {ACHIEVEMENT_TYPE_LABELS[achievement.type]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm text-slate-500">关联二级学院</span>
                        <span className="text-sm font-medium text-slate-900 text-right">
                          {achievement.secondaryColleges?.join('、') || '—'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm text-slate-500">发布日期</span>
                        <span className="text-sm font-medium text-slate-900">
                          {achievement.publishDate.toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm text-slate-500">创建时间</span>
                        <span className="text-sm font-medium text-slate-900">
                          {achievement.createdAt.toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-sm text-slate-500">更新时间</span>
                        <span className="text-sm font-medium text-slate-900">
                          {achievement.updatedAt.toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments">
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900">成果佐证材料</CardTitle>
                  <CardDescription>成果相关附件与佐证材料</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {achievement.attachments && achievement.attachments.length > 0 ? (
                    <div className="grid gap-3">
                      {achievement.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                        >
                          <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{file}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">暂无佐证材料</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenes">
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-600" />
                    关联实践场景
                  </CardTitle>
                  <CardDescription>成果关联的场景资源</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {achievement.relatedScenes && achievement.relatedScenes.length > 0 ? (
                    <div className="grid gap-3">
                      {achievement.relatedScenes.map((scene) => (
                        <div
                          key={scene.id}
                          className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                            <Layers className="h-5 w-5 text-amber-600" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{scene.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">暂无关联场景</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-sky-600" />
                    关联数字课程
                  </CardTitle>
                  <CardDescription>成果关联的课程资源</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {achievement.relatedCourses && achievement.relatedCourses.length > 0 ? (
                    <div className="grid gap-3">
                      {achievement.relatedCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                            <BookOpen className="h-5 w-5 text-sky-600" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{course.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">暂无关联课程</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="positions">
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    关联职业岗位
                  </CardTitle>
                  <CardDescription>成果关联的岗位资源</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {achievement.relatedPositions && achievement.relatedPositions.length > 0 ? (
                    <div className="grid gap-3">
                      {achievement.relatedPositions.map((position) => (
                        <div
                          key={position.id}
                          className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                            <Briefcase className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{position.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">暂无关联岗位</p>
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
