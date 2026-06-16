"use client"

import { useMemo, useState, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Users,
  TrendingUp,
  BookOpen,
  Briefcase,
  Star,
  FileText,
  Upload,
  X,
  Pencil,
  Award,
} from "lucide-react"
import { getMajorBrandById, majorBrands, partners, jobs as mockJobs, achievements } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS, INDUSTRIES, JOB_CATEGORY_LABELS } from "@/lib/types"
import type { MajorBrand, Job, JobCategory } from "@/lib/types"

import {
  JobActionButtons,
  NonTeachingJobDialog,
  TeachingJobDialog,
} from "@/components/admin/job-brand-tools"
import { TableRowActions } from "@/components/admin/table-row-actions"
import { ItemPublicDisplaySwitch } from "@/app/admin/enterprises/[id]/item-public-display-switch"

const departments = ["智能制造学院", "信息工程学院", "数字商务学院", "现代服务学院", "设计艺术学院"]

function generateId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function splitByComma(value: string) {
  return value.split(/[,，]/).map((item) => item.trim()).filter(Boolean)
}

// ============ 类型定义 ============
type LevelItem = {
  id: string
  title: string
  description: string
  attachments: string[]
}

type CompanyItem = {
  id: string
  name: string
  description: string
}

type CourseItem = {
  id: string
  name: string
  description: string
  url?: string
}

