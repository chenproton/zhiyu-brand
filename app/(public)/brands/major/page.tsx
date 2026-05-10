"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, GraduationCap, Users, TrendingUp, BookOpen, Building2, Award } from "lucide-react"
import { majorBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS } from "@/lib/types"

export default function MajorBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const departments = [...new Set(majorBrands.map((m) => m.department))]

  const filteredMajors = majorBrands.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || major.level === levelFilter
    const matchesDepartment = departmentFilter === "all" || major.department === departmentFilter
    return matchesSearch && matchesLevel && matchesDepartment && major.status === "published"
  })

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case "recommended":
        return "bg-amber-100 text-amber-700"
      case "key":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              专业品牌
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              特色专业展示
            </h1>
            <p className="text-muted-foreground">
              展示学校特色专业的培养目标、课程体系、就业成果和合作资源
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索专业名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="品牌等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="recommended">推荐品牌</SelectItem>
              <SelectItem value="key">重点品牌</SelectItem>
              <SelectItem value="standard">标准品牌</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="所属院系" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部院系</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Major Cards */}
        <div className="space-y-8">
          {filteredMajors.map((major) => (
            <Card key={major.id} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Cover Image */}
                <div className="aspect-[4/3] lg:aspect-auto bg-muted relative">
                  <img
                    src={major.coverImage || "/placeholder.svg?height=300&width=500"}
                    alt={major.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getLevelBadgeStyle(major.level)}>
                      {BRAND_LEVEL_LABELS[major.level]}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-2 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{major.name}</h2>
                      <p className="text-muted-foreground">{major.department}</p>
                    </div>
                    <Button>了解更多</Button>
                  </div>

                  <p className="text-muted-foreground mb-6">{major.introduction}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold">{major.studentCount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">在校生</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <span className="text-2xl font-bold text-emerald-600">{major.employmentRate}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">就业率</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold">{major.cooperationPartners.length}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">合作企业</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Core Courses */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">核心课程</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {major.coreCourses.map((course) => (
                          <Badge key={course} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Employment Directions */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">就业方向</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {major.employmentDirections.map((direction) => (
                          <Badge key={direction} variant="secondary" className="text-xs">
                            {direction}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Cooperation Partners */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">合作企业</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {major.cooperationPartners.map((partner) => (
                          <Badge key={partner} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Featured Achievements */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">特色成果</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {major.featuredAchievements.map((achievement) => (
                          <Badge key={achievement} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredMajors.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无符合条件的专业品牌</p>
          </div>
        )}
      </section>
    </div>
  )
}
