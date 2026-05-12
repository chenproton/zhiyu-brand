"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Search, Eye, Plus, Pencil, Trash2, Users, TrendingUp } from "lucide-react"
import { majorBrands } from "@/lib/mock-data"
import type { MajorBrand } from "@/lib/types"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"

function generateId() {
  return "mb-" + Math.random().toString(36).substr(2, 9)
}

function splitByComma(val: string): string[] {
  return val.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

// 从 majorBrands 构造可引用的专业源数据
const majors = majorBrands.map((mb) => ({
  id: mb.id,
  name: mb.name,
  department: mb.department,
}))

export default function MajorBrandPage() {
  const [data, setData] = useState<MajorBrand[]>(majorBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MajorBrand | null>(null)

  const [selectedMajorId, setSelectedMajorId] = useState<string>("")

  const [editForm, setEditForm] = useState<Partial<MajorBrand>>({})

  const departments = [...new Set(data.map((m) => m.department))]

  const filteredMajors = data.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || major.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const getBadgeVariant = (level: string) => {
    return "outline"
  }

  const handleQuoteSubmit = () => {
    if (!selectedMajorId) return
    const major = majors.find((m) => m.id === selectedMajorId)
    if (!major) return
    const newItem: MajorBrand = {
      id: generateId(),
      name: major.name,
      department: major.department,
      level: "standard",
      introduction: "",
      cultivationGoal: "",
      coreCourses: [],
      employmentDirections: [],
      cooperationPartners: [],
      featuredAchievements: [],
      studentCount: 0,
      employmentRate: 0,
      status: "draft",
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setData((prev) => [newItem, ...prev])
    setIsQuoteOpen(false)
    setSelectedMajorId("")
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该专业品牌吗？")) {
      setData((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const openEdit = (item: MajorBrand) => {
    setEditingItem(item)
    setEditForm({ ...item })
    setIsEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!editingItem) return
    setData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...(editForm as MajorBrand), updatedAt: new Date() }
          : item
      )
    )
    setIsEditOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">专业品牌管理</h1>
          <p className="text-muted-foreground">管理各专业的品牌展示内容</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索专业名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="品牌等级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="recommended">推荐品牌</SelectItem>
              <SelectItem value="key">重点品牌</SelectItem>
              <SelectItem value="standard">标准品牌</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsQuoteOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          引用专业
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredMajors.map((major) => (
          <Card key={major.id} className="text-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{major.name}</CardTitle>
                  <CardDescription className="mt-0.5">{major.department}</CardDescription>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {BRAND_LEVEL_LABELS[major.level]}
                  </Badge>
                  <Badge variant={major.status === "published" ? "secondary" : "outline"} className="text-xs">
                    {BRAND_STATUS_LABELS[major.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="text-muted-foreground line-clamp-1">{major.introduction}</p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {major.studentCount} 在校生
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground font-medium">{major.employmentRate}%</span> 就业率
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  {major.viewCount} 浏览
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {major.coreCourses.slice(0, 3).map((course) => (
                  <Badge key={course} variant="outline" className="text-xs font-normal">
                    {course}
                  </Badge>
                ))}
                {major.coreCourses.length > 3 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{major.coreCourses.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {major.cooperationPartners.slice(0, 2).map((partner) => (
                  <Badge key={partner} variant="secondary" className="text-xs font-normal">
                    {partner}
                  </Badge>
                ))}
                {major.cooperationPartners.length > 2 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    +{major.cooperationPartners.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {major.featuredAchievements.slice(0, 2).map((achievement) => (
                  <Badge key={achievement} variant="secondary" className="text-xs font-normal">
                    {achievement}
                  </Badge>
                ))}
                {major.featuredAchievements.length > 2 && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    +{major.featuredAchievements.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 border-t pt-4 mt-4">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => alert("预览功能开发中")}>
                  <Eye className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  预览
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(major)}>
                  <Pencil className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  编辑
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleDelete(major.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 引用专业 Dialog */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>引用专业</DialogTitle>
            <DialogDescription>从专业库中选择需要引用的专业</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label>选择专业</Label>
            <Select value={selectedMajorId} onValueChange={setSelectedMajorId}>
              <SelectTrigger>
                <SelectValue placeholder="请选择专业" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.name}（{major.department}）
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsQuoteOpen(false); setSelectedMajorId(""); }}>
              取消
            </Button>
            <Button onClick={handleQuoteSubmit} disabled={!selectedMajorId}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑 Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑专业品牌</DialogTitle>
            <DialogDescription>修改专业品牌的展示配置信息</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>专业名称</Label>
              <Input
                value={editForm.name || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">专业名称不可修改，修改仅影响品牌展示，不会回写专业库</p>
            </div>
            <div className="space-y-2">
              <Label>所属院系</Label>
              <Select
                value={editForm.department || ""}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, department: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择院系" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>品牌等级</Label>
              <Select
                value={editForm.level || "standard"}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, level: val as MajorBrand["level"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">推荐品牌</SelectItem>
                  <SelectItem value="key">重点品牌</SelectItem>
                  <SelectItem value="standard">标准品牌</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select
                value={editForm.status || "draft"}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, status: val as MajorBrand["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>在校生人数</Label>
              <Input
                type="number"
                value={editForm.studentCount ?? 0}
                onChange={(e) => setEditForm((prev) => ({ ...prev, studentCount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>就业率 (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={editForm.employmentRate ?? 0}
                onChange={(e) => setEditForm((prev) => ({ ...prev, employmentRate: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label>核心课程（逗号分隔）</Label>
              <Input
                value={editForm.coreCourses?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, coreCourses: splitByComma(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>就业方向（逗号分隔）</Label>
              <Input
                value={editForm.employmentDirections?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, employmentDirections: splitByComma(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>合作企业（逗号分隔）</Label>
              <Input
                value={editForm.cooperationPartners?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, cooperationPartners: splitByComma(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>特色成果（逗号分隔）</Label>
              <Input
                value={editForm.featuredAchievements?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, featuredAchievements: splitByComma(e.target.value) }))
                }
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>专业简介</Label>
              <Textarea
                value={editForm.introduction || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, introduction: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditSubmit}>
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
