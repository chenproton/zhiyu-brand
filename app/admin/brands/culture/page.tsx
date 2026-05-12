"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Eye, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cultureBrands } from "@/lib/mock-data"
import { CULTURE_TYPE_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"
import type { CultureBrand, BrandStatus } from "@/lib/types"

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const emptyForm = {
  name: "",
  type: "case" as CultureBrand["type"],
  description: "",
  relatedMajor: "",
  status: "draft" as BrandStatus,
}

export default function CultureBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [cultures, setCultures] = useState<CultureBrand[]>([...cultureBrands])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCulture, setEditingCulture] = useState<CultureBrand | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filteredCultures = cultures.filter((culture) => {
    const matchesSearch = culture.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || culture.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: CultureBrand["type"]) => {
    switch (type) {
      case "case":
        return "bg-blue-100 text-blue-700"
      case "resource":
        return "bg-emerald-100 text-emerald-700"
      case "activity":
        return "bg-amber-100 text-amber-700"
      case "award":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  function openAddDialog() {
    setEditingCulture(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEditDialog(culture: CultureBrand) {
    setEditingCulture(culture)
    setForm({
      name: culture.name,
      type: culture.type,
      description: culture.description,
      relatedMajor: culture.relatedMajor || "",
      status: culture.status,
    })
    setDialogOpen(true)
  }

  function handleSave() {
    if (editingCulture) {
      setCultures((prev) =>
        prev.map((c) =>
          c.id === editingCulture.id
            ? {
                ...c,
                ...form,
                relatedMajor: form.relatedMajor || undefined,
                updatedAt: new Date(),
              }
            : c
        )
      )
    } else {
      const newCulture: CultureBrand = {
        id: generateId("cb"),
        name: form.name,
        type: form.type,
        description: form.description,
        content: "",
        relatedMajor: form.relatedMajor || undefined,
        coverImage: "/placeholder.svg?height=200&width=300",
        status: form.status,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setCultures((prev) => [...prev, newCulture])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    if (confirm("确定要删除该内容吗？")) {
      setCultures((prev) => prev.filter((c) => c.id !== id))
    }
  }

  function toggleStatus(culture: CultureBrand) {
    const nextStatus = culture.status === "published" ? "draft" : "published"
    setCultures((prev) =>
      prev.map((c) =>
        c.id === culture.id ? { ...c, status: nextStatus, updatedAt: new Date() } : c
      )
    )
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
          <h1 className="text-2xl font-semibold text-foreground">文化思政品牌管理</h1>
          <p className="text-muted-foreground">管理思政案例、文化活动等品牌内容</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索内容名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="内容类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="case">典型案例</SelectItem>
              <SelectItem value="resource">思政资源</SelectItem>
              <SelectItem value="activity">文化活动</SelectItem>
              <SelectItem value="award">获奖成果</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          新增内容
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCultures.map((culture) => (
          <Card key={culture.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img
                src={culture.coverImage || "/placeholder.svg?height=200&width=300"}
                alt={culture.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge className={getTypeColor(culture.type)}>
                  {CULTURE_TYPE_LABELS[culture.type]}
                </Badge>
              </div>
              <Badge
                className="absolute top-2 right-2"
                variant={culture.status === "published" ? "default" : "secondary"}
              >
                {BRAND_STATUS_LABELS[culture.status]}
              </Badge>
            </div>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{culture.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {culture.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(culture)}>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(culture)}>
                      {culture.status === "published" ? "下架" : "发布"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(culture.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {culture.relatedMajor && (
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    {culture.relatedMajor}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{culture.viewCount}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  更新于 {culture.updatedAt.toLocaleDateString("zh-CN")}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCulture ? "编辑内容" : "新增内容"}</DialogTitle>
            <DialogDescription>
              {editingCulture ? "修改文化思政品牌内容" : "填写信息并添加新的品牌内容"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">名称</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="请输入内容名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-type">类型</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as CultureBrand["type"] })}
              >
                <SelectTrigger id="c-type">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="case">典型案例</SelectItem>
                  <SelectItem value="resource">思政资源</SelectItem>
                  <SelectItem value="activity">文化活动</SelectItem>
                  <SelectItem value="award">获奖成果</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-desc">描述</Label>
              <Textarea
                id="c-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="请输入内容描述"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-major">关联专业</Label>
              <Input
                id="c-major"
                value={form.relatedMajor}
                onChange={(e) => setForm({ ...form, relatedMajor: e.target.value })}
                placeholder="请输入关联专业（选填）"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-status">状态</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as BrandStatus })}
              >
                <SelectTrigger id="c-status">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="archived">已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
