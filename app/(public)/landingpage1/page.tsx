"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Building2, FolderKanban, Users, Trophy, Briefcase, Star,
  GraduationCap, UserCircle, Heart, MapPin,
  Calendar, TrendingUp, Target, Sparkles, CheckCircle2,
  BookOpen, ArrowUpRight, Zap, Lightbulb, Eye, Phone, Mail, Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  partners, projects, experts, achievements,
  talentProfiles, jobBrands, teacherBrands, cultureBrands,
  majorBrands, schoolInfo, employmentProjects, enterprises,
  employmentCases,
} from "@/lib/mock-data"
import {
  PROJECT_PHASE_LABELS, TEACHER_TYPE_LABELS, CULTURE_TYPE_LABELS,
  EMPLOYMENT_PROJECT_STATUS_LABELS, EMPLOYMENT_PROJECT_TYPE_LABELS,
  BRAND_STATUS_LABELS, BRAND_LEVEL_LABELS, JOB_CATEGORY_LABELS,
  SECONDARY_COLLEGES,
} from "@/lib/types"
import {
  CooperationRatingBadge,
  ProjectPhaseBadge,
  ProjectPublishStatusBadge,
} from "@/components/shared/status-badge"

function maskStudentId(id: string) {
  if (id.length <= 4) return id
  return id.slice(0, 2) + "****" + id.slice(-2)
}

function getMilestoneProgress(milestones: typeof projects[0]["milestones"]) {
  if (!milestones || milestones.length === 0) return 0
  const completed = milestones.filter((m) => m.status === "completed").length
  return Math.round((completed / milestones.length) * 100)
}

