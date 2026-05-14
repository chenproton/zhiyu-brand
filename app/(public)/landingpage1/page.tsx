"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Building2, FolderKanban, Users, Trophy, Briefcase, Star,
  ArrowRight, GraduationCap, UserCircle, Heart, MapPin,
  Calendar, TrendingUp, Target, Sparkles, CheckCircle2,
  BookOpen, ArrowUpRight, Zap, Lightbulb,
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

const brandCategories = [
  { id: "talent", title: "人才品牌", icon: Users, href: "/brands/talent", color: "text-slate-700" },
  { id: "partner", title: "雇主品牌", icon: Building2, href: "/brands/partner", color: "text-slate-700" },
  { id: "job", title: "岗位品牌", icon: Briefcase, href: "/brands/job", color: "text-slate-700" },
  { id: "major", title: "专业品牌", icon: GraduationCap, href: "/brands/major", color: "text-slate-700" },
  { id: "teacher", title: "师资品牌", icon: UserCircle, href: "/brands/teacher", color: "text-slate-700" },
  { id: "culture", title: "文化思政", icon: Heart, href: "/brands/culture", color: "text-slate-700" },
]

const stats = [
  { label: "合作主体", value: partners.filter(p => p.status === "active").length, icon: Building2 },
  { label: "合作项目", value: projects.filter(p => p.publishStatus === "published").length, icon: FolderKanban },
  { label: "专家资源", value: experts.length, icon: Users },
  { label: "成果产出", value: achievements.length, icon: Trophy },
  { label: "就业项目", value: employmentProjects.length, icon: Briefcase },
  { label: "品牌内容", value: talentProfiles.length + jobBrands.length + majorBrands.length + teacherBrands.length + cultureBrands.length, icon: Star },
]

const AVATARS = Array.from({ length: 16 }, (_, i) => `/images/avatars/p${i + 1}.jpg`)
function getAvatar(index: number) {
  return AVATARS[index % AVATARS.length]
}

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

/* ============================================================
   MODERN CARD COMPONENTS
   ============================================================ */

