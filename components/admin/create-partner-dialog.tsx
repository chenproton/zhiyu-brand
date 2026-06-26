"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Upload, X } from "lucide-react"
import {
  INDUSTRIES,
  SECONDARY_COLLEGES,
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
} from "@/lib/types"
import type { CooperationStatus, CooperationRating, NamedPhoto, Partner, EnterpriseType } from "@/lib/types"

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

interface CreatePartnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPartner?: Partner | null
  onSubmit: (partner: Partner) => void
}

function partnerToFormState(partner: Partner | null | undefined): PartnerFormState {
  if (!partner) return { ...emptyPartnerForm }
  return {
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
  }
}

export function CreatePartnerDialog({ open, onOpenChange, editingPartner, onSubmit }: CreatePartnerDialogProps) {
  const isEditing = Boolean(editingPartner)
  const [partnerForm, setPartnerForm] = useState<PartnerFormState>(partnerToFormState(editingPartner))

  const licenseFileRef = useRef<HTMLInputElement>(null)
  const ipFileRef = useRef<HTMLInputElement>(null)
  const qualFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const coverImageFileRef = useRef<HTMLInputElement>(null)

  // 当 open 或 editingPartner 变化时同步表单
  useEffect(() => {
    if (open) {
      setPartnerForm(partnerToFormState(editingPartner))
    }
  }, [open, editingPartner])

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

  const handleSubmit = () => {
    const base = {
      ...partnerForm,
      type: 'enterprise' as const,
      region: editingPartner?.region || '',
      cooperationTypes: (editingPartner as unknown as { cooperationTypes?: string[] })?.cooperationTypes || [],
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
    } as unknown as Partner
    const partner = isEditing
      ? { ...base, id: editingPartner!.id, createdAt: editingPartner!.createdAt }
      : { ...base, id: `custom-${Date.now()}`, createdAt: new Date() }
    onSubmit(partner)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑合作企业" : "新增独立雇主企业"}</DialogTitle>
          <DialogDescription>{isEditing ? "修改合作企业档案信息" : "从零创建一个新的独立雇主企业档案"}</DialogDescription>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? "保存修改" : "确认新增"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
