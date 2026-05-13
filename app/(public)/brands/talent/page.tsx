"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Trophy, Building2, TrendingUp, Award } from "lucide-react"
import { talentProfiles, employmentCases } from "@/lib/mock-data"

export default function TalentBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")

  const majors = [...new Set(talentProfiles.map((t) => t.major))]

  const filteredProfiles = talentProfiles.filter((profile) => {
    const matchesSearch = profile.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMajor = majorFilter === "all" || profile.major === majorFilter
    return matchesSearch && matchesMajor
  })

  const filteredCases = employmentCases.filter(
    (case_) =>
      case_.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              人才品牌
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              优质毕业生风采
            </h1>
            <p className="text-muted-foreground">
              展示优秀毕业生的能力画像与就业成果，彰显人才培养质量
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-8">
        <Tabs defaultValue="cases" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="cases">就业案例</TabsTrigger>
              <TabsTrigger value="ranking">能力排名</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="选择专业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部专业</SelectItem>
                  {majors.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="cases">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                    <img
                      src={case_.coverImage || case_.photo || "/placeholder.svg?height=180&width=320"}
                      alt={case_.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-semibold text-base">{case_.studentName}</h3>
                      <p className="text-xs text-white/80">{case_.major} | {case_.graduationYear}届</p>
                    </div>
                  </div>
                  <CardContent className="pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={case_.companyLogo} />
                        <AvatarFallback className="text-xs">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{case_.company}</p>
                        <p className="text-xs text-muted-foreground">{case_.position}</p>
                      </div>
                    </div>
                    {case_.salary && (
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground text-sm font-medium">{case_.salary}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {case_.story}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ranking">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile, index) => (
                <Card
                  key={profile.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => alert("跳转到学生画像")}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-xl">{profile.studentName[0]}</AvatarFallback>
                        </Avatar>
                        {profile.comprehensiveRank <= 3 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-background" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{profile.studentName}</h3>
                          <span
                            className={
                              profile.certificationLevel === "高级"
                                ? "inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-100 text-yellow-600"
                                : profile.certificationLevel === "中级"
                                ? "inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600"
                                : "inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-gray-500"
                            }
                            title={profile.certificationLevel}
                          >
                            <Award className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.major}</p>
                        <p className="text-xs text-muted-foreground">{profile.grade}</p>
                        <p className="text-xs text-muted-foreground">{profile.department}</p>
                        {profile.targetPositions && profile.targetPositions.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] text-muted-foreground shrink-0">目标岗位：</span>
                            <div className="flex flex-wrap gap-1">
                              {profile.targetPositions.slice(0, 2).map((pos) => (
                                <Badge key={pos} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                  {pos}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 py-4 border-y">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{profile.comprehensiveRank}</p>
                        <p className="text-xs text-muted-foreground">综合排名</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{profile.abilityScore}</p>
                        <p className="text-xs text-muted-foreground">能力分数</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{profile.taskCompletionRate}%</p>
                        <p className="text-xs text-muted-foreground">完成率</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">能力标签</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.abilityTags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {profile.abilityTags.length > 5 && (
                          <Badge variant="outline" className="text-xs">+{profile.abilityTags.length - 5}</Badge>
                        )}
                      </div>
                    </div>

                    {profile.lastVerifiedAt && (
                      <p className="text-[10px] text-muted-foreground mt-3">
                        上次验证：{profile.lastVerifiedAt.toLocaleDateString("zh-CN")}
                      </p>
                    )}

                    {profile.employmentStatus === "employed" && profile.employmentCompany && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{profile.employmentCompany}</span>
                        </div>
                        {profile.employmentPosition && (
                          <p className="text-sm text-muted-foreground ml-6">{profile.employmentPosition}</p>
                        )}
                      </div>
                    )}

                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
