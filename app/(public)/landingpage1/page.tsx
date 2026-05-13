"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Building2, FolderKanban, Users, Trophy, Briefcase, Star,
  ArrowRight, GraduationCap, UserCircle, Heart, MapPin,
  Calendar, TrendingUp, Target, Sparkles, CheckCircle2,
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

function useCountUp(end: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - p, 4)
            setCount(Math.round(easeOutQuart * end))
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

const IMAGES = [
  "/images/landingpage/building.jpg", "/images/landingpage/office.jpg",
  "/images/landingpage/team.jpg", "/images/landingpage/campus.jpg",
  "/images/landingpage/factory.jpg", "/images/landingpage/tech.jpg",
  "/images/landingpage/students.jpg", "/images/landingpage/meeting.jpg",
  "/images/landingpage/lab.jpg", "/images/landingpage/workspace.jpg",
]
function getImage(i: number) { return IMAGES[i % IMAGES.length] }

const AVATARS = Array.from({ length: 16 }, (_, i) => `/images/avatars/p${i + 1}.jpg`)
function getAvatar(i: number) { return AVATARS[i % AVATARS.length] }

const stats = [
  { label: "合作主体", value: partners.filter(p => p.status === "active").length, icon: Building2 },
  { label: "合作项目", value: projects.filter(p => p.publishStatus === "published").length, icon: FolderKanban },
  { label: "专家资源", value: experts.length, icon: Users },
  { label: "成果产出", value: achievements.length, icon: Trophy },
  { label: "就业项目", value: employmentProjects.length, icon: Briefcase },
  { label: "品牌内容", value: talentProfiles.length + jobBrands.length + majorBrands.length + teacherBrands.length + cultureBrands.length, icon: Star },
]

const featuredPartners = partners.filter(p => p.status === "active").slice(0, 4)
const featuredProjects = projects.filter(p => p.publishStatus === "published").slice(0, 3)
const featuredAchievements = achievements.filter(a => a.status === "published").slice(0, 3)
const featuredExperts = experts.filter(e => e.status === "active").slice(0, 4)
const featuredTalent = talentProfiles.sort((a, b) => b.abilityScore - a.abilityScore).slice(0, 4)
const featuredJobs = jobBrands.filter(j => j.level === "recommended").slice(0, 3)
const featuredMajors = majorBrands.filter(m => m.level === "recommended").slice(0, 3)
const featuredTeachers = teacherBrands.filter(t => t.isFeatured && t.status === "published").slice(0, 4)
const featuredCulture = cultureBrands.filter(c => c.status === "published").slice(0, 3)
const featuredEmployment = employmentProjects.slice(0, 6)

