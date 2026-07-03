"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
import { TableRowActions } from "@/components/admin/table-row-actions"
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
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import { Pencil, Trash2, AlertCircle } from "lucide-react"
import { jobBrands } from "@/lib/mock-data"
import type { JobBrand, Job } from "@/lib/types"
import { INDUSTRIES, JOB_CATEGORY_LABELS, SECONDARY_COLLEGES, MAJORS } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  JobActionButtons,
  NonTeachingJobDialog,
  TeachingJobDialog,
} from "@/components/admin/job-brand-tools"
import { PublicDisplaySwitch } from "@/components/shared/public-display-switch"

function generateId() {
  return "jb-" + Math.random().toString(36).substr(2, 9)
}

function splitByComma(val: string): string[] {
  return val.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

const virtualPartner = { id: "virtual", name: "岗位品牌", logo: "" }

export default function JobBrandPage() {
  const [data, setData] = useState<JobBrand[]>(jobBrands)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    industry: "all",
  })

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<JobBrand | null>(null)

  const [teachingOpen, setTeachingOpen] = useState(false)
  const [nonTeachingOpen, setNonTeachingOpen] = useState(false)

  const [editForm, setEditForm] = useState<Partial<JobBrand>>({})

  const filteredJobs = data.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(search.toLowerCase())
    const matchesIndustry = filters.industry === "all" || job.industry === filters.industry
    return matchesSearch && matchesIndustry
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ industry: "all" })
  }

  const filterConfigs = [
    {
      key: "industry",
      label: "全部行业",
      options: INDUSTRIES.map((industry) => ({ value: industry, label: industry })),
    },
  ]

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
      isPublicDisplay: true,
      status: "published",
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

  const columns = [
    { key: "name", title: "岗位名称", render: (job: JobBrand) => <span className="font-medium">{job.name}</span> },
    {
      key: "isPublicDisplay",
      title: "前台展示",
      render: (job: JobBrand) => (
        <PublicDisplaySwitch
          checked={job.isPublicDisplay ?? job.status === "published"}
          onChange={(checked) => {
            setData((prev) =>
              prev.map((item) =>
                item.id === job.id
                  ? { ...item, isPublicDisplay: checked, status: checked ? "published" : "draft", updatedAt: new Date() }
                  : item
              )
            )
          }}
        />
      ),
    },
    { key: "industry", title: "所属行业", render: (job: JobBrand) => job.industry },
    {
      key: "jobCategory",
      title: "岗位分类",
      render: (job: JobBrand) => (
        <Badge variant="outline">{JOB_CATEGORY_LABELS[job.jobCategory || "non-teaching"]}</Badge>
      ),
    },
    { key: "secondaryCollege", title: "关联二级学院", render: (job: JobBrand) => job.secondaryCollege || "-" },
    { key: "averageSalary", title: "薪资范围", render: (job: JobBrand) => job.averageSalary || "-" },
    { key: "demandCount", title: "需求量", render: (job: JobBrand) => job.demandCount ?? 0 },
    {
      key: "suitableMajors",
      title: "面向专业",
      render: (job: JobBrand) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {job.suitableMajors.slice(0, 2).map((major) => (
            <Badge key={major} variant="outline" className="text-[10px]">{major}</Badge>
          ))}
          {job.suitableMajors.length > 2 && (
            <Badge variant="outline" className="text-[10px]">+{job.suitableMajors.length - 2}</Badge>
          )}
          {job.suitableMajors.length === 0 && "-"}
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (job: JobBrand) => (
        <TableRowActions>
          {job.jobCategory !== "teaching" && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEdit(job)}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDelete(job.id)}
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
      title="岗位品牌管理"
      subtitle="管理职业岗位的品牌化展示配置"
      count={filteredJobs.length}
      countLabel="个岗位品牌"
      backHref="/admin/brands"
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索岗位名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <JobActionButtons
          onAddTeaching={() => setTeachingOpen(true)}
          onAddNonTeaching={() => setNonTeachingOpen(true)}
        />
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredJobs}
        rowKey={(j) => j.id}
        emptyText="暂无符合条件的岗位品牌"
      />

      <TeachingJobDialog
        open={teachingOpen}
        onOpenChange={setTeachingOpen}
        partner={virtualPartner}
        onSave={handleSaveTeaching}
        description="从岗位库中选择教学岗位，保存后添加到岗位品牌列表。"
      />

      <NonTeachingJobDialog
        open={nonTeachingOpen}
        onOpenChange={setNonTeachingOpen}
        partner={virtualPartner}
        onSave={handleSaveNonTeaching}
        description="填写岗位基础信息，保存后添加到岗位品牌列表。"
      />

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑岗位品牌</DialogTitle>
            <DialogDescription>修改岗位品牌的展示配置信息</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label>岗位名称</Label>
              <Input value={editForm.name || ""} disabled />
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
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
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
            <div className="col-span-2 space-y-2">
              <Label>面向专业</Label>
              <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {MAJORS.map((major) => (
                    <label
                      key={major}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={editForm.suitableMajors?.includes(major) ?? false}
                        onCheckedChange={(checked) => {
                          const current = editForm.suitableMajors || []
                          setEditForm((prev) => ({
                            ...prev,
                            suitableMajors:
                              checked === true
                                ? [...current, major]
                                : current.filter((m) => m !== major),
                          }))
                        }}
                      />
                      <span className="truncate">{major}</span>
                    </label>
                  ))}
                </div>
              </div>
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
              <Label htmlFor="job-isPublicDisplay">前台展示</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch
                  id="job-isPublicDisplay"
                  checked={editForm.isPublicDisplay ?? editForm.status === "published"}
                  onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, isPublicDisplay: checked, status: checked ? "published" : "draft" }))}
                />
                <span className={`text-sm ${(editForm.isPublicDisplay ?? editForm.status === "published") ? 'text-green-600' : 'text-gray-400'}`}>
                  {(editForm.isPublicDisplay ?? editForm.status === "published") ? '展示' : '隐藏'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>特色标签（逗号分隔）</Label>
              <Input
                value={editForm.featureTags?.join(", ") || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, featureTags: splitByComma(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>能力要求（逗号分隔）</Label>
              <Input
                value={editForm.abilityModel?.join(", ") || ""}
                onChange={(e) => setEditForm((prev) => ({ ...prev, abilityModel: splitByComma(e.target.value) }))}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>岗位描述</Label>
              <FakeRichTextEditor
                value={editForm.description || ""}
                onChange={(value) => setEditForm((prev) => ({ ...prev, description: value }))}
                minHeight="140px"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditSubmit}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
