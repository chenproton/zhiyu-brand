'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { partners, projects } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS, SECONDARY_COLLEGES } from '@/lib/types'
import type { ProjectPhase } from '@/lib/types'

const PROJECT_TYPES = [
  '人才培养项目',
  '技术研发项目',
  '基地建设项目',
  '技能竞赛项目',
  '创新创业项目',
  '师资培训项目',
  '课程开发项目',
]

export default function NewProjectPage() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    partnerIds: [] as string[],
    type: '',
    phase: 'initiation' as ProjectPhase,
    secondaryCollege: '',
    description: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newProject = {
      id: `proj${Date.now()}`,
      name: formData.name,
      partnerId: formData.partnerIds[0] || '',
      partnerName: partners.find((p) => p.id === formData.partnerIds[0])?.name || '',
      partnerIds: formData.partnerIds,
      type: formData.type,
      phase: formData.phase,
      secondaryCollege: formData.secondaryCollege || undefined,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      milestones: [],
      supportingResults: [],
      projectAgreements: [],
      phases: [],
      publishStatus: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    projects.push(newProject as any)

    alert('项目已新增（演示）')
    setIsSubmitting(false)
    router.push('/admin/projects')
  }

  const togglePartner = (partnerId: string) => {
    setFormData((prev) => ({
      ...prev,
      partnerIds: prev.partnerIds.includes(partnerId)
        ? prev.partnerIds.filter((id) => id !== partnerId)
        : [...prev.partnerIds, partnerId],
    }))
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">项目信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">项目名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入项目名称"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">合作类型 *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择合作类型" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phase">项目阶段</Label>
                      <Select
                        value={formData.phase}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, phase: value as ProjectPhase }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROJECT_PHASE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryCollege">关联二级学院</Label>
                      <Select
                        value={formData.secondaryCollege}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, secondaryCollege: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择关联二级学院" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECONDARY_COLLEGES.map((college) => (
                            <SelectItem key={college} value={college}>{college}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>合作主体 *</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                      {partners.map((partner) => (
                        <Badge
                          key={partner.id}
                          variant={formData.partnerIds.includes(partner.id) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => togglePartner(partner.id)}
                        >
                          {partner.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">点击标签进行选择，支持多选</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">开始日期 *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">结束日期 *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">项目简介</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="请输入项目简介"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? '保存中...' : '保存'}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin/projects">取消</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
