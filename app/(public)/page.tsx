import Link from "next/link"
import { ArrowRight, Building2, FolderKanban, Users, Trophy, Calendar, Handshake, Target, TrendingUp, Briefcase, Star, Flame, MapPin, Heart, GraduationCap, UserCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { partners, projects, experts, achievements, activities, jobs, employmentCases, majorBrands, talentProfiles, jobBrands, teacherBrands, cultureBrands, schoolInfo } from "@/lib/mock-data"
import { PARTNER_TYPE_LABELS, PROJECT_PHASE_LABELS, JOB_TYPE_LABELS, ACHIEVEMENT_TYPE_LABELS, EXPERT_RATING_LABELS, TEACHER_TYPE_LABELS, CULTURE_TYPE_LABELS } from "@/lib/types"

const stats = [
  { label: "合作主体", value: partners.filter(p => p.status === "active").length, icon: Building2, href: "/partners" },
  { label: "合作项目", value: projects.filter(p => p.publishStatus === "published").length, icon: FolderKanban, href: "/projects" },
  { label: "专家资源", value: experts.length, icon: Users, href: "/experts" },
  { label: "成果产出", value: achievements.length, icon: Trophy, href: "/achievements" },
  { label: "在招岗位", value: jobs.filter(j => j.status === "published").length, icon: Briefcase, href: "/jobs" },
  { label: "品牌内容", value: talentProfiles.length + jobBrands.length + majorBrands.length + teacherBrands.length + cultureBrands.length + employmentCases.length, icon: Star, href: "/brands" },
]

const features = [
  { icon: Handshake, title: "多元主体协同", description: "汇聚学校、企业、行业协会、产业园区等多元合作主体。" },
  { icon: Target, title: "项目全程管理", description: "从需求对接到成果验收，实现项目全生命周期管理。" },
  { icon: TrendingUp, title: "数据驱动决策", description: "多维度数据分析，助力合作效果评估和资源优化。" },
]

const brandCategories = [
  { id: "talent", title: "人才品牌", icon: Users, href: "/brands/talent", count: talentProfiles.length + employmentCases.length, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-100" },
  { id: "partner", title: "合作主体品牌", icon: Building2, href: "/brands/partner", count: partners.length, color: "text-emerald-500", bgColor: "bg-emerald-50", borderColor: "border-emerald-100" },
  { id: "job", title: "岗位品牌", icon: Briefcase, href: "/brands/job", count: jobBrands.length, color: "text-amber-500", bgColor: "bg-amber-50", borderColor: "border-amber-100" },
  { id: "major", title: "专业品牌", icon: GraduationCap, href: "/brands/major", count: majorBrands.length, color: "text-violet-500", bgColor: "bg-violet-50", borderColor: "border-violet-100" },
  { id: "teacher", title: "师资品牌", icon: UserCircle, href: "/brands/teacher", count: teacherBrands.length + experts.length, color: "text-rose-500", bgColor: "bg-rose-50", borderColor: "border-rose-100" },
  { id: "culture", title: "文化思政品牌", icon: Heart, href: "/brands/culture", count: cultureBrands.length, color: "text-pink-500", bgColor: "bg-pink-50", borderColor: "border-pink-100" },
]

export default function HomePage() {
  const featuredPartners = partners.filter(p => p.status === "active").slice(0, 6)
  const featuredProjects = projects.filter(p => p.publishStatus === "published").slice(0, 3)
  const upcomingActivities = activities.filter(a => a.status === "published").slice(0, 3)
  const featuredAchievements = achievements.filter(a => a.status === "published").slice(0, 3)
  const featuredExperts = experts.filter(e => e.status === "active").slice(0, 5)
  const publishedJobs = jobs.filter(j => j.status === "published")
  const recommendedJobs = publishedJobs.filter(j => j.isRecommended).slice(0, 3)
  const urgentJobs = publishedJobs.filter(j => j.isUrgent).slice(0, 3)
  const featuredJobBrands = jobBrands.filter(j => j.level === "recommended").slice(0, 3)
  const featuredTeachers = teacherBrands.filter(t => t.isFeatured && t.status === "published").slice(0, 4)
  const featuredCultureBrands = cultureBrands.filter(c => c.status === "published").slice(0, 3)
  const featuredTalents = talentProfiles.filter(t => t.isFeatured).slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left: Title & Slogan */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs">产业联盟与人资品牌服务平台</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-balance mb-3">
                搭建产教融合桥梁 <span className="text-muted-foreground">共育产业英才</span>
              </h1>
              <p className="text-base text-muted-foreground text-pretty max-w-xl mx-auto lg:mx-0 leading-relaxed">
                整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态。
              </p>
            </div>

            {/* Right: School Info Card */}
            <div className="lg:col-span-2">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <img
                        src={schoolInfo.logo || "/placeholder.svg?height=80&width=80"}
                        alt={schoolInfo.name}
                        className="w-16 h-16 rounded-xl object-cover border"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-lg truncate">{schoolInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">{schoolInfo.type} · {schoolInfo.province}{schoolInfo.city}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                        <span><strong className="text-foreground">{schoolInfo.studentCount?.toLocaleString()}</strong> <span className="text-muted-foreground">在校生</span></span>
                        <span><strong className="text-foreground">{schoolInfo.teacherCount}</strong> <span className="text-muted-foreground">教师</span></span>
                        <span><strong className="text-foreground">{schoolInfo.majorCount}</strong> <span className="text-muted-foreground">专业</span></span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                    {schoolInfo.introduction}
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t text-sm">
                    <span className="text-muted-foreground">{schoolInfo.establishedYear} 年建校</span>
                    {schoolInfo.website && (
                      <a href={schoolInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        学校官网
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href} className="group text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-background border shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all">
                    <stat.icon className="h-5 w-5 text-foreground" />
                  </div>
                </div>
                <div className="text-2xl font-bold group-hover:text-primary transition-colors">{stat.value}+</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 产教融合 Section */}
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">产教融合</h2>
              <p className="text-sm text-muted-foreground">多元主体协同，项目全程管理</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/partners">查看全部 <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Featured Partners */}
          <div className="mb-10">
            <h3 className="text-base font-semibold mb-4">合作主体</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPartners.map((partner) => (
                <Link key={partner.id} href={`/partners/${partner.id}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h4 className="font-semibold truncate">{partner.name}</h4>
                          <p className="text-sm text-muted-foreground">{partner.industry}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">{PARTNER_TYPE_LABELS[partner.type]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{partner.description}</p>
                      {partner.cooperationTypes && partner.cooperationTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {partner.cooperationTypes.slice(0, 3).map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs font-normal">{type}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="mb-10">
            <h3 className="text-base font-semibold mb-4">合作项目</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{PROJECT_PHASE_LABELS[project.phase]}</Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{project.type}</span>
                      </div>
                      <h4 className="font-semibold line-clamp-1 mb-2">{project.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Achievements */}
          <div className="mb-10">
            <h3 className="text-base font-semibold mb-4">合作成果</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredAchievements.map((ach) => (
                <Link key={ach.id} href="/achievements">
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{ACHIEVEMENT_TYPE_LABELS[ach.type]}</Badge>
                        {ach.partnerName && <span className="text-xs text-muted-foreground truncate">{ach.partnerName}</span>}
                      </div>
                      <h4 className="font-semibold line-clamp-1 mb-2">{ach.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{ach.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Experts */}
          <div className="mb-10">
            <h3 className="text-base font-semibold mb-4">专家资源库</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {featuredExperts.map((expert) => (
                <Link key={expert.id} href="/experts">
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm text-center">
                    <CardContent className="p-4">
                      <Avatar className="h-14 w-14 mx-auto mb-3">
                        <AvatarImage src={expert.avatar} />
                        <AvatarFallback className="text-sm bg-muted">{expert.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold text-sm truncate">{expert.name}</h4>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{expert.title}</p>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        <Badge variant="secondary" className="text-[10px] font-normal">{expert.field}</Badge>
                        {expert.rating && (
                          <Badge variant="outline" className="text-[10px] font-normal">{EXPERT_RATING_LABELS[expert.rating]}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Activities */}
          <div>
            <h3 className="text-base font-semibold mb-4">近期活动</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {activity.date.toLocaleDateString('zh-CN')}
                    </div>
                    <h4 className="font-semibold line-clamp-1 mb-2">{activity.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{activity.location}</span>
                      <Badge variant="default" className="text-xs">报名中</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 品牌展示 Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">品牌展示</h2>
              <p className="text-sm text-muted-foreground">人才培养、校企合作、专业建设等各领域品牌成果</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/brands">查看全部 <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Brand Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {brandCategories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.id} href={category.href}>
                  <Card className={`h-full hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group border ${category.borderColor} ${category.bgColor}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center mx-auto mb-2.5 shadow-sm`}>
                        <Icon className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <h3 className="font-medium text-sm">{category.title}</h3>
                      <p className="text-xl font-bold mt-0.5">{category.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Featured Talent */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">精选人才</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brands/talent">查看全部</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {employmentCases.slice(0, 6).map((case_) => (
                <Card key={case_.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="aspect-[4/3] bg-muted relative">
                    <img
                      src={case_.photo || "/placeholder.svg?height=180&width=240"}
                      alt={case_.studentName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-sm font-semibold truncate">{case_.studentName}</h4>
                    <p className="text-xs text-muted-foreground">{case_.major} | {case_.graduationYear}届</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground truncate max-w-[55%]">{case_.company}</span>
                      <Badge variant="secondary" className="text-[10px]">{case_.position}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Job Brands */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">岗位品牌</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brands/job">查看全部</Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredJobBrands.map((jb) => (
                <Link key={jb.id} href="/brands/job">
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-semibold truncate">{jb.name}</h4>
                        <Badge variant="outline" className="text-xs shrink-0">{jb.industry}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">{jb.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="text-primary font-semibold">{jb.averageSalary || '面议'}</span>
                        <span>需求 {jb.demandCount} 人</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Majors */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">特色专业</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brands/major">查看全部</Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {majorBrands.filter(m => m.level === "recommended").slice(0, 6).map((major) => (
                <Card key={major.id} className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold truncate">{major.name}</h4>
                          <Badge variant="default" className="text-[10px] h-4 px-1 shrink-0">推荐品牌</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{major.department}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">{major.introduction}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>在校生 <strong>{major.studentCount}</strong></span>
                      <span>就业率 <strong className="text-emerald-600">{major.employmentRate}%</strong></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Teachers */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">师资品牌</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brands/teacher">查看全部</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredTeachers.map((teacher) => (
                <Link key={teacher.id} href="/brands/teacher">
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar || "/placeholder.svg?height=48&width=48"}
                          alt={teacher.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm truncate">{teacher.name}</h4>
                          <p className="text-xs text-muted-foreground">{teacher.title}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <Badge variant="secondary" className="text-[10px] font-normal">{TEACHER_TYPE_LABELS[teacher.type]}</Badge>
                        <Badge variant="outline" className="text-[10px] font-normal">{teacher.department}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Culture Brands */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">文化思政品牌</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brands/culture">查看全部</Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCultureBrands.map((cb) => (
                <Link key={cb.id} href="/brands/culture">
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{CULTURE_TYPE_LABELS[cb.type]}</Badge>
                      </div>
                      <h4 className="font-semibold line-clamp-1 mb-2">{cb.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{cb.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 岗位大厅 Section */}
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">岗位大厅</h2>
              <p className="text-sm text-muted-foreground">汇聚优质企业资源，助力职业发展起航</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/jobs">查看全部 <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Job Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "在招岗位", value: publishedJobs.length },
              { label: "招聘企业", value: new Set(publishedJobs.map(j => j.partnerId)).size },
              { label: "招聘人数", value: publishedJobs.reduce((sum, j) => sum + j.headcount, 0) },
              { label: "急招岗位", value: publishedJobs.filter(j => j.isUrgent).length },
            ].map((s) => (
              <Card key={s.label} className="text-center border-0 shadow-sm">
                <CardContent className="py-6">
                  <p className="text-3xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured Talents */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">优质毕业生推荐</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brands/talent">查看全部</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredTalents.map((talent) => (
                <Card key={talent.id} className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={talent.avatar || "/placeholder.svg?height=48&width=48"}
                        alt={talent.studentName}
                        className="w-11 h-11 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">{talent.studentName}</h4>
                        <p className="text-xs text-muted-foreground">{talent.major}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">能力分 <strong>{talent.abilityScore}</strong></span>
                      {talent.employmentCompany ? (
                        <span className="text-xs text-emerald-600 truncate max-w-[55%]">{talent.employmentCompany}</span>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">求职中</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommended & Urgent Jobs */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recommended Jobs */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-base font-semibold">推荐岗位</h3>
              </div>
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={job.partnerLogo} />
                              <AvatarFallback className="text-xs bg-muted">{job.partnerName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h4 className="text-sm font-semibold truncate">{job.title}</h4>
                              <p className="text-xs text-muted-foreground truncate">{job.partnerName}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-primary font-semibold">
                              {job.salaryMin && job.salaryMax ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` : '面议'}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location.split('省')[1]?.slice(0, 3) || job.location.slice(0, 5)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Urgent Jobs */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-red-500" />
                <h3 className="text-base font-semibold">急招岗位</h3>
              </div>
              <div className="space-y-3">
                {urgentJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={job.partnerLogo} />
                              <AvatarFallback className="text-xs bg-muted">{job.partnerName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold truncate">{job.title}</h4>
                                <Badge variant="destructive" className="text-[10px] h-4 px-1">急招</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{job.partnerName}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-primary font-semibold">
                              {job.salaryMin && job.salaryMax ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` : '面议'}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location.split('省')[1]?.slice(0, 3) || job.location.slice(0, 5)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">加入产教融合生态圈</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8" asChild>
                <Link href="/contact">联系我们</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
