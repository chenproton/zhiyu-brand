"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Building2, Search, X } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CooperationRatingBadge } from "@/components/shared/status-badge"
import { partners, enterprises } from "@/lib/mock-data"
import {
  COOPERATION_RATING_LABELS,
  INDUSTRIES,
} from "@/lib/types"


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

export default function PartnersPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    rating: "all",
    industry: "all",
  })

  const enterpriseMap = useMemo(() => {
    return new Map(enterprises.map((e) => [e.id, e]))
  }, [])

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const enterprise = enterpriseMap.get(partner.id)
      if (!enterprise || !enterprise.isPublicDisplay) return false

      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          partner.name.toLowerCase().includes(term) ||
          partner.industry.toLowerCase().includes(term) ||
          partner.region.toLowerCase().includes(term)
        if (!matchesSearch) return false
      }

      if (filters.rating !== "all" && partner.rating !== filters.rating) return false
      if (filters.industry !== "all" && partner.industry !== filters.industry) return false

      return true
    })
  }, [search, filters, enterpriseMap])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({
      rating: "all",
      industry: "all",
    })
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
            合作主体
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            浏览和了解产教融合平台上的各类合作主体与企业伙伴
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
                    placeholder="搜索企业名称、行业、地区..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
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
              共 <span className="font-bold text-slate-900">{filteredPartners.length}</span> 个企业
            </p>
          </div>

          {filteredPartners.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredPartners.map((partner, index) => {
                const enterprise = enterpriseMap.get(partner.id)
                return (
                  <Link key={partner.id} href={`/partners/${partner.id}`}>
                    <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={enterprise?.coverImage || getImage(index)}
                          alt={partner.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-xl border-2 border-white/80 shadow-lg">
                              <AvatarImage src={enterprise?.coverImage || getImage(index)} className="object-cover" />
                              <AvatarFallback className="rounded-xl bg-white text-slate-800 font-bold text-lg">
                                {partner.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md truncate">{partner.name}</h4>
                              <p className="text-white/80 text-sm truncate">{partner.industry} · {partner.region}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">{partner.description}</p>
                        <div className="pt-4 mt-4 border-t border-slate-100">
                          <CooperationRatingBadge
                            rating={partner.rating}
                            className="text-[11px] px-3 py-1 rounded-full"
                          />
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
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的企业</p>
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
