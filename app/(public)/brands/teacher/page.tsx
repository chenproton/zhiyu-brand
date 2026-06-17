"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { UserCircle, Star, Search, X } from "lucide-react"
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
import { teacherBrands, experts } from "@/lib/mock-data"
import { TEACHER_TYPE_LABELS } from "@/lib/types"

const TEACHER_IMAGES = [
  "/images/landingpage/team.jpg",
  "/images/landingpage/meeting.jpg",
  "/images/landingpage/collaborate.jpg",
  "/images/landingpage/planning.jpg",
  "/images/landingpage/working.jpg",
  "/images/landingpage/group.jpg",
]

function getTeacherImage(index: number) {
  return TEACHER_IMAGES[index % TEACHER_IMAGES.length]
}

export default function TeacherBrandPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
  })
  const [activeTab, setActiveTab] = useState<"teachers" | "experts">("teachers")

  const filteredTeachers = useMemo(() => {
    return teacherBrands.filter((teacher) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          teacher.name.toLowerCase().includes(term) ||
          teacher.department.toLowerCase().includes(term) ||
          teacher.title.toLowerCase().includes(term)
        if (!matchesSearch) return false
      }
      if (filters.type !== "all" && teacher.type !== filters.type) return false
      return teacher.status === "published"
    })
  }, [search, filters])

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      if (search) {
        const term = search.toLowerCase()
        const matchesSearch =
          expert.name.toLowerCase().includes(term) ||
          (expert.organization?.toLowerCase().includes(term) ?? false) ||
          (expert.partnerName?.toLowerCase().includes(term) ?? false) ||
          (expert.title?.toLowerCase().includes(term) ?? false) ||
          (expert.position?.toLowerCase().includes(term) ?? false)
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
    setFilters({ type: "all" })
  }

  const hasActiveFilters = search || Object.values(filters).some((v) => v !== "all")
  const activeData = activeTab === "teachers" ? filteredTeachers : filteredExperts

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-violet-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            师资品牌
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示学校优秀教师和来自合作企业的行业专家
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
                    placeholder={activeTab === "teachers" ? "搜索教师姓名或院系..." : "搜索专家姓名或所属机构..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeTab === "teachers" && (
                    <Select value={filters.type} onValueChange={(v) => handleFilterChange("type", v)}>
                      <SelectTrigger className="w-[150px] rounded-xl">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        {Object.entries(TEACHER_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1 bg-slate-50">
                    <button
                      onClick={() => setActiveTab("teachers")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "teachers"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      校本师资
                    </button>
                    <button
                      onClick={() => setActiveTab("experts")}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === "experts"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      企业专家
                    </button>
                  </div>
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
              共 <span className="font-bold text-slate-900">{activeData.length}</span> 位{activeTab === "teachers" ? "教师" : "专家"}
            </p>
          </div>

          {activeData.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {activeTab === "teachers"
                ? filteredTeachers.map((teacher, index) => {
                  const genderLabel = teacher.gender === "male" ? "男" : teacher.gender === "female" ? "女" : "—"
                  return (
                    <Card key={teacher.id} className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white text-center h-full flex flex-col">
                      <div className="h-24 relative">
                        <img
                          src={getTeacherImage(index)}
                          alt={teacher.organization || teacher.department}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                          <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                            <AvatarImage src={teacher.avatar} className="object-cover" />
                            <AvatarFallback className="text-xl font-bold bg-white text-slate-800">{teacher.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <CardContent className="pt-12 pb-6 px-4 flex-1 flex flex-col text-left">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <h4 className="font-bold text-slate-900 text-center truncate">{teacher.name}</h4>
                          {teacher.isFeatured && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                        </div>
                        <p className="text-xs text-slate-500 text-center truncate mt-0.5">{teacher.title || teacher.position || '—'}</p>
                        <div className="mt-4 space-y-2 text-xs text-slate-600">
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">所属机构</span>
                            <span className="text-right truncate">{teacher.organization || teacher.department || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">年龄/性别</span>
                            <span className="text-right">{teacher.age ? `${teacher.age}岁` : '—'} / {genderLabel}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">从业年限</span>
                            <span className="text-right">{teacher.workExperience ? `${teacher.workExperience} 年` : '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">教育背景</span>
                            <span className="text-right truncate">{teacher.education || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">行业方向</span>
                            <span className="text-right truncate">{teacher.industryDirection || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">岗位方向</span>
                            <span className="text-right truncate">{teacher.positionDirection || '—'}</span>
                          </div>
                        </div>
                        
                        {teacher.researchFields.length > 0 && (
                          <div className="mt-4">
                            <p className="text-[11px] text-slate-400 mb-1.5">研究领域</p>
                            <div className="flex flex-wrap gap-1">
                              {teacher.researchFields.slice(0, 4).map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
                : filteredExperts.map((expert) => (
                    <Card key={expert.id} className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white text-center h-full flex flex-col">
                      <div className="h-24 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500" />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm border-0 shadow-sm">
                            认证专家
                          </Badge>
                        </div>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                          <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                            <AvatarImage src={expert.avatar} className="object-cover" />
                            <AvatarFallback className="text-xl font-bold bg-white text-slate-800">{expert.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <CardContent className="pt-12 pb-6 px-4 flex-1 flex flex-col text-left">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <h4 className="font-bold text-slate-900 text-center truncate">{expert.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 text-center truncate mt-0.5">{expert.title || expert.position || '—'}</p>
                        <div className="mt-4 space-y-2 text-xs text-slate-600">
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">年龄/性别</span>
                            <span className="text-right">{expert.age ? `${expert.age}岁` : '—'} / {expert.gender === 'male' ? '男' : expert.gender === 'female' ? '女' : '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">从业年限</span>
                            <span className="text-right">{expert.experience ? `${expert.experience} 年` : '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">教育背景</span>
                            <span className="text-right truncate">{expert.education || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">行业方向</span>
                            <span className="text-right truncate">{expert.industryDirection || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">岗位方向</span>
                            <span className="text-right truncate">{expert.positionDirection || '—'}</span>
                          </div>
                        </div>

                        {expert.specialties && expert.specialties.length > 0 && (
                          <div className="mt-4">
                            <p className="text-[11px] text-slate-400 mb-1.5">擅长领域</p>
                            <div className="flex flex-wrap gap-1">
                              {expert.specialties.slice(0, 4).map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <UserCircle className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">
                暂无符合条件的{activeTab === "teachers" ? "教师" : "专家"}
              </p>
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
