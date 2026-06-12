"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowLeft, Search, MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react"
import { jobBrands, jobs, enterprises } from "@/lib/mock-data"
import type { JobBrand, Job } from "@/lib/types"
import { BRAND_STATUS_LABELS, INDUSTRIES, JOB_CATEGORY_LABELS, SECONDARY_COLLEGES } from "@/lib/types"
import {
  JobActionButtons,
  NonTeachingJobDialog,
  TeachingJobDialog,
} from "@/components/admin/job-brand-tools"

function generateId() {
  return "jb-" + Math.random().toString(36).substr(2, 9)
}

function splitByComma(val: string): string[] {
  return val.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

const virtualPartner = { id: "virtual", name: "岗位品牌", logo: "" }

export default function JobBrandPage() {
  const [data, setData] = useState<JobBrand[]>(jobBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<JobBrand | null>(null)

  const [teachingOpen, setTeachingOpen] = useState(false)
  const [nonTeachingOpen, setNonTeachingOpen] = useState(false)

  const [editForm, setEditForm] = useState<Partial<JobBrand>>({})

  const filteredJobs = data.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || job.level === levelFilter
    const matchesIndustry = industryFilter === "all" || job.industry === industryFilter
    return matchesSearch && matchesLevel && matchesIndustry
  })

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

  const convertJobToJobBrand = (job: Job, category: "teaching" | "non-teaching"): JobBrand => {
    const salaryStr =
      job.salaryMin && job.salaryMax
        ? `${job.salaryMin}-${job.salaryMax}K`
        : job.salaryMin
          ? `${job.salaryMin}K`
          : ""
    return {
      id: generateId(),
      name: job.title,
      industry: job.industry || "",
      level: "standard",
      description: job.description || "",
      abilityModel: [],
      suitableMajors: job.suitableMajors || [],
      averageSalary: salaryStr,
      demandCount: job.headcount || 1,
      featureTags: [],
      status: "draft",
      viewCount: 0,
      jobCategory: category,
      secondaryCollege: job.secondaryCollege,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  const handleSaveTeaching = (job: Job) => {
    const newItem = convertJobToJobBrand(job, "teaching")
    setData((prev) => [newItem, ...prev])
    setTeachingOpen(false)
  }

  const handleSaveNonTeaching = (job: Job) => {
    const newItem = convertJobToJobBrand(job, "non-teaching")
    setData((prev) => [newItem, ...prev])
    setNonTeachingOpen(false)
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
              <JobActionButtons
                onAddTeaching={() => setTeachingOpen(true)}
                onAddNonTeaching={() => setNonTeachingOpen(true)}
              />
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
                <TableHead>岗位分类</TableHead>
                <TableHead>关联二级学院</TableHead>
                <TableHead>薪资范围</TableHead>
                <TableHead>需求量</TableHead>
                <TableHead>适用专业</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[80px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>{job.industry}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {JOB_CATEGORY_LABELS[job.jobCategory || "non-teaching"]}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.secondaryCollege || "-"}</TableCell>
                    <TableCell>{job.averageSalary || "-"}</TableCell>
                    <TableCell>{job.demandCount ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
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
                        {job.suitableMajors.length === 0 && "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={job.status === "published" ? "secondary" : "outline"}>
                        {BRAND_STATUS_LABELS[job.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(job)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(job.id)}>
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
                    暂无符合条件的岗位品牌
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 引用教学岗位 Dialog */}
      <TeachingJobDialog
        open={teachingOpen}
        onOpenChange={setTeachingOpen}
        partner={virtualPartner}
        onSave={handleSaveTeaching}
        description="从岗位库中选择教学岗位，保存后添加到岗位品牌列表。"
      />

      {/* 添加非教学岗位 Dialog */}
      <NonTeachingJobDialog
        open={nonTeachingOpen}
        onOpenChange={setNonTeachingOpen}
        partner={virtualPartner}
        onSave={handleSaveNonTeaching}
        description="填写岗位基础信息，保存后添加到岗位品牌列表。"
      />

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
              <Label>岗位分类</Label>
              <Select
                value={editForm.jobCategory || "non-teaching"}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, jobCategory: val as JobBrand["jobCategory"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teaching">教学岗位</SelectItem>
                  <SelectItem value="non-teaching">非教学岗位</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>关联二级学院</Label>
              <Select
                value={editForm.secondaryCollege || ""}
                onValueChange={(val) => setEditForm((prev) => ({ ...prev, secondaryCollege: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择二级学院" />
                </SelectTrigger>
                <SelectContent>
                  {SECONDARY_COLLEGES.map((college) => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
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
