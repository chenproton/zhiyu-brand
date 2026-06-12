"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Search, Plus, Pencil, Trash2, Upload, X, MoreHorizontal, Eye } from "lucide-react"
import { jobs, partners } from "@/lib/mock-data"
import { JobActionButtons, NonTeachingJobDialog, TeachingJobDialog } from "@/components/admin/job-brand-tools"
import {
  INDUSTRIES,
  SECONDARY_COLLEGES,
  PARTNER_TYPE_LABELS,
  COOPERATION_STATUS_LABELS,
} from "@/lib/types"
import type { Job, Partner, PartnerType } from "@/lib/types"

const emptyPartner: Omit<Partner, "id" | "createdAt" | "updatedAt"> = {
  type: "enterprise",
  name: "",
  industry: INDUSTRIES[0],
  region: "",
  description: "",
  logo: undefined,
  status: "active",
  rating: "general",
  cooperationTypes: [],
  contactPerson: undefined,
  contactPhone: undefined,
  contactEmail: undefined,
  address: undefined,
  establishedYear: undefined,
  employeeCount: undefined,
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
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

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

  // Edit form states
  const [formDescription, setFormDescription] = useState("")
  const [formCooperationTypes, setFormCooperationTypes] = useState("")
  const [formContactPerson, setFormContactPerson] = useState("")
  const [formContactPhone, setFormContactPhone] = useState("")
  const [formIndustry, setFormIndustry] = useState("")
  const [formRegion, setFormRegion] = useState("")
  const [formStatus, setFormStatus] = useState<Partner["status"]>('active')

  // Create form states
  const [createForm, setCreateForm] = useState({ ...emptyPartner })

  // Photo upload refs & state
  const licenseFileRef = useRef<HTMLInputElement>(null)
  const ipFileRef = useRef<HTMLInputElement>(null)
  const qualFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const [licensePhotos, setLicensePhotos] = useState<string[]>([])
  const [ipPhotos, setIpPhotos] = useState<string[]>([])
  const [qualPhotos, setQualPhotos] = useState<string[]>([])
  const [coverPhotos, setCoverPhotos] = useState<string[]>([])

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file))
      setter((prev) => [...prev, ...newPhotos])
    }
    e.target.value = ''
  }

  const removePhoto = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index))
  }

  const resetCreatePhotos = () => {
    setLicensePhotos([])
    setIpPhotos([])
    setQualPhotos([])
    setCoverPhotos([])
  }

  const filteredPartners = displayedPartners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || partner.type === typeFilter
    const matchesIndustry = industryFilter === "all" || partner.industry === industryFilter
    const matchesRating = ratingFilter === "all" || partner.rating === ratingFilter
    return matchesSearch && matchesType && matchesIndustry && matchesRating
  })

  const openEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormDescription(partner.description)
    setFormCooperationTypes(partner.cooperationTypes.join(", "))
    setFormContactPerson(partner.contactPerson || "")
    setFormContactPhone(partner.contactPhone || "")
    setFormIndustry(partner.industry)
    setFormRegion(partner.region)
    setFormStatus(partner.status)
    setEditDialogOpen(true)
  }

  const openCreate = () => {
    setCreateForm({ ...emptyPartner })
    resetCreatePhotos()
    setCreateDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingPartner) return
    setDisplayedPartners((prev) =>
      prev.map((p) =>
        p.id === editingPartner.id
          ? {
              ...p,
              description: formDescription,
              cooperationTypes: formCooperationTypes
                .split(/,|，/)
                .map((s) => s.trim())
                .filter(Boolean),
              contactPerson: formContactPerson || undefined,
              contactPhone: formContactPhone || undefined,
              industry: formIndustry,
              region: formRegion,
              status: formStatus,
              updatedAt: new Date(),
            }
          : p
      )
    )
    setEditDialogOpen(false)
    setEditingPartner(null)
  }

  const handleCreate = () => {
    const newPartner: Partner = {
      ...createForm,
      id: `custom-${Date.now()}`,
      cooperationTypes: [],
      contactPerson: createForm.contactPerson || undefined,
      contactPhone: createForm.contactPhone || undefined,
      contactEmail: createForm.contactEmail || undefined,
      address: createForm.address || undefined,
      establishedYear: createForm.establishedYear || undefined,
      employeeCount: createForm.employeeCount || undefined,
      businessLicensePhotos: licensePhotos.length > 0 ? licensePhotos : undefined,
      intellectualPropertyPhotos: ipPhotos.length > 0 ? ipPhotos : undefined,
      qualificationPhotos: qualPhotos.length > 0 ? qualPhotos : undefined,
      coverPhotos: coverPhotos.length > 0 ? coverPhotos : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">雇主品牌管理</h1>
          <p className="text-muted-foreground">管理合作主体的品牌展示配置</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索主体名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="主体类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="enterprise">企业</SelectItem>
              <SelectItem value="association">行业协会</SelectItem>
              <SelectItem value="park">产业园区</SelectItem>
              <SelectItem value="institution">机构</SelectItem>
            </SelectContent>
          </Select>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
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
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="合作深度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部深度</SelectItem>
              <SelectItem value="strategic">战略合作</SelectItem>
              <SelectItem value="deep">深度合作</SelectItem>
              <SelectItem value="general">一般合作</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            新增独立雇主企业
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            从合作企业库引用
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>主体名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>行业</TableHead>
              <TableHead>地区</TableHead>
              <TableHead>合作方式</TableHead>
              <TableHead>关联岗位</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[50px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => {
                const partnerJobs = localJobs.filter((job) => job.partnerId === partner.id)
                return (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <span className="font-medium">{partner.name}</span>
                    </TableCell>
                    <TableCell>{PARTNER_TYPE_LABELS[partner.type]}</TableCell>
                    <TableCell>{partner.industry}</TableCell>
                    <TableCell>{partner.region}</TableCell>
                    <TableCell>
                      {partner.cooperationTypes.length > 0
                        ? partner.cooperationTypes.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {partnerJobs.length > 0
                        ? partnerJobs.map((job) => job.title).join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>{COOPERATION_STATUS_LABELS[partner.status]}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/brands/partner/${partner.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(partner)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(partner.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  没有找到符合条件的雇主品牌
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑雇主品牌</DialogTitle>
            <DialogDescription>修改合作主体的品牌展示信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>主体名称</Label>
              <Input value={editingPartner?.name || ""} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>所属行业</Label>
                <Select value={formIndustry} onValueChange={setFormIndustry}>
                  <SelectTrigger>
                    <SelectValue />
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
              {!editingPartner?.id.startsWith('custom-') && (
                <div className="space-y-2">
                  <Label>合作状态</Label>
                  <Select value={formStatus} onValueChange={(v) => setFormStatus(v as Partner["status"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">合作中</SelectItem>
                      <SelectItem value="negotiating">洽谈中</SelectItem>
                      <SelectItem value="paused">已暂停</SelectItem>
                      <SelectItem value="terminated">已终止</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>地区</Label>
              <Input
                value={formRegion}
                onChange={(e) => setFormRegion(e.target.value)}
                placeholder="如 江苏省苏州市"
              />
            </div>
            <div className="space-y-2">
              <Label>联系人</Label>
              <Input
                value={formContactPerson}
                onChange={(e) => setFormContactPerson(e.target.value)}
                placeholder="请输入联系人姓名"
              />
            </div>
            <div className="space-y-2">
              <Label>联系电话</Label>
              <Input
                value={formContactPhone}
                onChange={(e) => setFormContactPhone(e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
            {!editingPartner?.id.startsWith('custom-') && (
              <div className="space-y-2">
                <Label>合作类型（逗号分隔）</Label>
                <Input
                  value={formCooperationTypes}
                  onChange={(e) => setFormCooperationTypes(e.target.value)}
                  placeholder="如 人才培养, 实习实训, 技术研发"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>品牌描述</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                placeholder="请输入品牌描述..."
              />
            </div>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                    value={createForm.name}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入企业全称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>主体类型</Label>
                  <Select
                    value={createForm.type}
                    onValueChange={(v) => setCreateForm((prev) => ({ ...prev, type: v as PartnerType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">企业</SelectItem>
                      <SelectItem value="association">行业协会</SelectItem>
                      <SelectItem value="park">产业园区</SelectItem>
                      <SelectItem value="institution">机构</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>所属行业</Label>
                  <Select
                    value={createForm.industry}
                    onValueChange={(v) => setCreateForm((prev) => ({ ...prev, industry: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <div className="space-y-2 md:col-span-2">
                  <Label>地区</Label>
                  <Input
                    value={createForm.region}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, region: e.target.value }))}
                    placeholder="如 江苏省苏州市"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>品牌描述</Label>
                  <Textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="请输入品牌描述..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>联系人</Label>
                  <Input
                    value={createForm.contactPerson || ""}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input
                    value={createForm.contactPhone || ""}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系邮箱</Label>
                  <Input
                    value={createForm.contactEmail || ""}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="请输入联系邮箱"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>详细地址</Label>
                  <Input
                    value={createForm.address || ""}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入详细地址"
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
                    value={createForm.establishedYear || ""}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, establishedYear: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="如 2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label>员工人数</Label>
                  <Input
                    type="number"
                    value={createForm.employeeCount || ""}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, employeeCount: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="如 500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>关联二级学院</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {SECONDARY_COLLEGES.map((college) => (
                      <Badge
                        key={college}
                        variant={(createForm.secondaryColleges || []).includes(college) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() =>
                          setCreateForm((prev) => ({
                            ...prev,
                            secondaryColleges: (prev.secondaryColleges || []).includes(college)
                              ? (prev.secondaryColleges || []).filter((c) => c !== college)
                              : [...(prev.secondaryColleges || []), college],
                          }))
                        }
                      >
                        {college}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">点击标签进行选择，支持多选</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">资质材料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 营业执照 */}
                <div className="space-y-2">
                  <Label>营业执照照片</Label>
                  <input ref={licenseFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange(setLicensePhotos)} />
                  <div className="flex flex-wrap gap-3">
                    {licensePhotos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img src={photo} alt={`营业执照 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removePhoto(setLicensePhotos, idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-dashed" onClick={() => licenseFileRef.current?.click()}>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">上传</span>
                    </Button>
                  </div>
                </div>
                {/* 知识产权 */}
                <div className="space-y-2">
                  <Label>知识产权照片</Label>
                  <input ref={ipFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange(setIpPhotos)} />
                  <div className="flex flex-wrap gap-3">
                    {ipPhotos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img src={photo} alt={`知识产权 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removePhoto(setIpPhotos, idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-dashed" onClick={() => ipFileRef.current?.click()}>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">上传</span>
                    </Button>
                  </div>
                </div>
                {/* 企业资质 */}
                <div className="space-y-2">
                  <Label>企业资质证明材料</Label>
                  <input ref={qualFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange(setQualPhotos)} />
                  <div className="flex flex-wrap gap-3">
                    {qualPhotos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img src={photo} alt={`资质 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removePhoto(setQualPhotos, idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-dashed" onClick={() => qualFileRef.current?.click()}>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">上传</span>
                    </Button>
                  </div>
                </div>
                {/* 封面 */}
                <div className="space-y-2">
                  <Label>封面照片</Label>
                  <input ref={coverFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange(setCoverPhotos)} />
                  <div className="flex flex-wrap gap-3">
                    {coverPhotos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img src={photo} alt={`封面 ${idx + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removePhoto(setCoverPhotos, idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-dashed" onClick={() => coverFileRef.current?.click()}>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">上传</span>
                    </Button>
                  </div>
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
    </div>
  )
}
