"use client"

import { useMemo, useState } from "react"
import { Users, Award, Briefcase, Search, X } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { talentProfiles, employmentCases } from "@/lib/mock-data"
import { BRAND_STATUS_LABELS } from "@/lib/types"
import type { BrandStatus } from "@/lib/types"

function maskStudentId(id: string) {
  if (id.length <= 4) return id
  return id.slice(0, 2) + "****" + id.slice(-2)
}

const EMPLOYMENT_STATUS_LABELS: Record<NonNullable<typeof talentProfiles[0]["employmentStatus"]>, string> = {
  employed: "已就业",
  seeking: "求职中",
  studying: "在读",
}

const IMAGES = [
  "/images/landingpage/students.jpg",
  "/images/landingpage/campus.jpg",
  "/images/landingpage/team.jpg",
  "/images/landingpage/coding.jpg",
  "/images/landingpage/workspace.jpg",
  "/images/landingpage/startup.jpg",
  "/images/landingpage/collaborate.jpg",
  "/images/landingpage/group.jpg",
]

function getImage(index: number) {
  return IMAGES[index % IMAGES.length]
}

function MajorTabs({
  value,
  onChange,
  majors,
}: {
  value: string
  onChange: (value: string) => void
  majors: string[]
}) {
  const tabs = ["全部专业", ...majors]
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((major) => {
        const tabValue = major === "全部专业" ? "all" : major
        const active = value === tabValue
        return (
          <button
            key={tabValue}
            onClick={() => onChange(tabValue)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              active
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {major}
          </button>
        )
      })}
    </div>
  )
}

export default function TalentBrandPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"talent" | "cases">("cases")
  const [filters, setFilters] = useState<Record<string, string>>({
    major: "all",
    employmentStatus: "all",
  })

  const allMajors = useMemo(() => [...new Set(talentProfiles.map((t) => t.major))].sort(), [])

  const filteredProfiles = useMemo(() => {
    return talentProfiles
      .filter((p) => {
        if (search) {
          const term = search.toLowerCase()
          const matchesSearch =
            p.studentName.toLowerCase().includes(term) ||
            p.studentId.toLowerCase().includes(term) ||
            p.major.toLowerCase().includes(term)
          if (!matchesSearch) return false
        }
        if (filters.major !== "all" && p.major !== filters.major) return false
        if (filters.employmentStatus !== "all" && p.employmentStatus !== filters.employmentStatus) return false
        return true
      })
      .sort((a, b) => b.abilityScore - a.abilityScore)
  }, [search, filters])

  const filteredCases = useMemo(() => {
    return employmentCases.filter((case_) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          case_.studentName.toLowerCase().includes(term) ||
          case_.company.toLowerCase().includes(term) ||
          case_.major.toLowerCase().includes(term)
        if (!matchesSearch) return false
      }
      return true
    })
  }, [search])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ major: "all", employmentStatus: "all" })
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
            人才品牌
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示优秀毕业生的能力画像与就业成果，彰显人才培养质量
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "talent" | "cases")}>
              <TabsList className="rounded-xl">
                <TabsTrigger value="cases" className="rounded-lg">就业案例</TabsTrigger>
                <TabsTrigger value="talent" className="rounded-lg">学生排行</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab === "talent" ? "搜索学生姓名、学号或专业..." : "搜索学生姓名、企业或专业..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
              {activeTab === "talent" && (
                <Select value={filters.employmentStatus} onValueChange={(v) => handleFilterChange("employmentStatus", v)}>
                  <SelectTrigger className="w-[150px] rounded-xl">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="employed">已就业</SelectItem>
                    <SelectItem value="seeking">求职中</SelectItem>
                    <SelectItem value="studying">在读</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="rounded-xl">
                  <X className="h-4 w-4 mr-1" />
                  清除筛选
                </Button>
              )}
            </div>
          </div>

          {activeTab === "talent" ? (
            <>
              <MajorTabs
                value={filters.major}
                onChange={(v) => handleFilterChange("major", v)}
                majors={allMajors}
              />
              <div className="flex items-center justify-between mb-6 mt-6">
                <p className="text-slate-500 text-sm">
                  共 <span className="font-bold text-slate-900">{filteredProfiles.length}</span> 位人才
                </p>
              </div>

              {filteredProfiles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredProfiles.map((profile, index) => {
                    const gradients = [
                      "from-blue-500 via-blue-600 to-indigo-600",
                      "from-violet-500 via-purple-600 to-fuchsia-600",
                      "from-emerald-500 via-teal-600 to-cyan-600",
                      "from-amber-500 via-orange-600 to-red-600",
                    ]
                    const grad = gradients[index % gradients.length]
                    return (
                      <Card key={profile.id} className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
                        <div className={`h-28 bg-gradient-to-r ${grad} relative`}>
                          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="absolute -bottom-10 left-6">
                            <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                              <AvatarImage src={profile.avatar} />
                              <AvatarFallback className="text-xl font-bold bg-white text-slate-800">
                                {profile.studentName[0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <CardContent className="pt-12 pb-6 px-6">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 truncate">{profile.studentName}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{maskStudentId(profile.studentId)} · {profile.major} · {profile.grade}</p>
                              <p className="text-xs text-slate-400 mt-0.5 truncate">{profile.department}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${grad}`}>
                                {profile.abilityScore}
                              </p>
                              <p className="text-[10px] text-slate-400">能力分</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {profile.certificationLevel && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-white font-medium">
                                {profile.certificationLevel}
                              </span>
                            )}
                            {profile.employmentStatus && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-medium">
                                {EMPLOYMENT_STATUS_LABELS[profile.employmentStatus]}
                              </span>
                            )}
                            {profile.abilityTags.slice(0, 4).map((tag) => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {profile.remark && (
                            <p className="text-xs text-slate-400 mt-4 line-clamp-2 italic border-l-2 border-slate-200 pl-3">
                              &ldquo;{profile.remark}&rdquo;
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                    <Users className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg mb-5">暂无符合条件的人才</p>
                  <Button variant="outline" onClick={handleClearFilters} className="rounded-full px-6">
                    清除筛选条件
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-500 text-sm">
                  共 <span className="font-bold text-slate-900">{filteredCases.length}</span> 个就业案例
                </p>
              </div>

              {filteredCases.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredCases.map((case_, index) => (
                    <Card key={case_.id} className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getImage(index)}
                          alt={case_.studentName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-xl border-2 border-white/80 shadow-lg">
                              <AvatarImage src={case_.companyLogo} className="object-cover" />
                              <AvatarFallback className="rounded-xl bg-white text-slate-800 font-bold text-lg">
                                {case_.studentName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md truncate">{case_.studentName}</h4>
                              <p className="text-white/80 text-sm truncate">{case_.company} · {case_.position}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{case_.story}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-500">
                            {case_.major}
                          </Badge>
                          <Badge variant={case_.status === "published" ? "secondary" : "outline"} className="text-[10px]">
                            {BRAND_STATUS_LABELS[case_.status as BrandStatus]}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-4 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-amber-500" /> {case_.salary || "面议"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-violet-500" /> {case_.graduationYear}届
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate- Tabs...max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Briefcase className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg mb-5">暂无符合条件的就业案例</p>
                  <Button variant="outline" onClick={handleClearFilters} className="rounded-full px-6">
                    清除筛选条件
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
