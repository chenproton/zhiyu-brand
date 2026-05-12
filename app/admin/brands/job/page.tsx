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
import { ArrowLeft, Search, Eye, Plus, Pencil, Trash2, TrendingUp, Users, AlertCircle } from "lucide-react"
import { jobBrands, jobs, enterprises } from "@/lib/mock-data"
import type { JobBrand } from "@/lib/types"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS, INDUSTRIES } from "@/lib/types"

function generateId() {
  return "jb-" + Math.random().toString(36).substr(2, 9)
}

function splitByComma(val: string): string[] {
  return val.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

export default function JobBrandPage() {
  const [data, setData] = useState<JobBrand[]>(jobBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<JobBrand | null>(null)

  const [selectedJobId, setSelectedJobId] = useState("")
  const [quoteForm, setQuoteForm] = useState<Partial<JobBrand>>({
    level: "standard",
    status: "draft",
    featureTags: [],
    description: "",
    name: "",
    industry: "",
    suitableMajors: [],
    averageSalary: "",
    demandCount: 0,
    abilityModel: [],
  })

  const [editForm, setEditForm] = useState<Partial<JobBrand>>({})

  const filteredJobs = data.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || job.level === levelFilter
    const matchesIndustry = industryFilter === "all" || job.industry === industryFilter
    return matchesSearch && matchesLevel && matchesIndustry
  })

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId)
    const job = jobs.find((j) => j.id === jobId)
    if (!job) return
    const enterprise = enterprises.find((e) => e.id === job.partnerId)
    const salaryStr =
      job.salaryMin && job.salaryMax
        ? `${job.salaryMin}-${job.salaryMax}K`
        : job.salaryMin
          ? `${job.salaryMin}K`
          : ""
    setQuoteForm((prev) => ({
      ...prev,
      name: job.title,
      industry: enterprise?.industry || "",
      suitableMajors: job.suitableMajors,
      averageSalary: salaryStr,
      demandCount: job.headcount,
    }))
  }

  const resetQuoteForm = () => {
    setSelectedJobId("")
    setQuoteForm({
      level: "standard",
      status: "draft",
      featureTags: [],
      description: "",
      name: "",
      industry: "",
      suitableMajors: [],
      averageSalary: "",
      demandCount: 0,
      abilityModel: [],
    })
  }

  const handleQuoteSubmit = () => {
    if (!quoteForm.name || !selectedJobId) return
    const newItem: JobBrand = {
      id: generateId(),
      name: quoteForm.name || "",
      industry: quoteForm.industry || "",
      level: (quoteForm.level as JobBrand["level"]) || "standard",
      description: quoteForm.description || "",
      abilityModel: quoteForm.abilityModel || [],
      suitableMajors: quoteForm.suitableMajors || [],
      averageSalary: quoteForm.averageSalary,
      demandCount: quoteForm.demandCount || 0,
      featureTags: quoteForm.featureTags || [],
      status: (quoteForm.status as JobBrand["status"]) || "draft",
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setData((prev) => [newItem, ...prev])
    setIsQuoteOpen(false)
    resetQuoteForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该岗位品牌吗？")) {
      setData((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const openEdit = (item: JobBrand) => {
    setEditingItem(item)
    setEditForm({ ...item })
    setIsEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!editingItem) return
    setData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...(editForm as JobBrand), updatedAt: new Date() }
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
          <h1 className="text-2xl font-semibold text-foreground">岗位品牌管理</h1>
          <p className="text-muted-foreground">管理职业岗位的品牌化展示配置</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>岗位品牌列表</CardTitle>
              <CardDescription>从职业岗位平台同步岗位，进行品牌化配置</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsQuoteOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                引用岗位
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索岗位名称..."
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
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="所属行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <div className="aspect-[3/2] bg-muted relative overflow-hidden">
                  <img
                    src={job.coverImage || "/placeholder.svg?height=200&width=300"}
                    alt={job.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge variant="outline">
                      {BRAND_LEVEL_LABELS[job.level]}
                    </Badge>
                    <Badge variant={job.status === "published" ? "secondary" : "outline"}>
                      {BRAND_STATUS_LABELS[job.status]}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-base text-white">{job.name}</h3>
                    <p className="text-white/80 text-xs">{job.industry}</p>
                  </div>
                </div>
                <CardContent className="pt-3 pb-3">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-medium text-foreground text-sm">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        {job.averageSalary}
                      </div>
                      <p className="text-[10px] text-muted-foreground">薪资范围</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-medium text-foreground text-sm">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {job.demandCount}
                      </div>
                      <p className="text-[10px] text-muted-foreground">需求量</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-medium text-foreground text-sm">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {job.viewCount}
                      </div>
                      <p className="text-[10px] text-muted-foreground">浏览量</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {job.suitableMajors.slice(0, 2).map((major) => (
                        <Badge key={major} variant="outline" className="text-[10px]">
                          {major}
                        </Badge>
                      ))}
                      {job.suitableMajors.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{job.suitableMajors.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(job)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无符合条件的岗位品牌</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 引用岗位 Dialog */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>引用岗位</DialogTitle>
            <DialogDescription>从岗位库中选择岗位进行引用</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>选择源岗位</Label>
              <Select value={selectedJobId} onValueChange={handleSelectJob}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择岗位" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedJobId && (
              <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                <p><span className="text-muted-foreground">岗位名称：</span>{quoteForm.name}</p>
                <p><span className="text-muted-foreground">所属行业：</span>{quoteForm.industry || "-"}</p>
                <p><span className="text-muted-foreground">薪资范围：</span>{quoteForm.averageSalary || "-"}</p>
                <p><span className="text-muted-foreground">需求量：</span>{quoteForm.demandCount || 0}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsQuoteOpen(false); resetQuoteForm(); }}>
              取消
            </Button>
            <Button onClick={handleQuoteSubmit} disabled={!selectedJobId}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑 Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑岗位品牌</DialogTitle>
            <DialogDescription>修改岗位品牌的展示配置信息</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>岗位名称</Label>
              <Input
                value={editForm.name || ""}
                disabled
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                岗位名称不可修改，修改仅影响品牌展示，不会回写岗位库
              </p>
            </div>
            <div className="space-y-2">
              <Label>所属行业</Label>
              <Select
                value={editForm.industry || ""}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, industry: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择行业" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>薪资范围</Label>
              <Input
                value={editForm.averageSalary || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, averageSalary: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>需求量</Label>
              <Input
                type="number"
                value={editForm.demandCount ?? 0}
                onChange={(e) => setEditForm((prev) => ({ ...prev, demandCount: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label>适用专业（逗号分隔）</Label>
              <Input
                value={editForm.suitableMajors?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, suitableMajors: splitByComma(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>品牌等级</Label>
              <Select
                value={editForm.level || "standard"}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, level: val as JobBrand["level"] }))}
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
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, status: val as JobBrand["status"] }))}
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
              <Label>特色标签（逗号分隔）</Label>
              <Input
                value={editForm.featureTags?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, featureTags: splitByComma(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>能力要求（逗号分隔）</Label>
              <Input
                value={editForm.abilityModel?.join(", ") || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, abilityModel: splitByComma(e.target.value) }))
                }
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>岗位描述</Label>
              <Textarea
                value={editForm.description || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
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
