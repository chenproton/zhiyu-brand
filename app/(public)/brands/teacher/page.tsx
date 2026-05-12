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
import { Search, UserCircle, Award, BookOpen, Star, Building2 } from "lucide-react"
import { teacherBrands, experts } from "@/lib/mock-data"
import { TEACHER_TYPE_LABELS, EXPERT_RATING_LABELS } from "@/lib/types"

export default function TeacherBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredTeachers = teacherBrands.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || teacher.type === typeFilter
    return matchesSearch && matchesType && teacher.status === "published"
  })

  const filteredExperts = experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              师资品牌
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              优质师资团队
            </h1>
            <p className="text-muted-foreground">
              展示学校优秀教师和来自合作企业的行业专家
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-8">
        <Tabs defaultValue="teachers" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="teachers">校本师资</TabsTrigger>
              <TabsTrigger value="experts">企业专家</TabsTrigger>
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
            </div>
          </div>

          <TabsContent value="teachers">
            <div className="flex items-center gap-4 mb-6">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="教师类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="teaching-master">教学名师</SelectItem>
                  <SelectItem value="dual-qualified">双师型教师</SelectItem>
                  <SelectItem value="backbone">骨干教师</SelectItem>
                  <SelectItem value="award-winning">获奖教师</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback className="text-3xl">{teacher.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xl">{teacher.name}</h3>
                        {teacher.isFeatured && (
                          <Star className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{teacher.title}</p>
                      <p className="text-sm text-muted-foreground">{teacher.department}</p>
                      <Badge variant="secondary" className="mt-2">
                        {TEACHER_TYPE_LABELS[teacher.type]}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground text-center line-clamp-2 mb-4">
                      {teacher.introduction}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">研究领域</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {teacher.researchFields.map((field) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">荣誉奖项</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {teacher.awards.slice(0, 2).map((award) => (
                            <Badge key={award} variant="outline" className="text-xs">
                              {award}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">暂无符合条件的教师</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="experts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => (
                <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="text-2xl">{expert.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{expert.name}</h3>
                          <Badge
                            variant={
                              expert.rating === "gold"
                                ? "default"
                                : expert.rating === "silver"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {EXPERT_RATING_LABELS[expert.rating]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{expert.title}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Building2 className="h-3 w-3" />
                          <span>{expert.partnerName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">专业领域</p>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">参与角色</p>
                        <div className="flex flex-wrap gap-1">
                          {expert.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-center">
                          <p className="font-semibold">{expert.experience}</p>
                          <p className="text-xs text-muted-foreground">行业经验</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{expert.achievements?.length || 0}</p>
                          <p className="text-xs text-muted-foreground">成果数量</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredExperts.length === 0 && (
              <div className="text-center py-12">
                <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">暂无符合条件的专家</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
