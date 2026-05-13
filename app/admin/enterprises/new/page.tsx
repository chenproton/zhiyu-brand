'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  INDUSTRIES,
  SECONDARY_COLLEGES,
} from '@/lib/types'
import type { CooperationStatus, CooperationRating } from '@/lib/types'

export default function NewEnterprisePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const ipFileInputRef = useRef<HTMLInputElement>(null)
  const qualFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    enterpriseType: 'school-based' as const,
    industry: '',
    status: 'negotiating' as CooperationStatus,
    rating: 'general' as CooperationRating,
    description: '',
    unifiedSocialCreditCode: '',
    businessLicensePhotos: [] as string[],
    intellectualPropertyPhotos: [] as string[],
    qualificationPhotos: [] as string[],
    coverPhotos: [] as string[],
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    establishedYear: '',
    employeeCount: '',
    secondaryColleges: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('企业信息已保存（演示）')
    router.push('/admin/enterprises')
  }

  const handleFileChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, [field]: [...(prev[field] as string[]), ...newPhotos] }))
    }
    e.target.value = ''
  }

  const removePhoto = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const toggleSecondaryCollege = (college: string) => {
    setFormData((prev) => ({
      ...prev,
      secondaryColleges: prev.secondaryColleges.includes(college)
        ? prev.secondaryColleges.filter((c) => c !== college)
        : [...prev.secondaryColleges, college],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/enterprises">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">新增企业</h1>
        <p className="text-muted-foreground">录入新的企业档案信息</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>企业名称 *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入企业全称"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>统一社会信用代码 *</Label>
                  <Input
                    value={formData.unifiedSocialCreditCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, unifiedSocialCreditCode: e.target.value }))}
                    placeholder="如：91320594MA1P7XXXX1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>所属行业</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>合作状态</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as typeof formData.status }))}
                  >
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
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, rating: value as typeof formData.rating }))}
                  >
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
                <div className="space-y-2 md:col-span-2">
                  <Label>企业简介</Label>
                  <Textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="请输入企业简介..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">营业执照照片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange('businessLicensePhotos')}
                />
                <div className="flex flex-wrap gap-3">
                  {formData.businessLicensePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`营业执照 ${index + 1}`}
                        className="w-32 h-40 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto('businessLicensePhotos', index)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">知识产权照片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={ipFileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange('intellectualPropertyPhotos')} />
                <div className="flex flex-wrap gap-3">
                  {formData.intellectualPropertyPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`知识产权 ${index + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removePhoto('intellectualPropertyPhotos', index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => ipFileInputRef.current?.click()}>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">上传照片</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">企业资质证明材料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={qualFileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange('qualificationPhotos')} />
                <div className="flex flex-wrap gap-3">
                  {formData.qualificationPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`资质证明 ${index + 1}`} className="w-32 h-40 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removePhoto('qualificationPhotos', index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-32 h-40 flex flex-col items-center justify-center gap-2 border-dashed" onClick={() => qualFileInputRef.current?.click()}>
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
                  <Label>联系人</Label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="space-y-2">
                  <Label>联系邮箱</Label>
                  <Input
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="请输入联系邮箱"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>详细地址</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入企业地址"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>成立年份</Label>
                  <Input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData((prev) => ({ ...prev, establishedYear: e.target.value }))}
                    placeholder="如：2010"
                  />
                </div>
                <div className="space-y-2">
                  <Label>员工规模</Label>
                  <Input
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employeeCount: e.target.value }))}
                    placeholder="如：500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>关联二级学院</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {SECONDARY_COLLEGES.map((college) => (
                      <Badge
                        key={college}
                        variant={formData.secondaryColleges.includes(college) ? 'default' : 'outline'}
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

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/enterprises">取消</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