const EMPLOYMENT_STATUS_LABELS: Record<NonNullable<typeof talentProfiles[0]["employmentStatus"]>, string> = {
  employed: "已就业",
  seeking: "求职中",
  studying: "在读",
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

function getIndustryImage(industry?: string) {
  const map: Record<string, string> = {
    "信息技术": IMAGES.tech,
    "制造业": IMAGES.factory,
    "智能制造": IMAGES.factory,
    "教育": IMAGES.campus,
    "金融服务": IMAGES.office,
    "电子商务": IMAGES.workspace,
    "生物医药": IMAGES.lab,
    "新能源": IMAGES.workshop,
    "文化艺术": IMAGES.diversity,
    "建筑工程": IMAGES.building,
  }
  return map[industry || ""] || getImage(0)
}

const brandCategories = [
  { id: "talent", title: "人才品牌", icon: Users, href: "/brands/talent" },
  { id: "partner", title: "雇主品牌", icon: Building2, href: "/brands/partner" },
  { id: "job", title: "岗位品牌", icon: Briefcase, href: "/brands/job" },
  { id: "major", title: "专业品牌", icon: GraduationCap, href: "/brands/major" },
  { id: "teacher", title: "师资品牌", icon: UserCircle, href: "/brands/teacher" },
  { id: "culture", title: "文化思政", icon: Heart, href: "/brands/culture" },
]

const stats = [
  { label: "合作企业", value: partners.filter(p => p.status === "active").length, icon: Building2 },
  { label: "合作项目", value: projects.filter(p => p.publishStatus === "published").length, icon: FolderKanban },
  { label: "合作专家", value: experts.length, icon: Users },
  { label: "合作成果", value: achievements.length, icon: Trophy },
  { label: "就业项目", value: employmentProjects.length, icon: Briefcase },
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
const featuredCases = employmentCases.filter(c => c.status === "published").slice(0, 4)
const featuredJobs = jobBrands.filter(j => j.level === "recommended").slice(0, 3)
const featuredMajors = majorBrands.filter(m => m.level === "recommended").slice(0, 3)
const featuredTeachers = teacherBrands.filter(t => t.isFeatured && t.status === "published").slice(0, 4)
const featuredCulture = cultureBrands.filter(c => c.status === "published").slice(0, 3)
const featuredEmployment = employmentProjects.slice(0, 6)

/* ============================================================
   MODERN CARD COMPONENTS
   ============================================================ */

function PartnerCard({ partner }: { partner: typeof partners[0] }) {
  const img = partner.coverImage || getIndustryImage(partner.industry)
  return (
    <Link href={`/partners/${partner.id}`}>
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full">
        <div className="relative h-44 overflow-hidden">
          <img src={img} alt={partner.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 rounded-xl border-2 border-white/80 shadow-md bg-white">
                <AvatarImage src={partner.logo} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-white text-slate-800 font-bold text-sm">
                  {partner.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-semibold text-white text-base leading-tight drop-shadow-md truncate">{partner.name}</h4>
                <p className="text-white/80 text-xs truncate">{partner.industry} · {partner.region}</p>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-5 flex flex-col h-[calc(100%-11rem)]">
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">{partner.description}</p>
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
}

function ProjectCard({ project, img }: { project: typeof projects[0]; img: string }) {
  const milestoneProgress = getMilestoneProgress(project.milestones)
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img src={img} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <ProjectPhaseBadge phase={project.phase} />
            <ProjectPublishStatusBadge status={project.publishStatus} />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-white/90 text-xs font-medium bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              {project.type}
            </span>
          </div>
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <h4 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-blue-700 transition-colors">{project.name}</h4>
          <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {project.partnerName}
          </p>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">{project.description}</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{project.startDate.toLocaleDateString("zh-CN")} 至 {project.endDate.toLocaleDateString("zh-CN")}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>里程碑进度</span>
                <span>{milestoneProgress}%</span>
              </div>
              <Progress value={milestoneProgress} className="h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const ACHIEVEMENT_DISPLAY_LABELS: Record<typeof achievements[0]['type'], string> = {
  course: '数字课程',
  scene: '实践场景',
  job: '职业岗位',
  custom: '自定义成果',
}

const ACHIEVEMENT_DISPLAY_VARIANTS: Record<typeof achievements[0]['type'], string> = {
  course: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  scene: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  job: 'bg-blue-50 text-blue-700 border-blue-100',
  custom: 'bg-slate-100 text-slate-700 border-slate-200',
}

function AchievementCard({ ach, img }: { ach: typeof achievements[0]; img: string }) {
  return (
    <Link href="/achievements">
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full">
        <div className="relative h-44 overflow-hidden">
          <img src={img} alt={ach.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className={ACHIEVEMENT_DISPLAY_VARIANTS[ach.type]}>
              {ACHIEVEMENT_DISPLAY_LABELS[ach.type]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h4 className="font-semibold text-slate-900 text-base mb-2 group-hover:text-blue-700 transition-colors">{ach.name}</h4>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">{ach.description}</p>
          <div className="space-y-1.5 text-xs text-slate-600">
            {ach.partnerName && (
              <p className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3" /> {ach.partnerName}
              </p>
            )}
            {ach.projectName && (
              <p className="flex items-center gap-1.5">
                <FolderKanban className="h-3 w-3" /> {ach.projectName}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{ach.publishDate.toLocaleDateString("zh-CN")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ExpertCard({ expert, avatarSrc, coverSrc }: { expert: typeof experts[0]; avatarSrc?: string; coverSrc?: string }) {
  const genderLabel = expert.gender === "male" ? "男" : expert.gender === "female" ? "女" : "—"
  const displayAvatar = avatarSrc || expert.avatar || getAvatar(expert.name.charCodeAt(0))
  return (
    <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white text-center h-full flex flex-col">
      <div className="h-20 relative">
        <img
          src={coverSrc || "/images/landingpage/tech.jpg"}
          alt={expert.organization || expert.partnerName || expert.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
          <Avatar className="h-[72px] w-[72px] ring-4 ring-white shadow-md">
            <AvatarImage src={displayAvatar} />
            <AvatarFallback className="text-lg font-semibold bg-slate-100 text-slate-800">
              {expert.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardContent className="pt-11 pb-5 px-4 flex-1 flex flex-col text-left">
        <h4 className="font-semibold text-slate-900 text-center text-sm truncate">{expert.name}</h4>
        <p className="text-xs text-slate-500 text-center truncate mt-0.5">{expert.title || expert.position || "—"}</p>
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <div className="flex justify-between gap-2">
            <span className="text-slate-400 shrink-0">年龄/性别</span>
            <span className="text-right">{expert.age ? `${expert.age}岁` : "—"} / {genderLabel}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-400 shrink-0">从业年限</span>
            <span className="text-right">{expert.experience && expert.experience > 0 ? `${expert.experience} 年` : "—"}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-400 shrink-0">教育背景</span>
            <span className="text-right truncate">{expert.education || "—"}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-400 shrink-0">行业方向</span>
            <span className="text-right truncate">{expert.industryDirection || "—"}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-400 shrink-0">岗位方向</span>
            <span className="text-right truncate">{expert.positionDirection || "—"}</span>
          </div>
        </div>
        {expert.specialties && expert.specialties.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] text-slate-400 mb-1.5">擅长领域</p>
            <div className="flex flex-wrap gap-1">
              {expert.specialties.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TalentCard({ profile, index, avatarSrc }: { profile: typeof talentProfiles[0]; index: number; avatarSrc?: string }) {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-indigo-500 to-violet-600",
    "from-slate-600 to-slate-700",
    "from-blue-600 to-slate-700",
  ]
  const grad = gradients[index % gradients.length]
  const displayAvatar = avatarSrc || profile.avatar || getAvatar(profile.studentName.charCodeAt(0))
  const employmentLabel = profile.employmentStatus ? EMPLOYMENT_STATUS_LABELS[profile.employmentStatus] : null
  return (
    <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white">
      <div className={`h-24 bg-gradient-to-r ${grad} relative`}>
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-xs">
          {index + 1}
        </div>
        <div className="absolute -bottom-9 left-5">
          <Avatar className="h-[72px] w-[72px] ring-4 ring-white shadow-md">
            <AvatarImage src={displayAvatar} />
            <AvatarFallback className="text-lg font-semibold bg-slate-100 text-slate-800">
              {profile.studentName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardContent className="pt-11 pb-5 px-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">{profile.studentName}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{maskStudentId(profile.studentId)} · {profile.major} · {profile.grade}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {profile.department}
              {profile.secondaryCollege && ` · ${profile.secondaryCollege}`}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${grad}`}>
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
          {employmentLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
              {employmentLabel}
            </span>
          )}
          {profile.abilityTags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
              {tag}
            </span>
          ))}
        </div>
        {profile.remark && (
          <p className="text-xs text-slate-500 mt-3 line-clamp-2 italic border-l-2 border-slate-200 pl-3">
            &ldquo;{profile.remark}&rdquo;
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function JobCard({ job }: { job: typeof jobBrands[0] }) {
  return (
    <Link href="/brands/job">
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-5 flex flex-col justify-center min-w-0 h-auto">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h4 className="font-semibold text-slate-900 text-sm truncate">{job.name}</h4>
          </div>
          {(job.industry || job.description) && (
            <p className="text-xs text-slate-500 line-clamp-1 mb-2">
              {[job.industry, job.description].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {job.jobCategory && (
              <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-600">
                {JOB_CATEGORY_LABELS[job.jobCategory]}
              </Badge>
            )}
            {job.suitableMajors.slice(0, 2).map((major) => (
              <span key={major} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {major}
              </span>
            ))}
            {job.featureTags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {job.averageSalary && (
              <span className="font-semibold text-emerald-600">{job.averageSalary}</span>
            )}
            {job.demandCount > 0 && (
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="h-3 w-3" /> {job.demandCount}
              </span>
            )}
            {job.secondaryCollege && (
              <span className="text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.secondaryCollege}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function EmploymentCaseCard({ case_, img }: { case_: typeof employmentCases[0]; img: string }) {
  const displayAvatar = case_.companyLogo || getAvatar(case_.studentName.charCodeAt(0))
  return (
    <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full">
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={case_.studentName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 rounded-xl border-2 border-white/80 shadow-md bg-white">
              <AvatarImage src={displayAvatar} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-white text-slate-800 font-semibold text-sm">
                {case_.studentName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h4 className="font-semibold text-white text-base leading-tight drop-shadow-md truncate">{case_.studentName}</h4>
              <p className="text-white/80 text-xs truncate">{case_.company} · {case_.position}</p>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">{case_.story}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-600">
            {case_.major}
          </Badge>
          <Badge variant={case_.status === "published" ? "secondary" : "outline"} className="text-[10px]">
            {BRAND_STATUS_LABELS[case_.status]}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-amber-500" /> {case_.salary || "面议"}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> {case_.graduationYear}届
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function MajorCard({ major, img }: { major: typeof majorBrands[0]; img: string }) {
  return (
    <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full flex flex-col">
      <div className="relative h-52 overflow-hidden shrink-0">
        <img src={img} alt={major.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm font-semibold border-0 mb-2 shadow-sm">
            {BRAND_LEVEL_LABELS[major.level]}
          </Badge>
          <h4 className="font-semibold text-white text-lg mb-1 drop-shadow-md">{major.name}</h4>
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
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-2">{major.introduction}</p>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{major.cultivationGoal}</p>
        <div className="space-y-2 mt-auto">
          <div className="flex flex-wrap gap-1">
            {major.coreCourses.slice(0, 3).map((course) => (
              <span key={typeof course === "string" ? course : course.name} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                {typeof course === "string" ? course : course.name}
              </span>
            ))}
          </div>
          {major.cooperationPartners.length > 0 && (
            <p className="text-xs text-slate-500 truncate">
              合作企业：{major.cooperationPartners.slice(0, 3).join("、")}
              {major.cooperationPartners.length > 3 && ` 等${major.cooperationPartners.length}家`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TeacherCard({ teacher, avatarSrc }: { teacher: typeof teacherBrands[0]; avatarSrc?: string }) {
  const genderLabel = teacher.gender === "male" ? "男" : teacher.gender === "female" ? "女" : "—"
  const displayAvatar = avatarSrc || teacher.avatar || getAvatar(teacher.name.charCodeAt(0))
  return (
    <Link href="/brands/teacher">
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white text-center h-full flex flex-col">
        <div className="h-20 relative">
          <img
            src={"/images/landingpage/team.jpg"}
            alt={teacher.organization || teacher.department}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
            <Avatar className="h-[72px] w-[72px] ring-4 ring-white shadow-md">
              <AvatarImage src={displayAvatar} />
              <AvatarFallback className="text-lg font-semibold bg-slate-100 text-slate-800">{teacher.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-11 pb-5 px-4 flex-1 flex flex-col text-left">
          <h4 className="font-semibold text-slate-900 text-center text-sm truncate">{teacher.name}</h4>
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
          {teacher.researchFields && teacher.researchFields.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] text-slate-400 mb-1.5">研究领域</p>
              <div className="flex flex-wrap gap-1">
                {teacher.researchFields.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function CultureCard({ cb, img }: { cb: typeof cultureBrands[0]; img: string }) {
  return (
    <Link href="/brands/culture">
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full">
        <div className="relative h-44 overflow-hidden">
          <img src={img} alt={cb.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm font-semibold border-0 shadow-sm">
              {CULTURE_TYPE_LABELS[cb.type]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h4 className="font-semibold text-slate-900 text-base mb-2 group-hover:text-blue-700 transition-colors">{cb.name}</h4>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">{cb.description}</p>
          {cb.relatedMajor && (
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" /> 面向专业：{cb.relatedMajor}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function EmploymentCard({ project, img }: { project: typeof employmentProjects[0]; img: string }) {
  const partnerNames = project.partnerIds
    .map((id) => enterprises.find((e) => e.id === id)?.name)
    .filter(Boolean)
  return (
    <Link href={`/jobs/project/${project.id}`}>
      <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white h-full">
        <div className="relative h-44 overflow-hidden">
          <img src={img} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className={`font-semibold border-0 shadow-sm ${
              project.status === "preparing" ? "bg-amber-500 text-white" :
              project.status === "ongoing" ? "bg-emerald-500 text-white" :
              "bg-slate-500 text-white"
            }`}>
              {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
            </Badge>
            <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm font-semibold border-0 shadow-sm">
              {EMPLOYMENT_PROJECT_TYPE_LABELS[project.type]}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h4 className="font-semibold text-white text-lg drop-shadow-md line-clamp-1">{project.name}</h4>
          </div>
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
            {project.description || `面向${project.targetStudentGroups.join("、")}学生，提供丰富的就业岗位。`}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              {project.startDate.toLocaleDateString("zh-CN")} ~ {project.endDate.toLocaleDateString("zh-CN")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
              {project.jobCount} 岗位
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100 mt-auto">
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate">
              {partnerNames.slice(0, 2).join("、")}
              {partnerNames.length > 2 && ` 等${partnerNames.length}家`}
            </span>
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
      <Button asChild className="rounded-full px-7 py-5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
        <Link href={href}>{children}</Link>
      </Button>
    )
  }
  return (
    <Button asChild variant="outline" className="rounded-full px-7 py-5 text-sm font-semibold border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function ViewAllLink({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
      查看全部 <ArrowUpRight className="h-4 w-4" />
    </Link>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </div>
  )
}

function SectionSubHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      {action}
    </div>
  )
}

function SectionDivider() {
  return <div className="border-t border-slate-100 pt-16 mt-16" />
}

function useSelectedCollege() {
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
  return [selectedCollege, handleChange] as const
}

function CollegeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const sortedColleges = [...SECONDARY_COLLEGES].sort((a, b) => {
    if (a === '校本级') return 1
    if (b === '校本级') return -1
    return a.localeCompare(b, 'zh-CN')
  })
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border border-white/30 bg-white/10 px-2 pr-6 text-sm text-white outline-none backdrop-blur-sm hover:border-white/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors cursor-pointer"
    >
      <option value="all" className="text-slate-900">全校</option>
      {sortedColleges.map((c) => <option key={c} value={c} className="text-slate-900">{c}</option>)}
    </select>
  )
}

function useLocalCollege(defaultValue = "all") {
  const [selectedCollege, setSelectedCollege] = useState(defaultValue)
  const handleChange = (value: string) => setSelectedCollege(value)
  return [selectedCollege, handleChange] as const
}

function CollegeTabs<T extends { secondaryColleges?: string[] }>({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (value: string) => void
  items: T[]
}) {
  const availableColleges = new Set<string>()
  items.forEach((item) => {
    item.secondaryColleges?.forEach((college) => availableColleges.add(college))
  })
  const tabs = ["全校", ...SECONDARY_COLLEGES.filter((c) => availableColleges.has(c))]
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((college) => {
        const tabValue = college === "全校" ? "all" : college
        const active = value === tabValue
        return (
          <button
            key={tabValue}
            onClick={() => onChange(tabValue)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {college}
          </button>
        )
      })}
    </div>
  )
}

function MajorTabs({
  value,
  onChange,
  items,
  labelKey,
}: {
  value: string
  onChange: (value: string) => void
  items: unknown[]
  labelKey: string
}) {
  const availableMajors = [...new Set((items as Record<string, unknown>[]).map((item) => String(item[labelKey])))].sort()
  const tabs = ["全部专业", ...availableMajors]
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
                ? "bg-blue-600 text-white shadow-sm"
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

const ANCHOR_SECTIONS = [
  { id: "achievement-library", label: "产教融合成果库" },
  { id: "brand-library", label: "产教品牌库" },
  { id: "talent-job-hall", label: "人才与岗位供需服务大厅" },
]

function SectionAnchorNav() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )

    ANCHOR_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-4">
      {ANCHOR_SECTIONS.map(({ id, label }) => {
        const active = activeId === id
        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className="group flex items-center gap-3 text-right"
          >
            <span
              className="text-sm font-medium transition-all duration-300 text-slate-500 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            >
              {label}
            </span>
            <span
              className={`block w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                active
                  ? "bg-blue-600 border-blue-600 scale-125"
                  : "bg-white border-slate-300 group-hover:border-blue-400"
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}

export default function LandingPage() {
  const [selectedCollege, handleCollegeChange] = useSelectedCollege()
  const [partnerCollege, setPartnerCollege] = useLocalCollege()
  const [projectCollege, setProjectCollege] = useLocalCollege()
  const [achievementCollege, setAchievementCollege] = useLocalCollege()
  const [expertCollege, setExpertCollege] = useLocalCollege()
  const [talentMajor, setTalentMajor] = useState("all")

  const heroInfo = selectedCollege === "all"
    ? {
        name: schoolInfo.name,
        logo: schoolInfo.logo,
        studentCount: schoolInfo.studentCount,
        teacherCount: schoolInfo.teacherCount,
        majorCount: schoolInfo.majorCount,
        introduction: schoolInfo.introduction,
      }
    : (() => {
        const college = schoolInfo.secondaryColleges?.find((c) => c.name === selectedCollege)
        return {
          name: college?.name ?? schoolInfo.name,
          logo: college?.logo ?? schoolInfo.logo,
          studentCount: college?.studentCount ?? schoolInfo.studentCount,
          teacherCount: college?.teacherCount ?? schoolInfo.teacherCount,
          majorCount: college?.majorCount ?? schoolInfo.majorCount,
          introduction: college?.introduction ?? schoolInfo.introduction,
        }
      })()

  const filteredPartners = partnerCollege === "all" ? featuredPartners : featuredPartners.filter((p) => p.secondaryColleges?.includes(partnerCollege))
  const filteredProjects = projectCollege === "all" ? featuredProjects : featuredProjects.filter((p) => p.secondaryColleges?.includes(projectCollege))
  const filteredAchievements = achievementCollege === "all" ? featuredAchievements : featuredAchievements.filter((a) => a.secondaryColleges?.includes(achievementCollege))
  const filteredExperts = expertCollege === "all" ? featuredExperts : featuredExperts.filter((e) => e.secondaryColleges?.includes(expertCollege))

  return (
    <div className="min-h-screen bg-white">
      <SectionAnchorNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.campus} alt="campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/50" />
        </div>
        <div className="absolute top-24 right-24 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-16 left-16 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-32">
          <div className="flex items-center justify-end gap-3 mb-16">
            <CollegeSelect value={selectedCollege} onChange={handleCollegeChange} />
            <Link href="/partner/login" className="flex items-center gap-1.5 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:border-white/50">
              <Building2 className="h-4 w-4" />
              企业/专家服务台
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-[1.15] tracking-tight">
                搭建产教融合桥梁
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">
                  共育产业英才
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 mb-10 max-w-lg leading-relaxed">
                坚持以产业需求为牵引，面向职业岗位能力要求，依托真实实践场景，推动企业用人标准、教学培养目标与人才测评体系协同贯通。
              </p>
             </div>

            <div className="hidden lg:block">
              <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl">
                <CardContent className="p-7">
                  <div className="flex items-start gap-4">
                    <img
                      src={heroInfo.logo}
                      alt={heroInfo.name}
                      className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-white">{heroInfo.name}</h3>
                      <a
                        href={schoolInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-300 hover:text-blue-200 mt-1 inline-flex items-center gap-1"
                      >
                        前往官网 <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-7 py-6 border-y border-white/10">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-300">{heroInfo.studentCount?.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">在校生</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-300">{heroInfo.teacherCount}</p>
                      <p className="text-xs text-slate-400 mt-1">教师</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-300">{heroInfo.majorCount}</p>
                      <p className="text-xs text-slate-400 mt-1">专业</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-5 leading-relaxed line-clamp-3">{heroInfo.introduction}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-10 z-10 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border border-slate-100 shadow-xl shadow-slate-200/30 rounded-2xl bg-white">
            <CardContent className="p-6 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                {stats.map((stat, idx) => {
                  const colors = [
                    "from-blue-500 to-blue-600",
                    "from-indigo-500 to-indigo-600",
                    "from-slate-600 to-slate-700",
                    "from-emerald-500 to-emerald-600",
                    "from-amber-500 to-amber-600",
                  ]
                  return (
                    <div key={stat.label} className="text-center group">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx]} text-white mb-3 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}+</p>
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
      <section id="achievement-library" className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="产教融合成果库" subtitle="多元主体协同，以产业需求为牵引，以学生能力为中心，以场景实践为载体，以跨专业融合为特征" />

          <SectionSubHeading
            title="合作企业"
            action={
              <div className="flex items-center gap-3">
                <CollegeTabs value={partnerCollege} onChange={setPartnerCollege} items={featuredPartners} />
                <ViewAllLink href="/partners" />
              </div>
            }
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

          <SectionDivider />

          <SectionSubHeading
            title="合作成果"
            action={
              <div className="flex items-center gap-3">
                <CollegeTabs value={achievementCollege} onChange={setAchievementCollege} items={featuredAchievements} />
                <ViewAllLink href="/achievements" />
              </div>
            }
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredAchievements.map((ach, i) => (
              <AchievementCard key={ach.id} ach={ach} img={getImage(i + 9)} />
            ))}
          </div>

          <SectionDivider />

          <SectionSubHeading
            title="专家资源"
            action={
              <div className="flex items-center gap-3">
                <CollegeTabs value={expertCollege} onChange={setExpertCollege} items={featuredExperts} />
                <ViewAllLink href="/experts" />
              </div>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {filteredExperts.map((expert, i) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                avatarSrc={getAvatar(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 品牌展示 */}
      <section id="brand-library" className="py-20 bg-gradient-to-b from-white via-slate-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="产教品牌库" subtitle="人才培养、校企合作、专业建设等各领域品牌成果" />

          {/* 六大分类 */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
            {brandCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link key={cat.id} href={cat.href}>
                  <div className="group flex items-center gap-3 px-5 py-3 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{cat.title}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* 人才品牌 - Tab 切换 */}
          <div className="mb-20">
            <Tabs defaultValue="cases" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-800">人才品牌</h3>
                </div>
                <TabsList className="rounded-xl">
                  <TabsTrigger value="cases" className="rounded-lg text-xs">就业案例</TabsTrigger>
                  <TabsTrigger value="talent" className="rounded-lg text-xs">学生排行</TabsTrigger>
                </TabsList>
                <ViewAllLink href="/brands/talent" />
              </div>
              <TabsContent value="talent">
                <MajorTabs
                  value={talentMajor}
                  onChange={setTalentMajor}
                  items={featuredTalent}
                  labelKey="major"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                  {featuredTalent
                    .filter((p) => (talentMajor === "all" ? true : p.major === talentMajor))
                    .map((profile, i) => (
                      <TalentCard key={profile.id} profile={profile} index={i} avatarSrc={getAvatar(i + 5)} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="cases">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredCases.map((case_, i) => (
                    <EmploymentCaseCard key={case_.id} case_={case_} img={getImage(i + 20)} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SectionDivider />

          {/* 雇主品牌 + 岗位品牌 */}
          <div className="grid lg:grid-cols-2 gap-10 mb-20">
            <div>
              <SectionSubHeading title="雇主品牌" action={<ViewAllLink href="/brands/partner" />} />
              <div className="space-y-4">
                {featuredPartners.slice(0, 3).map((partner, i) => (
                  <Link key={partner.id} href={`/partners/${partner.id}`}>
                    <Card className="group border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                      <div className="flex h-28">
                        <div className="w-32 relative overflow-hidden shrink-0">
                          <img src={getImage(i + 12)} alt={partner.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                        </div>
                        <CardContent className="flex-1 p-4 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-9 w-9 rounded-lg bg-white">
                              <AvatarImage src={partner.logo} className="object-cover" />
                              <AvatarFallback className="rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">{partner.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-slate-900 text-sm">{partner.name}</h4>
                              <p className="text-[11px] text-slate-500">{partner.industry}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{partner.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
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
              <SectionSubHeading title="岗位品牌" action={<ViewAllLink href="/brands/job" />} />
              <div className="space-y-4">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </div>

          <SectionDivider />

          {/* 特色专业 */}
          <SectionSubHeading title="专业品牌" action={<ViewAllLink href="/brands/major" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {featuredMajors.map((major, i) => (
              <MajorCard key={major.id} major={major} img={getImage(i + 3)} />
            ))}
          </div>

          <SectionDivider />

          {/* 师资品牌 */}
          <div className="mb-20">
            <Tabs defaultValue="teachers" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-800">师资品牌</h3>
                </div>
                <div className="flex items-center gap-3">
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="teachers" className="rounded-lg text-xs">校本师资</TabsTrigger>
                    <TabsTrigger value="experts" className="rounded-lg text-xs">企业专家</TabsTrigger>
                  </TabsList>
                  <ViewAllLink href="/brands/teacher" />
                </div>
              </div>
              <TabsContent value="teachers">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {featuredTeachers.map((teacher, i) => (
                    <TeacherCard key={teacher.id} teacher={teacher} avatarSrc={getAvatar(i + 10)} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="experts">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                  {featuredExperts.map((expert, i) => (
                    <Link key={expert.id} href="/brands/teacher">
                      <ExpertCard expert={expert} avatarSrc={getAvatar(i + 20)} />
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SectionDivider />

          {/* 文化思政 */}
          <SectionSubHeading title="文化思政品牌" action={<ViewAllLink href="/brands/culture" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCulture.map((cb, i) => (
              <CultureCard key={cb.id} cb={cb} img={getImage(i + 10)} />
            ))}
          </div>
        </div>
      </section>

      {/* 人才与岗位供需服务大厅 */}
      <section id="talent-job-hall" className="py-20 bg-gradient-to-b from-blue-50/50 via-indigo-50/30 to-violet-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="人才与岗位供需服务大厅" subtitle="校企合作就业项目，汇聚优质岗位资源" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "发布场次", value: employmentProjects.length, icon: Briefcase, color: "from-blue-500 to-blue-600" },
              { label: "进行中", value: employmentProjects.filter(p => p.status === "ongoing").length, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
              { label: "在招岗位", value: employmentProjects.reduce((sum, p) => sum + p.jobCount, 0), icon: Target, color: "from-indigo-500 to-indigo-600" },
              { label: "合作企业", value: new Set(employmentProjects.flatMap(p => p.partnerIds)).size, icon: Building2, color: "from-amber-500 to-amber-600" },
            ].map((s) => (
              <Card key={s.label} className="border border-slate-100 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-5 text-center">
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white mb-3 shadow-md`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredEmployment.map((project, i) => (
              <EmploymentCard key={project.id} project={project} img={getImage(i + 6)} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="rounded-full px-7 py-5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
              <Link href="/jobs">查看全部岗位</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
