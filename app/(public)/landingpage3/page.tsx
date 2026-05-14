"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Building2, FolderKanban, Users, Trophy, Briefcase, Star,
  ArrowRight, GraduationCap, UserCircle, Heart, MapPin,
  Calendar, Target, Sparkles, CheckCircle2,
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
  SECONDARY_COLLEGES,
} from "@/lib/types"

function maskStudentId(id: string) {
  if (id.length <= 4) return id
  return id.slice(0, 2) + "****" + id.slice(-2)
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

/* ============================================================ */

function CollegeSelect() {
  const [selectedCollege, setSelectedCollege] = useState("all")
  useEffect(() => {
    const readCollege = () => {
      const params = new URLSearchParams(window.location.search)
      setSelectedCollege(params.get("college") || "all")
    }
    readCollege()
    window.addEventListener("popstate", readCollege)
    return () => window.removeEventListener("popstate", readCollege)
  }, [])
  const handleChange = (value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value === "all") params.delete("college")
    else params.set("college", value)
    window.history.pushState(null, "", `${window.location.pathname}${params.toString() ? `?${params}` : ""}`)
    window.dispatchEvent(new Event("popstate"))
  }
  return (
    <select
      value={selectedCollege}
      onChange={(e) => handleChange(e.target.value)}
      className="h-8 rounded-md border bg-background px-2 pr-6 text-sm text-muted-foreground outline-none hover:border-foreground/30 focus:border-foreground focus:ring-1 focus:ring-foreground transition-colors cursor-pointer"
    >
      <option value="all">全校</option>
      {SECONDARY_COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}

export default function LandingPage3() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">产教融合平台</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            {["合作主体","项目","专家","品牌","就业"].map((item) => (
              <Link key={item} href={`/${item === "合作主体" ? "partners" : item === "项目" ? "projects" : item === "专家" ? "experts" : item === "品牌" ? "brands" : "jobs"}`} 
                className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-all duration-200">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <CollegeSelect />
            <Link href="/partner/login" className="flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
              <Building2 className="h-4 w-4" />
              企业登录
            </Link>
            <Button asChild size="sm" className="rounded-md font-medium">
              <Link href="/contact">联系我们</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-muted/60 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-8 px-4 py-1.5 text-sm font-medium rounded-full border shadow-sm">
              产业联盟与人资品牌服务平台
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.08]">
              搭建产教融合桥梁
              <br />
              共育产业英才
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态。
            </p>
            <div className="flex gap-3">
              <Button asChild className="rounded-md px-8 py-6 text-base font-semibold shadow-sm hover:shadow-md transition-shadow">
                <Link href="/partners">探索合作主体</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-md px-8 py-6 text-base font-semibold hover:bg-muted/60 transition-colors">
                <Link href="/projects">浏览合作项目</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background border mb-3 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-all duration-300">
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}+</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 产教融合 */}
      <section className="py-28 bg-slate-50/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">产教融合</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground text-lg">
              多元主体协同，项目全程管理，数据驱动决策
            </p>
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">合作主体</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-24">
            {featuredPartners.map((partner, i) => (
              <Link key={partner.id} href={`/partners/${partner.id}`}>
                <div className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer h-full">
                  <div className="flex h-full flex-col justify-between rounded-md p-5">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center text-white font-bold text-sm ${["bg-black","bg-neutral-700","bg-neutral-600","bg-neutral-800"][i%4]}`}>{partner.name[0]}</div>
                    <div className="space-y-2 mt-4">
                      <h3 className="font-bold leading-tight">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{partner.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {partner.cooperationTypes?.slice(0, 2).map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">合作项目</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mb-24">
            {featuredProjects.map((project, i) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer h-full">
                  <div className="flex flex-col justify-between rounded-md">
                    <div className="h-36 rounded-md overflow-hidden mb-3">
                      <img src={getImage(i)} alt={project.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                    </div>
                    <div className="px-3 pb-3 space-y-2">
                      <Badge variant="secondary" className="text-xs font-medium">{PROJECT_PHASE_LABELS[project.phase]}</Badge>
                      <h3 className="font-bold leading-tight">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">合作成果</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mb-24">
            {featuredAchievements.map((ach, i) => (
              <div key={ach.id} className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                <div className="flex flex-col justify-between rounded-md">
                  <div className="h-36 rounded-md overflow-hidden mb-3">
                    <img src={getImage(i + 3)} alt={ach.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <div className="px-3 pb-3 space-y-2">
                    <Badge variant="outline" className="text-xs font-medium">{ACHIEVEMENT_TYPE_LABELS[ach.type]}</Badge>
                    <h3 className="font-bold leading-tight">{ach.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{ach.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">专家资源库</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
            {featuredExperts.map((expert, i) => (
              <Link key={expert.id} href="/experts">
                <div className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer text-center">
                  <div className="flex h-full flex-col justify-center items-center rounded-md p-5 space-y-3">
                    <Avatar className="h-16 w-16 ring-2 ring-transparent group-hover:ring-muted transition-all duration-300">
                      <AvatarImage src={getAvatar(i)} />
                      <AvatarFallback className="bg-muted font-bold text-lg">{expert.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{expert.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{expert.title}</p>
                    </div>
                    {expert.rating && <Badge variant="outline" className="text-[10px]">{EXPERT_RATING_LABELS[expert.rating]}</Badge>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 品牌展示 */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">品牌展示</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground text-lg">
              人才培养、校企合作、专业建设等各领域品牌成果
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-3 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-6 mb-24">
            {[
              { title: "人才品牌", icon: Users, desc: "优秀学生" },
              { title: "雇主品牌", icon: Building2, desc: "知名企业" },
              { title: "岗位品牌", icon: Briefcase, desc: "优质岗位" },
              { title: "专业品牌", icon: GraduationCap, desc: "特色专业" },
              { title: "师资品牌", icon: UserCircle, desc: "名师团队" },
              { title: "文化思政", icon: Heart, desc: "文化建设" },
            ].map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.title} href={`/brands/${cat.title === "人才品牌" ? "talent" : cat.title === "雇主品牌" ? "partner" : cat.title === "岗位品牌" ? "job" : cat.title === "专业品牌" ? "major" : cat.title === "师资品牌" ? "teacher" : "culture"}`}>
                  <div className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer">
                    <div className="flex h-[140px] flex-col justify-center items-center rounded-md p-5 space-y-2.5">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-sm">{cat.title}</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">精选人才</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-24">
            {featuredTalent.map((profile, i) => (
              <div key={profile.id} className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                <div className="flex h-full flex-col justify-between rounded-md p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-muted transition-all duration-300">
                      <AvatarImage src={getAvatar(i + 4)} />
                      <AvatarFallback className="bg-muted font-bold">{profile.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm">{profile.studentName}</h3>
                      <p className="text-xs text-muted-foreground">{maskStudentId(profile.studentId)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{profile.major}</span>
                      <span className="text-xl font-bold">{profile.abilityScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.abilityTags.slice(0, 3).map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mb-24">
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">岗位品牌</h3>
              <div className="space-y-3">
                {featuredJobs.map((job, i) => (
                  <Link key={job.id} href="/brands/job">
                    <div className="group flex items-center gap-4 rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer">
                      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <img src={getImage(i + 6)} alt={job.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-bold text-sm">{job.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{job.industry}</p>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="font-semibold">{job.averageSalary || "面议"}</span>
                          <span className="text-muted-foreground">需求 {job.demandCount} 人</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">特色专业</h3>
              <div className="space-y-4">
                {featuredMajors.map((major, i) => (
                  <div key={major.id} className="group relative overflow-hidden rounded-lg border bg-background hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                    <div className="h-40 rounded-t-md overflow-hidden">
                      <img src={getImage(i + 3)} alt={major.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold">{major.name}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{major.department}</p>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span className="text-muted-foreground">{major.studentCount} 在校生</span>
                        <span className="text-muted-foreground">就业率 {major.employmentRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">师资品牌</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-24">
            {featuredTeachers.map((teacher, i) => (
              <Link key={teacher.id} href="/brands/teacher">
                <div className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer text-center">
                  <div className="flex h-full flex-col justify-center items-center rounded-md p-5 space-y-3">
                    <Avatar className="h-16 w-16 ring-2 ring-transparent group-hover:ring-muted transition-all duration-300">
                      <AvatarImage src={getAvatar(i + 10)} />
                      <AvatarFallback className="bg-muted font-bold text-lg">{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm">{teacher.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{teacher.title}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{TEACHER_TYPE_LABELS[teacher.type]}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h3 className="text-xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase text-xs tracking-widest">文化思政品牌</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {featuredCulture.map((cb, i) => (
              <div key={cb.id} className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                <div className="flex flex-col justify-between rounded-md">
                  <div className="h-36 rounded-md overflow-hidden mb-3">
                    <img src={getImage(i + 7)} alt={cb.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <div className="px-3 pb-3 space-y-2">
                    <Badge variant="outline" className="text-xs font-medium">{CULTURE_TYPE_LABELS[cb.type]}</Badge>
                    <h3 className="font-bold leading-tight">{cb.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{cb.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 就业项目 */}
      <section className="py-28 bg-slate-50/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">就业项目</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground text-lg">
              校企合作就业项目，汇聚优质岗位资源
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-12">
            {[
              { label: "就业项目", value: employmentProjects.length, icon: Briefcase },
              { label: "进行中", value: employmentProjects.filter(p => p.status === "ongoing").length, icon: CheckCircle2 },
              { label: "在招岗位", value: employmentProjects.reduce((s, p) => s + p.jobCount, 0), icon: Target },
              { label: "合作企业", value: new Set(employmentProjects.flatMap(p => p.partnerIds)).size, icon: Building2 },
            ].map(s => (
              <div key={s.label} className="relative overflow-hidden rounded-lg border bg-background p-1.5 text-center hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                <div className="flex h-[160px] flex-col justify-center items-center rounded-md p-6 space-y-2">
                  <s.icon className="h-7 w-7 text-muted-foreground" />
                  <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {featuredEmployment.map((project, i) => {
              const pn = project.partnerIds.map(id => enterprises.find(e => e.id === id)?.name).filter(Boolean).slice(0, 2)
              return (
                <Link key={project.id} href={`/jobs/project/${project.id}`}>
                  <div className="group relative overflow-hidden rounded-lg border bg-background p-1.5 hover:border-foreground/20 hover:shadow-sm transition-all duration-300 cursor-pointer h-full">
                    <div className="flex flex-col justify-between rounded-md h-full">
                      <div className="h-40 rounded-md overflow-hidden mb-3">
                        <img src={getImage(i + 8)} alt={project.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className="px-3 pb-3 space-y-2">
                        <Badge variant="secondary" className="text-xs font-medium">{EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}</Badge>
                        <h3 className="font-bold leading-tight">{project.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description || `面向${project.targetStudentGroups.join("、")}学生，提供丰富的就业岗位。`}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                          <span>{project.startDate.toLocaleDateString("zh-CN")}</span>
                          <span>{project.jobCount} 岗位</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{pn.join("、")}{project.partnerIds.length > 2 && ` 等${project.partnerIds.length}家`}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-y">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">加入产教融合生态圈</h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild className="rounded-md px-8 py-6 text-base font-semibold shadow-sm hover:shadow-md transition-shadow">
              <Link href="/contact">联系我们</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-md px-8 py-6 text-base font-semibold hover:bg-muted/60 transition-colors">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">产教融合平台</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">整合多元主体资源，构建产教深度融合的协同育人新生态。</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">平台服务</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/partners" className="hover:text-foreground transition-colors">合作主体</Link></li>
                <li><Link href="/projects" className="hover:text-foreground transition-colors">合作项目</Link></li>
                <li><Link href="/experts" className="hover:text-foreground transition-colors">专家资源</Link></li>
                <li><Link href="/brands" className="hover:text-foreground transition-colors">品牌展示</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">就业服务</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-foreground transition-colors">就业项目</Link></li>
                <li><Link href="/brands/job" className="hover:text-foreground transition-colors">岗位品牌</Link></li>
                <li><Link href="/brands/talent" className="hover:text-foreground transition-colors">人才品牌</Link></li>
                <li><Link href="/brands/major" className="hover:text-foreground transition-colors">专业品牌</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">关于我们</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">平台介绍</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">联系我们</Link></li>
                <li><Link href="/admin" className="hover:text-foreground transition-colors">管理后台</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 产教融合平台. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">隐私政策</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