// ============ 通用编辑弹窗 ============
function NameDescDialog({
  open,
  onOpenChange,
  title,
  nameLabel,
  descLabel,
  namePlaceholder,
  descPlaceholder,
  urlLabel,
  urlPlaceholder,
  item,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  nameLabel: string
  descLabel: string
  namePlaceholder: string
  descPlaceholder: string
  urlLabel?: string
  urlPlaceholder?: string
  item?: { name: string; description: string; url?: string } | null
  onSave: (name: string, description: string, url?: string) => void
}) {
  const [name, setName] = useState(item?.name || "")
  const [desc, setDesc] = useState(item?.description || "")
  const [url, setUrl] = useState(item?.url || "")

  // 弹窗打开时重置表单
  const handleOpen = (open: boolean) => {
    if (open) {
      setName(item?.name || "")
      setDesc(item?.description || "")
      setUrl(item?.url || "")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{nameLabel}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={namePlaceholder} />
          </div>
          <div className="space-y-2">
            <Label>{descLabel}</Label>
            <FakeRichTextEditor value={desc} onChange={setDesc} placeholder={descPlaceholder} minHeight="120px" />
          </div>
          {urlLabel && (
            <div className="space-y-2">
              <Label>{urlLabel}</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={urlPlaceholder || "请输入URL"} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onSave(name, desc, url || undefined)} disabled={!name.trim()}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 等级编辑弹窗（带附件上传） ============
function LevelEditDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: LevelItem | null
  onSave: (item: Omit<LevelItem, "id">) => void
}) {
  const [title, setTitle] = useState(item?.title || "")
  const [desc, setDesc] = useState(item?.description || "")
  const [attachments, setAttachments] = useState<string[]>(item?.attachments || [])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleOpen = (open: boolean) => {
    if (open) {
      setTitle(item?.title || "")
      setDesc(item?.description || "")
      setAttachments(item?.attachments ? [...item.attachments] : [])
    }
    onOpenChange(open)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    setAttachments((prev) => [...prev, ...names])
    e.target.value = ""
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "编辑等级描述" : "新增等级描述"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>等级描述</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="填写等级描述" />
          </div>
          <div className="space-y-2">
            <Label>详细说明</Label>
            <FakeRichTextEditor value={desc} onChange={setDesc} placeholder="填写该等级的认定依据、建设目标或佐证说明" minHeight="120px" />
          </div>
          <div className="space-y-2">
            <Label>附件佐证</Label>
            <input
              type="file"
              multiple
              ref={fileRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              点击上传附件
            </Button>
            {attachments.length > 0 && (
              <div className="space-y-2 mt-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onSave({ title, description: desc, attachments })} disabled={!title.trim()}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============ 主页面 ============
export default function MajorBrandDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialMajor = useMemo(() => getMajorBrandById(id), [id])

  const [major, setMajor] = useState<MajorBrand | undefined>(initialMajor)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "info")

  // Tab 1 states
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    initialMajor?.department ? splitByComma(initialMajor.department) : []
  )
  const [introductionAttachments, setIntroductionAttachments] = useState<string[]>([])
  const introFileRef = useRef<HTMLInputElement>(null)

  const handleIntroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    setIntroductionAttachments((prev) => [...prev, ...names])
    e.target.value = ""
  }

  const removeIntroAttachment = (index: number) => {
    setIntroductionAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Tab 2 states
  const [levels, setLevels] = useState<LevelItem[]>([
    {
      id: generateId("level"),
      title: initialMajor ? BRAND_LEVEL_LABELS[initialMajor.level] : "",
      description: "专业品牌说明",
      attachments: [],
    },
  ])
  const [levelDialog, setLevelDialog] = useState<{ open: boolean; item?: LevelItem | null }>({ open: false })

  // Tab 3 states
  const [directionJobs, setDirectionJobs] = useState<Job[]>([...mockJobs])
  const [teachingOpen, setTeachingOpen] = useState(false)
  const [nonTeachingOpen, setNonTeachingOpen] = useState(false)
  const virtualPartner = { id: "virtual", name: "岗位品牌", logo: "" }

  // Tab 4 states
  const [companies, setCompanies] = useState<CompanyItem[]>(
    (initialMajor?.cooperationPartners || []).map((c) => ({
      id: generateId("co"),
      name: c,
      description: "",
    }))
  )
  const [companyDialog, setCompanyDialog] = useState<{ open: boolean; item?: CompanyItem | null }>({ open: false })
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [selectedPartnerId, setSelectedPartnerId] = useState("")
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false)
  const [createCompanyForm, setCreateCompanyForm] = useState({
    name: "",
    industry: INDUSTRIES[0],
    region: "",
    description: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    establishedYear: "",
    employeeCount: "",
  })

  // Tab 5 states
  const majorAchievements = useMemo(
    () => achievements.filter((a) => major?.cooperationPartners.includes(a.partnerName || "")),
    [major]
  )

  // Tab 6 states
  const [courses, setCourses] = useState<CourseItem[]>(
    (initialMajor?.coreCourses || []).map((c) => ({
      id: generateId("course"),
      name: typeof c === 'string' ? c : c.name,
      description: typeof c === 'string' ? "" : (c.description || ""),
      url: typeof c === 'string' ? undefined : c.url,
    }))
  )
  const [courseDialog, setCourseDialog] = useState<{ open: boolean; item?: CourseItem | null }>({ open: false })

  if (!major) {
    return (
      <div className="space-y-6">
        <Link href="/admin/brands/major">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
        <div className="text-center py-12 text-muted-foreground">未找到该专业品牌</div>
      </div>
    )
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const sp = new URLSearchParams(searchParams)
    sp.set("tab", value)
    router.push(`?${sp.toString()}`, { scroll: false })
  }

  const handleSave = () => {
    const updated: MajorBrand = {
      ...major,
      department: selectedDepartments.join("，"),
      employmentDirections: directionJobs.map((j) => j.title).filter(Boolean),
      cooperationPartners: companies.map((c) => c.name).filter(Boolean),
      featuredAchievements: majorAchievements.map((a) => a.name).filter(Boolean),
      coreCourses: courses.map((c) => ({ name: c.name, description: c.description || undefined, url: c.url || undefined })).filter((c) => c.name),
      updatedAt: new Date(),
    }
    setMajor(updated)
    alert("保存成功（演示）")
  }

  // Tab 2 helpers
  const handleSaveLevel = (data: Omit<LevelItem, "id">) => {
    if (levelDialog.item) {
      setLevels((prev) => prev.map((l) => (l.id === levelDialog.item!.id ? { ...l, ...data } : l)))
    } else {
      setLevels((prev) => [...prev, { ...data, id: generateId("level") }])
    }
    setLevelDialog({ open: false })
  }

  const removeLevel = (id: string) => {
    setLevels((prev) => prev.filter((l) => l.id !== id))
  }

  // Tab 3 helpers
  const handleSaveTeachingJob = (job: Job) => {
    setDirectionJobs((prev) => [job, ...prev])
    setTeachingOpen(false)
  }

  const handleSaveNonTeachingJob = (job: Job) => {
    setDirectionJobs((prev) => [job, ...prev])
    setNonTeachingOpen(false)
  }

  const handleRemoveJob = (jobId: string) => {
    if (confirm("确定要移除该岗位吗？")) {
      setDirectionJobs((prev) => prev.filter((j) => j.id !== jobId))
    }
  }

  // Tab 4 helpers
  const handleSaveCompany = (name: string, description: string) => {
    if (companyDialog.item) {
      setCompanies((prev) => prev.map((c) => (c.id === companyDialog.item!.id ? { ...c, name, description } : c)))
    } else {
      setCompanies((prev) => [...prev, { id: generateId("co"), name, description }])
    }
    setCompanyDialog({ open: false })
  }

  const removeCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id))
  }

  const handleQuotePartner = () => {
    if (!selectedPartnerId) return
    const partner = partners.find((p) => p.id === selectedPartnerId)
    if (!partner) return
    setCompanies((prev) => [...prev, { id: generateId("co"), name: partner.name, description: "" }])
    setSelectedPartnerId("")
    setQuoteDialogOpen(false)
  }

  const handleCreateCompany = () => {
    if (!createCompanyForm.name.trim()) return
    setCompanies((prev) => [
      ...prev,
      {
        id: generateId("co"),
        name: createCompanyForm.name,
        description: `所属行业：${createCompanyForm.industry}，地区：${createCompanyForm.region}，${createCompanyForm.description}`,
      },
    ])
    setCreateCompanyForm({
      name: "",
      industry: INDUSTRIES[0],
      region: "",
      description: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      address: "",
      establishedYear: "",
      employeeCount: "",
    })
    setCreateCompanyOpen(false)
  }

  // Tab 6 helpers
  const handleSaveCourse = (name: string, description: string, url?: string) => {
    if (courseDialog.item) {
      setCourses((prev) => prev.map((c) => (c.id === courseDialog.item!.id ? { ...c, name, description, url } : c)))
    } else {
      setCourses((prev) => [...prev, { id: generateId("course"), name, description, url }])
    }
    setCourseDialog({ open: false })
  }

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  const validTabs = ["info", "levels", "directions", "companies", "achievements", "courses"]
  const currentTab = validTabs.includes(activeTab) ? activeTab : "info"

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link href="/admin/brands/major">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{major.name}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline">{BRAND_LEVEL_LABELS[major.level]}</Badge>
              <Badge variant={major.status === "published" ? "secondary" : "outline"}>
                {BRAND_STATUS_LABELS[major.status]}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          保存修改
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{major.studentCount}</p>
                <p className="text-xs text-muted-foreground">在校生人数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{major.employmentRate}%</p>
                <p className="text-xs text-muted-foreground">就业率</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-muted-foreground">核心课程</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{directionJobs.length}</p>
                <p className="text-xs text-muted-foreground">就业方向</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">专业基本信息</TabsTrigger>
          <TabsTrigger value="levels">专业品牌 ({levels.length})</TabsTrigger>
          <TabsTrigger value="directions">专业就业方向 ({directionJobs.length})</TabsTrigger>
          <TabsTrigger value="companies">专业合作企业 ({companies.length})</TabsTrigger>
          <TabsTrigger value="achievements">专业特色成果 ({majorAchievements.length})</TabsTrigger>
          <TabsTrigger value="courses">专业课程体系 ({courses.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: 专业基本信息 */}
        <TabsContent value="info">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 左侧：基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>专业名称</Label>
                  <Input value={major.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>所属二级学院（可多选）</Label>
                  <div className="grid gap-2 rounded-md border p-3 md:grid-cols-2">
                    {departments.map((dept) => (
                      <label key={dept} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept)}
                          onChange={() =>
                            setSelectedDepartments((prev) =>
                              prev.includes(dept)
                                ? prev.filter((item) => item !== dept)
                                : [...prev, dept]
                            )
                          }
                        />
                        {dept}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>在校生人数</Label>
                    <Input
                      type="number"
                      value={major.studentCount}
                      onChange={(e) => setMajor({ ...major, studentCount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>就业率(%)</Label>
                    <Input
                      type="number"
                      value={major.employmentRate}
                      onChange={(e) => setMajor({ ...major, employmentRate: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>状态</Label>
                  <Select
                    value={major.status}
                    onValueChange={(val) => setMajor({ ...major, status: val as MajorBrand["status"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="pending">待审核</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 右侧：专业简介 + 附件 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">专业简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <FakeRichTextEditor
                    value={major.introduction}
                    onChange={(value) => setMajor({ ...major, introduction: value })}
                    placeholder="请输入专业简介"
                    minHeight="160px"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    专业简介附件
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    multiple
                    ref={introFileRef}
                    className="hidden"
                    onChange={handleIntroFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => introFileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    点击上传附件
                  </Button>
                  {introductionAttachments.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {introductionAttachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">{file}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeIntroAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: 专业品牌 */}
        <TabsContent value="levels">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">专业品牌</CardTitle>
                <CardDescription>添加专业品牌描述及佐证材料</CardDescription>
              </div>
              <Button size="sm" onClick={() => setLevelDialog({ open: true, item: null })}>
                <Plus className="h-4 w-4 mr-1" />
                新增等级
              </Button>
            </CardHeader>
            <CardContent>
              {levels.length > 0 ? (
                <div className="space-y-4">
                  {levels.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{row.title}</p>
                        {row.description && (
                          <p className="text-sm text-muted-foreground mt-1">{row.description}</p>
                        )}
                        {row.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {row.attachments.map((file, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setLevelDialog({ open: true, item: row })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => removeLevel(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无等级描述</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 专业就业方向 */}
        <TabsContent value="directions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">专业就业方向</CardTitle>
                <CardDescription>管理本专业对应的就业方向（岗位）</CardDescription>
              </div>
              <JobActionButtons
                onAddTeaching={() => setTeachingOpen(true)}
                onAddNonTeaching={() => setNonTeachingOpen(true)}
              />
            </CardHeader>
            <CardContent className="p-0">
              {directionJobs.length > 0 ? (
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
                      {directionJobs.map((job, index) => (
                        <TableRow key={job.id} className="group">
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{JOB_CATEGORY_LABELS[job.jobCategory || "non-teaching"]}</Badge>
                        </TableCell>
                        <TableCell>
                          {job.salaryMin && job.salaryMax ? `${job.salaryMin}-${job.salaryMax}K` : "面议"}
                        </TableCell>
                        <TableCell>
                          <p className="max-w-[220px] truncate text-sm text-muted-foreground">{job.description || "-"}</p>
                        </TableCell>
                        <TableCell>
                          <p className="max-w-[140px] truncate text-sm text-muted-foreground">{job.suitableMajors.join("、") || "-"}</p>
                        </TableCell>
                        <TableCell>{job.industry || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{job.status === "published" ? "已发布" : "草稿"}</Badge>
                        </TableCell>
                        <TableCell className="text-right relative">
                          <TableRowActions>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600" onClick={() => handleRemoveJob(job.id)}>
                              <Trash2 className="mr-1 h-3 w-3" />
                              删除
                            </Button>
                          </TableRowActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无就业方向</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 专业合作企业 */}
        <TabsContent value="companies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">专业合作企业</CardTitle>
                <CardDescription>管理与本专业合作的企业</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCreateCompanyOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  新增独立雇主企业
                </Button>
                <Button size="sm" onClick={() => setQuoteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  引用已有企业
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {companies.length > 0 ? (
                <div className="space-y-4">
                  {companies.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{row.name}</p>
                        {row.description && (
                          <p className="text-sm text-muted-foreground mt-1">{row.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCompanyDialog({ open: true, item: row })}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCompany(row.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无合作企业</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: 专业特色成果 */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  合作成果
                </CardTitle>
                <CardDescription>与本专业合作企业相关的合作成果</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/achievements/new">
                  <Plus className="h-4 w-4 mr-1" />
                  新增成果
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {(() => {
                const majorAchievements = achievements.filter((a) =>
                  major.cooperationPartners.includes(a.partnerName || "")
                )
                return majorAchievements.length > 0 ? (
                  <div className="space-y-4">
                    {majorAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.publishDate.toLocaleDateString("zh-CN")} 发布
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{achievement.type}</Badge>
                          <ItemPublicDisplaySwitch
                            defaultChecked={achievement.isPublicDisplay ?? true}
                            onChange={undefined}
                          />
                          <Link href={`/admin/achievements/${achievement.id}`}>
                            <Button variant="outline" size="sm">
                              查看详情
                            </Button>
                          </Link>
                          <Link href={`/admin/achievements/${achievement.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-3 w-3 mr-1" />
                              编辑
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无合作成果
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: 专业课程体系 */}
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">专业课程体系</CardTitle>
                <CardDescription>添加专业课程体系及说明</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => alert("开发中")}>
                  <Plus className="h-4 w-4 mr-1" />
                  引用体系课程
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("开发中")}>
                  <Plus className="h-4 w-4 mr-1" />
                  引用排课课程
                </Button>
                <Button size="sm" onClick={() => setCourseDialog({ open: true, item: null })}>
                  <Plus className="h-4 w-4 mr-1" />
                  新增课程
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{row.name}</p>
                        {row.description && (
                          <p className="text-sm text-muted-foreground mt-1">{row.description}</p>
                        )}
                        {row.url && (
                          <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block truncate">
                            {row.url}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCourseDialog({ open: true, item: row })}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(row.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">暂无课程体系</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 引用已有企业 Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>引用已有企业</DialogTitle>
            <DialogDescription>从合作企业库中选择要添加的企业</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择企业</Label>
              <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择企业" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} — {partner.industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedPartnerId(""); setQuoteDialogOpen(false) }}>
              取消
            </Button>
            <Button onClick={handleQuotePartner} disabled={!selectedPartnerId}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 等级编辑弹窗 */}
      <LevelEditDialog
        open={levelDialog.open}
        onOpenChange={(open) => setLevelDialog({ open })}
        item={levelDialog.item}
        onSave={handleSaveLevel}
      />

      {/* 引用教学岗位弹窗 */}
      <TeachingJobDialog
        open={teachingOpen}
        onOpenChange={setTeachingOpen}
        partner={virtualPartner}
        onSave={handleSaveTeachingJob}
        description="从岗位库中选择教学岗位，保存后关联到当前专业就业方向。"
      />

      {/* 添加非教学岗位弹窗 */}
      <NonTeachingJobDialog
        open={nonTeachingOpen}
        onOpenChange={setNonTeachingOpen}
        partner={virtualPartner}
        onSave={handleSaveNonTeachingJob}
        description="填写岗位基础信息，保存后关联到当前专业就业方向。"
      />

      {/* 合作企业编辑弹窗 */}
      <NameDescDialog
        open={companyDialog.open}
        onOpenChange={(open) => setCompanyDialog({ open })}
        title={companyDialog.item ? "编辑合作企业" : "新增合作企业"}
        nameLabel="企业名称"
        descLabel="合作内容"
        namePlaceholder="填写企业名称"
        descPlaceholder="填写合作内容、共建基础或合作成效"
        item={companyDialog.item ? { name: companyDialog.item.name, description: companyDialog.item.description } : null}
        onSave={handleSaveCompany}
      />

      {/* 课程体系编辑弹窗 */}
      <NameDescDialog
        open={courseDialog.open}
        onOpenChange={(open) => setCourseDialog({ open })}
        title={courseDialog.item ? "编辑课程体系" : "新增课程体系"}
        nameLabel="课程名称"
        descLabel="课程描述"
        namePlaceholder="填写课程名称"
        descPlaceholder="填写课程定位、课程特色或课程成果"
        urlLabel="课程 URL"
        urlPlaceholder="请输入课程链接地址"
        item={courseDialog.item ? { name: courseDialog.item.name, description: courseDialog.item.description, url: courseDialog.item.url } : null}
        onSave={handleSaveCourse}
      />
    </div>
  )
}
