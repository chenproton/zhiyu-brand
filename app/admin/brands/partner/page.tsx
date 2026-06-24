"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { TableRowActions } from "@/components/admin/table-row-actions"
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import { Search, Plus, Pencil, Trash2, Upload, X, Eye } from "lucide-react"
import { jobs, partners } from "@/lib/mock-data"
import { JobActionButtons, NonTeachingJobDialog, TeachingJobDialog } from "@/components/admin/job-brand-tools"
import {
  INDUSTRIES,
  SECONDARY_COLLEGES,
  PARTNER_TYPE_LABELS,
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  ENTERPRISE_TYPE_LABELS,
} from "@/lib/types"
import type { Job, NamedPhoto, Partner, PartnerType, CooperationStatus, CooperationRating, EnterpriseType } from "@/lib/types"
import { PublicDisplaySwitch } from "@/components/shared/public-display-switch"

type PartnerFormState = {
  name: string
  enterpriseType: EnterpriseType
  isPublicDisplay: boolean
  industry: string
  status: CooperationStatus
  rating: CooperationRating
  description: string
  unifiedSocialCreditCode: string
  logo: string
  coverImage: string
  businessLicensePhotos: string[]
  intellectualPropertyPhotos: NamedPhoto[]
  qualificationPhotos: NamedPhoto[]
  coverPhotos: string[]
  contactPerson: string
  contactPhone: string
  contactEmail: string
  address: string
  establishedYear: string
  employeeCount: string
  secondaryColleges: string[]
}

const emptyPartnerForm: PartnerFormState = {
  name: '',
  enterpriseType: 'school-based',
  isPublicDisplay: true,
  industry: '',
  status: 'negotiating',
  rating: 'general',
  description: '',
  unifiedSocialCreditCode: '',
  logo: '',
  coverImage: '',
  businessLicensePhotos: [],
  intellectualPropertyPhotos: [],
  qualificationPhotos: [],
  coverPhotos: [],
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  address: '',
  establishedYear: '',
  employeeCount: '',
  secondaryColleges: [],
}

const CUSTOM_PARTNERS_KEY = "brand_custom_partners"

function getStoredCustomPartners(): Partner[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CUSTOM_PARTNERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map((p) => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) })) : []
  } catch {
    return []
  }
}

function saveStoredCustomPartners(customPartners: Partner[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CUSTOM_PARTNERS_KEY, JSON.stringify(customPartners))
}

