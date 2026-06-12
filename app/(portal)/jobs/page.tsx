"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Calendar,
  Briefcase,
  Building2,
  ArrowRight,
} from "lucide-react"
import { employmentProjects, enterprises } from "@/lib/mock-data"
import { EMPLOYMENT_PROJECT_TYPE_LABELS, EMPLOYMENT_PROJECT_STATUS_LABELS } from "@/lib/types"

const statusColors: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
}

export default function EmploymentProjectsPortalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredProjects = useMemo(() => {
    return employmentProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || project.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [searchTerm, typeFilter])

  const typeOptions = [
    { value: "all", label: "全部" },
    { value: "spring", label: EMPLOYMENT_PROJECT_TYPE_LABELS.spring },
    { value: "autumn", label: EMPLOYMENT_PROJECT_TYPE_LABELS.autumn },
    { value: "定向招聘", label: EMPLOYMENT_PROJECT_TYPE_LABELS['定向招聘'] },
    { value: "other", label: EMPLOYMENT_PROJECT_TYPE_LABELS['other'] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">就业项目</h1>
            <p className="text-lg text-gray-300 mb-8">
              汇聚优质校企合作项目，助力职业发展起航
            </p>
            
            {/* 搜索框 */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="搜索项目名称或招聘季..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base bg-white text-gray-900"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                搜索
              </Button>
            </div>

            {/* 快捷筛选 */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {typeOptions.map((opt) => (
                <Badge 
                  key={opt.value}
                  variant={typeFilter === opt.value ? "default" : "secondary"}
                  className="cursor-pointer px-4 py-1"
                  onClick={() => setTypeFilter(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 统计数字 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">{employmentProjects.length}</p>
              <p className="text-sm text-muted-foreground">就业项目</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {employmentProjects.filter(p => p.status === 'ongoing').length}
              </p>
              <p className="text-sm text-muted-foreground">进行中</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {employmentProjects.reduce((sum, p) => sum + p.jobCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">在招岗位</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {new Set(employmentProjects.flatMap(p => p.partnerIds)).size}
              </p>
              <p className="text-sm text-muted-foreground">合作企业</p>
            </CardContent>
          </Card>
        </div>

        {/* 项目列表 */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                没有找到符合条件的就业项目
              </CardContent>
            </Card>
          ) : (
            filteredProjects.map((project) => {
              const partnerNames = project.partnerIds
                .map((id) => enterprises.find((e) => e.id === id)?.name)
                .filter(Boolean)
                .slice(0, 3)
              const remainingCount = project.partnerIds.length - partnerNames.length

              return (
                <Link key={project.id} href={`/jobs/project/${project.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="py-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                              {project.name}
                            </h3>
                            <Badge className={statusColors[project.status]}>
                              {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
                            </Badge>
                            <Badge variant="outline">
                              {EMPLOYMENT_PROJECT_TYPE_LABELS[project.type]}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {project.description || `就业项目，面向${project.targetStudentGroups.join('、')}学生。`}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {project.startDate.toLocaleDateString('zh-CN')} ~ {project.endDate.toLocaleDateString('zh-CN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {project.jobCount} 个岗位
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {partnerNames.join('、')}
                              {remainingCount > 0 && ` 等 ${project.partnerIds.length} 家企业`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center ml-4">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
