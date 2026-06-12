'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, Briefcase, FileText, Plus, Pencil, Trash2 } from 'lucide-react'
import { employmentProjects } from '@/lib/mock-data'
import { EMPLOYMENT_PROJECT_TYPE_LABELS, EMPLOYMENT_PROJECT_STATUS_LABELS } from '@/lib/types'

const statusColors: Record<string, string> = {
  preparing: 'bg-yellow-100 text-yellow-800',
  ongoing: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
}

export default function EmploymentProjectsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return employmentProjects.filter((ep) => {
      if (search && !ep.name.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && ep.type !== typeFilter) return false
      if (statusFilter !== 'all' && ep.status !== statusFilter) return false
      return true
    })
  }, [search, typeFilter, statusFilter])

  const handleDelete = () => {
    if (deleteId) {
      // 实际项目中这里调用 API 删除
      const index = employmentProjects.findIndex((ep) => ep.id === deleteId)
      if (index !== -1) {
        employmentProjects.splice(index, 1)
      }
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">就业项目管理</h1>
          <p className="text-muted-foreground">春招/秋招/定向招聘/其他的项目化管理</p>
        </div>
        <Button asChild>
          <Link href="/admin/employment/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            新建项目
          </Link>
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">筹备中</p>
                <p className="text-3xl font-bold">
                  {employmentProjects.filter(ep => ep.status === 'preparing').length}
                </p>
              </div>
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-3xl font-bold">
                  {employmentProjects.filter(ep => ep.status === 'ongoing').length}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">岗位总数</p>
                <p className="text-3xl font-bold">
                  {employmentProjects.reduce((sum, ep) => sum + ep.jobCount, 0)}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选 */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="搜索项目名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
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

      {/* 项目列表 */}
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
                <TableHead>类型</TableHead>
                <TableHead>面向学生</TableHead>
                <TableHead>时间范围</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>岗位</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ep) => (
                <TableRow key={ep.id}>
                  <TableCell className="font-medium">{ep.name}</TableCell>
                  <TableCell>{EMPLOYMENT_PROJECT_TYPE_LABELS[ep.type]}</TableCell>
                  <TableCell>{ep.targetStudentGroups.join('、')}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {ep.startDate.toLocaleDateString('zh-CN')} ~ {ep.endDate.toLocaleDateString('zh-CN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[ep.status]}>
                      {EMPLOYMENT_PROJECT_STATUS_LABELS[ep.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-3.5 w-3.5" />
                      {ep.jobCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/employment/projects/${ep.id}`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          编辑
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(ep.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              删除后无法恢复，是否继续？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
