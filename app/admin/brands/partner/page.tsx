"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { ArrowLeft, Search, Plus, Pencil, Trash2, Building2, MapPin, Users, Briefcase } from "lucide-react"
import { jobs, partners } from "@/lib/mock-data"
import { JobActionButtons, NonTeachingJobDialog, TeachingJobDialog } from "@/components/admin/job-brand-tools"
import {
  INDUSTRIES,
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
            新增独立雇主品牌
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            引用已有企业
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 rounded-lg shrink-0">
                  <AvatarImage src={partner.logo} className="object-cover" />
                  <AvatarFallback className="rounded-lg">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground truncate">{partner.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {partner.id.startsWith('custom-') ? (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            独立雇主品牌
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            合作企业
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{partner.description}</p>

              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{partner.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                  <span>{partner.industry}</span>
                </div>
                {partner.employeeCount && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{partner.employeeCount}人</span>
                  </div>
                )}
              </div>

              {!partner.id.startsWith('custom-') && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {partner.cooperationTypes.slice(0, 3).map((type) => (
                    <Badge key={type} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {type}
                    </Badge>
                  ))}
                  {partner.cooperationTypes.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      +{partner.cooperationTypes.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  教学岗位 {localJobs.filter((job) => job.partnerId === partner.id && job.jobCategory === "teaching").length}
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  非教学岗位 {localJobs.filter((job) => job.partnerId === partner.id && job.jobCategory === "non-teaching").length}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t">
                <div className="flex gap-1.5">
                  <Link href={`/admin/brands/partner/${partner.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                      查看详情
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => openEdit(partner)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => handleDelete(partner.id)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredPartners.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            没有找到符合条件的雇主品牌
          </div>
        )}
      </div>

      {/* 引用已有企业 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>引用已有企业</DialogTitle>
            <DialogDescription>从合作主体库中选择要展示的品牌</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择企业</Label>
              <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择企业" />
                </SelectTrigger>
                <SelectContent>
                  {unreferencedPartners.length === 0 && (
                    <SelectItem value="__empty__" disabled>
                      没有可引用的企业
                    </SelectItem>
                  )}
                  {unreferencedPartners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} — {partner.industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedPartnerId(""); setDialogOpen(false) }}>
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

      {/* 新增独立雇主品牌 Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增独立雇主品牌</DialogTitle>
            <DialogDescription>从零创建一个新的雇主品牌</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>主体名称</Label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入主体名称"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="space-y-2">
              <Label>地区</Label>
              <Input
                value={createForm.region}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, region: e.target.value }))}
                placeholder="如 江苏省苏州市"
              />
            </div>
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
            <div className="space-y-2">
              <Label>详细地址</Label>
              <Input
                value={createForm.address || ""}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="请输入详细地址"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="space-y-2">
              <Label>品牌描述</Label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="请输入品牌描述..."
              />
            </div>
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
