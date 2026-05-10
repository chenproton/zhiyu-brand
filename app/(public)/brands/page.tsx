import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  UserCircle,
  Heart,
  ArrowRight,
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

const brandCategories = [
  {
    id: "talent",
    title: "人才品牌",
    description: "展示优质毕业生画像与就业案例",
    icon: Users,
    href: "/brands/talent",
    count: talentProfiles.length + employmentCases.length,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "partner",
    title: "合作主体品牌",
    description: "企业、协会、园区、机构品牌展示",
    icon: Building2,
    href: "/brands/partner",
    count: partners.length,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    id: "job",
    title: "岗位品牌",
    description: "优质职业岗位品牌化展示",
    icon: Briefcase,
    href: "/brands/job",
    count: jobBrands.length,
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: "major",
    title: "专业品牌",
    description: "特色专业与培养成果展示",
    icon: GraduationCap,
    href: "/brands/major",
    count: majorBrands.length,
    color: "bg-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    id: "teacher",
    title: "师资品牌",
    description: "优质校本师资与企业专家",
    icon: UserCircle,
    href: "/brands/teacher",
    count: teacherBrands.length + experts.length,
    color: "bg-rose-500",
    bgColor: "bg-rose-50",
  },
  {
    id: "culture",
    title: "文化思政品牌",
    description: "校园文化与思政教育成果",
    icon: Heart,
    href: "/brands/culture",
    count: cultureBrands.length,
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
  },
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              品牌展示中心
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              产教融合品牌资产
            </h1>
            <p className="text-lg text-muted-foreground">
              汇聚人才培养、校企合作、专业建设等各领域的品牌成果，
              展示学校教育质量与合作实力
            </p>
          </div>
        </div>
      </section>

      {/* Brand Categories */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-2`}>
                      <Icon className={`h-7 w-7 ${category.color.replace("bg-", "text-")}`} />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {category.title}
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{category.count}</span>
                      <span className="text-sm text-muted-foreground">个品牌内容</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Content */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">精选人才</h2>
            <p className="text-muted-foreground">优秀毕业生代表</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/brands/talent">查看全部</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {employmentCases.slice(0, 3).map((case_) => (
            <Card key={case_.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted relative">
                <img
                  src={case_.photo || "/placeholder.svg?height=300&width=400"}
                  alt={case_.studentName}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold">{case_.studentName}</h3>
                <p className="text-sm text-muted-foreground">{case_.major} | {case_.graduationYear}届</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-sm">{case_.company}</span>
                  <Badge variant="secondary">{case_.position}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Majors */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">特色专业</h2>
            <p className="text-muted-foreground">重点建设专业展示</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/brands/major">查看全部</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {majorBrands.filter(m => m.level === "recommended").slice(0, 2).map((major) => (
            <Card key={major.id} className="overflow-hidden">
              <div className="aspect-[5/2] bg-muted relative">
                <img
                  src={major.coverImage || "/placeholder.svg?height=200&width=500"}
                  alt={major.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3">推荐品牌</Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">{major.name}</h3>
                <p className="text-sm text-muted-foreground">{major.department}</p>
                <p className="text-sm mt-2 line-clamp-2">{major.introduction}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span>在校生 <strong>{major.studentCount}</strong></span>
                  <span>就业率 <strong className="text-emerald-600">{major.employmentRate}%</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
