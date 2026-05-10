"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Search, Eye, Plus, Edit, ExternalLink, Users, TrendingUp } from "lucide-react"
import { majorBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"

export default function MajorBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  const departments = [...new Set(majorBrands.map((m) => m.department))]

  const filteredMajors = majorBrands.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || major.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "recommended":
        return "default"
      case "key":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">专业品牌管理</h1>
          <p className="text-muted-foreground">管理各专业的品牌展示内容</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索专业名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="品牌等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="recommended">推荐品牌</SelectItem>
              <SelectItem value="key">重点品牌</SelectItem>
              <SelectItem value="standard">标准品牌</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增专业
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMajors.map((major) => (
          <Card key={major.id} className="overflow-hidden">
            <div className="aspect-[5/2] bg-muted relative">
              <img
                src={major.coverImage || "/placeholder.svg?height=200&width=500"}
                alt={major.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant={getBadgeVariant(major.level)}>
                  {BRAND_LEVEL_LABELS[major.level]}
                </Badge>
                <Badge variant={major.status === "published" ? "default" : "secondary"}>
                  {BRAND_STATUS_LABELS[major.status]}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{major.name}</CardTitle>
                  <CardDescription>{major.department}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{major.introduction}</p>

              <div className="grid grid-cols-3 gap-4 py-3 border-y">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {major.studentCount}
                  </div>
                  <p className="text-xs text-muted-foreground">在校生</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    {major.employmentRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">就业率</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {major.viewCount}
                  </div>
                  <p className="text-xs text-muted-foreground">浏览量</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">核心课程</p>
                <div className="flex flex-wrap gap-1">
                  {major.coreCourses.slice(0, 4).map((course) => (
                    <Badge key={course} variant="outline" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                  {major.coreCourses.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{major.coreCourses.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">合作主体</p>
                <div className="flex flex-wrap gap-1">
                  {major.cooperationPartners.map((partner) => (
                    <Badge key={partner} variant="secondary" className="text-xs">
                      {partner}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">特色成果</p>
                <div className="flex flex-wrap gap-1">
                  {major.featuredAchievements.map((achievement) => (
                    <Badge key={achievement} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