function PartnerCard({ partner, img }: { partner: typeof partners[0]; img: string }) {
  return (
    <Link href={`/partners/${partner.id}`}>
      <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
        <div className="relative h-48 overflow-hidden">
          <img src={img} alt={partner.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 rounded-xl border-2 border-white/80 shadow-lg">
                <AvatarImage src={img} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-white text-slate-800 font-bold text-lg">
                  {partner.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-bold text-white text-lg leading-tight drop-shadow-md">{partner.name}</h4>
                <p className="text-white/80 text-sm">{partner.industry}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{partner.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {partner.cooperationTypes?.slice(0, 2).map((type) => (
                <span key={type} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {type}
                </span>
              ))}
            </div>
            <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-500">
              {PARTNER_TYPE_LABELS[partner.type]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ProjectCard({ project, img }: { project: typeof projects[0]; img: string }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full flex flex-col">
        <div className="relative h-52 overflow-hidden">
          <img src={img} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm font-semibold border-0 shadow-sm">
              {PROJECT_PHASE_LABELS[project.phase]}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-white/90 text-xs font-medium bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              {project.type}
            </span>
          </div>
        </div>
        <CardContent className="p-6 flex-1 flex flex-col">
          <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{project.name}</h4>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">{project.description}</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{project.startDate.toLocaleDateString("zh-CN")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function AchievementCard({ ach, img }: { ach: typeof achievements[0]; img: string }) {
  return (
    <Link href="/achievements">
      <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
        <div className="relative h-44 overflow-hidden">
          <img src={img} alt={ach.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-emerald-500 text-white border-0 font-semibold shadow-lg">
              {ACHIEVEMENT_TYPE_LABELS[ach.type]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          {ach.partnerName && (
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
              <Building2 className="h-3 w-3" /> {ach.partnerName}
            </p>
          )}
          <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">{ach.name}</h4>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{ach.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function ExpertCard({ expert, avatarSrc }: { expert: typeof experts[0]; avatarSrc?: string }) {
  return (
    <Link href="/experts">
      <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white text-center">
        <div className="h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 relative">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
              <AvatarImage src={avatarSrc || expert.avatar} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700">
                {expert.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-12 pb-6 px-5">
          <h4 className="font-bold text-slate-900 truncate">{expert.name}</h4>
          <p className="text-xs text-slate-500 truncate mt-1">{expert.title}</p>
          <div className="flex justify-center gap-2 mt-3">
            {expert.rating && (
              <Badge className="text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 shadow-sm">
                {EXPERT_RATING_LABELS[expert.rating]}
              </Badge>
            )}
            {expert.partnerName && (
              <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-500">
                {expert.partnerName}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TalentCard({ profile, index, avatarSrc }: { profile: typeof talentProfiles[0]; index: number; avatarSrc?: string }) {
  const gradients = [
    "from-blue-500 via-blue-600 to-indigo-600",
    "from-violet-500 via-purple-600 to-fuchsia-600",
    "from-emerald-500 via-teal-600 to-cyan-600",
    "from-amber-500 via-orange-600 to-red-600",
  ]
  const grad = gradients[index % gradients.length]
  return (
    <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
      <div className={`h-28 bg-gradient-to-r ${grad} relative`}>
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>
        <div className="absolute -bottom-10 left-6">
          <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
            <AvatarImage src={avatarSrc || profile.avatar} />
            <AvatarFallback className="text-xl font-bold bg-white text-slate-800">
              {profile.studentName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardContent className="pt-12 pb-6 px-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-bold text-slate-900">{profile.studentName}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{maskStudentId(profile.studentId)} · {profile.major}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${grad}`}>
              {profile.abilityScore}
            </p>
            <p className="text-[10px] text-slate-400">能力分</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {profile.abilityTags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
              {tag}
            </span>
          ))}
        </div>
        {profile.remark && (
          <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic border-l-2 border-slate-200 pl-3">
            "{profile.remark}"
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function JobCard({ job, img }: { job: typeof jobBrands[0]; img: string }) {
  return (
    <Link href="/brands/job">
      <Card className="group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-3xl overflow-hidden bg-white">
        <div className="flex h-28">
          <div className="w-32 relative overflow-hidden shrink-0">
            <img src={img} alt={job.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          </div>
          <CardContent className="flex-1 p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h4 className="font-bold text-slate-900 text-sm truncate">{job.name}</h4>
              <Badge variant="outline" className="text-[10px] font-medium border-amber-200 text-amber-700 bg-amber-50 shrink-0">
                推荐
              </Badge>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mb-2">{job.industry} · {job.description}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-emerald-600">{job.averageSalary || "面议"}</span>
              <span className="text-slate-400">需求 {job.demandCount} 人</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

function MajorCard({ major, img }: { major: typeof majorBrands[0]; img: string }) {
  return (
    <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white relative h-80">
      <img src={img} alt={major.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm font-bold border-0 mb-3 shadow-lg">
          推荐品牌
        </Badge>
        <h4 className="font-bold text-white text-xl mb-1 drop-shadow-md">{major.name}</h4>
        <p className="text-white/70 text-sm mb-3">{major.department}</p>
        <div className="flex items-center gap-5 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {major.studentCount} 在校生
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> 就业率 {major.employmentRate}%
          </span>
        </div>
      </div>
    </Card>
  )
}

function TeacherCard({ teacher, avatarSrc }: { teacher: typeof teacherBrands[0]; avatarSrc?: string }) {
  return (
    <Link href="/brands/teacher">
      <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
        <div className="h-20 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 relative">
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <img
              src={avatarSrc || teacher.avatar || "/placeholder.svg"}
              alt={teacher.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
            />
          </div>
        </div>
        <CardContent className="pt-10 pb-5 px-5 text-center">
          <h4 className="font-bold text-slate-900">{teacher.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{teacher.title}</p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-100">
              {TEACHER_TYPE_LABELS[teacher.type]}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 font-medium border border-slate-100">
              {teacher.department}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CultureCard({ cb, img }: { cb: typeof cultureBrands[0]; img: string }) {
  return (
    <Link href="/brands/culture">
      <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
        <div className="relative h-44 overflow-hidden">
          <img src={img} alt={cb.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-pink-700 backdrop-blur-sm font-bold border-0 shadow-lg">
              {CULTURE_TYPE_LABELS[cb.type]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-pink-600 transition-colors">{cb.name}</h4>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{cb.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function EmploymentCard({ project, img }: { project: typeof employmentProjects[0]; img: string }) {
  const partnerNames = project.partnerIds
    .map((id) => enterprises.find((e) => e.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)
  return (
    <Link href={`/jobs/project/${project.id}`}>
      <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full">
        <div className="relative h-48 overflow-hidden">
          <img src={img} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`font-semibold border-0 shadow-lg ${
              project.status === "preparing" ? "bg-amber-500 text-white" :
              project.status === "ongoing" ? "bg-emerald-500 text-white" :
              "bg-slate-500 text-white"
            }`}>
              {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h4 className="font-bold text-white text-xl drop-shadow-md line-clamp-1">{project.name}</h4>
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
            {project.description || `面向${project.targetStudentGroups.join("、")}学生，提供丰富的就业岗位。`}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              {project.startDate.toLocaleDateString("zh-CN")}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-violet-500" />
              {project.jobCount} 岗位
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-3 border-t border-slate-100">
            <Building2 className="h-3.5 w-3.5" />
            {partnerNames.join("、")}
            {project.partnerIds.length > 2 && ` 等${project.partnerIds.length}家`}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* ============================================================
   PAGE
   ============================================================ */

function GradientButton({ children, href, variant = "primary" }: { children: React.ReactNode; href: string; variant?: "primary" | "secondary" }) {
  if (variant === "primary") {
    return (
      <Button asChild className="rounded-full px-8 py-6 text-base font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:from-blue-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-200 transition-all hover:shadow-2xl hover:-translate-y-1">
        <Link href={href}>{children}</Link>
      </Button>
    )
  }
  return (
    <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base font-bold border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}

function SectionSubHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      </div>
      {action}
    </div>
  )
}

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
      className="h-8 rounded-md border border-slate-200 bg-white/80 px-2 pr-6 text-sm text-slate-600 outline-none backdrop-blur-sm hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
    >
      <option value="all">全校</option>
      {SECONDARY_COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">产教融合平台</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="/partners" className="hover:text-blue-600 transition-colors">合作主体</Link>
              <Link href="/projects" className="hover:text-blue-600 transition-colors">项目</Link>
              <Link href="/experts" className="hover:text-blue-600 transition-colors">专家</Link>
              <Link href="/brands" className="hover:text-blue-600 transition-colors">品牌</Link>
              <Link href="/jobs" className="hover:text-blue-600 transition-colors">就业</Link>
            </div>
            <div className="flex items-center gap-3">
              <CollegeSelect />
              <Link href="/partner/login" className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-900 hover:border-slate-300">
                <Building2 className="h-4 w-4" />
                企业登录
              </Link>
              <GradientButton href="/contact">联系我们</GradientButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus} alt="campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
        </div>
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-8 px-4 py-1.5 text-sm font-semibold bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/10">
                产业联盟与人资品牌服务平台
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight">
                搭建产教融合桥梁
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-violet-300 to-indigo-300">
                  共育产业英才
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
                整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <GradientButton href="/partners">探索合作主体 <ArrowRight className="ml-2 h-4 w-4" /></GradientButton>
                <GradientButton href="/projects" variant="secondary">浏览合作项目</GradientButton>
              </div>
            </div>

            <div className="hidden lg:block">
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/10">
                <CardContent className="p-8">
                  <div className="flex items-start gap-5">
                    <img
                      src={IMAGES.campus}
                      alt={schoolInfo.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-white">{schoolInfo.name}</h3>
                      <p className="text-sm text-slate-300 mt-1">{schoolInfo.type} · {schoolInfo.province}{schoolInfo.city}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 py-6 border-y border-white/10">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-blue-300">{schoolInfo.studentCount?.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">在校生</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-violet-300">{schoolInfo.teacherCount}</p>
                      <p className="text-xs text-slate-400 mt-1">教师</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-indigo-300">{schoolInfo.majorCount}</p>
                      <p className="text-xs text-slate-400 mt-1">专业</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-5 leading-relaxed line-clamp-3">{schoolInfo.introduction}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10 z-10 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl bg-white">
            <CardContent className="p-8 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {stats.map((stat, idx) => {
                  const colors = [
                    "from-blue-500 to-blue-600",
                    "from-violet-500 to-violet-600",
                    "from-indigo-500 to-indigo-600",
                    "from-emerald-500 to-emerald-600",
                    "from-amber-500 to-amber-600",
                    "from-rose-500 to-rose-600",
                  ]
                  return (
                    <div key={stat.label} className="text-center group">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[idx]} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="h-6 w-6" />
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

      {/* 产教融合 */}
      <section className="py-24 bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="产教融合" subtitle="多元主体协同，项目全程管理，数据驱动决策" />

          <SectionSubHeading title="合作主体" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
            {featuredPartners.map((partner, i) => (
              <PartnerCard key={partner.id} partner={partner} img={getImage(i)} />
            ))}
          </div>

          <SectionSubHeading title="合作项目" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} img={getImage(i + 6)} />
            ))}
          </div>

          <SectionSubHeading title="合作成果" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
            {featuredAchievements.map((ach, i) => (
              <AchievementCard key={ach.id} ach={ach} img={getImage(i + 9)} />
            ))}
          </div>

          <SectionSubHeading title="专家资源库" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {featuredExperts.map((expert, i) => (
              <ExpertCard key={expert.id} expert={expert} avatarSrc={getAvatar(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* 品牌展示 */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="品牌展示" subtitle="人才培养、校企合作、专业建设等各领域品牌成果" />

          {/* 六大分类 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
            {brandCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.id} href={cat.href}>
                  <Card className="h-full border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 rounded-3xl cursor-pointer bg-white">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-slate-600" />
                      </div>
                      <h3 className="font-bold text-slate-800">{cat.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* 精选人才 */}
          <SectionSubHeading title="精选人才" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {featuredTalent.map((profile, i) => (
              <TalentCard key={profile.id} profile={profile} index={i} avatarSrc={getAvatar(i + 5)} />
            ))}
          </div>

          {/* 雇主品牌 + 岗位品牌 */}
          <div className="grid lg:grid-cols-2 gap-10 mb-20">
            <div>
              <SectionSubHeading title="雇主品牌" />
              <div className="space-y-5">
                {featuredPartners.slice(0, 3).map((partner, i) => (
                  <Link key={partner.id} href={`/partners/${partner.id}`}>
                    <Card className="group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-3xl overflow-hidden bg-white">
                      <div className="flex h-32">
                        <div className="w-2/5 relative overflow-hidden">
                          <img src={getImage(i + 12)} alt={partner.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                        </div>
                        <CardContent className="flex-1 p-5 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-10 w-10 rounded-lg">
                              <AvatarImage src={partner.logo} className="object-cover" />
                              <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">{partner.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{partner.name}</h4>
                              <p className="text-[11px] text-slate-400">{partner.industry}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{partner.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{partner.region}</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <SectionSubHeading title="岗位品牌" />
              <div className="space-y-5">
                {featuredJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} img={getImage(i + 15)} />
                ))}
              </div>
            </div>
          </div>

          {/* 特色专业 */}
          <SectionSubHeading title="特色专业" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {featuredMajors.map((major, i) => (
              <MajorCard key={major.id} major={major} img={getImage(i + 3)} />
            ))}
          </div>

          {/* 师资品牌 */}
          <SectionSubHeading title="师资品牌" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-20">
            {featuredTeachers.map((teacher, i) => (
              <TeacherCard key={teacher.id} teacher={teacher} avatarSrc={getAvatar(i + 10)} />
            ))}
          </div>

          {/* 文化思政 */}
          <SectionSubHeading title="文化思政品牌" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCulture.map((cb, i) => (
              <CultureCard key={cb.id} cb={cb} img={getImage(i + 10)} />
            ))}
          </div>
        </div>
      </section>

      {/* 就业项目 */}
      <section className="py-24 bg-gradient-to-b from-blue-50/50 via-indigo-50/30 to-violet-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="就业项目" subtitle="校企合作就业项目，汇聚优质岗位资源" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
            {[
              { label: "就业项目", value: employmentProjects.length, icon: Briefcase, color: "from-blue-500 to-blue-600" },
              { label: "进行中", value: employmentProjects.filter(p => p.status === "ongoing").length, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
              { label: "在招岗位", value: employmentProjects.reduce((sum, p) => sum + p.jobCount, 0), icon: Target, color: "from-violet-500 to-violet-600" },
              { label: "合作企业", value: new Set(employmentProjects.flatMap(p => p.partnerIds)).size, icon: Building2, color: "from-amber-500 to-amber-600" },
            ].map((s) => (
              <Card key={s.label} className="border-0 shadow-sm rounded-3xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white mb-4 shadow-lg`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredEmployment.map((project, i) => (
              <EmploymentCard key={project.id} project={project} img={getImage(i + 6)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            加入产教融合生态圈
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rounded-full px-12 py-7 text-lg font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-2xl transition-all hover:shadow-white/20 hover:-translate-y-1">
              <Link href="/contact">联系我们</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-12 py-7 text-lg font-bold border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50 transition-all">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-200 block leading-tight">产教融合平台</span>
                <span className="text-xs text-slate-600">产业联盟与人资品牌服务平台</span>
              </div>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} 产教融合平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
