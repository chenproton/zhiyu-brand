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

export default function MajorBrandPage() {
  const [data, setData] = useState<MajorBrand[]>(majorBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MajorBrand | null>(null)

  const [quoteForm, setQuoteForm] = useState<Partial<MajorBrand>>({
    name: "",
    department: "",
    level: "standard",
    introduction: "",
    cultivationGoal: "",
    studentCount: 0,
    employmentRate: 0,
    coreCourses: [],
    employmentDirections: [],
    cooperationPartners: [],
    featuredAchievements: [],
    status: "draft",
  })

  const [editForm, setEditForm] = useState<Partial<MajorBrand>>({})

  const departments = [...new Set(data.map((m) => m.department))]

  const filteredMajors = data.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || major.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "recommended":
        return "default"
      case "key":
        return "secondary"
      default:
        return "outline"
    }
  }

  const resetQuoteForm = () => {
    setQuoteForm({
      name: "",
      department: "",
      level: "standard",
      introduction: "",
      cultivationGoal: "",
      studentCount: 0,
      employmentRate: 0,
      coreCourses: [],
      employmentDirections: [],
      cooperationPartners: [],
      featuredAchievements: [],
      status: "draft",
    })
  }

  const handleQuoteSubmit = () => {
    if (!quoteForm.name) return
    const newItem: MajorBrand = {
      id: generateId(),
      name: quoteForm.name || "",
      department: quoteForm.department || "",
      level: (quoteForm.level as MajorBrand["level"]) || "standard",
      introduction: quoteForm.introduction || "",
      cultivationGoal: quoteForm.cultivationGoal || "",
      coreCourses: quoteForm.coreCourses || [],
      employmentDirections: quoteForm.employmentDirections || [],
      cooperationPartners: quoteForm.cooperationPartners || [],
      featuredAchievements: quoteForm.featuredAchievements || [],
      studentCount: quoteForm.studentCount || 0,
      employmentRate: quoteForm.employmentRate || 0,
      status: (quoteForm.status as MajorBrand["status"]) || "draft",
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setData((prev) => [newItem, ...prev])
    setIsQuoteOpen(false)
    resetQuoteForm()
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

      <div className="grid gap-4 md:grid-cols-2">
        {filteredMajors.map((major) => (
          <Card key={major.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{major.name}</CardTitle>
                  <CardDescription className="mt-1">{major.department}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Badge variant={getBadgeVariant(major.level)}>
                    {BRAND_LEVEL_LABELS[major.level]}
                  </Badge>
                  <Badge variant={major.status === "published" ? "default" : "secondary"}>
                    {BRAND_STATUS_LABELS[major.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{major.introduction}</p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {major.studentCount} 在校生
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  {major.employmentRate}% 就业率
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {major.viewCount} 浏览
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {major.coreCourses.slice(0, 4).map((course) => (
                  <Badge key={course} variant="outline" className="text-xs">
                    {course}
                  </Badge>
                ))}
                {major.coreCourses.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{major.coreCourses.length - 4}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {major.cooperationPartners.map((partner) => (
                  <Badge key={partner} variant="secondary" className="text-xs">
                    {partner}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {major.featuredAchievements.map((achievement) => (
                  <Badge key={achievement} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">
                    {achievement}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => alert("预览功能开发中")}>
                  <Eye className="h-4 w-4 mr-1" />
                  预览
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(major)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  编辑
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(major.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 引用专业 Dialog */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>引用专业</DialogTitle>
            <DialogDescription>手动填写专业品牌信息</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>专业名称</Label>
              <Input
                value={quoteForm.name || ""}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="如 人工智能应用技术"
              />
            </div>
            <div className="space-y-2">
              <Label>所属院系</Label>
              <Select
                value={quoteForm.department || ""}
                onValueChange={(val) => setQuoteForm((prev) => ({ ...prev, department: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择或输入院系" />
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
                value={quoteForm.level || "standard"}
                onValueChange={(val) => setQuoteForm((prev) => ({ ...prev, level: val as MajorBrand["level"] }))}
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
                value={quoteForm.status || "draft"}
                onValueChange={(val) => setQuoteForm((prev) => ({ ...prev, status: val as MajorBrand["status"] }))}
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
                value={quoteForm.studentCount ?? 0}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, studentCount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>就业率 (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={quoteForm.employmentRate ?? 0}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, employmentRate: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label>核心课程（逗号分隔）</Label>
              <Input
                value={quoteForm.coreCourses?.join(", ") || ""}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, coreCourses: splitByComma(e.target.value) }))
                }
                placeholder="如 Python程序设计, 机器学习基础"
              />
            </div>
            <div className="space-y-2">
              <Label>就业方向（逗号分隔）</Label>
              <Input
                value={quoteForm.employmentDirections?.join(", ") || ""}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, employmentDirections: splitByComma(e.target.value) }))
                }
                placeholder="如 算法工程师, 数据分析师"
              />
            </div>

            <div className="space-y-2">
              <Label>合作企业（逗号分隔）</Label>
              <Input
                value={quoteForm.cooperationPartners?.join(", ") || ""}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, cooperationPartners: splitByComma(e.target.value) }))
                }
                placeholder="如 苏州智联科技有限公司"
              />
            </div>
            <div className="space-y-2">
              <Label>特色成果（逗号分隔）</Label>
              <Input
                value={quoteForm.featuredAchievements?.join(", ") || ""}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, featuredAchievements: splitByComma(e.target.value) }))
                }
                placeholder="如 省级特色专业, 教育部1+X试点"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>专业简介</Label>
              <Textarea
                value={quoteForm.introduction || ""}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, introduction: e.target.value }))}
                rows={3}
                placeholder="请输入专业简介..."
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>培养目标</Label>
              <Textarea
                value={quoteForm.cultivationGoal || ""}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, cultivationGoal: e.target.value }))}
                rows={3}
                placeholder="请输入培养目标..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsQuoteOpen(false); resetQuoteForm(); }}>
              取消
            </Button>
            <Button onClick={handleQuoteSubmit} disabled={!quoteForm.name}>
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
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
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
            <div className="col-span-2 space-y-2">
              <Label>培养目标</Label>
              <Textarea
                value={editForm.cultivationGoal || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, cultivationGoal: e.target.value }))}
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
