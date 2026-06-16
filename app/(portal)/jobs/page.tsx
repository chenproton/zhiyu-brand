"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Calendar, Briefcase, Users } from "lucide-react"
import { employmentProjects } from "@/lib/mock-data"
import { EMPLOYMENT_PROJECT_TYPE_LABELS, EMPLOYMENT_PROJECT_STATUS_LABELS } from "@/lib/types"

const statusColors: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
}

export default function EmploymentProjectsPortalPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredProjects = useMemo(() => {
    return employmentProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || project.type === typeFilter
      const matchesStatus = statusFilter === "all" || project.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, typeFilter, statusFilter])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">就业项目</h1>
            <p className="text-lg text-gray-300 mb-8">
              汇聚优质校企合作项目，助力职业发展起航
            </p>

            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="搜索项目名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
                {employmentProjects.reduce((sum, p) => sum + p.applicationCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">报名人数</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="项目类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="spring">春季招聘</SelectItem>
              <SelectItem value="autumn">秋季招聘</SelectItem>
              <SelectItem value="定向招聘">定向招聘</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="项目状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="preparing">筹备中</SelectItem>
              <SelectItem value="ongoing">进行中</SelectItem>
              <SelectItem value="ended">已结束</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>就业项目列表</CardTitle>
            <CardDescription>按招聘季组织的岗位发布与对接项目</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>项目类型</TableHead>
                  <TableHead>目标学生群体</TableHead>
                  <TableHead>起止时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>岗位数</TableHead>
                  <TableHead>报名人数</TableHead>
                  <TableHead>创建人</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-16">
                      没有找到符合条件的就业项目
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/jobs/project/${project.id}`)}
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{EMPLOYMENT_PROJECT_TYPE_LABELS[project.type]}</TableCell>
                      <TableCell>{project.targetStudentGroups.join('、')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {project.startDate.toLocaleDateString('zh-CN')} ~ {project.endDate.toLocaleDateString('zh-CN')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[project.status]}>
                          {EMPLOYMENT_PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Briefcase className="h-3.5 w-3.5" />
                          {project.jobCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3.5 w-3.5" />
                          {project.applicationCount}
                        </div>
                      </TableCell>
                      <TableCell>{project.createdBy || '—'}</TableCell>
                      <TableCell>{project.createdAt.toLocaleDateString('zh-CN')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
