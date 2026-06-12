"use client"

import { useState, useRef } from "react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Search, Eye, Plus, Pencil, Trash2, MoreHorizontal, Upload, X } from "lucide-react"
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
  coverImage: "",
}

export default function CultureBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [cultures, setCultures] = useState<CultureBrand[]>([...cultureBrands])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCulture, setEditingCulture] = useState<CultureBrand | null>(null)
  const [form, setForm] = useState(emptyForm)
  const coverFileRef = useRef<HTMLInputElement>(null)

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, coverImage: URL.createObjectURL(files[0]) }))
    }
    e.target.value = ""
  }

  const removeCoverImage = () => {
    setForm((prev) => ({ ...prev, coverImage: "" }))
  }

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
      coverImage: culture.coverImage || "",
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
                coverImage: form.coverImage || c.coverImage,
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
        coverImage: form.coverImage || "/placeholder.svg?height=200&width=300",
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>封面</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>关联专业</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>浏览量</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCultures.length > 0 ? (
              filteredCultures.map((culture) => (
                <TableRow key={culture.id}>
                  <TableCell>
                    <img
                      src={culture.coverImage || "/placeholder.svg?height=32&width=48"}
                      alt={culture.name}
                      className="h-8 w-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{culture.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(culture.type)}>
                      {CULTURE_TYPE_LABELS[culture.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{culture.description}</TableCell>
                  <TableCell>{culture.relatedMajor || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={culture.status === "published" ? "default" : "secondary"}>
                      {BRAND_STATUS_LABELS[culture.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{culture.viewCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {culture.updatedAt.toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(culture)}>
                          <Pencil className="h-4 w-4 mr-2" />
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  暂无符合条件的内容
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

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
              <Label>封面图片</Label>
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileChange}
              />
              {form.coverImage ? (
                <div className="relative w-full h-32 rounded-lg border overflow-hidden">
                  <img src={form.coverImage} alt="封面预览" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 flex flex-col items-center justify-center gap-2 border-dashed"
                  onClick={() => coverFileRef.current?.click()}
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">点击上传封面图片</span>
                </Button>
              )}
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
