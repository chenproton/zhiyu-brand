'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ArrowLeft, Save } from 'lucide-react'
import { partners } from '@/lib/mock-data'
import { AGREEMENT_STATUS_LABELS } from '@/lib/types'
import type { AgreementStatus } from '@/lib/types'

const AGREEMENT_TYPES = [
  '战略合作协议',
  '产学研合作协议',
  '实习实训协议',
  '人才培养协议',
  '就业合作协议',
  '课程共建协议',
  '技术服务协议',
]

export default function NewAgreementPage() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    partnerId: '',
    type: '',
    content: '',
    startDate: '',
    endDate: '',
    status: 'draft' as AgreementStatus,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save to database here
    alert('协议信息已保存（演示）')
    router.push('/admin/agreements')
  }

  return (
    <>
      <AdminHeader title="新增合作协议" />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/agreements">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">协议信息</CardTitle>
                <CardDescription>填写合作协议的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">协议名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="请输入协议名称"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnerId">合作主体 *</Label>
                    <Select
                      value={formData.partnerId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, partnerId: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择合作主体" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">协议类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择协议类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGREEMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">生效日期 *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">到期日期 *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">协议状态</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value as AgreementStatus }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGREEMENT_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">协议概要</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="请输入协议主要内容概要"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">附件上传</CardTitle>
                <CardDescription>上传协议扫描件或电子文档</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">
                    拖拽文件到此处或点击上传
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    支持 PDF、Word 格式，单个文件不超过 10MB
                  </p>
                  <Button type="button" variant="outline" className="mt-4">
                    选择文件
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/admin/agreements">
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
      </main>
    </>
  )
}
