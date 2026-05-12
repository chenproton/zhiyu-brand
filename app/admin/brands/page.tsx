"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  UserCircle,
  Heart,
  FileText,
  TrendingUp,
  Eye,
} from "lucide-react"
import {
  talentProfiles,
  employmentCases,
  jobBrands,
  majorBrands,
  teacherBrands,
  cultureBrands,
  partners,
  experts,
} from "@/lib/mock-data"

const brandModules = [
  {
    id: "talent",
    title: "人才品牌",
    description: "学生能力画像排名、典型就业案例",
    icon: Users,
    href: "/admin/brands/talent",
    stats: [
      { label: "人才画像", value: talentProfiles.length },
      { label: "就业案例", value: employmentCases.length },
    ],
    color: "bg-blue-500",
  },
  {
    id: "partner",
    title: "雇主品牌",
    description: "企业/协会/园区/机构品牌展示",
    icon: Building2,
    href: "/admin/brands/partner",
    stats: [
      { label: "合作主体", value: partners.length },
      { label: "已发布", value: partners.filter(p => p.status === "active").length },
    ],
    color: "bg-emerald-500",
  },
  {
    id: "job",
    title: "岗位品牌",
    description: "优质职业岗位品牌化展示",
    icon: Briefcase,
    href: "/admin/brands/job",
    stats: [
      { label: "岗位品牌", value: jobBrands.length },
      { label: "推荐品牌", value: jobBrands.filter(j => j.level === "recommended").length },
    ],
    color: "bg-amber-500",
  },
  {
    id: "major",
    title: "专业品牌",
    description: "专业画像与品牌展示",
    icon: GraduationCap,
    href: "/admin/brands/major",
    stats: [
      { label: "专业品牌", value: majorBrands.length },
      { label: "特色专业", value: majorBrands.filter(m => m.level === "recommended").length },
    ],
    color: "bg-violet-500",
  },
  {
    id: "teacher",
    title: "师资品牌",
    description: "校本师资与企业专家展示",
    icon: UserCircle,
    href: "/admin/brands/teacher",
    stats: [
      { label: "校本师资", value: teacherBrands.length },
      { label: "企业专家", value: experts.length },
    ],
    color: "bg-rose-500",
  },
  {
    id: "culture",
    title: "文化思政品牌",
    description: "思政案例与校园文化展示",
    icon: Heart,
    href: "/admin/brands/culture",
    stats: [
      { label: "品牌内容", value: cultureBrands.length },
      { label: "已发布", value: cultureBrands.filter(c => c.status === "published").length },
    ],
    color: "bg-pink-500",
  },
]

// 计算总浏览量
const totalViews =
  employmentCases.reduce((sum, e) => sum + e.viewCount, 0) +
  jobBrands.reduce((sum, j) => sum + j.viewCount, 0) +
  majorBrands.reduce((sum, m) => sum + m.viewCount, 0) +
  teacherBrands.reduce((sum, t) => sum + t.viewCount, 0) +
  cultureBrands.reduce((sum, c) => sum + c.viewCount, 0) +
  0

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">品牌运营管理</h1>
        <p className="text-muted-foreground mt-1">
          管理六大类品牌资产的配置、审核与发布
        </p>
      </div>

      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">品牌内容总数</p>
                <p className="text-2xl font-semibold">
                  {talentProfiles.length +
                    employmentCases.length +
                    jobBrands.length +
                    majorBrands.length +
                    teacherBrands.length +
                    cultureBrands.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总浏览量</p>
                <p className="text-2xl font-semibold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">文化思政</p>
                <p className="text-2xl font-semibold">{cultureBrands.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-rose-100 text-rose-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">就业案例</p>
                <p className="text-2xl font-semibold">{employmentCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 品牌模块卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandModules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.id} href={module.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${module.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">管理</Badge>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    {module.stats.map((stat, index) => (
                      <div key={index}>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
