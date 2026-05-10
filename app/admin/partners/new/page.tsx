'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import {
  PARTNER_TYPE_LABELS,
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  INDUSTRIES,
  COOPERATION_TYPES,
} from '@/lib/types'
import type { PartnerType, CooperationStatus, CooperationRating } from '@/lib/types'

export default function NewPartnerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '' as PartnerType | '',
    industry: '',
    region: '',
    description: '',
    status: 'negotiating' as CooperationStatus,
    rating: 'general' as CooperationRating,
    cooperationTypes: [] as string[],
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    establishedYear: '',
    employeeCount: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save to database here
    alert('主体信息已保存（演示）')
    router.push('/admin/partners')
  }

  const handleCooperationTypeChange = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      cooperationTypes: checked
        ? [...prev.cooperationTypes, type]
        : prev.cooperationTypes.filter((t) => t !== type),
    }))
  }

  return (
    <div>
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/partners">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
                <CardDescription>填写合作主体的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">主体名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="请输入主体名称"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">主体类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value as PartnerType }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择主体类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PARTNER_TYPE_LABELS)
                          .filter(([key]) => key !== 'expert')
                          .map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">所属行业 *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, industry: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择所属行业" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">所在地区 *</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, region: e.target.value }))
                      }
                      placeholder="如：江苏省苏州市"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">主体简介</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="请输入主体简介"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cooperation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">合作信息</CardTitle>
                <CardDescription>设置合作状态和合作类型</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">合作状态</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value as CooperationStatus,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COOPERATION_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">合作深度</Label>
                    <Select
                      value={formData.rating}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: value as CooperationRating,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>合作类型</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {COOPERATION_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`coop-${type}`}
                          checked={formData.cooperationTypes.includes(type)}
                          onCheckedChange={(checked) =>
                            handleCooperationTypeChange(type, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`coop-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系信息</CardTitle>
                <CardDescription>填写主体的联系方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">联系人</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))
                      }
                      placeholder="联系人姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">联系电话</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))
                      }
                      placeholder="联系电话"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">电子邮箱</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                      }
                      placeholder="电子邮箱"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">详细地址</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="详细地址"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Other Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">成立年份</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, establishedYear: e.target.value }))
                      }
                      placeholder="如：2010"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">员工规模</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={formData.employeeCount}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, employeeCount: e.target.value }))
                      }
                      placeholder="员工人数"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/admin/partners">
                <Button type="button" variant="outline">
                  取消
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </form>
    </div>
  )
}
