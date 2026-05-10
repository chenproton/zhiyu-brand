"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search, Briefcase, TrendingUp, Users, Star, Eye } from "lucide-react"
import { jobBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, INDUSTRIES } from "@/lib/types"

export default function JobBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

  const filteredJobs = jobBrands.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || job.level === levelFilter
    const matchesIndustry = industryFilter === "all" || job.industry === industryFilter
    return matchesSearch && matchesLevel && matchesIndustry && job.status === "published"
  })

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case "recommended":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "key":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              岗位品牌
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              优质职业岗位
            </h1>
            <p className="text-muted-foreground">
              展示具有示范价值的职业岗位资源，帮助学生了解目标职业方向
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索岗位名称..."
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
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="所属行业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部行业</SelectItem>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[3/2] bg-muted relative overflow-hidden">
                <img
                  src={job.coverImage || "/placeholder.svg?height=200&width=300"}
                  alt={job.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getLevelBadgeStyle(job.level)}>
                    {BRAND_LEVEL_LABELS[job.level]}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-semibold text-xl text-white">{job.name}</h3>
                  <p className="text-white/80 text-sm">{job.industry}</p>
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {job.description}
                </p>

                <div className="grid grid-cols-3 gap-4 py-3 border-y mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      {job.averageSalary}
                    </div>
                    <p className="text-xs text-muted-foreground">薪资范围</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {job.demandCount}
                    </div>
                    <p className="text-xs text-muted-foreground">需求量</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 font-semibold">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      {job.viewCount}
                    </div>
                    <p className="text-xs text-muted-foreground">浏览</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">能力要求</p>
                  <div className="flex flex-wrap gap-1">
                    {job.abilityModel.slice(0, 3).map((ability) => (
                      <Badge key={ability} variant="outline" className="text-xs">
                        {ability}
                      </Badge>
                    ))}
                    {job.abilityModel.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.abilityModel.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">适合专业</p>
                  <div className="flex flex-wrap gap-1">
                    {job.suitableMajors.map((major) => (
                      <Badge key={major} variant="secondary" className="text-xs">
                        {major}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {job.featureTags.map((tag) => (
                    <Badge key={tag} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">
                      <Star className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无符合条件的岗位品牌</p>
          </div>
        )}
      </section>
    </div>
  )
}
