"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Building2, Handshake, Search, X, Briefcase } from "lucide-react"
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
import { partners, jobs } from "@/lib/mock-data"
import {
  INDUSTRIES,
  PARTNER_TYPE_LABELS,
  COOPERATION_RATING_LABELS,
} from "@/lib/types"
import type { PartnerType, CooperationRating } from "@/lib/types"

const IMAGES = [
  "/images/landingpage/building.jpg",
  "/images/landingpage/office.jpg",
  "/images/landingpage/factory.jpg",
  "/images/landingpage/tech.jpg",
  "/images/landingpage/meeting.jpg",
  "/images/landingpage/workspace.jpg",
  "/images/landingpage/handshake.jpg",
  "/images/landingpage/collaborate.jpg",
]

function getImage(index: number) {
  return IMAGES[index % IMAGES.length]
}

export default function PartnerBrandPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
    industry: "all",
    rating: "all",
  })

  const partnerJobsCount = useMemo(() => {
    const map = new Map<string, number>()
    jobs.forEach((job) => {
      if (job.partnerId) {
        map.set(job.partnerId, (map.get(job.partnerId) || 0) + 1)
      }
    })
    return map
  }, [])

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          partner.name.toLowerCase().includes(term) ||
          partner.industry.toLowerCase().includes(term) ||
          partner.region.toLowerCase().includes(term)
        if (!matchesSearch) return false
      }
      if (filters.type !== "all" && partner.type !== filters.type) return false
      if (filters.industry !== "all" && partner.industry !== filters.industry) return false
      if (filters.rating !== "all" && partner.rating !== filters.rating) return false
      return partner.status === "active"
    })
  }, [search, filters, partnerJobsCount])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ type: "all", industry: "all", rating: "all" })
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
            合作主体品牌
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示与学校建立合作关系的企业、行业协会、产业园区、机构等合作伙伴
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
                    placeholder="搜索主体名称、行业或地区..."
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
                      {Object.entries(PARTNER_TYPE_LABELS).map(([value, label]) => (
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
                  <Select value={filters.rating} onValueChange={(v) => handleFilterChange("rating", v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部评级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部评级</SelectItem>
                      {Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => (
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
              共 <span className="font-bold text-slate-900">{filteredPartners.length}</span> 个合作主体
            </p>
          </div>

          {filteredPartners.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredPartners.map((partner, index) => {
                const jobCount = partnerJobsCount.get(partner.id) || 0
                return (
                  <Link key={partner.id} href={`/partners/${partner.id}`}>
                    <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={partner.coverImage || getImage(index)}
                          alt={partner.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white/90 flex items-center justify-center text-slate-800 font-bold text-lg shadow-lg">
                              {partner.name[0]}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md truncate">{partner.name}</h4>
                              <p className="text-white/80 text-sm truncate">{partner.industry} · {partner.region}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{partner.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="text-[10px]">
                            {PARTNER_TYPE_LABELS[partner.type as PartnerType]}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-500">
                            {COOPERATION_RATING_LABELS[partner.rating as CooperationRating]}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Handshake className="h-3.5 w-3.5 text-blue-500" /> {partner.cooperationTypes.length} 合作方式
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-violet-500" /> {jobCount} 关联岗位
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <Building2 className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的合作主体</p>
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
