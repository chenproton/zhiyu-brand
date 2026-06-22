"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableRowActions } from "@/components/admin/table-row-actions"
import { Check, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { INDUSTRIES, JOB_CATEGORY_LABELS, JOB_STATUS_LABELS, MAJORS, SECONDARY_COLLEGES } from "@/lib/types"
import { jobBrands } from "@/lib/mock-data"
import type { Job, Partner } from "@/lib/types"

type JobFormState = {
  title: string
  industry: string
  selectedMajors: string[]
  salaryMin: string
  salaryMax: string
  description: string
  responsibilities: string
  requirements: string
  secondaryCollege: string
  abilityModel: string
  featureTags: string
}

const emptyForm: JobFormState = {
  title: "",
  industry: "",
  selectedMajors: [],
  salaryMin: "",
  salaryMax: "",
  description: "",
  responsibilities: "",
  requirements: "",
  secondaryCollege: "",
  abilityModel: "",
  featureTags: "",
}

function splitByComma(val: string): string[] {
  return val.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function getSalary(job: Job) {
  if (job.salaryMin && job.salaryMax) return `${job.salaryMin}-${job.salaryMax}K`
  return "面议"
}

export function makeNonTeachingJob(partner: Pick<Partner, "id" | "name" | "logo">, form: JobFormState): Job {
  return {
    id: `job-${Date.now()}`,
    title: form.title,
    partnerId: partner.id,
    partnerName: partner.name,
    partnerLogo: partner.logo || "/placeholder.svg?height=64&width=64",
    jobCategory: "non-teaching",
    industry: form.industry,
    type: "full-time",
    workNature: "on-site",
    department: "",
    location: "",
    salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
    salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
    salaryUnit: "month",
    requirements: lines(form.requirements),
    responsibilities: lines(form.responsibilities),
    education: "不限",
    experience: "不限",
    headcount: 1,
    suitableMajors: form.selectedMajors,
    skills: splitByComma(form.abilityModel),
    benefits: splitByComma(form.featureTags),
    description: form.description,
    status: "draft",
    isUrgent: false,
    isRecommended: false,
    viewCount: 0,
    applicationCount: 0,
    secondaryCollege: form.secondaryCollege,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function NonTeachingJobDialog({
  open,
  onOpenChange,
  partner,
  initialJob,
  onSave,
  description,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  partner: Pick<Partner, "id" | "name" | "logo">
  initialJob?: Job | null
  onSave: (job: Job) => void
  description?: string
}) {
  const [form, setForm] = useState<JobFormState>(() =>
    initialJob
      ? {
          title: initialJob.title,
          industry: initialJob.industry || "",
          selectedMajors: initialJob.suitableMajors,
          salaryMin: initialJob.salaryMin ? String(initialJob.salaryMin) : "",
          salaryMax: initialJob.salaryMax ? String(initialJob.salaryMax) : "",
          description: initialJob.description,
          responsibilities: initialJob.responsibilities.join("\n"),
          requirements: initialJob.requirements.join("\n"),
          secondaryCollege: initialJob.secondaryCollege || "",
          abilityModel: initialJob.skills?.join(", ") || "",
          featureTags: "",
        }
      : emptyForm
  )

  const toggleMajor = (major: string) => {
    setForm((prev) => ({
      ...prev,
      selectedMajors: prev.selectedMajors.includes(major)
        ? prev.selectedMajors.filter((item) => item !== major)
        : [...prev.selectedMajors, major],
    }))
  }

  const save = () => {
    if (!form.title.trim()) return
    const next = initialJob
      ? {
          ...initialJob,
          title: form.title,
          industry: form.industry,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
          suitableMajors: form.selectedMajors,
          description: form.description,
          responsibilities: lines(form.responsibilities),
          requirements: lines(form.requirements),
          skills: splitByComma(form.abilityModel),
          benefits: splitByComma(form.featureTags),
          secondaryCollege: form.secondaryCollege,
          updatedAt: new Date(),
        }
      : makeNonTeachingJob(partner, form)
    onSave(next)
    setForm(emptyForm)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialJob ? "编辑非教学岗位" : "新建非教学岗位"}</DialogTitle>
          <DialogDescription>{description || "填写岗位基础信息，保存后直接关联到当前雇主品牌。"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>岗位名称 <span className="text-red-500">*</span></Label>
            <Input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="请输入岗位名称" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>所属行业</Label>
              <Select value={form.industry} onValueChange={(industry) => setForm((prev) => ({ ...prev, industry }))}>
                <SelectTrigger><SelectValue placeholder="选择所属行业" /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>薪资范围（K/月）</Label>
              <div className="flex items-center gap-2">
                <Input type="number" value={form.salaryMin} onChange={(e) => setForm((prev) => ({ ...prev, salaryMin: e.target.value }))} placeholder="最低" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" value={form.salaryMax} onChange={(e) => setForm((prev) => ({ ...prev, salaryMax: e.target.value }))} placeholder="最高" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>面向专业</Label>
            <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2 md:grid-cols-3">
              {MAJORS.map((major) => (
                <label key={major} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted">
                  <Checkbox checked={form.selectedMajors.includes(major)} onCheckedChange={() => toggleMajor(major)} />
                  <span>{major}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>能力要求（逗号分隔）</Label>
              <Input
                value={form.abilityModel}
                onChange={(e) => setForm((prev) => ({ ...prev, abilityModel: e.target.value }))}
                placeholder="团队协作, 问题解决, 学习能力, 沟通能力"
              />
            </div>
            <div className="space-y-2">
              <Label>特色标签（逗号分隔）</Label>
              <Input
                value={form.featureTags}
                onChange={(e) => setForm((prev) => ({ ...prev, featureTags: e.target.value }))}
                placeholder="发展空间大, 技术前沿"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>关联二级学院</Label>
            <Select value={form.secondaryCollege} onValueChange={(val) => setForm((prev) => ({ ...prev, secondaryCollege: val }))}>
              <SelectTrigger><SelectValue placeholder="选择二级学院" /></SelectTrigger>
              <SelectContent>
                {SECONDARY_COLLEGES.map((college) => (
                  <SelectItem key={college} value={college}>{college}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>岗位介绍</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="简要描述该岗位的职责和要求" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>工作职责</Label>
              <Textarea rows={5} value={form.responsibilities} onChange={(e) => setForm((prev) => ({ ...prev, responsibilities: e.target.value }))} placeholder="每行一条职责" />
            </div>
            <div className="space-y-2">
              <Label>任职要求</Label>
              <Textarea rows={5} value={form.requirements} onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))} placeholder="每行一条要求" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={save} disabled={!form.title.trim()}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TeachingJobDialog({
  open,
  onOpenChange,
  partner,
  onSave,
  description,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  partner: Pick<Partner, "id" | "name" | "logo">
  onSave: (job: Job) => void
  description?: string
}) {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const [secondaryCollege, setSecondaryCollege] = useState("")
  const filtered = useMemo(
    () => jobBrands.filter((item) => item.status === "published" && (item.name.includes(search) || item.industry.includes(search))),
    [search]
  )
  const selected = jobBrands.find((item) => item.id === selectedId)

  const save = () => {
    if (!selected) return
    onSave({
      id: `job-${Date.now()}`,
      title: selected.name,
      partnerId: partner.id,
      partnerName: partner.name,
      partnerLogo: partner.logo || "/placeholder.svg?height=64&width=64",
      jobBrandId: selected.id,
      jobBrandName: selected.name,
      jobCategory: "teaching",
      industry: selected.industry,
      type: "full-time",
      workNature: "on-site",
      department: "",
      location: "",
      salaryMin: selected.averageSalary ? Number(selected.averageSalary.split("-")[0].replace("K", "")) : undefined,
      salaryMax: selected.averageSalary ? Number(selected.averageSalary.split("-")[1]?.replace("K", "")) : undefined,
      salaryUnit: "month",
      requirements: [],
      responsibilities: [],
      benefits: [],
      education: "不限",
      experience: "不限",
      headcount: 1,
      suitableMajors: selected.suitableMajors,
      skills: [],
      description: selected.description,
      secondaryCollege,
      status: "draft",
      isUrgent: false,
      isRecommended: false,
      viewCount: 0,
      applicationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setSelectedId("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>引用职业岗位库</DialogTitle>
          <DialogDescription>{description || "从岗位库中选择教学岗位，保存后关联到当前雇主品牌。"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="搜索岗位名称或行业" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>关联二级学院</Label>
            <Select value={secondaryCollege} onValueChange={setSecondaryCollege}>
              <SelectTrigger><SelectValue placeholder="选择二级学院" /></SelectTrigger>
              <SelectContent>
                {SECONDARY_COLLEGES.map((college) => (
                  <SelectItem key={college} value={college}>{college}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-80 overflow-y-auto rounded-md border">
            {filtered.map((brand) => (
              <button
                key={brand.id}
                type="button"
                className={`flex w-full items-center justify-between border-b p-3 text-left last:border-b-0 hover:bg-muted ${selectedId === brand.id ? "bg-muted" : ""}`}
                onClick={() => setSelectedId(brand.id)}
              >
                <div>
                  <div className="font-medium">{brand.name}</div>
                  <div className="text-xs text-muted-foreground">{brand.industry} · {brand.suitableMajors.join("、")}</div>
                </div>
                {selectedId === brand.id && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={save} disabled={!selectedId}>确认引用</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AssociatedJobsTable({
  jobs,
  onEdit,
  onDelete,
}: {
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (jobId: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">序号</TableHead>
          <TableHead>岗位名称</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>薪资范围</TableHead>
          <TableHead>岗位介绍</TableHead>
          <TableHead>面向专业</TableHead>
          <TableHead>所属行业</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.length === 0 ? (
          <TableRow><TableCell colSpan={9} className="py-10 text-center text-muted-foreground">暂无关联岗位</TableCell></TableRow>
        ) : (
          jobs.map((job, index) => (
            <TableRow key={job.id} className="group">
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell><Badge variant="outline">{JOB_CATEGORY_LABELS[job.jobCategory || "non-teaching"]}</Badge></TableCell>
              <TableCell>{getSalary(job)}</TableCell>
              <TableCell><p className="max-w-[220px] truncate text-sm text-muted-foreground">{job.description || "-"}</p></TableCell>
              <TableCell><p className="max-w-[140px] truncate text-sm text-muted-foreground">{job.suitableMajors.join("、") || "-"}</p></TableCell>
              <TableCell>{job.industry || "-"}</TableCell>
              <TableCell><Badge variant="secondary">{JOB_STATUS_LABELS[job.status]}</Badge></TableCell>
              <TableCell className="text-right relative">
                <TableRowActions>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onEdit(job)}>
                    <Pencil className="mr-1 h-3 w-3" />
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600" onClick={() => onDelete(job.id)}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    删除
                  </Button>
                </TableRowActions>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export function JobActionButtons({
  onAddNonTeaching,
  onAddTeaching,
  size = "sm",
}: {
  onAddNonTeaching: () => void
  onAddTeaching: () => void
  size?: "sm" | "default"
}) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size={size} onClick={onAddTeaching}>
        <Plus className="mr-1 h-4 w-4" />
        引用职业岗位库
      </Button>
      <Button size={size} onClick={onAddNonTeaching}>
        <Plus className="mr-1 h-4 w-4" />
        新增独立岗位
      </Button>
    </div>
  )
}
