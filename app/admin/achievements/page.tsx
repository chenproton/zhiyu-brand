"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Eye, Edit, Trash2, Briefcase, Map, BookOpen, Tag, MoreHorizontal } from "lucide-react"
import { ImportAchievementsButton } from "./_components/import-achievements-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { achievements } from "@/lib/mock-data"
import { ACHIEVEMENT_TYPE_LABELS } from "@/lib/types"
import type { Achievement, AchievementType } from "@/lib/types"

const typeIcons: Record<AchievementType, React.ReactNode> = {
  job: <Briefcase className="h-4 w-4" />,
  scene: <Map className="h-4 w-4" />,
  course: <BookOpen className="h-4 w-4" />,
  custom: <Tag className="h-4 w-4" />,
}

const typeColors: Record<AchievementType, string> = {
  job: "bg-blue-100 text-blue-800",
  scene: "bg-green-100 text-green-800",
  course: "bg-purple-100 text-purple-800",
  custom: "bg-orange-100 text-orange-800",
}

const TABS = [
  { value: 'all', label: '全部' },
  { value: 'job', label: '岗位' },
  { value: 'scene', label: '场景' },
  { value: 'course', label: '课程' },
  { value: 'custom', label: '自定义成果' },
] as const

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.partnerName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || achievement.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleDeleteClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false)
    setSelectedAchievement(null)
  }

  const statsByType = Object.entries(ACHIEVEMENT_TYPE_LABELS).map(([type, label]) => ({
    type,
    label,
    count: achievements.filter(a => a.type === type).length,
    icon: typeIcons[type as AchievementType],
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">成果管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理岗位成果、场景成果、课程成果及自定义成果
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ImportAchievementsButton />
          <Button asChild>
            <Link href="/admin/achievements/new">
              <Plus className="mr-2 h-4 w-4" />
              添加自定义成果
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsByType.map((stat) => (
          <Card key={stat.type}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${typeColors[stat.type as AchievementType]}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">成果列表</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab 筛选 */}
          <div className="flex gap-1 mb-4">
            {TABS.map((tab) => (
              <Button
                key={tab.value}
                variant={typeFilter === tab.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索成果名称、描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>成果名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>关联主体</TableHead>
                  <TableHead>关联项目</TableHead>
                  <TableHead>发布日期</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      暂无成果数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell>
                        <div className="font-medium">{achievement.name}</div>
                        {achievement.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {achievement.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={typeColors[achievement.type]}>
                          <span className="flex items-center gap-1">
                            {typeIcons[achievement.type]}
                            {ACHIEVEMENT_TYPE_LABELS[achievement.type]}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {achievement.partnerName ? (
                          <span className="text-sm">{achievement.partnerName}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {achievement.projectId ? (
                          <Link href={`/admin/projects/${achievement.projectId}`} className="text-primary hover:underline text-sm">
                            查看项目
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>{achievement.publishDate.toLocaleDateString('zh-CN')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {achievement.type === 'custom' ? (
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/achievements/${achievement.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  查看详情
                                </Link>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => alert('跳转到对应系统中查看')}>
                                <Eye className="h-4 w-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                            )}
                            {achievement.type === 'custom' && (
                              <DropdownMenuItem onClick={() => alert('编辑功能开发中')}>
                                <Edit className="h-4 w-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(achievement)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除成果「{selectedAchievement?.name}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
