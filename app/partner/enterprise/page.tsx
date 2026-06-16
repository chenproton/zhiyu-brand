'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Save, Building2 } from 'lucide-react'
import { FakeRichTextEditor } from '@/components/shared/fake-rich-text-editor'
import { Badge } from '@/components/ui/badge'
import { enterprises } from '@/lib/mock-data'
import {
  ENTERPRISE_TYPE_LABELS,
  INDUSTRIES,
  SECONDARY_COLLEGES,
} from '@/lib/types'
import type { EnterpriseType } from '@/lib/types'
import { usePartner } from '../partner-context'

export default function PartnerEnterprisePage() {
  const router = useRouter()
  const { selectedEnterpriseId } = usePartner()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    enterpriseType: 'platform' as EnterpriseType,
    industry: '',
    description: '',
    unifiedSocialCreditCode: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    establishedYear: '',
    employeeCount: '',
    secondaryColleges: [] as string[],
  })

  useEffect(() => {
    if (!selectedEnterpriseId) {
      setNotFound(true)
      return
    }
    const enterprise = enterprises.find((e) => e.id === selectedEnterpriseId)
    if (!enterprise) {
      setNotFound(true)
      return
    }
    setFormData({
      name: enterprise.name,
      enterpriseType: enterprise.enterpriseType,
      industry: enterprise.industry,
      description: enterprise.description,
      unifiedSocialCreditCode: enterprise.unifiedSocialCreditCode || '',
      contactPerson: enterprise.contactPerson || '',
      contactPhone: enterprise.contactPhone || '',
      contactEmail: enterprise.contactEmail || '',
      address: enterprise.address || '',
      establishedYear: enterprise.establishedYear?.toString() || '',
      employeeCount: enterprise.employeeCount?.toString() || '',
      secondaryColleges: enterprise.secondaryColleges || [],
    })
  }, [selectedEnterpriseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const enterprise = enterprises.find((e) => e.id === selectedEnterpriseId)
    if (enterprise) {
      enterprise.name = formData.name
      enterprise.enterpriseType = formData.enterpriseType
      enterprise.industry = formData.industry
      enterprise.description = formData.description
      enterprise.unifiedSocialCreditCode = formData.unifiedSocialCreditCode
      enterprise.contactPerson = formData.contactPerson
      enterprise.contactPhone = formData.contactPhone
      enterprise.contactEmail = formData.contactEmail
      enterprise.address = formData.address
      enterprise.establishedYear = formData.establishedYear ? parseInt(formData.establishedYear) : undefined
      enterprise.employeeCount = formData.employeeCount ? parseInt(formData.employeeCount) : undefined
      enterprise.secondaryColleges = formData.secondaryColleges.length > 0 ? formData.secondaryColleges : undefined
      enterprise.updatedAt = new Date()
    }

    alert('企业信息已保存（演示）')
    router.push('/partner/jobs')
  }

  const toggleSecondaryCollege = (college: string) => {
    setFormData((prev) => ({
      ...prev,
      secondaryColleges: prev.secondaryColleges.includes(college)
        ? prev.secondaryColleges.filter((c) => c !== college)
        : [...prev.secondaryColleges, college],
    }))
  }

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">企业信息不可用</h1>
        <p className="text-muted-foreground mb-6">未选择企业或企业不存在</p>
        <Link href="/partner/jobs">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回岗位管理
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/partner/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">企业信息管理</h1>
          <p className="text-muted-foreground">查看并维护当前企业档案信息</p>
        </div>
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
                  <Label>企业类型</Label>
                  <Select
                    value={formData.enterpriseType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, enterpriseType: value as typeof formData.enterpriseType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ENTERPRISE_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="space-y-2 md:col-span-2">
                  <Label>企业简介</Label>
                  <FakeRichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                    placeholder="请输入企业简介..."
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
                  <Label>企业联系人</Label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="请输入企业联系人姓名"
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
                  <Label>企业规模</Label>
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
                <Link href="/partner/jobs">取消</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
