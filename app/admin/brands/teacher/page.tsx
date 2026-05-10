"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Eye, Plus, Edit, Star, RefreshCw } from "lucide-react"
import { teacherBrands, experts } from "@/lib/mock-data"
import { TEACHER_TYPE_LABELS, BRAND_STATUS_LABELS, EXPERT_RATING_LABELS } from "@/lib/types"

export default function TeacherBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTeachers = teacherBrands.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredExperts = experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">师资品牌管理</h1>
          <p className="text-muted-foreground">管理校本师资和企业专家的品牌展示</p>
        </div>
      </div>

      <Tabs defaultValue="teachers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teachers">校本师资</TabsTrigger>
          <TabsTrigger value="experts">企业专家</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索教师姓名或院系..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                同步教务数据
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新增教师
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback className="text-2xl">{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        {teacher.isFeatured && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{teacher.title}</p>
                      <p className="text-sm text-muted-foreground">{teacher.department}</p>
                      <Badge variant="secondary" className="mt-2">
                        {TEACHER_TYPE_LABELS[teacher.type]}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                    {teacher.introduction}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">研究领域</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.researchFields.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">获奖荣誉</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.awards.slice(0, 2).map((award) => (
                        <Badge key={award} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{teacher.viewCount}</span>
                      </div>
                      <Badge variant={teacher.status === "published" ? "default" : "secondary"}>
                        {BRAND_STATUS_LABELS[teacher.status]}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索专家姓名或所属机构..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              同步专家库
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={expert.avatar} />
                      <AvatarFallback className="text-2xl">{expert.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{expert.name}</h3>
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
                      <p className="text-muted-foreground">{expert.title}</p>
                      <p className="text-sm text-muted-foreground">{expert.partnerName}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">专业领域</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">参与角色</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.roles.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t text-center">
                    <div>
                      <p className="text-lg font-semibold">{expert.experience}</p>
                      <p className="text-xs text-muted-foreground">行业经验(年)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{expert.achievements?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">成果数量</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
