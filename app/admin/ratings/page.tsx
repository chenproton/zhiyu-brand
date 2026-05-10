'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Star, TrendingUp, Award, Building2, FolderKanban } from 'lucide-react'
import { partners, projects } from '@/lib/mock-data'
import { COOPERATION_RATING_LABELS, PROJECT_PHASE_LABELS } from '@/lib/types'

const ratingColors: Record<string, string> = {
  strategic: 'bg-emerald-100 text-emerald-800',
  deep: 'bg-blue-100 text-blue-800',
  general: 'bg-gray-100 text-gray-800',
}

export default function RatingsPage() {
  const [activeTab, setActiveTab] = useState<'partner' | 'project'>('partner')

  const ratedProjects = useMemo(() => {
    return projects.filter(p => p.rating !== undefined)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">合作评级管理</h1>
          <p className="text-muted-foreground">合作主体评级与项目质量评级</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">战略合作主体</p>
                <p className="text-3xl font-bold">
                  {partners.filter(p => p.rating === 'strategic').length}
                </p>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">深度合作主体</p>
                <p className="text-3xl font-bold">
                  {partners.filter(p => p.rating === 'deep').length}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已评级项目</p>
                <p className="text-3xl font-bold">{ratedProjects.length}</p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均项目评分</p>
                <p className="text-3xl font-bold">
                  {ratedProjects.length > 0
                    ? (ratedProjects.reduce((sum, p) => sum + (p.rating || 0), 0) / ratedProjects.length).toFixed(1)
                    : '-'}
                </p>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 切换标签 */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === 'partner' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('partner')}
        >
          <Building2 className="h-4 w-4 mr-2" />
          合作主体评级
        </Button>
        <Button
          variant={activeTab === 'project' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('project')}
        >
          <FolderKanban className="h-4 w-4 mr-2" />
          合作项目评级
        </Button>
      </div>

      {/* 主体评级 */}
      {activeTab === 'partner' && (
        <Card>
          <CardHeader>
            <CardTitle>合作主体评级列表</CardTitle>
            <CardDescription>按合作深度与贡献度对合作主体进行综合评级</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>主体名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>当前评级</TableHead>
                  <TableHead>合作状态</TableHead>
                  <TableHead>关联项目数</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{partner.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={ratingColors[partner.rating]}>
                        {COOPERATION_RATING_LABELS[partner.rating]}
                      </Badge>
                    </TableCell>
                    <TableCell>{partner.status}</TableCell>
                    <TableCell>
                      {projects.filter(p => p.partnerId === partner.id).length}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">调整评级</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 项目评级 */}
      {activeTab === 'project' && (
        <Card>
          <CardHeader>
            <CardTitle>合作项目评级列表</CardTitle>
            <CardDescription>对已结项项目进行质量评级</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>合作主体</TableHead>
                  <TableHead>当前阶段</TableHead>
                  <TableHead>项目评分</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.partnerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{PROJECT_PHASE_LABELS[project.phase]}</Badge>
                    </TableCell>
                    <TableCell>
                      {project.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-medium">{project.rating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">未评级</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        {project.rating ? '修改评级' : '添加评级'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
