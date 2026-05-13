"use client"

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

export default function LandingPage3() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold text-lg tracking-tight">产教融合平台</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/partners" className="hover:text-foreground transition-colors">合作主体</Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">项目</Link>
            <Link href="/experts" className="hover:text-foreground transition-colors">专家</Link>
            <Link href="/brands" className="hover:text-foreground transition-colors">品牌</Link>
            <Link href="/jobs" className="hover:text-foreground transition-colors">就业</Link>
          </div>
          <Button asChild size="sm" className="rounded-md">
            <Link href="/contact">联系我们</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-8 px-4 py-1.5 text-sm font-medium rounded-full">
              产业联盟与人资品牌服务平台
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              搭建产教融合桥梁
              <br />
              共育产业英才
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态。
            </p>
            <div className="flex gap-4">
              <Button asChild className="rounded-md px-8 py-6 text-base font-semibold">
                <Link href="/partners">探索合作主体</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-md px-8 py-6 text-base font-semibold">
                <Link href="/projects">浏览合作项目</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight">{stat.value}+</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 产教融合 */}
      <section className="py-24 bg-slate-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">产教融合</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground text-lg">
              多元主体协同，项目全程管理，数据驱动决策
            </p>
          </div>

          <h3 className="text-2xl font-bold tracking-tight mb-8">合作主体</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-20">
            {featuredPartners.map((partner, i) => (
              <div key={partner.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-bold ${["bg-black","bg-slate-700","bg-slate-600","bg-slate-800"][i%4]}`}>{partner.name[0]}</div>
                  <div className="space-y-2">
                    <h3 className="font-bold">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{partner.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.cooperationTypes?.slice(0, 2).map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold tracking-tight mb-8">合作项目</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mb-20">
            {featuredProjects.map((project) => (
              <div key={project.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex flex-col justify-between rounded-md">
                  <div className="h-32 rounded-md overflow-hidden mb-4">
                    <img src={getImage(0)} alt={project.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <Badge variant="secondary" className="text-xs">{PROJECT_PHASE_LABELS[project.phase]}</Badge>
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold tracking-tight mb-8">合作成果</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mb-20">
            {featuredAchievements.map((ach) => (
              <div key={ach.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex flex-col justify-between rounded-md">
                  <div className="h-32 rounded-md overflow-hidden mb-4">
                    <img src={getImage(1)} alt={ach.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <Badge variant="outline" className="text-xs">{ACHIEVEMENT_TYPE_LABELS[ach.type]}</Badge>
                    <h3 className="font-bold">{ach.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ach.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold tracking-tight mb-8">专家资源库</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
            {featuredExperts.map((expert, i) => (
              <div key={expert.id} className="relative overflow-hidden rounded-lg border bg-background p-2 text-center">
                <div className="flex h-[200px] flex-col justify-center items-center rounded-md p-6 space-y-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={getAvatar(i)} />
                    <AvatarFallback className="bg-muted font-bold">{expert.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{expert.name}</h3>
                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                  </div>
                  {expert.rating && <Badge variant="outline" className="text-[10px]">{EXPERT_RATING_LABELS[expert.rating]}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 品牌展示 */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">品牌展示</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground text-lg">
              人才培养、校企合作、专业建设等各领域品牌成果
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-6 mb-20">
            {[
              { title: "人才品牌", icon: Users },
              { title: "雇主品牌", icon: Building2 },
              { title: "岗位品牌", icon: Briefcase },
              { title: "专业品牌", icon: GraduationCap },
              { title: "师资品牌", icon: UserCircle },
              { title: "文化思政", icon: Heart },
            ].map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.title} className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-[140px] flex-col justify-center items-center rounded-md p-6 space-y-3">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-bold text-sm">{cat.title}</h3>
                  </div>
                </div>
              )
            })}
          </div>

          <h3 className="text-2xl font-bold tracking-tight mb-8">精选人才</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-20">
            {featuredTalent.map((profile, i) => (
              <div key={profile.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getAvatar(i + 4)} />
                      <AvatarFallback className="bg-muted font-bold">{profile.studentName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm">{profile.studentName}</h3>
                      <p className="text-xs text-muted-foreground">{maskStudentId(profile.studentId)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
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

          <div className="grid lg:grid-cols-2 gap-10 mb-20">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-8">岗位品牌</h3>
              <div className="space-y-4">
                {featuredJobs.map((job, i) => (
                  <div key={job.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                    <div className="flex items-center gap-4 rounded-md p-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <img src={getImage(i + 6)} alt={job.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{job.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{job.industry}</p>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="font-semibold">{job.averageSalary || "面议"}</span>
                          <span className="text-muted-foreground">需求 {job.demandCount} 人</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-8">特色专业</h3>
              <div className="space-y-4">
                {featuredMajors.map((major, i) => (
                  <div key={major.id} className="relative overflow-hidden rounded-lg border bg-background">
                    <div className="h-40 rounded-md overflow-hidden">
                      <img src={getImage(i + 3)} alt={major.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold">{major.name}</h4>
                      <p className="text-sm text-muted-foreground">{major.department}</p>
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

          <h3 className="text-2xl font-bold tracking-tight mb-8">师资品牌</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mb-20">
            {featuredTeachers.map((teacher, i) => (
              <div key={teacher.id} className="relative overflow-hidden rounded-lg border bg-background p-2 text-center">
                <div className="flex h-[200px] flex-col justify-center items-center rounded-md p-6 space-y-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={getAvatar(i + 10)} />
                    <AvatarFallback className="bg-muted font-bold">{teacher.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{teacher.name}</h3>
                    <p className="text-xs text-muted-foreground">{teacher.title}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{TEACHER_TYPE_LABELS[teacher.type]}</Badge>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold tracking-tight mb-8">文化思政品牌</h3>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {featuredCulture.map((cb) => (
              <div key={cb.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex flex-col justify-between rounded-md">
                  <div className="h-32 rounded-md overflow-hidden mb-4">
                    <img src={getImage(7)} alt={cb.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    <Badge variant="outline" className="text-xs">{CULTURE_TYPE_LABELS[cb.type]}</Badge>
                    <h3 className="font-bold">{cb.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{cb.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 就业项目 */}
      <section className="py-24 bg-slate-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
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
              <div key={s.label} className="relative overflow-hidden rounded-lg border bg-background p-2 text-center">
                <div className="flex h-[160px] flex-col justify-center items-center rounded-md p-6 space-y-2">
                  <s.icon className="h-8 w-8 text-muted-foreground" />
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
                <div key={project.id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex flex-col justify-between rounded-md">
                    <div className="h-40 rounded-md overflow-hidden mb-4">
                      <img src={getImage(i + 8)} alt={project.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="px-4 pb-4 space-y-2">
                      <Badge variant="secondary" className="text-xs">{EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}</Badge>
                      <h3 className="font-bold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description || `面向${project.targetStudentGroups.join("、")}学生，提供丰富的就业岗位。`}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                        <span>{project.startDate.toLocaleDateString("zh-CN")}</span>
                        <span>{project.jobCount} 岗位</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{pn.join("、")}{project.partnerIds.length > 2 && ` 等${project.partnerIds.length}家`}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">加入产教融合生态圈</h2>
          <p className="text-lg text-muted-foreground mb-10">
            无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="rounded-md px-8 py-6 text-base font-semibold">
              <Link href="/contact">联系我们</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-md px-8 py-6 text-base font-semibold">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-bold">产教融合平台</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 产教融合平台. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
