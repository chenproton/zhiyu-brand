import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Users, Target, FileText, Trophy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projects, partners, achievements } from "@/lib/mock-data"
import { PROJECT_PHASE_LABELS, PARTNER_TYPE_LABELS, type ProjectPhase } from "@/lib/types"

const phaseColors: Record<ProjectPhase, string> = {
  initiation: "bg-blue-100 text-blue-800",
  execution: "bg-yellow-100 text-yellow-800",
  acceptance: "bg-orange-100 text-orange-800",
  closure: "bg-purple-100 text-purple-800",
  archived: "bg-gray-100 text-gray-800",
  terminated: "bg-red-100 text-red-800",
}

const phaseProgress: Record<ProjectPhase, number> = {
  initiation: 15,
  execution: 40,
  acceptance: 70,
  closure: 90,
  archived: 100,
  terminated: 0,
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projects.find(p => p.id === id)

  if (!project || project.publishStatus !== 'published') {
    notFound()
  }

  // Get related partner
  const relatedPartner = partners.find(p => p.id === project.partnerId)

  const relatedAchievements = achievements.filter(a => a.projectId === project.id)

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回项目列表
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className={phaseColors[project.phase]}>
              {PROJECT_PHASE_LABELS[project.phase]}
            </Badge>
            <Badge variant="outline">{project.type}</Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">{project.name}</h1>
          <p className="text-muted-foreground max-w-3xl">{project.description}</p>
        </div>

        {/* Progress & Info Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">项目进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>当前阶段: {PROJECT_PHASE_LABELS[project.phase]}</span>
                  <span>{phaseProgress[project.phase]}%</span>
                </div>
                <Progress value={phaseProgress[project.phase]} className="h-2" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PROJECT_PHASE_LABELS).map(([phase, label], index) => (
                  <div 
                    key={phase} 
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                      Object.keys(PROJECT_PHASE_LABELS).indexOf(project.phase) >= index
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {Object.keys(PROJECT_PHASE_LABELS).indexOf(project.phase) >= index && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">开始时间: </span>
                  <span>{project.startDate.toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
              {project.endDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">结束时间: </span>
                    <span>{project.endDate.toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">参与主体: </span>
                  <span>{relatedPartner ? 1 : 0} 个</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">成果产出: </span>
                  <span>{relatedAchievements.length} 项</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="participants" className="mt-8">
          <TabsList>
            <TabsTrigger value="participants" className="gap-2">
              <Users className="h-4 w-4" />
              参与主体
              <Badge variant="secondary">{relatedPartner ? 1 : 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="objectives" className="gap-2">
              <Target className="h-4 w-4" />
              项目产出
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              成果产出
              <Badge variant="secondary">{relatedAchievements.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-6">
            {!relatedPartner ? (
              <div className="text-center py-12 text-muted-foreground">
                暂无参与主体信息
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href={`/partners/${relatedPartner.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">
                            {relatedPartner.name}
                          </CardTitle>
                          <CardDescription>
                            {PARTNER_TYPE_LABELS[relatedPartner.type]}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">合作方</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPartner.description || "暂无简介"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="objectives" className="mt-6">
            {project.outputs && project.outputs.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {project.outputs.map((output, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{output}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                暂无项目产出信息
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            {relatedAchievements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                暂无成果产出
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedAchievements.map((achievement) => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.publishDate.toLocaleDateString('zh-CN')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="mt-3">
                        <Badge variant="secondary">{achievement.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
