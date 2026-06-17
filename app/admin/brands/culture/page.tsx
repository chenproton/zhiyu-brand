"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TableRowActions } from "@/components/admin/table-row-actions"
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
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import { Plus, Pencil, Trash2, Upload, X, FileText } from "lucide-react"
import { cultureBrands } from "@/lib/mock-data"
import { CULTURE_TYPE_LABELS } from "@/lib/types"
import type { CultureBrand } from "@/lib/types"
import { Switch } from "@/components/ui/switch"
import { PublicDisplaySwitch } from "@/components/shared/public-display-switch"

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const emptyForm = {
  name: "",
  type: "case" as CultureBrand["type"],
  description: "",
  relatedMajor: "",
  relatedLink: "",
  isPublicDisplay: true,
  coverImage: "",
  attachments: [] as string[],
}

export default function CultureBrandPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
  })
  const [cultures, setCultures] = useState<CultureBrand[]>([...cultureBrands])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCulture, setEditingCulture] = useState<CultureBrand | null>(null)
  const [form, setForm] = useState(emptyForm)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const attachmentFileRef = useRef<HTMLInputElement>(null)

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

  const handleAttachmentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...names] }))
    e.target.value = ""
  }

  const removeAttachment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const filteredCultures = cultures.filter((culture) => {
    const matchesSearch = culture.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filters.type === "all" || culture.type === filters.type
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
      relatedLink: culture.relatedLink || "",
      isPublicDisplay: culture.isPublicDisplay ?? culture.status === "published",
      coverImage: culture.coverImage || "",
      attachments: culture.attachments || [],
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
                relatedLink: form.relatedLink || undefined,
                coverImage: form.coverImage || c.coverImage,
                attachments: form.attachments.length > 0 ? form.attachments : undefined,
                status: form.isPublicDisplay ? "published" : "draft",
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
        relatedLink: form.relatedLink || undefined,
        coverImage: form.coverImage || "/placeholder.svg?height=200&width=300",
        attachments: form.attachments.length > 0 ? form.attachments : undefined,
        isPublicDisplay: form.isPublicDisplay,
        status: form.isPublicDisplay ? "published" : "draft",
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ type: "all" })
  }

  const filterConfigs = [
    {
      key: "type",
      label: "全部类型",
      options: [
        { value: "case", label: "典型案例" },
        { value: "resource", label: "思政资源" },
        { value: "activity", label: "文化活动" },
        { value: "award", label: "获奖成果" },
      ],
    },
  ]

  const columns = [
    {
      key: "cover",
      title: "封面",
      render: (culture: CultureBrand) => (
        <img
          src={culture.coverImage || "/placeholder.svg?height=32&width=48"}
          alt={culture.name}
          className="h-8 w-12 object-cover rounded"
        />
      ),
    },
    { key: "name", title: "名称", render: (culture: CultureBrand) => <span className="font-medium">{culture.name}</span> },
    {
      key: "isPublicDisplay",
      title: "前台展示",
      render: (culture: CultureBrand) => (
        <PublicDisplaySwitch
          checked={culture.isPublicDisplay ?? culture.status === "published"}
          onChange={(checked) => {
            setCultures((prev) =>
              prev.map((c) =>
                c.id === culture.id
                  ? { ...c, isPublicDisplay: checked, status: checked ? "published" : "draft", updatedAt: new Date() }
                  : c
              )
            )
          }}
        />
      ),
    },
    {
      key: "type",
      title: "类型",
      render: (culture: CultureBrand) => (
        <Badge className={getTypeColor(culture.type)}>{CULTURE_TYPE_LABELS[culture.type]}</Badge>
      ),
    },
    { key: "description", title: "描述", render: (culture: CultureBrand) => <span className="max-w-xs truncate">{culture.description}</span> },
    { key: "relatedMajor", title: "面向专业", render: (culture: CultureBrand) => culture.relatedMajor || "-" },
    {
      key: "updatedAt",
      title: "更新时间",
      render: (culture: CultureBrand) => <span className="text-sm">{culture.updatedAt.toLocaleDateString("zh-CN")}</span>,
    },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (culture: CultureBrand) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEditDialog(culture)}>
            <Pencil className="mr-1 h-3 w-3" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDelete(culture.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <AdminListPage
      title="文化思政品牌管理"
      subtitle="管理思政案例、文化活动等品牌内容"
      count={filteredCultures.length}
      countLabel="条内容"
      backHref="/admin/brands"
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索内容名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-1" />
          新增内容
        </Button>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredCultures}
        rowKey={(c) => c.id}
        emptyText="暂无符合条件的内容"
      />

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
              <FakeRichTextEditor
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="请输入内容描述"
                minHeight="120px"
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
              <Label>附件上传</Label>
              <input
                ref={attachmentFileRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleAttachmentFileChange}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => attachmentFileRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                点击上传附件
              </Button>
              <p className="text-xs text-muted-foreground">可上传视频、PDF、图片</p>
              {form.attachments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {form.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{file}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-link">相关链接</Label>
              <Input
                id="c-link"
                value={form.relatedLink}
                onChange={(e) => setForm({ ...form, relatedLink: e.target.value })}
                placeholder="请输入 https 链接"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-major">面向专业</Label>
              <Input
                id="c-major"
                value={form.relatedMajor}
                onChange={(e) => setForm({ ...form, relatedMajor: e.target.value })}
                placeholder="请输入面向专业（选填）"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="c-isPublicDisplay" className="flex-1">前台展示</Label>
              <Switch
                id="c-isPublicDisplay"
                checked={form.isPublicDisplay}
                onCheckedChange={(checked) => setForm({ ...form, isPublicDisplay: checked })}
              />
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
    </AdminListPage>
  )
}
