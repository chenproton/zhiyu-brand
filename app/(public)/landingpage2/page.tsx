"use client"

import React from "react"
import Link from "next/link"
import {
  Building2, FolderKanban, Users, Trophy, Briefcase, Star,
  ArrowRight, GraduationCap, UserCircle, Heart, MapPin,
  Calendar, TrendingUp, Target, Sparkles, CheckCircle2,
  BookOpen, ArrowUpRight, Zap, Lightbulb, School, Menu, X,
  ChevronRight, Globe, Phone, Mail, Github, Linkedin,
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

/* ============================================================
   HELPERS
   ============================================================ */

function maskStudentId(id: string) {
  if (id.length <= 4) return id
  return id.slice(0, 2) + "****" + id.slice(-2)
}

const IMAGES = {
  building: "/images/landingpage/building.jpg",
  office: "/images/landingpage/office.jpg",
  team: "/images/landingpage/team.jpg",
  campus: "/images/landingpage/campus.jpg",
  factory: "/images/landingpage/factory.jpg",
  tech: "/images/landingpage/tech.jpg",
  students: "/images/landingpage/students.jpg",
  meeting: "/images/landingpage/meeting.jpg",
  lab: "/images/landingpage/lab.jpg",
  workspace: "/images/landingpage/workspace.jpg",
  handshake: "/images/landingpage/handshake.jpg",
  workshop: "/images/landingpage/workshop.jpg",
  coding: "/images/landingpage/coding.jpg",
  startup: "/images/landingpage/startup.jpg",
  agreement: "/images/landingpage/agreement.jpg",
  diversity: "/images/landingpage/diversity.jpg",
  collaborate: "/images/landingpage/collaborate.jpg",
  planning: "/images/landingpage/planning.jpg",
  working: "/images/landingpage/working.jpg",
  group: "/images/landingpage/group.jpg",
}

const allImages = Object.values(IMAGES)
function getImage(index: number) {
  return allImages[index % allImages.length]
}

const AVATARS = Array.from({ length: 16 }, (_, i) => `/images/avatars/p${i + 1}.jpg`)
function getAvatar(index: number) {
  return AVATARS[index % AVATARS.length]
}

const stats = [
  { label: "合作主体", value: partners.filter(p => p.status === "active").length, icon: Building2 },
  { label: "合作项目", value: projects.filter(p => p.publishStatus === "published").length, icon: FolderKanban },
  { label: "专家资源", value: experts.length, icon: Users },
  { label: "成果产出", value: achievements.length, icon: Trophy },
  { label: "就业项目", value: employmentProjects.length, icon: Briefcase },
  { label: "品牌内容", value: talentProfiles.length + jobBrands.length + majorBrands.length + teacherBrands.length + cultureBrands.length, icon: Star },
]

const brandCategories = [
  { id: "talent", title: "人才品牌", icon: Users, href: "/brands/talent", color: "bg-rose-50 text-rose-700 border-rose-100" },
  { id: "partner", title: "雇主品牌", icon: Building2, href: "/brands/partner", color: "bg-sky-50 text-sky-700 border-sky-100" },
  { id: "job", title: "岗位品牌", icon: Briefcase, href: "/brands/job", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { id: "major", title: "专业品牌", icon: GraduationCap, href: "/brands/major", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "teacher", title: "师资品牌", icon: UserCircle, href: "/brands/teacher", color: "bg-violet-50 text-violet-700 border-violet-100" },
  { id: "culture", title: "文化思政", icon: Heart, href: "/brands/culture", color: "bg-pink-50 text-pink-700 border-pink-100" },
]

const featuredPartners = partners.filter(p => p.status === "active").slice(0, 6)
const featuredProjects = projects.filter(p => p.publishStatus === "published").slice(0, 4)
const featuredAchievements = achievements.filter(a => a.status === "published").slice(0, 4)
const featuredExperts = experts.filter(e => e.status === "active").slice(0, 6)
const featuredTalent = talentProfiles.sort((a, b) => b.abilityScore - a.abilityScore).slice(0, 4)
const featuredJobs = jobBrands.filter(j => j.status === "published").slice(0, 4)
const featuredMajors = majorBrands.filter(m => m.status === "published").slice(0, 4)
const featuredTeachers = teacherBrands.filter(t => t.status === "published").slice(0, 4)
const featuredCulture = cultureBrands.filter(c => c.status === "published").slice(0, 4)
const featuredEmployment = employmentProjects.slice(0, 6)

/* ============================================================
   SECTIONS
   ============================================================ */

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-black">{schoolInfo.shortName}</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-500">
              <Link href="#cooperation" className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-gray-100/80 transition-all duration-200">产教融合</Link>
              <Link href="#brands" className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-gray-100/80 transition-all duration-200">品牌展示</Link>
              <Link href="#employment" className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-gray-100/80 transition-all duration-200">就业项目</Link>
              <Link href="/partners" className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-gray-100/80 transition-all duration-200">合作主体</Link>
              <Link href="/projects" className="px-3 py-1.5 rounded-lg hover:text-black hover:bg-gray-100/80 transition-all duration-200">合作项目</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-gray-500 hover:text-black hover:bg-gray-100/80 transition-all duration-200 rounded-lg">
              登录
            </Button>
            <Button size="sm" className="rounded-full bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 px-5">
              立即合作
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100/80 via-white/50 to-white" />
      {/* Animated gradient blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/60 to-violet-100/60 blur-[100px] animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-rose-100/50 to-amber-100/50 blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-50/40 to-emerald-50/40 blur-[120px] animate-blob animation-delay-4000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-36">
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-sm shadow-black/5 text-gray-700 text-sm font-medium mb-10 animate-fade-up hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>产教融合平台全新升级</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-br from-black via-stone-700 to-stone-500 bg-clip-text text-transparent">
              搭建产教融合桥梁
            </span>
            <br />
            <span className="bg-gradient-to-br from-black via-stone-700 to-stone-500 bg-clip-text text-transparent">
              共育产业英才
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            深度连接院校与企业资源，构建校企协同育人新生态，为学生就业与企业发展创造无限可能
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-24 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="rounded-full bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 px-8 h-12 text-base transition-all duration-300">
              立即部署 <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 px-8 h-12 text-base transition-all duration-300 bg-white/60 backdrop-blur-sm">
              <Github className="mr-2 w-4 h-4" /> GitHub
            </Button>
          </div>

          {/* Bento school info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Card className="md:col-span-2 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 group">
              <div className="relative h-64 overflow-hidden">
                <img src={IMAGES.campus} alt="campus" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{schoolInfo.name}</h3>
                  <p className="text-white/80 text-sm leading-relaxed max-w-lg">{schoolInfo.introduction}</p>
                </div>
              </div>
            </Card>
            <div className="flex flex-col gap-4">
              <Card className="flex-1 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-stone-700 flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">在校学生</span>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent">{schoolInfo.studentCount?.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">涵盖 {schoolInfo.majorCount} 个专业方向</p>
              </Card>
              <Card className="flex-1 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-6 hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-stone-700 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">师资力量</span>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent">{schoolInfo.teacherCount}</p>
                <p className="text-sm text-gray-400 mt-1">双师型教师占比超 65%</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0)
  React.useEffect(() => {
    const duration = 1500
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const timer = setTimeout(() => requestAnimationFrame(animate), 300)
    return () => clearTimeout(timer)
  }, [value])
  return <>{display.toLocaleString()}</>
}

function StatsBar() {
  return (
    <section className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="border border-gray-200/60 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/5 p-6 sm:p-8 hover:shadow-black/10 transition-shadow duration-500">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-700 mb-3 group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/20 group-hover:scale-110">
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent tracking-tight">
                  <AnimatedNumber value={s.value} />
                </p>
                <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}


function CooperationSection() {
  return (
    <section id="cooperation" className="py-28 sm:py-36 bg-gray-50/50 relative">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-xs font-medium bg-white border border-gray-200/60 text-gray-600 rounded-full shadow-sm">
            产教融合
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            <span className="bg-gradient-to-br from-black via-stone-700 to-stone-500 bg-clip-text text-transparent">
              校企协同，深度融合
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            汇聚优质企业资源，打造产学研一体化平台，实现教育链、人才链与产业链、创新链的有机衔接
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {/* Large partner card */}
          <Card className="md:col-span-2 lg:col-span-2 row-span-2 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-56 overflow-hidden">
              <img src={IMAGES.handshake} alt="partners" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl shadow-inner" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-white/90 text-black border-0 mb-2 shadow-sm">合作主体</Badge>
                <h3 className="text-xl font-bold text-white drop-shadow-sm">{featuredPartners[0]?.name}</h3>
              </div>
            </div>
            <CardContent className="p-6 relative">
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{featuredPartners[0]?.description}</p>
              <div className="flex flex-wrap gap-2">
                {featuredPartners[0]?.cooperationTypes.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100/80 text-gray-600 text-xs rounded-lg font-medium border border-gray-100">{t}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project card */}
          <Card className="md:col-span-1 lg:col-span-2 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-40 overflow-hidden">
              <img src={IMAGES.tech} alt="project" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute bottom-3 left-4">
                <Badge className="bg-white/90 text-black border-0 shadow-sm">{PROJECT_PHASE_LABELS[featuredProjects[0]?.phase]}</Badge>
              </div>
            </div>
            <CardContent className="p-5 relative">
              <h4 className="font-semibold text-black mb-1">{featuredProjects[0]?.name}</h4>
              <p className="text-gray-500 text-sm line-clamp-2">{featuredProjects[0]?.description}</p>
            </CardContent>
          </Card>

          {/* Achievement card */}
          <Card className="md:col-span-1 lg:col-span-2 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-900/10 hover:border-amber-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-40 overflow-hidden">
              <img src={IMAGES.agreement} alt="achievement" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute bottom-3 left-4">
                <Badge className="bg-white/90 text-black border-0 shadow-sm">{ACHIEVEMENT_TYPE_LABELS[featuredAchievements[0]?.type]}</Badge>
              </div>
            </div>
            <CardContent className="p-5 relative">
              <h4 className="font-semibold text-black mb-1">{featuredAchievements[0]?.name}</h4>
              <p className="text-gray-500 text-sm line-clamp-2">{featuredAchievements[0]?.description}</p>
            </CardContent>
          </Card>

          {/* Expert cards row */}
          {featuredExperts.slice(0, 3).map((expert, i) => (
            <Card key={expert.id} className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-5 hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              <div className="flex items-start gap-4 relative">
                <Avatar className="w-12 h-12 rounded-xl border border-gray-200/60 shadow-sm">
                  <AvatarImage src={expert.avatar || getAvatar(i)} className="object-cover" />
                  <AvatarFallback className="rounded-xl bg-gray-100 text-gray-700 font-bold">{expert.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-black text-sm truncate">{expert.name}</h4>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-gray-200 text-gray-500">
                      {EXPERT_RATING_LABELS[expert.rating]}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{expert.title} · {expert.partnerName}</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.specialties.slice(0, 2).map((s, j) => (
                      <span key={j} className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-md border border-gray-100">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* More partners mini cards */}
          {featuredPartners.slice(1, 4).map((partner, i) => (
            <Card key={partner.id} className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-5 hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              <div className="flex items-center gap-3 mb-3 relative">
                <Avatar className="w-10 h-10 rounded-lg border border-gray-200/60 shadow-sm">
                  <AvatarImage src={partner.logo} className="object-cover" />
                  <AvatarFallback className="rounded-lg bg-gray-100 text-gray-700 text-sm font-bold">{partner.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="font-semibold text-black text-sm truncate">{partner.name}</h4>
                  <p className="text-gray-400 text-xs">{partner.industry}</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed relative">{partner.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandShowcase() {
  return (
    <section id="brands" className="py-28 sm:py-36 bg-white relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200/60 text-gray-600 rounded-full shadow-sm">
            品牌展示
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            <span className="bg-gradient-to-br from-black via-stone-700 to-stone-500 bg-clip-text text-transparent">
              多元品牌，全面赋能
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            构建六大品牌矩阵，全方位展示学院办学实力与特色成果
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {brandCategories.map((cat) => (
            <Link key={cat.id} href={cat.href}>
              <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 active:translate-y-0 ${cat.color}`}>
                <cat.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{cat.title}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Talent */}
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-rose-900/10 hover:border-rose-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-44 overflow-hidden">
              <img src={IMAGES.students} alt="talent" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-black border-0 shadow-sm">人才品牌</Badge>
              </div>
            </div>
            <CardContent className="p-5 relative">
              <div className="space-y-3">
                {featuredTalent.slice(0, 3).map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 rounded-lg border border-gray-200/60">
                      <AvatarImage src={t.avatar || getAvatar(i)} />
                      <AvatarFallback className="rounded-lg bg-gray-100 text-xs font-bold">{t.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{t.studentName} <span className="text-gray-400 text-xs">{maskStudentId(t.studentId)}</span></p>
                      <p className="text-xs text-gray-400">{t.major} · 能力分 {t.abilityScore}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Jobs */}
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-900/10 hover:border-amber-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-44 overflow-hidden">
              <img src={IMAGES.office} alt="jobs" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-black border-0 shadow-sm">岗位品牌</Badge>
              </div>
            </div>
            <CardContent className="p-5 relative">
              <div className="space-y-3">
                {featuredJobs.slice(0, 3).map((j) => (
                  <div key={j.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-black truncate">{j.name}</p>
                      <p className="text-xs text-gray-400">{j.industry} · 需求 {j.demandCount}</p>
                    </div>
                    {j.averageSalary && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap border border-emerald-100">{j.averageSalary}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Majors */}
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-44 overflow-hidden">
              <img src={IMAGES.lab} alt="majors" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-black border-0 shadow-sm">专业品牌</Badge>
              </div>
            </div>
            <CardContent className="p-5 relative">
              <div className="space-y-3">
                {featuredMajors.slice(0, 3).map((m) => (
                  <div key={m.id}>
                    <p className="text-sm font-medium text-black">{m.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">就业率 {m.employmentRate}%</span>
                      <span className="text-xs text-gray-400">{m.studentCount} 人</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teachers - spans 2 cols on large */}
          <Card className="lg:col-span-2 border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-violet-900/10 hover:border-violet-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative h-48 sm:h-full overflow-hidden">
                <img src={IMAGES.meeting} alt="teachers" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-l-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/40 sm:to-transparent rounded-l-2xl" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-black border-0 shadow-sm">师资品牌</Badge>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col justify-center relative">
                <div className="space-y-4">
                  {featuredTeachers.slice(0, 3).map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-lg border border-gray-200/60 shadow-sm">
                        <AvatarImage src={t.avatar || getAvatar(i + 5)} />
                        <AvatarFallback className="rounded-lg bg-gray-100 font-bold">{t.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black">{t.name} <span className="text-gray-400 text-xs font-normal">{t.title}</span></p>
                        <p className="text-xs text-gray-400">{TEACHER_TYPE_LABELS[t.type]} · {t.courses.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Culture */}
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-pink-900/10 hover:border-pink-200/60 hover:-translate-y-1 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative h-44 overflow-hidden">
              <img src={IMAGES.diversity} alt="culture" className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-black border-0 shadow-sm">文化思政</Badge>
              </div>
            </div>
            <CardContent className="p-5 relative">
              <div className="space-y-3">
                {featuredCulture.slice(0, 3).map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-black">{c.name}</p>
                      <Badge variant="outline" className="text-[10px] h-4 px-1 border-gray-200 text-gray-500">{CULTURE_TYPE_LABELS[c.type]}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{c.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function EmploymentSection() {
  const totalJobs = featuredEmployment.reduce((sum, ep) => sum + ep.jobCount, 0)
  const totalApps = featuredEmployment.reduce((sum, ep) => sum + ep.applicationCount, 0)

  return (
    <section id="employment" className="py-28 sm:py-36 bg-gray-50/50 relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-xs font-medium bg-white border border-gray-200/60 text-gray-600 rounded-full shadow-sm">
            就业项目
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            <span className="bg-gradient-to-br from-black via-stone-700 to-stone-500 bg-clip-text text-transparent">
              精准对接，高质量就业
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            搭建学生与企业之间的直通桥梁，实现人才供需精准匹配
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 group">
            <p className="text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent">
              <AnimatedNumber value={employmentProjects.length} />
            </p>
            <p className="text-sm text-gray-500 mt-1">就业项目</p>
          </Card>
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 group">
            <p className="text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent">
              <AnimatedNumber value={totalJobs} />
            </p>
            <p className="text-sm text-gray-500 mt-1">提供岗位</p>
          </Card>
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 group">
            <p className="text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent">
              <AnimatedNumber value={totalApps} />
            </p>
            <p className="text-sm text-gray-500 mt-1">投递人次</p>
          </Card>
          <Card className="border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-black/10 hover:border-gray-300/80 hover:-translate-y-1 transition-all duration-500 group">
            <p className="text-3xl font-bold bg-gradient-to-br from-black to-stone-600 bg-clip-text text-transparent">
              <AnimatedNumber value={enterprises.length} />
            </p>
            <p className="text-sm text-gray-500 mt-1">入驻企业</p>
          </Card>
        </div>

        {/* Bento grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredEmployment.map((ep, i) => (
            <Card key={ep.id} className={`border border-gray-200/60 bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-sky-900/10 hover:border-sky-200/60 hover:-translate-y-1 transition-all duration-500 group relative ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative h-40 overflow-hidden">
                <img src={getImage(i + 10)} alt={ep.name} className="w-full h-full object-cover grayscale-[25%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 rounded-t-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-2xl" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-black border-0 shadow-sm">{EMPLOYMENT_PROJECT_TYPE_LABELS[ep.type]}</Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-bold text-white text-lg drop-shadow-sm">{ep.name}</h4>
                </div>
              </div>
              <CardContent className="p-5 relative">
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{ep.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Briefcase className="w-3.5 h-3.5" /> {ep.jobCount} 岗位
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3.5 h-3.5" /> {ep.applicationCount} 投递
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                    {EMPLOYMENT_PROJECT_STATUS_LABELS[ep.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-32 sm:py-40 bg-black relative overflow-hidden">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/80 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-950/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-950/20 via-transparent to-transparent" />

      {/* Floating shapes */}
      <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-white/20 animate-float" />
      <div className="absolute top-40 left-[20%] w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-float animation-delay-1000" />
      <div className="absolute top-16 right-[15%] w-2.5 h-2.5 rounded-full bg-violet-400/20 animate-float animation-delay-2000" />
      <div className="absolute bottom-32 left-[25%] w-1 h-1 rounded-full bg-white/30 animate-float animation-delay-3000" />
      <div className="absolute bottom-24 right-[20%] w-2 h-2 rounded-full bg-sky-400/20 animate-float animation-delay-4000" />
      <div className="absolute top-1/2 right-[10%] w-1.5 h-1.5 rounded-full bg-white/10 animate-float animation-delay-1500" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #525252 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            开启产教融合新篇章
          </span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          无论您是院校管理者、企业HR还是行业专家，都可以在这里找到合作机会，共同推动教育与产业的深度融合
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 px-8 h-12 text-base font-semibold transition-all duration-300">
            立即合作 <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full border-gray-700 text-white hover:bg-gray-900/80 hover:border-gray-600 hover:-translate-y-0.5 active:translate-y-0 px-8 h-12 text-base transition-all duration-300 backdrop-blur-sm">
            了解更多
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-lg text-white">{schoolInfo.shortName}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              {schoolInfo.introduction}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">平台导航</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/partners" className="hover:text-white transition-colors">合作主体</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">合作项目</Link></li>
              <li><Link href="/experts" className="hover:text-white transition-colors">专家资源</Link></li>
              <li><Link href="/achievements" className="hover:text-white transition-colors">成果展示</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {schoolInfo.address}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {schoolInfo.contactPhone}</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {schoolInfo.contactEmail}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p> {schoolInfo.shortName} 版权所有</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-white transition-colors">服务条款</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function LandingPage2() {
  return (
    <main className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.7s ease-out forwards;
          opacity: 0;
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
      <Navbar />
      <Hero />
      <StatsBar />
      <CooperationSection />
      <BrandShowcase />
      <EmploymentSection />
      <CTASection />
      <Footer />
    </main>
  )
}
