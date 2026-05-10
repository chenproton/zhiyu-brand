import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  FileText,
  FolderKanban,
  Users,
  Award,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { dashboardStats, projects, activities, partners } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS, PARTNER_TYPE_LABELS } from '@/lib/types'
import { ProjectPhaseBadge, CooperationStatusBadge } from '@/components/shared/status-badge'

export default function AdminDashboardPage() {
  // Get recent projects
  const recentProjects = projects
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)

  // Get upcoming activities
  const upcomingActivities = activities
    .filter(a => a.status === 'published' && a.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3)

  return (
    <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合作主体</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalPartners}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {dashboardStats.activePartners} 个合作中
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合作协议</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalAgreements}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {dashboardStats.activeAgreements} 个生效中
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">合作项目</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalProjects}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {dashboardStats.activeProjects} 个进行中
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">专家资源</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalExperts}</p>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                产业导师、技术顾问
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">最近更新的项目</CardTitle>
                <CardDescription>项目进度动态</CardDescription>
              </div>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm font-medium text-gray-900 hover:underline truncate block"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.partnerName}
                      </p>
                    </div>
                    <ProjectPhaseBadge phase={project.phase} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partner Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">主体类型分布</CardTitle>
              <CardDescription>按类型统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dashboardStats.partnersByType).map(([type, count]) => {
                  if (count === 0) return null
                  const total = dashboardStats.totalPartners
                  const percentage = Math.round((count / total) * 100)
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {PARTNER_TYPE_LABELS[type as keyof typeof PARTNER_TYPE_LABELS]}
                        </span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Upcoming Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">即将举办的活动</CardTitle>
                <CardDescription>联盟活动安排</CardDescription>
              </div>
              <Link href="/admin/activities">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingActivities.length > 0 ? (
                <div className="space-y-4">
                  {upcomingActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-white border rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          {activity.date.toLocaleDateString('zh-CN', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold">
                          {activity.date.getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          已报名 {activity.currentParticipants}
                          {activity.maxParticipants && ` / ${activity.maxParticipants}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无即将举办的活动</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Phase Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">项目阶段分布</CardTitle>
              <CardDescription>按生命周期阶段统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dashboardStats.projectsByPhase).map(([phase, count]) => {
                  if (count === 0) return null
                  const total = dashboardStats.totalProjects
                  const percentage = Math.round((count / total) * 100)
                  return (
                    <div key={phase}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {PROJECT_PHASE_LABELS[phase as keyof typeof PROJECT_PHASE_LABELS]}
                        </span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">快捷操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/partners/new">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm">新增主体</span>
                </Button>
              </Link>
              <Link href="/admin/agreements/new">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">新增协议</span>
                </Button>
              </Link>
              <Link href="/admin/projects/new">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <FolderKanban className="h-5 w-5" />
                  <span className="text-sm">新增项目</span>
                </Button>
              </Link>
              <Link href="/admin/activities/new">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">发布活动</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
