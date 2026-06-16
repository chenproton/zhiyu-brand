"use client"

import { useMemo, useState } from "react"
import { Briefcase, Building2, Search, X, Target } from "lucide-react"
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
import { jobBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, INDUSTRIES, JOB_CATEGORY_LABELS } from "@/lib/types"

export default function JobBrandPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    level: "all",
    industry: "all",
    category: "all",
  })

  const categories = useMemo(() => [...new Set(jobBrands.map((j) => j.jobCategory).filter(Boolean))], [])

  const filteredJobs = useMemo(() => {
    return jobBrands.filter((job) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          job.name.toLowerCase().includes(term) ||
          job.industry.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          job.suitableMajors.some((m) => m.toLowerCase().includes(term))
        if (!matchesSearch) return false
      }
      if (filters.level !== "all" && job.level !== filters.level) return false
      if (filters.industry !== "all" && job.industry !== filters.industry) return false
      if (filters.category !== "all" && job.jobCategory !== filters.category) return false
      return true
    })
  }, [search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ level: "all", industry: "all", category: "all" })
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
            岗位品牌
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示具有示范价值的职业岗位资源，帮助学生了解目标职业方向
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
                    placeholder="搜索岗位名称、行业或专业..."
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
                  <Select value={filters.industry} onValueChange={(v) => handleFilterChange("industry", v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部行业" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部行业</SelectItem>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.category} onValueChange={(v) => handleFilterChange("category", v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category as string}>{JOB_CATEGORY_LABELS[category || "non-teaching"]}</SelectItem>
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
              共 <span className="font-bold text-slate-900">{filteredJobs.length}</span> 个岗位品牌
            </p>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
                  <div className="p-5 flex flex-col h-full">
                    <div className="mb-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-slate-900 text-lg truncate">{job.name}</h4>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{job.industry}</p>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-500">
                        {JOB_CATEGORY_LABELS[job.jobCategory || "non-teaching"]}
                      </Badge>
                      {job.suitableMajors.slice(0, 2).map((major) => (
                        <span key={major} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                          {major}
                        </span>
                      ))}
                      {job.featureTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100 mt-auto">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-blue-500" /> {job.averageSalary || "面议"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5 text-emerald-500" /> {job.suitableMajors.slice(0, 2).join("、") || "-"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <Briefcase className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的岗位品牌</p>
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
