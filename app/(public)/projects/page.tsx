'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FolderKanban, Building2, Calendar, Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectPhaseBadge, ProjectPublishStatusBadge } from '@/components/shared/status-badge'
import { projects } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'

const PROJECT_TYPES = [
  '人才培养项目',
  '技术研发项目',
  '基地建设项目',
  '技能竞赛项目',
  '创新创业项目',
  '师资培训项目',
  '课程开发项目',
]

const IMAGES = [
  "/images/landingpage/tech.jpg",
  "/images/landingpage/coding.jpg",
  "/images/landingpage/workshop.jpg",
  "/images/landingpage/factory.jpg",
  "/images/landingpage/office.jpg",
  "/images/landingpage/meeting.jpg",
]

function getImage(index: number) {
  return IMAGES[index % IMAGES.length]
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    phase: 'all',
    type: 'all',
  })

  const publishedProjects = useMemo(() => {
    return projects.filter((project) => project.publishStatus === 'published')
  }, [])

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.partnerName.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (filters.phase !== 'all' && project.phase !== filters.phase) return false
      if (filters.type !== 'all' && project.type !== filters.type) return false
      return true
    })
  }, [publishedProjects, search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      phase: 'all',
      type: 'all',
    })
  }

  const getMilestoneProgress = (milestones: typeof projects[0]['milestones']) => {
    if (!milestones || milestones.length === 0) return 0
    const completed = milestones.filter((m) => m.status === 'completed').length
    return Math.round((completed / milestones.length) * 100)
  }

  const hasActiveFilters = search || Object.values(filters).some((v) => v !== 'all')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-indigo-50/30">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-blue-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            合作项目
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            浏览产教融合平台上的各类合作项目
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl bg-white/80 backdrop-blur-sm mb-10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索项目名称、合作主体..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filters.phase} onValueChange={(v) => handleFilterChange('phase', v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部阶段" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部阶段</SelectItem>
                      {Object.entries(PROJECT_PHASE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="rounded-xl">
                      <X className="h-4 w-4 mr-1" />
                      清除筛选
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              共 <span className="font-bold text-slate-900">{filteredProjects.length}</span> 个合作项目
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProjects.map((project, index) => {
                const progress = getMilestoneProgress(project.milestones)
                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full flex flex-col hover:-translate-y-1">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={getImage(index)}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
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
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {project.partnerName}
                        </p>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed flex-1">{project.description}</p>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{project.startDate.toLocaleDateString('zh-CN')} 至 {project.endDate.toLocaleDateString('zh-CN')}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>里程碑进度</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <FolderKanban className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的合作项目</p>
              <Button variant="outline" className="rounded-full px-6" onClick={handleClearFilters}>
                清除筛选条件
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
