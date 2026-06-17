"use client"

import { useMemo, useState } from "react"
import { Heart, Search, X, Calendar, BookOpen } from "lucide-react"
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
import { cultureBrands } from "@/lib/mock-data"
import { CULTURE_TYPE_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"
import type { CultureBrand, BrandStatus } from "@/lib/types"

const IMAGES = [
  "/images/landingpage/diversity.jpg",
  "/images/landingpage/group.jpg",
  "/images/landingpage/collaborate.jpg",
  "/images/landingpage/planning.jpg",
  "/images/landingpage/meeting.jpg",
  "/images/landingpage/students.jpg",
  "/images/landingpage/agreement.jpg",
  "/images/landingpage/working.jpg",
]

function getImage(index: number) {
  return IMAGES[index % IMAGES.length]
}

const TYPE_COLORS: Record<CultureBrand["type"], string> = {
  case: "bg-blue-100 text-blue-700 border-blue-200",
  resource: "bg-emerald-100 text-emerald-700 border-emerald-200",
  activity: "bg-amber-100 text-amber-700 border-amber-200",
  award: "bg-rose-100 text-rose-700 border-rose-200",
}

export default function CultureBrandPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
  })

  const filteredCultures = useMemo(() => {
    return cultureBrands.filter((culture) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          culture.name.toLowerCase().includes(term) ||
          culture.description.toLowerCase().includes(term) ||
          (culture.relatedMajor?.toLowerCase().includes(term) ?? false)
        if (!matchesSearch) return false
      }
      if (filters.type !== "all" && culture.type !== filters.type) return false
      return culture.status === "published"
    })
  }, [search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ type: "all" })
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
            文化思政品牌
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示学校文化建设与思政教育的典型案例、优质资源和获奖成果
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
                    placeholder="搜索内容名称、描述或面向专业..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={filters.type} onValueChange={(v) => handleFilterChange("type", v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {Object.entries(CULTURE_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
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
              共 <span className="font-bold text-slate-900">{filteredCultures.length}</span> 个文化思政品牌
            </p>
          </div>

          {filteredCultures.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredCultures.map((culture, index) => (
                <Card key={culture.id} className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={culture.coverImage || getImage(index)}
                      alt={culture.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <Badge className={`${TYPE_COLORS[culture.type]} border font-bold shadow-sm`}>
                        {CULTURE_TYPE_LABELS[culture.type]}
                      </Badge>
                      <Badge variant={culture.status === "published" ? "secondary" : "outline"} className="text-[10px]">
                        {BRAND_STATUS_LABELS[culture.status as BrandStatus]}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md line-clamp-1">{culture.name}</h4>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{culture.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
                      {culture.relatedMajor && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5 text-blue-500" /> {culture.relatedMajor}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-emerald-500" /> {culture.updatedAt.toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <Heart className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的文化思政品牌</p>
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