function StatCard({ stat, idx }: { stat: typeof stats[0]; idx: number }) {
  const gradients = [
    "from-orange-100 to-amber-50 text-orange-600",
    "from-blue-100 to-indigo-50 text-blue-600",
    "from-emerald-100 to-teal-50 text-emerald-600",
    "from-violet-100 to-purple-50 text-violet-600",
    "from-amber-100 to-yellow-50 text-amber-600",
    "from-rose-100 to-pink-50 text-rose-600",
  ]
  const { count, ref } = useCountUp(stat.value)
  return (
    <div ref={ref} className="text-center p-5 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all hover:-translate-y-0.5">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[idx]} mb-4 shadow-inner`}>
        <stat.icon className="h-6 w-6" />
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{count}+</p>
      <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
    </div>
  )
}

/* ============================================================ */

export default function LandingPage1() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">产教融合平台</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/partners" className="hover:text-orange-600 transition-colors">合作主体</Link>
            <Link href="/projects" className="hover:text-orange-600 transition-colors">项目</Link>
            <Link href="/experts" className="hover:text-orange-600 transition-colors">专家</Link>
            <Link href="/brands" className="hover:text-orange-600 transition-colors">品牌</Link>
            <Link href="/jobs" className="hover:text-orange-600 transition-colors">就业</Link>
          </div>
          <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6">
            <Link href="/contact">联系我们</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-white">
        {/* Gradient mesh background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(251,146,60,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 70%, rgba(99,102,241,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 50% 50%, rgba(20,184,166,0.05) 0%, transparent 60%)
            `,
          }}
        />
        {/* Floating blurred blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-300/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 px-4 py-1.5 text-sm font-semibold bg-orange-50 text-orange-700 border-orange-200/60 hover:bg-orange-50 tracking-wide">
                产业联盟与人资品牌服务平台
              </Badge>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                搭建产教融合桥梁
                <span className="block bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent mt-2">
                  共育产业英才
                </span>
              </h1>
              <p className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
                整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="rounded-full px-8 py-6 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200/50 transition-all hover:scale-[1.02]">
                  <Link href="/partners">探索合作主体 <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base font-bold border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all hover:scale-[1.02]">
                  <Link href="/projects">浏览合作项目</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="border border-gray-100/80 shadow-2xl shadow-gray-900/5 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0">
                      <img src={schoolInfo.logo || "/images/landingpage/campus.jpg"} alt={schoolInfo.name} className="w-20 h-20 rounded-2xl object-cover ring-1 ring-gray-100 shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900">{schoolInfo.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{schoolInfo.type} · {schoolInfo.province}{schoolInfo.city}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 py-5 border-y border-gray-100/80">
                    <div className="text-center"><p className="text-2xl font-bold text-orange-500">{schoolInfo.studentCount?.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">在校生</p></div>
                    <div className="text-center"><p className="text-2xl font-bold text-blue-500">{schoolInfo.teacherCount}</p><p className="text-xs text-gray-500 mt-1">教师</p></div>
                    <div className="text-center"><p className="text-2xl font-bold text-emerald-500">{schoolInfo.majorCount}</p><p className="text-xs text-gray-500 mt-1">专业</p></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-5 leading-relaxed line-clamp-3">{schoolInfo.introduction}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, idx) => (
              <StatCard key={stat.label} stat={stat} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 产教融合 */}
      <section className="py-24 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 tracking-widest uppercase mb-3">Collaboration</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">产教融合</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">多元主体协同，项目全程管理，数据驱动决策</p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />合作主体</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {featuredPartners.map((partner, i) => (
              <Link key={partner.id} href={`/partners/${partner.id}`}>
                <Card className="group border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${["from-orange-400 to-orange-600","from-blue-400 to-blue-600","from-emerald-400 to-emerald-600","from-violet-400 to-violet-600"][i%4]} shadow-sm`}>{partner.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{partner.name}</h4>
                        <p className="text-xs text-gray-400">{partner.industry}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">{partner.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.cooperationTypes?.slice(0, 2).map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100">{t}</span>)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />合作项目</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredProjects.map((project, i) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white h-full overflow-hidden">
                  <div className="h-44 overflow-hidden relative">
                    <img src={getImage(i)} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-t-[1.75rem] grayscale-[15%] group-hover:grayscale-0" style={{ objectPosition: "center 30%" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                  </div>
                  <CardContent className="p-5">
                    <Badge className="bg-orange-50 text-orange-700 border-orange-100/60 mb-2 font-medium">{PROJECT_PHASE_LABELS[project.phase]}</Badge>
                    <h4 className="font-bold text-gray-900 mb-1 leading-snug">{project.name}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />专家资源库</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {featuredExperts.map((expert, i) => (
              <Link key={expert.id} href="/experts">
                <Card className="group border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white text-center">
                  <CardContent className="p-5">
                    <div className="relative inline-block mb-3">
                      <Avatar className="h-16 w-16 mx-auto ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all duration-300">
                        <AvatarImage src={getAvatar(i)} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 font-bold">{expert.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{expert.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{expert.title}</p>
                    {expert.rating && <Badge variant="outline" className="mt-2 text-[10px] border-amber-200 text-amber-700 bg-amber-50/60">{EXPERT_RATING_LABELS[expert.rating]}</Badge>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 品牌展示 */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 tracking-widest uppercase mb-3">Brand Showcase</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">品牌展示</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">人才培养、校企合作、专业建设等各领域品牌成果</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {[
              { title: "人才品牌", icon: Users, href: "/brands/talent", color: "text-orange-600", bg: "from-orange-100 to-amber-50" },
              { title: "雇主品牌", icon: Building2, href: "/brands/partner", color: "text-blue-600", bg: "from-blue-100 to-indigo-50" },
              { title: "岗位品牌", icon: Briefcase, href: "/brands/job", color: "text-emerald-600", bg: "from-emerald-100 to-teal-50" },
              { title: "专业品牌", icon: GraduationCap, href: "/brands/major", color: "text-violet-600", bg: "from-violet-100 to-purple-50" },
              { title: "师资品牌", icon: UserCircle, href: "/brands/teacher", color: "text-rose-600", bg: "from-rose-100 to-pink-50" },
              { title: "文化思政", icon: Heart, href: "/brands/culture", color: "text-pink-600", bg: "from-pink-100 to-rose-50" },
            ].map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.title} href={cat.href}>
                  <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.02] transition-all duration-300 rounded-[1.5rem] bg-white text-center cursor-pointer group">
                    <CardContent className="p-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.bg} flex items-center justify-center mx-auto mb-3 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${cat.color}`} />
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">{cat.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />精选人才</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {featuredTalent.map((profile, i) => (
              <Card key={profile.id} className="border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all duration-300">
                      <AvatarImage src={getAvatar(i + 4)} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 font-bold">{profile.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{profile.studentName}</p>
                      <p className="text-xs text-gray-500">{maskStudentId(profile.studentId)}</p>
                      <p className="text-xs text-gray-400">{profile.major}</p>
                    </div>
                    <div className="text-right"><p className="text-xl font-extrabold text-orange-500">{profile.abilityScore}</p><p className="text-[10px] text-gray-400">能力分</p></div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {profile.abilityTags.slice(0, 3).map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100">{tag}</span>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />岗位品牌</h3>
              <div className="space-y-4">
                {featuredJobs.map((job, i) => (
                  <Link key={job.id} href="/brands/job">
                    <Card className="border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white overflow-hidden">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img src={getImage(i + 6)} alt={job.name} className="w-full h-full object-cover rounded-xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" style={{ objectPosition: "center 20%" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm">{job.name}</h4>
                          <p className="text-xs text-gray-400 line-clamp-1 mb-1">{job.industry} · {job.description}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-emerald-600">{job.averageSalary || "面议"}</span>
                            <span className="text-gray-400">需求 {job.demandCount} 人</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />特色专业</h3>
              <div className="space-y-4">
                {featuredMajors.map((major, i) => (
                  <Card key={major.id} className="border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white relative h-48 overflow-hidden group">
                    <img src={getImage(i + 3)} alt={major.name} className="absolute inset-0 w-full h-full object-cover rounded-[1.75rem]" style={{ objectPosition: "center 25%" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-[1.75rem]" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <Badge className="bg-white/95 text-gray-900 mb-2 backdrop-blur-sm shadow-sm">推荐品牌</Badge>
                      <h4 className="font-bold text-white text-lg">{major.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-white/90 mt-1">
                        <span>{major.studentCount} 在校生</span>
                        <span>就业率 {major.employmentRate}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3"><div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-600" />师资品牌</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-16">
            {featuredTeachers.map((teacher, i) => (
              <Link key={teacher.id} href="/brands/teacher">
                <Card className="border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white text-center">
                  <CardContent className="p-5">
                    <Avatar className="h-16 w-16 mx-auto mb-3 ring-4 ring-gray-50 group-hover:ring-rose-100 transition-all duration-300">
                      <AvatarImage src={getAvatar(i + 10)} />
                      <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-50 text-rose-700 font-bold">{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-gray-900 text-sm">{teacher.name}</h4>
                    <p className="text-xs text-gray-500">{teacher.title}</p>
                    <div className="flex flex-wrap justify-center gap-1 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">{TEACHER_TYPE_LABELS[teacher.type]}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 就业项目 */}
      <section className="py-24 bg-stone-50/60 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 tracking-widest uppercase mb-3">Employment</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">就业项目</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">校企合作就业项目，汇聚优质岗位资源</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "就业项目", value: employmentProjects.length, icon: Briefcase, color: "text-blue-600", bg: "from-blue-100 to-indigo-50" },
              { label: "进行中", value: employmentProjects.filter(p => p.status === "ongoing").length, icon: CheckCircle2, color: "text-emerald-600", bg: "from-emerald-100 to-teal-50" },
              { label: "在招岗位", value: employmentProjects.reduce((s, p) => s + p.jobCount, 0), icon: Target, color: "text-violet-600", bg: "from-violet-100 to-purple-50" },
              { label: "合作企业", value: new Set(employmentProjects.flatMap(p => p.partnerIds)).size, icon: Building2, color: "text-amber-600", bg: "from-amber-100 to-yellow-50" },
            ].map(s => (
              <Card key={s.label} className="border border-gray-100 shadow-sm rounded-[1.5rem] bg-white text-center hover:shadow-md hover:border-gray-200 transition-all">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${s.bg} mb-3 shadow-inner`}>
                    <s.icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEmployment.map((project, i) => {
              const pn = project.partnerIds.map(id => enterprises.find(e => e.id === id)?.name).filter(Boolean).slice(0, 2)
              return (
                <Link key={project.id} href={`/jobs/project/${project.id}`}>
                  <Card className="border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200/60 hover:scale-[1.01] transition-all duration-300 rounded-[1.75rem] bg-white h-full overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                      <img src={getImage(i + 8)} alt={project.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ objectPosition: "center 30%" }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex gap-2 mb-3">
                        <Badge className={`text-xs border-0 font-medium ${project.status === "preparing" ? "bg-amber-100 text-amber-700" : project.status === "ongoing" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                          {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 leading-snug">{project.name}</h4>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">{project.description || `面向${project.targetStudentGroups.join("、")}学生，提供丰富的就业岗位。`}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.startDate.toLocaleDateString("zh-CN")}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{project.jobCount} 岗位</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">{pn.join("、")}{project.partnerIds.length > 2 && ` 等${project.partnerIds.length}家`}</div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">加入产教融合生态圈</h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rounded-full px-10 py-6 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-900/20 transition-all hover:scale-[1.02]">
              <Link href="/contact">联系我们</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-10 py-6 text-base font-bold border-2 border-slate-600 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-500 transition-all hover:scale-[1.02]">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20"><Sparkles className="h-4 w-4 text-white" /></div>
                <span className="font-bold text-slate-200 text-lg">产教融合平台</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">整合多元主体资源，构建产教深度融合的协同育人新生态。</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 mb-4 text-sm">平台服务</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/partners" className="hover:text-orange-400 transition-colors">合作主体</Link></li>
                <li><Link href="/projects" className="hover:text-orange-400 transition-colors">合作项目</Link></li>
                <li><Link href="/experts" className="hover:text-orange-400 transition-colors">专家资源</Link></li>
                <li><Link href="/brands" className="hover:text-orange-400 transition-colors">品牌展示</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 mb-4 text-sm">就业服务</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/jobs" className="hover:text-orange-400 transition-colors">就业项目</Link></li>
                <li><Link href="/brands/job" className="hover:text-orange-400 transition-colors">岗位品牌</Link></li>
                <li><Link href="/brands/talent" className="hover:text-orange-400 transition-colors">人才品牌</Link></li>
                <li><Link href="/brands/major" className="hover:text-orange-400 transition-colors">专业品牌</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 mb-4 text-sm">关于我们</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="hover:text-orange-400 transition-colors">平台介绍</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">联系我们</Link></li>
                <li><Link href="/admin" className="hover:text-orange-400 transition-colors">管理后台</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© {new Date().getFullYear()} 产教融合平台. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">隐私政策</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
