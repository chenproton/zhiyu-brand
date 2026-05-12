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
import { ArrowLeft, Search, Eye, Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
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
  })

  const [editForm, setEditForm] = useState<Partial<JobBrand>>({})

  const filteredJobs = data.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || job.level === levelFilter
    const matchesIndustry = industryFilter === "all" || job.industry === industryFilter
    return matchesSearch && matchesLevel && matchesIndustry
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
      abilityModel: [],
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
              <Button variant="outline" size="sm" onClick={() => alert("同步岗位功能开发中")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                同步岗位
              </Button>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>岗位名称</TableHead>
                <TableHead>所属行业</TableHead>
                <TableHead>品牌等级</TableHead>
                <TableHead>适用专业</TableHead>
                <TableHead>薪资范围</TableHead>
                <TableHead>需求量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>浏览量</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.name}</p>
                      <div className="flex gap-1 mt-1">
                        {job.featureTags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{job.industry}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(job.level)}>
                      {BRAND_LEVEL_LABELS[job.level]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {job.suitableMajors.slice(0, 2).map((major) => (
                        <Badge key={major} variant="secondary" className="text-xs">
                          {major}
                        </Badge>
                      ))}
                      {job.suitableMajors.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.suitableMajors.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-emerald-600 font-medium">{job.averageSalary}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{job.demandCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === "published" ? "default" : "secondary"}>
                      {BRAND_STATUS_LABELS[job.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{job.viewCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(job)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 引用岗位 Dialog */}
      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>引用岗位</DialogTitle>
            <DialogDescription>从岗位库中选择岗位，并进行品牌化配置</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
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

            <div className="space-y-2">
              <Label>岗位名称</Label>
              <Input
                value={quoteForm.name || ""}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>所属行业</Label>
              <Select
                value={quoteForm.industry || ""}
                onValueChange={(val) => setQuoteForm((prev) => ({ ...prev, industry: val }))}
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
                value={quoteForm.averageSalary || ""}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, averageSalary: e.target.value }))}
                placeholder="如 15-25K"
              />
            </div>
            <div className="space-y-2">
              <Label>需求量</Label>
              <Input
                type="number"
                value={quoteForm.demandCount ?? 0}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, demandCount: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label>适用专业（逗号分隔）</Label>
              <Input
                value={quoteForm.suitableMajors?.join(", ") || ""}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, suitableMajors: splitByComma(e.target.value) }))
                }
                placeholder="如 软件技术, 大数据技术"
              />
            </div>
            <div className="space-y-2">
              <Label>品牌等级</Label>
              <Select
                value={quoteForm.level || "standard"}
                onValueChange={(val) => setQuoteForm((prev) => ({ ...prev, level: val as JobBrand["level"] }))}
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
                onValueChange={(val) => setQuoteForm((prev) => ({ ...prev, status: val as JobBrand["status"] }))}
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
                value={quoteForm.featureTags?.join(", ") || ""}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, featureTags: splitByComma(e.target.value) }))
                }
                placeholder="如 发展空间大, 技术前沿"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>岗位描述</Label>
              <Textarea
                value={quoteForm.description || ""}
                onChange={(e) => setQuoteForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="请输入岗位品牌描述..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsQuoteOpen(false); resetQuoteForm(); }}>
              取消
            </Button>
            <Button onClick={handleQuoteSubmit} disabled={!selectedJobId || !quoteForm.name}>
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
            <div className="space-y-2">
              <Label>岗位名称</Label>
              <Input
                value={editForm.name || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
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
