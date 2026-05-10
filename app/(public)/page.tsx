import Link from "next/link"
import { ArrowRight, Building2, FolderKanban, Users, Trophy, Calendar, Handshake, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { partners, projects, experts, achievements, activities } from "@/lib/mock-data"
import { PARTNER_TYPE_LABELS, PROJECT_PHASE_LABELS } from "@/lib/types"

// Stats
const stats = [
  { label: "合作主体", value: partners.length, icon: Building2 },
  { label: "合作项目", value: projects.length, icon: FolderKanban },
  { label: "专家资源", value: experts.length, icon: Users },
  { label: "成果产出", value: achievements.length, icon: Trophy },
]

// Features
const features = [
  {
    icon: Handshake,
    title: "多元主体协同",
    description: "汇聚学校、企业、行业协会、产业园区、政府机构等多元合作主体，构建产教融合生态圈。",
  },
  {
    icon: Target,
    title: "项目全程管理",
    description: "从需求对接到成果验收，实现合作项目的全生命周期精细化管理。",
  },
  {
    icon: TrendingUp,
    title: "数据驱动决策",
    description: "提供多维度数据分析，助力合作效果评估和资源优化配置。",
  },
]

export default function HomePage() {
  const featuredPartners = partners.filter(p => p.status === "active").slice(0, 6)
  const featuredProjects = projects.slice(0, 3)
  const upcomingActivities = activities.filter(a => a.status === "published").slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              产业联盟与人资品牌服务平台
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
              搭建产教融合桥梁
              <br />
              <span className="text-muted-foreground">共育产业英才</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              整合学校、企业、行业协会、产业园区等多元主体资源，构建产教深度融合的协同育人新生态，助力区域产业高质量发展。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/partners">
                  浏览合作主体
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">查看合作项目</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-background border">
                    <stat.icon className="h-6 w-6 text-foreground" />
                  </div>
                </div>
                <div className="text-3xl font-bold">{stat.value}+</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">平台特色</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              依托数字化平台，实现产教资源的高效对接与协同管理
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted">
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">合作主体</h2>
              <p className="text-muted-foreground">来自各行各业的优质合作伙伴</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/partners">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPartners.map((partner) => (
              <Link key={partner.id} href={`/partners/${partner.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <CardDescription>{partner.industry}</CardDescription>
                      </div>
                      <Badge variant="outline">{PARTNER_TYPE_LABELS[partner.type]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {partner.description}
                    </p>
                    {partner.cooperationTypes && partner.cooperationTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {partner.cooperationTypes.slice(0, 3).map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">合作项目</h2>
              <p className="text-muted-foreground">正在进行中的产教融合项目</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projects">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {PROJECT_PHASE_LABELS[project.phase]}
                      </Badge>
                    </div>
                    <CardDescription>{project.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.startDate.toLocaleDateString('zh-CN')} - {project.endDate ? project.endDate.toLocaleDateString('zh-CN') : "进行中"}</span>
                      <span>1 个参与方</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Activities */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">近期活动</h2>
              <p className="text-muted-foreground">即将举办的产教融合活动</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/activities">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {activity.date.toLocaleDateString('zh-CN')}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{activity.location}</span>
                    <Badge variant="default">
                      报名中
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">加入产教融合生态圈</h2>
            <p className="text-muted-foreground mb-8">
              无论您是高校、企业、行业协会还是产业园区，都可以加入我们的平台，共同推动产教深度融合发展。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">联系我们</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
