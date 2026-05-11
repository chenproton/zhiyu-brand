"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Calendar, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { projects } from "@/lib/mock-data"
import { PROJECT_PHASE_LABELS, type ProjectPhase } from "@/lib/types"

const phaseColors: Record<ProjectPhase, string> = {
  initiation: "bg-blue-100 text-blue-800",
  execution: "bg-yellow-100 text-yellow-800",
  acceptance: "bg-orange-100 text-orange-800",
  closure: "bg-purple-100 text-purple-800",
  archived: "bg-gray-100 text-gray-800",
  terminated: "bg-red-100 text-red-800",
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [phaseFilter, setPhaseFilter] = useState<string>("all")

  const publishedProjects = useMemo(() => {
    return projects.filter((project) => project.publishStatus === 'published')
  }, [])

  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || project.type === typeFilter
      const matchesPhase = phaseFilter === "all" || project.phase === phaseFilter
      return matchesSearch && matchesType && matchesPhase
    })
  }, [publishedProjects, searchTerm, typeFilter, phaseFilter])

  const projectTypes = [...new Set(publishedProjects.map(p => p.type))]

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">合作项目</h1>
          <p className="text-muted-foreground">
            浏览产教融合平台上的各类合作项目
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目名称、描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="项目类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="项目阶段" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部阶段</SelectItem>
              {Object.entries(PROJECT_PHASE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{filteredProjects.length}</span> 个项目
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无符合条件的项目</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setTypeFilter("all"); setPhaseFilter("all") }}>
              清除筛选条件
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={phaseColors[project.phase]}>
                        {PROJECT_PHASE_LABELS[project.phase]}
                      </Badge>
                      <Badge variant="outline">{project.type}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {project.description || "暂无描述"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.startDate.toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>1 参与方</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
