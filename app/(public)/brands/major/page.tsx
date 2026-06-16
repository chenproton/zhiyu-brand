"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { GraduationCap, Users, TrendingUp, Search, X, BookOpen, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { majorBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"
import type { BrandLevel, BrandStatus } from "@/lib/types"

const IMAGES = [
  "/images/landingpage/lab.jpg",
  "/images/landingpage/coding.jpg",
  "/images/landingpage/factory.jpg",
  "/images/landingpage/office.jpg",
  "/images/landingpage/tech.jpg",
  "/images/landingpage/meeting.jpg",
  "/images/landingpage/workspace.jpg",
  "/images/landingpage/students.jpg",
]

function getImage(index: number) {
  return IMAGES[index % IMAGES.length]
}

export default function MajorBrandPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    level: "all",
    department: "all",
  })

  const departments = useMemo(
    () => [...new Set(majorBrands.map((m) => m.department))].sort(),
    []
  )

  const filteredMajors = useMemo(() => {
    return majorBrands.filter((major) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          major.name.toLowerCase().includes(term) ||
          major.department.toLowerCase().includes(term) ||
          major.introduction.toLowerCase().includes(term)
        if (!matchesSearch) return false
      }
      if (filters.level !== "all" && major.level !== filters.level) return false
      if (filters.department !== "all" && major.department !== filters.department) return false
      return major.status === "published"
    })
  }, [search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ level: "all", department: "all" })
  }

  const hasActiveFilters = search || Object.values(filters).some((v) => v !== "all")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            专业品牌
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示学校特色专业的培养目标、课程体系、就业成果和合作资源
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl bg-white/80 backdrop-blur-sm mb-10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索专业名称或院系..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={filters.level} onValueChange={(v) => handleFilterChange("level", v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部等级</SelectItem>
                      {Object.entries(BRAND_LEVEL_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.department} onValueChange={(v) => handleFilterChange("department", v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部院系" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部院系</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="rounded-xl">
                      <X className="h-4 w-4 mr-1" />
                      清除筛选
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              共 <span className="font-bold text-slate-900">{filteredMajors.length}</span> 个专业品牌
            </p>
          </div>

          {filteredMajors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredMajors.map((major, index) => (
                <Link key={major.id} href={`/brands/major/${major.id}`}>
                  <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full flex flex-col">
                    <div className="relative h-56 overflow-hidden shrink-0">
                      <img
                        src={major.coverImage || getImage(index)}
                        alt={major.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm font-bold border-0 shadow-lg">
                          {BRAND_LEVEL_LABELS[major.level as BrandLevel]}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h4 className="font-bold text-white text-xl mb-1 drop-shadow-md">{major.name}</h4>
                        <p className="text-white/70 text-sm mb-3">{major.department}</p>
                        <div className="flex items-center gap-5 text-sm text-white/90">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" /> {major.studentCount} 在校生
                          </span>
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-emerald-400" /> 就业率 {major.employmentRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{major.introduction}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {major.coreCourses.slice(0, 3).map((course) => (
                          <span
                            key={typeof course === "string" ? course : course.name}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium"
                          >
                            {typeof course === "string" ? course : course.name}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-3 mt-auto">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" /> 课程完成度
                            </span>
                            <span>{Math.round(major.employmentRate)}%</span>
                          </div>
                          <Progress value={major.employmentRate} className="h-1.5" />
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-blue-500" /> {major.cooperationPartners.slice(0, 2).join("、") || "暂无合作"}
                            {major.cooperationPartners.length > 2 && ` 等${major.cooperationPartners.length}家`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <GraduationCap className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的专业品牌</p>
              <Button variant="outline" onClick={handleClearFilters} className="rounded-full px-6">
                清除筛选条件
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
