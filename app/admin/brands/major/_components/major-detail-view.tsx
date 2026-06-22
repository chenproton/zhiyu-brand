import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  BookOpen,
  Briefcase,
  Star,
  Building2,
  Award,
  GraduationCap,
  FileText,
  Medal,
} from "lucide-react"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS, JOB_CATEGORY_LABELS } from "@/lib/types"
import type { MajorBrand } from "@/lib/types"

interface MajorDetailViewProps {
  major: MajorBrand
  mode: "admin-preview" | "public"
}

export function MajorDetailView({ major, mode }: MajorDetailViewProps) {
  const courses = major.coreCourses || []
  const directions = major.employmentDirections || []
  const partners = major.cooperationPartners || []
  const achievements = major.featuredAchievements || []
  const levels = major.level ? [{ title: BRAND_LEVEL_LABELS[major.level], description: "", attachments: [] as string[] }] : []

  const backHref = mode === "admin-preview" ? "/admin/brands/major" : "/brands/major"
  const backText = mode === "admin-preview" ? "返回列表" : "返回专业品牌"

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {backText}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 专业头部 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
              <div className="flex flex-col gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {major.coverImage ? (
                    <img
                      src={major.coverImage}
                      alt={major.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
              <div>
                  <h1 className="text-2xl font-bold text-gray-900">{major.name}</h1>
                  <p className="text-muted-foreground mt-1">{major.department}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline">{BRAND_LEVEL_LABELS[major.level]}</Badge>
                    <Badge variant={major.status === "published" ? "secondary" : "outline"}>
                      {BRAND_STATUS_LABELS[major.status]}
                    </Badge>
                  </div>
                </div>
              </div>
              {mode === "admin-preview" && (
                <Button variant="outline" asChild>
                  <Link href={`/admin/brands/major/${major.id}`}>编辑信息</Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{major.studentCount}</p>
                  <p className="text-xs text-muted-foreground">在校生人数</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{major.employmentRate}%</p>
                  <p className="text-xs text-muted-foreground">就业率</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-xs text-muted-foreground">核心课程</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{directions.length}</p>
                  <p className="text-xs text-muted-foreground">就业方向</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
          <TabsTrigger value="info">专业基本信息</TabsTrigger>
          <TabsTrigger value="levels">专业品牌 ({levels.length})</TabsTrigger>
          <TabsTrigger value="directions">专业就业方向 ({directions.length})</TabsTrigger>
          <TabsTrigger value="companies">专业合作企业 ({partners.length})</TabsTrigger>
          <TabsTrigger value="achievements">专业特色成果 ({achievements.length})</TabsTrigger>
          <TabsTrigger value="courses">专业课程体系 ({courses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">专业名称</p>
                      <p className="font-medium">{major.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">所属院系</p>
                      <p className="font-medium">{major.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">在校生人数</p>
                      <p className="font-medium">{major.studentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">就业率</p>
                      <p className="font-medium">{major.employmentRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">品牌</p>
                      <p className="font-medium">{BRAND_LEVEL_LABELS[major.level]}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">发布状态</p>
                      <p className="font-medium">{BRAND_STATUS_LABELS[major.status]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">专业简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{major.introduction}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="levels">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业品牌</CardTitle>
                <CardDescription>专业品牌及认定说明</CardDescription>
              </CardHeader>
              <CardContent>
                {levels.length > 0 ? (
                  <div className="space-y-4">
                    {levels.map((row, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                          <Medal className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{row.title}</p>
                          {row.description && (
                            <p className="text-sm text-muted-foreground mt-1">{row.description}</p>
                          )}
                          {row.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {row.attachments.map((file, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">暂无品牌描述</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directions">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业就业方向</CardTitle>
                <CardDescription>本专业对应的就业方向（岗位）</CardDescription>
              </CardHeader>
              <CardContent>
                {directions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {directions.map((direction) => (
                      <Badge key={direction} variant="secondary" className="text-sm px-3 py-1">
                        <GraduationCap className="h-3.5 w-3.5 mr-1" />
                        {direction}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">暂无就业方向</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业合作企业</CardTitle>
                <CardDescription>与本专业合作的企业</CardDescription>
              </CardHeader>
              <CardContent>
                {partners.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {partners.map((partner) => (
                      <Badge key={partner} variant="outline" className="text-sm px-3 py-1">
                        <Building2 className="h-3.5 w-3.5 mr-1" />
                        {partner}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">暂无合作企业</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业特色成果</CardTitle>
                <CardDescription>专业特色成果及说明</CardDescription>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div key={achievement} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <Award className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">暂无特色成果</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业课程体系</CardTitle>
                <CardDescription>专业核心课程及说明</CardDescription>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course) => {
                      const courseName = typeof course === "string" ? course : course.name
                      const courseDesc = typeof course === "string" ? "" : course.description
                      const courseUrl = typeof course === "string" ? undefined : course.url
                      return (
                        <div key={courseName} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{courseName}</p>
                          </div>
                          {courseDesc && <p className="text-sm text-muted-foreground">{courseDesc}</p>}
                          {courseUrl && (
                            <a href={courseUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                              {courseUrl}
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">暂无课程体系</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