export default function PartnerBrandPage() {
  const [displayedPartners, setDisplayedPartners] = useState<Partner[]>(() => {
    const stored = getStoredCustomPartners()
    return [...partners.slice(0, 3), ...stored]
  })
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
    industry: "all",
    rating: "all",
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [selectedPartnerId, setSelectedPartnerId] = useState("")
  const [partnerSearchTerm, setPartnerSearchTerm] = useState("")
  const [localJobs, setLocalJobs] = useState<Job[]>([...jobs])
  const [jobPartner, setJobPartner] = useState<Partner | null>(null)
  const [nonTeachingJobOpen, setNonTeachingJobOpen] = useState(false)
  const [teachingJobOpen, setTeachingJobOpen] = useState(false)

  // 编辑/新增共用表单状态
  const [partnerForm, setPartnerForm] = useState<PartnerFormState>({ ...emptyPartnerForm })

  // Photo upload refs & state
  const licenseFileRef = useRef<HTMLInputElement>(null)
  const ipFileRef = useRef<HTMLInputElement>(null)
  const qualFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const coverImageFileRef = useRef<HTMLInputElement>(null)

  const resetPartnerForm = () => {
    setPartnerForm({ ...emptyPartnerForm })
  }

  const handleFileChange = (field: 'businessLicensePhotos' | 'coverPhotos') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file))
      setPartnerForm((prev) => ({ ...prev, [field]: [...prev[field], ...newPhotos] }))
    }
    e.target.value = ''
  }

  const removePhoto = (field: 'businessLicensePhotos' | 'coverPhotos', index: number) => {
    setPartnerForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const handleSingleImageChange = (field: 'logo' | 'coverImage') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPartnerForm((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }))
    }
    e.target.value = ''
  }

  const removeSingleImage = (field: 'logo' | 'coverImage') => {
    setPartnerForm((prev) => ({ ...prev, [field]: '' }))
  }

  const handleNamedFileChange = (field: 'intellectualPropertyPhotos' | 'qualificationPhotos') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos: NamedPhoto[] = Array.from(files).map((file) => ({ name: '', url: URL.createObjectURL(file) }))
      setPartnerForm((prev) => ({ ...prev, [field]: [...prev[field], ...newPhotos] }))
    }
    e.target.value = ''
  }

  const updateNamedPhotoName = (
    field: 'intellectualPropertyPhotos' | 'qualificationPhotos',
    index: number,
    name: string
  ) => {
    setPartnerForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? { ...item, name } : item)),
    }))
  }

  const removeNamedPhoto = (field: 'intellectualPropertyPhotos' | 'qualificationPhotos', index: number) => {
    setPartnerForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const toggleSecondaryCollege = (college: string) => {
    setPartnerForm((prev) => ({
      ...prev,
      secondaryColleges: prev.secondaryColleges.includes(college)
        ? prev.secondaryColleges.filter((c) => c !== college)
        : [...prev.secondaryColleges, college],
    }))
  }

  const filteredPartners = displayedPartners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filters.type === "all" || partner.type === filters.type
    const matchesIndustry = filters.industry === "all" || partner.industry === filters.industry
    const matchesRating = filters.rating === "all" || partner.rating === filters.rating
    return matchesSearch && matchesType && matchesIndustry && matchesRating
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ type: "all", industry: "all", rating: "all" })
  }

  const filterConfigs = [
    {
      key: "type",
      label: "全部类型",
      options: [
        { value: "enterprise", label: "企业" },
        { value: "association", label: "行业协会" },
        { value: "park", label: "产业园区" },
        { value: "institution", label: "机构" },
      ],
    },
    {
      key: "industry",
      label: "全部行业",
      options: INDUSTRIES.map((industry) => ({ value: industry, label: industry })),
    },
    {
      key: "rating",
      label: "全部深度",
      options: [
        { value: "strategic", label: "战略合作" },
        { value: "deep", label: "深度合作" },
        { value: "general", label: "一般合作" },
      ],
    },
  ]

  const columns = [
    { key: "name", title: "主体名称", render: (partner: Partner) => <span className="font-medium">{partner.name}</span> },
    {
      key: "isPublicDisplay",
      title: "前台展示",
      render: (partner: Partner) => (
        <PublicDisplaySwitch
          checked={partner.isPublicDisplay ?? true}
          onChange={(checked) => {
            setDisplayedPartners((prev) =>
              prev.map((p) =>
                p.id === partner.id ? { ...p, isPublicDisplay: checked, updatedAt: new Date() } : p
              )
            )
          }}
        />
      ),
    },
    { key: "type", title: "类型", render: (partner: Partner) => PARTNER_TYPE_LABELS[partner.type] },
    { key: "industry", title: "行业", render: (partner: Partner) => partner.industry },
    { key: "region", title: "地区", render: (partner: Partner) => partner.region },
    {
      key: "jobs",
      title: "关联岗位",
      render: (partner: Partner) => {
        const partnerJobs = localJobs.filter((job) => job.partnerId === partner.id)
        return partnerJobs.length > 0 ? partnerJobs.map((job) => job.title).join(", ") : "-"
      },
    },
    { key: "hiredStudents", title: "招聘学生数量", render: (partner: Partner) => partner.hiredStudents?.length ?? 0 },
    {
      key: "openJobs",
      title: "开放岗位数量",
      render: (partner: Partner) => {
        const partnerJobs = localJobs.filter((job) => job.partnerId === partner.id)
        return partnerJobs.length
      },
    },
    { key: "updatedAt", title: "更新时间", render: (partner: Partner) => partner.updatedAt.toLocaleDateString("zh-CN") },
    { key: "status", title: "状态", render: (partner: Partner) => COOPERATION_STATUS_LABELS[partner.status] },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (partner: Partner) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/brands/partner/${partner.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEdit(partner)}>
            <Pencil className="mr-1 h-3 w-3" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDelete(partner.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  const openEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setPartnerForm({
      name: partner.name || '',
      enterpriseType: (partner as unknown as { enterpriseType?: EnterpriseType }).enterpriseType || 'school-based',
      isPublicDisplay: (partner as unknown as { isPublicDisplay?: boolean }).isPublicDisplay ?? true,
      industry: partner.industry || '',
      status: partner.status || 'negotiating',
      rating: partner.rating || 'general',
      description: partner.description || '',
      unifiedSocialCreditCode: (partner as unknown as { unifiedSocialCreditCode?: string }).unifiedSocialCreditCode || '',
      logo: partner.logo || '',
      coverImage: partner.coverImage || '',
      businessLicensePhotos: partner.businessLicensePhotos || [],
      intellectualPropertyPhotos: partner.intellectualPropertyPhotos || [],
      qualificationPhotos: partner.qualificationPhotos || [],
      coverPhotos: partner.coverPhotos || [],
      contactPerson: partner.contactPerson || '',
      contactPhone: partner.contactPhone || '',
      contactEmail: partner.contactEmail || '',
      address: partner.address || '',
      establishedYear: partner.establishedYear?.toString() || '',
      employeeCount: partner.employeeCount?.toString() || '',
      secondaryColleges: partner.secondaryColleges || [],
    })
    setEditDialogOpen(true)
  }

  const openCreate = () => {
    resetPartnerForm()
    setCreateDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingPartner) return
    setDisplayedPartners((prev) =>
      prev.map((p) =>
        p.id === editingPartner.id
          ? ({
              ...p,
              name: partnerForm.name,
              industry: partnerForm.industry,
              status: partnerForm.status,
              rating: partnerForm.rating,
              isPublicDisplay: partnerForm.isPublicDisplay,
              description: partnerForm.description,
              unifiedSocialCreditCode: partnerForm.unifiedSocialCreditCode,
              logo: partnerForm.logo || undefined,
              coverImage: partnerForm.coverImage || undefined,
              businessLicensePhotos: partnerForm.businessLicensePhotos.length > 0 ? partnerForm.businessLicensePhotos : undefined,
              intellectualPropertyPhotos: partnerForm.intellectualPropertyPhotos.length > 0 ? partnerForm.intellectualPropertyPhotos : undefined,
              qualificationPhotos: partnerForm.qualificationPhotos.length > 0 ? partnerForm.qualificationPhotos : undefined,
              coverPhotos: partnerForm.coverPhotos.length > 0 ? partnerForm.coverPhotos : undefined,
              contactPerson: partnerForm.contactPerson || undefined,
              contactPhone: partnerForm.contactPhone || undefined,
              contactEmail: partnerForm.contactEmail || undefined,
              address: partnerForm.address || undefined,
              establishedYear: partnerForm.establishedYear ? Number(partnerForm.establishedYear) : undefined,
              employeeCount: partnerForm.employeeCount ? Number(partnerForm.employeeCount) : undefined,
              secondaryColleges: partnerForm.secondaryColleges,
              updatedAt: new Date(),
            } as unknown as Partner)
          : p
      )
    )
    setEditDialogOpen(false)
    setEditingPartner(null)
  }

  const handleCreate = () => {
    const newPartner = {
      ...partnerForm,
      id: `custom-${Date.now()}`,
      type: 'enterprise' as const,
      region: '',
      cooperationTypes: [] as string[],
      logo: partnerForm.logo || undefined,
      coverImage: partnerForm.coverImage || undefined,
      businessLicensePhotos: partnerForm.businessLicensePhotos.length > 0 ? partnerForm.businessLicensePhotos : undefined,
      intellectualPropertyPhotos: partnerForm.intellectualPropertyPhotos.length > 0 ? partnerForm.intellectualPropertyPhotos : undefined,
      qualificationPhotos: partnerForm.qualificationPhotos.length > 0 ? partnerForm.qualificationPhotos : undefined,
      coverPhotos: partnerForm.coverPhotos.length > 0 ? partnerForm.coverPhotos : undefined,
      contactPerson: partnerForm.contactPerson || undefined,
      contactPhone: partnerForm.contactPhone || undefined,
      contactEmail: partnerForm.contactEmail || undefined,
      address: partnerForm.address || undefined,
      establishedYear: partnerForm.establishedYear ? Number(partnerForm.establishedYear) : undefined,
      employeeCount: partnerForm.employeeCount ? Number(partnerForm.employeeCount) : undefined,
      secondaryColleges: partnerForm.secondaryColleges,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as Partner
    setDisplayedPartners((prev) => {
      const next = [...prev, newPartner]
      const customOnly = next.filter((p) => p.id.startsWith("custom-"))
      saveStoredCustomPartners(customOnly)
      return next
    })
    setCreateDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该雇主品牌吗？")) {
      setDisplayedPartners((prev) => {
        const next = prev.filter((p) => p.id !== id)
        const customOnly = next.filter((p) => p.id.startsWith("custom-"))
        saveStoredCustomPartners(customOnly)
        return next
      })
    }
  }

  const unreferencedPartners = partners.filter(
    (p) => !displayedPartners.some((dp) => dp.id === p.id)
  )

  const handleAdd = () => {
    const partner = partners.find((p) => p.id === selectedPartnerId)
    if (!partner) return
    setDisplayedPartners((prev) => [...prev, partner])
    setSelectedPartnerId("")
    setDialogOpen(false)
  }

  const openJobDialog = (kind: "teaching" | "non-teaching", partner = filteredPartners[0]) => {
    if (!partner) return
    setJobPartner(partner)
    if (kind === "teaching") setTeachingJobOpen(true)
    else setNonTeachingJobOpen(true)
  }

  const handleSaveJob = (job: Job) => {
    setLocalJobs((prev) => [job, ...prev])
  }

  return (
    <AdminListPage
      title="雇主品牌管理"
      subtitle="管理合作主体的品牌展示配置"
      count={filteredPartners.length}
      countLabel="个雇主品牌"
      backHref="/admin/brands"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />
            新增独立雇主企业
          </Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            从合作企业库引用
          </Button>
        </>
      }
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索主体名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
    >
      <AdminDataTable
        columns={columns}
        data={filteredPartners}
        rowKey={(p) => p.id}
        emptyText="没有找到符合条件的雇主品牌"
      />

      {/* 引用已有企业 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>从合作企业库引用</DialogTitle>
            <DialogDescription>搜索并选择要展示的品牌</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择企业</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索企业名称或行业..."
                  value={partnerSearchTerm}
                  onChange={(e) => {
                    setPartnerSearchTerm(e.target.value)
                    setSelectedPartnerId("")
                  }}
                  className="pl-10"
                />
              </div>
              <div className="border rounded-md max-h-[220px] overflow-y-auto">
                {unreferencedPartners
                  .filter((p) =>
                    !partnerSearchTerm.trim() ||
                    p.name.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                    p.industry.toLowerCase().includes(partnerSearchTerm.toLowerCase())
                  )
                  .length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    没有可引用的企业
                  </div>
                )}
                {unreferencedPartners
                  .filter((p) =>
                    !partnerSearchTerm.trim() ||
                    p.name.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                    p.industry.toLowerCase().includes(partnerSearchTerm.toLowerCase())
                  )
                  .map((partner) => (
                    <div
                      key={partner.id}
                      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted border-b last:border-b-0 ${
                        selectedPartnerId === partner.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedPartnerId(partner.id)}
                    >
                      <div>
                        <p className="text-sm font-medium">{partner.name}</p>
                        <p className="text-xs text-muted-foreground">{partner.industry}</p>
                      </div>
                      {selectedPartnerId === partner.id && (
                        <div className="h-4 w-4 rounded-full bg-primary" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedPartnerId(""); setPartnerSearchTerm(""); setDialogOpen(false) }}>
              取消
            </Button>
            <Button onClick={handleAdd} disabled={!selectedPartnerId || unreferencedPartners.length === 0}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑 Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑雇主品牌</DialogTitle>
            <DialogDescription>修改合作主体的品牌展示信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>企业名称 *</Label>
                  <Input
                    value={partnerForm.name}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入企业全称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>统一社会信用代码 *</Label>
                  <Input
                    value={partnerForm.unifiedSocialCreditCode}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, unifiedSocialCreditCode: e.target.value }))}
                    placeholder="如：91320594MA1P7XXXX1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>所属行业</Label>
                  <Select value={partnerForm.industry} onValueChange={(v) => setPartnerForm((prev) => ({ ...prev, industry: v }))}>
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
                  <Label>合作状态</Label>
                  <Select value={partnerForm.status} onValueChange={(v) => setPartnerForm((prev) => ({ ...prev, status: v as CooperationStatus }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COOPERATION_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>合作评级</Label>
                  <Select value={partnerForm.rating} onValueChange={(v) => setPartnerForm((prev) => ({ ...prev, rating: v as CooperationRating }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>前台展示</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      checked={partnerForm.isPublicDisplay}
                      onCheckedChange={(checked) => setPartnerForm((prev) => ({ ...prev, isPublicDisplay: checked }))}
                    />
                    <span className={`text-sm ${partnerForm.isPublicDisplay ? 'text-green-600' : 'text-gray-400'}`}>
                      {partnerForm.isPublicDisplay ? '展示' : '隐藏'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>企业简介</Label>
                  <FakeRichTextEditor
                    value={partnerForm.description}
                    onChange={(value) => setPartnerForm((prev) => ({ ...prev, description: value }))}
                    placeholder="请输入企业简介..."
                    minHeight="120px"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业形象</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>企业 Logo</Label>
                  <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={handleSingleImageChange('logo')} />
                  {partnerForm.logo ? (
                    <div className="relative inline-block">
                      <img src={partnerForm.logo} alt="企业 Logo" className="w-24 h-24 object-cover rounded-xl border" />
                      <button type="button" onClick={() => removeSingleImage('logo')} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => logoFileRef.current?.click()}>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">上传 Logo</span>
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>企业主页封面</Label>
                  <input ref={coverImageFileRef} type="file" accept="image/*" className="hidden" onChange={handleSingleImageChange('coverImage')} />
                  {partnerForm.coverImage ? (
                    <div className="relative inline-block">
                      <img src={partnerForm.coverImage} alt="企业主页封面" className="w-full max-w-md h-40 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removeSingleImage('coverImage')} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-full max-w-md h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => coverImageFileRef.current?.click()}>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">上传主页封面</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业营业执照</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={licenseFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange('businessLicensePhotos')} />
                <div className="flex flex-wrap gap-3">
                  {partnerForm.businessLicensePhotos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img src={photo} alt={`营业执照 ${idx + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removePhoto('businessLicensePhotos', idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => licenseFileRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业知识产权</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={ipFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNamedFileChange('intellectualPropertyPhotos')} />
                <div className="flex flex-wrap gap-3">
                  {partnerForm.intellectualPropertyPhotos.map((photo, idx) => (
                    <div key={idx} className="relative flex flex-col gap-2 w-32">
                      <div className="relative">
                        <img src={photo.url} alt={photo.name || `知识产权 ${idx + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeNamedPhoto('intellectualPropertyPhotos', idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Input
                        value={photo.name}
                        onChange={(e) => updateNamedPhotoName('intellectualPropertyPhotos', idx, e.target.value)}
                        placeholder="名称"
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => ipFileRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业荣誉资质</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={qualFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNamedFileChange('qualificationPhotos')} />
                <div className="flex flex-wrap gap-3">
                  {partnerForm.qualificationPhotos.map((photo, idx) => (
                    <div key={idx} className="relative flex flex-col gap-2 w-32">
                      <div className="relative">
                        <img src={photo.url} alt={photo.name || `资质证明 ${idx + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeNamedPhoto('qualificationPhotos', idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Input
                        value={photo.name}
                        onChange={(e) => updateNamedPhotoName('qualificationPhotos', idx, e.target.value)}
                        placeholder="名称"
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => qualFileRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>企业联系人</Label>
                  <Input
                    value={partnerForm.contactPerson}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="请输入企业联系人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input
                    value={partnerForm.contactPhone}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系邮箱</Label>
                  <Input
                    value={partnerForm.contactEmail}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="请输入联系邮箱"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>详细地址</Label>
                  <Input
                    value={partnerForm.address}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入企业地址"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>成立年份</Label>
                  <Input
                    type="number"
                    value={partnerForm.establishedYear}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, establishedYear: e.target.value }))}
                    placeholder="如：2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label>企业规模</Label>
                  <Input
                    type="number"
                    value={partnerForm.employeeCount}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, employeeCount: e.target.value }))}
                    placeholder="如：500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>关联二级学院</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {SECONDARY_COLLEGES.map((college) => (
                      <Badge
                        key={college}
                        variant={partnerForm.secondaryColleges.includes(college) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSecondaryCollege(college)}
                      >
                        {college}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">点击标签进行选择，支持多选</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增独立雇主企业 Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增独立雇主企业</DialogTitle>
            <DialogDescription>从零创建一个新的独立雇主企业档案</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>企业名称 *</Label>
                  <Input
                    value={partnerForm.name}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入企业全称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>统一社会信用代码 *</Label>
                  <Input
                    value={partnerForm.unifiedSocialCreditCode}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, unifiedSocialCreditCode: e.target.value }))}
                    placeholder="如：91320594MA1P7XXXX1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>所属行业</Label>
                  <Select value={partnerForm.industry} onValueChange={(v) => setPartnerForm((prev) => ({ ...prev, industry: v }))}>
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
                  <Label>合作状态</Label>
                  <Select value={partnerForm.status} onValueChange={(v) => setPartnerForm((prev) => ({ ...prev, status: v as CooperationStatus }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COOPERATION_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>合作评级</Label>
                  <Select value={partnerForm.rating} onValueChange={(v) => setPartnerForm((prev) => ({ ...prev, rating: v as CooperationRating }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>前台展示</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      checked={partnerForm.isPublicDisplay}
                      onCheckedChange={(checked) => setPartnerForm((prev) => ({ ...prev, isPublicDisplay: checked }))}
                    />
                    <span className={`text-sm ${partnerForm.isPublicDisplay ? 'text-green-600' : 'text-gray-400'}`}>
                      {partnerForm.isPublicDisplay ? '展示' : '隐藏'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>企业简介</Label>
                  <FakeRichTextEditor
                    value={partnerForm.description}
                    onChange={(value) => setPartnerForm((prev) => ({ ...prev, description: value }))}
                    placeholder="请输入企业简介..."
                    minHeight="120px"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业形象</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>企业 Logo</Label>
                  <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={handleSingleImageChange('logo')} />
                  {partnerForm.logo ? (
                    <div className="relative inline-block">
                      <img src={partnerForm.logo} alt="企业 Logo" className="w-24 h-24 object-cover rounded-xl border" />
                      <button type="button" onClick={() => removeSingleImage('logo')} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => logoFileRef.current?.click()}>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">上传 Logo</span>
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>企业主页封面</Label>
                  <input ref={coverImageFileRef} type="file" accept="image/*" className="hidden" onChange={handleSingleImageChange('coverImage')} />
                  {partnerForm.coverImage ? (
                    <div className="relative inline-block">
                      <img src={partnerForm.coverImage} alt="企业主页封面" className="w-full max-w-md h-40 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removeSingleImage('coverImage')} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Button type="button" variant="outline" className="w-full max-w-md h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => coverImageFileRef.current?.click()}>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">上传主页封面</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业营业执照</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={licenseFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange('businessLicensePhotos')} />
                <div className="flex flex-wrap gap-3">
                  {partnerForm.businessLicensePhotos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img src={photo} alt={`营业执照 ${idx + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removePhoto('businessLicensePhotos', idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => licenseFileRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业知识产权</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={ipFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNamedFileChange('intellectualPropertyPhotos')} />
                <div className="flex flex-wrap gap-3">
                  {partnerForm.intellectualPropertyPhotos.map((photo, idx) => (
                    <div key={idx} className="relative flex flex-col gap-2 w-32">
                      <div className="relative">
                        <img src={photo.url} alt={photo.name || `知识产权 ${idx + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeNamedPhoto('intellectualPropertyPhotos', idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Input
                        value={photo.name}
                        onChange={(e) => updateNamedPhotoName('intellectualPropertyPhotos', idx, e.target.value)}
                        placeholder="名称"
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => ipFileRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业荣誉资质</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={qualFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleNamedFileChange('qualificationPhotos')} />
                <div className="flex flex-wrap gap-3">
                  {partnerForm.qualificationPhotos.map((photo, idx) => (
                    <div key={idx} className="relative flex flex-col gap-2 w-32">
                      <div className="relative">
                        <img src={photo.url} alt={photo.name || `资质证明 ${idx + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeNamedPhoto('qualificationPhotos', idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Input
                        value={photo.name}
                        onChange={(e) => updateNamedPhotoName('qualificationPhotos', idx, e.target.value)}
                        placeholder="名称"
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => qualFileRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>企业联系人</Label>
                  <Input
                    value={partnerForm.contactPerson}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="请输入企业联系人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input
                    value={partnerForm.contactPhone}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系邮箱</Label>
                  <Input
                    value={partnerForm.contactEmail}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="请输入联系邮箱"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>详细地址</Label>
                  <Input
                    value={partnerForm.address}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入企业地址"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>成立年份</Label>
                  <Input
                    type="number"
                    value={partnerForm.establishedYear}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, establishedYear: e.target.value }))}
                    placeholder="如：2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label>企业规模</Label>
                  <Input
                    type="number"
                    value={partnerForm.employeeCount}
                    onChange={(e) => setPartnerForm((prev) => ({ ...prev, employeeCount: e.target.value }))}
                    placeholder="如：500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>关联二级学院</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {SECONDARY_COLLEGES.map((college) => (
                      <Badge
                        key={college}
                        variant={partnerForm.secondaryColleges.includes(college) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSecondaryCollege(college)}
                      >
                        {college}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">点击标签进行选择，支持多选</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>确认新增</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {jobPartner && (
        <>
          <NonTeachingJobDialog
            open={nonTeachingJobOpen}
            onOpenChange={setNonTeachingJobOpen}
            partner={jobPartner}
            onSave={handleSaveJob}
          />
          <TeachingJobDialog
            open={teachingJobOpen}
            onOpenChange={setTeachingJobOpen}
            partner={jobPartner}
            onSave={handleSaveJob}
          />
        </>
      )}
    </AdminListPage>
  )
}
