"use client"

import Link from "next/link"
import {
  Building2, FolderKanban, Users, Trophy, Briefcase, Star,
  ArrowRight, GraduationCap, UserCircle, Heart, BookOpen,
  Calendar, MapPin, TrendingUp, Target, Sparkles, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  partners, projects, experts, achievements,
  talentProfiles, jobBrands, teacherBrands, cultureBrands,
  majorBrands, schoolInfo, employmentProjects, enterprises,
} from "@/lib/mock-data"
import {
  PARTNER_TYPE_LABELS, PROJECT_PHASE_LABELS, ACHIEVEMENT_TYPE_LABELS,
  EXPERT_RATING_LABELS, TEACHER_TYPE_LABELS, CULTURE_TYPE_LABELS,
  EMPLOYMENT_PROJECT_STATUS_LABELS, EMPLOYMENT_PROJECT_TYPE_LABELS,
} from "@/lib/types"

function maskStudentId(id: string) {
  if (id.length <= 4) return id
  return id.slice(0, 2) + "****" + id.slice(-2)
}

const brandCategories = [
  { id: "talent", title: "人才品牌", icon: Users, href: "/brands/talent", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { id: "partner", title: "雇主品牌", icon: Building2, href: "/brands/partner", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { id: "job", title: "岗位品牌", icon: Briefcase, href: "/brands/job", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { id: "major", title: "专业品牌", icon: GraduationCap, href: "/brands/major", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  { id: "teacher", title: "师资品牌", icon: UserCircle, href: "/brands/teacher", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  { id: "culture", title: "文化思政", icon: Heart, href: "/brands/culture", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
]

const stats = [
  { label: "合作主体", value: partners.filter(p => p.status === "active").length, icon: Building2 },
  { label: "合作项目", value: projects.filter(p => p.publishStatus === "published").length, icon: FolderKanban },
  { label: "专家资源", value: experts.length, icon: Users },
  { label: "成果产出", value: achievements.length, icon: Trophy },
  { label: "就业项目", value: employmentProjects.length, icon: Briefcase },
  { label: "品牌内容", value: talentProfiles.length + jobBrands.length + majorBrands.length + teacherBrands.length + cultureBrands.length, icon: Star },
]

const featuredPartners = partners.filter(p => p.status === "active").slice(0, 6)
const featuredProjects = projects.filter(p => p.publishStatus === "published").slice(0, 3)
const featuredAchievements = achievements.filter(a => a.status === "published").slice(0, 3)
const featuredExperts = experts.filter(e => e.status === "active").slice(0, 5)
const featuredTalent = talentProfiles.sort((a, b) => b.abilityScore - a.abilityScore).slice(0, 4)
const featuredJobs = jobBrands.filter(j => j.level === "recommended").slice(0, 3)
const featuredMajors = majorBrands.filter(m => m.level === "recommended").slice(0, 3)
const featuredTeachers = teacherBrands.filter(t => t.isFeatured && t.status === "published").slice(0, 4)
const featuredCulture = cultureBrands.filter(c => c.status === "published").slice(0, 3)
const featuredEmployment = employmentProjects.slice(0, 6)

function GradientButton({ children, href, variant = "primary" }: { children: React.ReactNode; href: string; variant?: "primary" | "secondary" }) {
  if (variant === "primary") {
    return (
      <Button asChild className="rounded-full px-8 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:from-blue-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5">
        <Link href={href}>{children}</Link>
      </Button>
    )
  }
  return (
    <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}

function SectionSubHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========== Navbar ========== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">产教融合平台</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="/partners" className="hover:text-blue-600 transition-colors">合作主体</Link>
              <Link href="/projects" className="hover:text-blue-600 transition-colors">项目</Link>
              <Link href="/experts" className="hover:text-blue-600 transition-colors">专家</Link>
              <Link href="/brands" className="hover:text-blue-600 transition-colors">品牌</Link>
              <Link href="/jobs" className="hover:text-blue-600 transition-colors">就业</Link>
            </div>
            <GradientButton href="/contact">联系我们</GradientButton>
          </div>
        </div>
      </nav>

      {/* ========== Hero ========== */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100 via-violet-100 to-indigo-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-100 via-orange-100 to-rose-100 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
                产业联盟与人资品牌服务平台
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                搭建产教融合桥梁
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600">
                  共育产业英才
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <GradientButton href="/partners">探索合作主体 <ArrowRight className="ml-2 h-4 w-4" /></GradientButton>
                <GradientButton href="/projects" variant="secondary">浏览合作项目</GradientButton>
              </div>
            </div>

            {/* Right: School Card */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-5">
                    <img
                      src={schoolInfo.logo || "/placeholder.svg?height=80&width=80"}
                      alt={schoolInfo.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-slate-900 truncate">{schoolInfo.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{schoolInfo.type} · {schoolInfo.province}{schoolInfo.city}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 py-5 border-y border-slate-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{schoolInfo.studentCount?.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-1">在校生</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-600">{schoolInfo.teacherCount}</p>
                      <p className="text-xs text-slate-500 mt-1">教师</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{schoolInfo.majorCount}</p>
                      <p className="text-xs text-slate-500 mt-1">专业</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-5 leading-relaxed line-clamp-3">{schoolInfo.introduction}</p>
                  <div className="flex items-center gap-4 mt-5 text-sm">
                    <span className="text-slate-400">{schoolInfo.establishedYear} 年建校</span>
                    {schoolInfo.website && (
                      <a href={schoolInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                        学校官网 →
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Stats Bar ========== */}
      <section className="relative -mt-12 z-10 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-3xl bg-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {stats.map((stat, idx) => {
                  const colors = [
                    "text-blue-600 bg-blue-50",
                    "text-violet-600 bg-violet-50",
                    "text-indigo-600 bg-indigo-50",
                    "text-emerald-600 bg-emerald-50",
                    "text-amber-600 bg-amber-50",
                    "text-rose-600 bg-rose-50",
                  ]
                  const colorClass = colors[idx % colors.length]
                  return (
                    <div key={stat.label} className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${colorClass} mb-3`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900">{stat.value}+</p>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========== 产教融合 ========== */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="产教融合" subtitle="多元主体协同，项目全程管理，数据驱动决策" />

          {/* 合作主体 */}
          <SectionSubHeading title="合作主体" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredPartners.map((partner) => (
              <Link key={partner.id} href={`/partners/${partner.id}`}>
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarImage src={partner.logo} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 font-bold">
                          {partner.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className="shrink-0 text-xs font-medium border-slate-200 text-slate-600">
                        {PARTNER_TYPE_LABELS[partner.type]}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{partner.name}</h4>
                    <p className="text-sm text-slate-500 mb-1">{partner.industry}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{partner.description}</p>
                    {partner.cooperationTypes && partner.cooperationTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {partner.cooperationTypes.slice(0, 3).map((type) => (
                          <span key={type} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 合作项目 */}
          <SectionSubHeading title="合作项目" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-blue-50 to-violet-50 text-blue-700 border-blue-100 font-medium">
                        {PROJECT_PHASE_LABELS[project.phase]}
                      </Badge>
                      <span className="text-xs text-slate-400">{project.type}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2 line-clamp-1">{project.name}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 合作成果 */}
          <SectionSubHeading title="合作成果" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredAchievements.map((ach) => (
              <Link key={ach.id} href="/achievements">
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs font-medium border-emerald-200 text-emerald-700 bg-emerald-50">
                        {ACHIEVEMENT_TYPE_LABELS[ach.type]}
                      </Badge>
                      {ach.partnerName && <span className="text-xs text-slate-400 truncate">{ach.partnerName}</span>}
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2 line-clamp-1">{ach.name}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{ach.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 专家资源库 */}
          <SectionSubHeading title="专家资源库" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {featuredExperts.map((expert) => (
              <Link key={expert.id} href="/experts">
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm text-center">
                  <CardContent className="p-5">
                    <Avatar className="h-16 w-16 mx-auto mb-4 ring-4 ring-slate-50">
                      <AvatarImage src={expert.avatar} />
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700">
                        {expert.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{expert.name}</h4>
                    <p className="text-xs text-slate-500 truncate mt-1">{expert.title}</p>
                    {expert.rating && (
                      <Badge variant="outline" className="mt-3 text-[10px] font-medium border-amber-200 text-amber-700 bg-amber-50">
                        {EXPERT_RATING_LABELS[expert.rating]}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 品牌展示 ========== */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="品牌展示" subtitle="人才培养、校企合作、专业建设等各领域品牌成果" />

          {/* 六大品牌分类 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
            {brandCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.id} href={cat.href}>
                  <Card className={`h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl cursor-pointer ${cat.bg} ${cat.border} border`}>
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                        <Icon className={`h-6 w-6 ${cat.color}`} />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800">{cat.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* 精选人才 */}
          <SectionSubHeading title="精选人才" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {featuredTalent.map((profile, index) => (
              <Card key={profile.id} className="border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-4 ring-blue-50">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-base font-bold bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700">
                          {profile.studentName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{profile.studentName}</p>
                      <p className="text-xs text-slate-500">{maskStudentId(profile.studentId)}</p>
                      <p className="text-xs text-slate-400">{profile.major}</p>
                    </div>
                    <div className="text-center shrink-0">
                      <p className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        {profile.abilityScore}
                      </p>
                      <p className="text-[10px] text-slate-400">能力分</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {profile.abilityTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {tag}
                      </span>
                    ))}
                    {profile.abilityTags.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-medium">
                        +{profile.abilityTags.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 雇主品牌 + 岗位品牌 */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <SectionSubHeading title="雇主品牌" />
              <div className="space-y-4">
                {featuredPartners.slice(0, 3).map((partner) => (
                  <Link key={partner.id} href={`/partners/${partner.id}`}>
                    <Card className="border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-2xl bg-white">
                      <CardContent className="p-5 flex items-center gap-4">
                        <Avatar className="h-14 w-14 rounded-xl">
                          <AvatarImage src={partner.logo} className="object-cover" />
                          <AvatarFallback className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 font-bold">
                            {partner.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{partner.name}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{partner.region}</span>
                            <span>{partner.industry}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <SectionSubHeading title="岗位品牌" />
              <div className="space-y-4">
                {featuredJobs.map((jb) => (
                  <Link key={jb.id} href="/brands/job">
                    <Card className="border-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-2xl bg-white">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-bold text-slate-900">{jb.name}</h4>
                          <Badge variant="outline" className="text-xs font-medium border-amber-200 text-amber-700 bg-amber-50">
                            {jb.industry}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-1 mb-3">{jb.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-bold text-emerald-600">{jb.averageSalary || "面议"}</span>
                          <span className="text-slate-400">需求 {jb.demandCount} 人</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 特色专业 */}
          <SectionSubHeading title="特色专业" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredMajors.map((major) => (
              <Card key={major.id} className="border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-bold text-slate-900">{major.name}</h4>
                    <Badge className="text-[10px] h-5 px-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white border-0">
                      推荐品牌
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{major.department}</p>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{major.introduction}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-slate-600"><strong>{major.studentCount}</strong> 在校生</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-600">就业率 <strong className="text-emerald-600">{major.employmentRate}%</strong></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 师资品牌 */}
          <SectionSubHeading title="师资品牌" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
            {featuredTeachers.map((teacher) => (
              <Link key={teacher.id} href="/brands/teacher">
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-5">
                    <img
                      src={teacher.avatar || "/placeholder.svg?height=48&width=48"}
                      alt={teacher.name}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-rose-50 mx-auto mb-3"
                    />
                    <h4 className="font-bold text-slate-900 text-sm text-center truncate">{teacher.name}</h4>
                    <p className="text-xs text-slate-500 text-center">{teacher.title}</p>
                    <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium border border-rose-100">
                        {TEACHER_TYPE_LABELS[teacher.type]}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-medium border border-slate-100">
                        {teacher.department}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 文化思政品牌 */}
          <SectionSubHeading title="文化思政品牌" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCulture.map((cb) => (
              <Link key={cb.id} href="/brands/culture">
                <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="text-xs font-medium border-pink-200 text-pink-700 bg-pink-50 mb-3">
                      {CULTURE_TYPE_LABELS[cb.type]}
                    </Badge>
                    <h4 className="font-bold text-slate-900 mb-2">{cb.name}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{cb.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 就业项目 ========== */}
      <section className="py-24 bg-gradient-to-b from-blue-50/40 via-indigo-50/30 to-violet-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="就业项目" subtitle="校企合作就业项目，汇聚优质岗位资源" />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
            {[
              { label: "就业项目", value: employmentProjects.length, icon: Briefcase, color: "from-blue-500 to-blue-600" },
              { label: "进行中", value: employmentProjects.filter(p => p.status === "ongoing").length, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
              { label: "在招岗位", value: employmentProjects.reduce((sum, p) => sum + p.jobCount, 0), icon: Target, color: "from-violet-500 to-violet-600" },
              { label: "合作企业", value: new Set(employmentProjects.flatMap(p => p.partnerIds)).size, icon: Building2, color: "from-amber-500 to-amber-600" },
            ].map((s) => (
              <Card key={s.label} className="border-0 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white mb-3 shadow-md`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEmployment.map((project) => {
              const partnerNames = project.partnerIds
                .map((id) => enterprises.find((e) => e.id === id)?.name)
                .filter(Boolean)
                .slice(0, 2)
              return (
                <Link key={project.id} href={`/jobs/project/${project.id}`}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`text-xs font-medium border-0 ${
                          project.status === "preparing"
                            ? "bg-amber-100 text-amber-700"
                            : project.status === "ongoing"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium border-slate-200 text-slate-500">
                          {EMPLOYMENT_PROJECT_TYPE_LABELS[project.type]}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2 line-clamp-1">{project.name}</h4>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {project.description || `面向${project.targetStudentGroups.join("、")}学生，提供丰富的就业岗位。`}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-blue-500" />
                          {project.startDate.toLocaleDateString("zh-CN")} 起
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-violet-500" />
                          {project.jobCount} 个岗位
                        </span>
                      </div>
                      <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {partnerNames.join("、")}
                        {project.partnerIds.length > 2 && ` 等 ${project.partnerIds.length} 家企业`}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            加入产教融合生态圈
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rounded-full px-10 py-6 text-base font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5">
              <Link href="/contact">联系我们</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-10 py-6 text-base font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-200">产教融合平台</span>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} 产业联盟与人资品牌服务平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
