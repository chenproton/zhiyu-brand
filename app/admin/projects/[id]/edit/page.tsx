'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
import { ArrowLeft, Save, Send } from 'lucide-react'
import { projects, partners } from '@/lib/mock-data'
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

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    partnerIds: [] as string[],
    type: '',
    phase: 'initiation' as ProjectPhase,
    secondaryColleges: [] as string[],
    description: '',
    startDate: '',
    endDate: '',
    publishStatus: 'draft' as 'draft' | 'published',
  })

  // Keep references to sub-data so we don't lose them on save
  const [supportingResults, setSupportingResults] = useState<any[]>([])
  const [projectAgreements, setProjectAgreements] = useState<any[]>([])
  const [phases, setPhases] = useState<any[]>([])

  useEffect(() => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      setNotFound(true)
      return
    }
    setFormData({
      name: project.name,
      partnerIds: project.partnerIds?.length ? project.partnerIds : [project.partnerId],
      type: project.type,
      phase: project.phase,
      secondaryColleges: project.secondaryColleges || [],
      description: project.description,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate.toISOString().split('T')[0],
      publishStatus: project.publishStatus,
    })
    setSupportingResults(project.supportingResults || [])
    setProjectAgreements(project.projectAgreements || [])
    setPhases(project.phases || [])
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent, action?: 'save' | 'publish') => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const project = projects.find((p) => p.id === projectId)
    if (project) {
      project.name = formData.name
      project.partnerIds = formData.partnerIds
      project.partnerId = formData.partnerIds[0] || ''
      project.partnerName = partners.find((p) => p.id === formData.partnerIds[0])?.name || ''
      project.type = formData.type
      project.phase = formData.phase
      project.secondaryColleges = formData.secondaryColleges.length > 0 ? formData.secondaryColleges : undefined
      project.description = formData.description
      project.startDate = new Date(formData.startDate)
      project.endDate = new Date(formData.endDate)
      // Preserve sub-data managed on detail page
      project.supportingResults = supportingResults
      project.projectAgreements = projectAgreements
      project.phases = phases
      if (action === 'publish') {
        project.publishStatus = 'published'
      }
      project.updatedAt = new Date()
    }

    alert(action === 'publish' ? '项目已发布（演示）' : '项目信息已保存（演示）')
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

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">项目不存在</h1>
        <p className="text-muted-foreground mb-6">该项目可能已被删除或 ID 不正确</p>
        <Link href="/admin/projects">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>
    )
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

      <form onSubmit={(e) => handleSubmit(e, 'save')}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">当前状态：</span>
            <Badge variant={formData.publishStatus === 'published' ? 'default' : 'secondary'}>
              {formData.publishStatus === 'published' ? '已发布' : '草稿'}
            </Badge>
          </div>

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
                      <Label htmlFor="secondaryColleges">关联二级学院</Label>
                      <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                        {SECONDARY_COLLEGES.map((college) => (
                          <Badge
                            key={college}
                            variant={formData.secondaryColleges.includes(college) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                secondaryColleges: prev.secondaryColleges.includes(college)
                                  ? prev.secondaryColleges.filter((c) => c !== college)
                                  : [...prev.secondaryColleges, college],
                              }))
                            }
                          >
                            {college}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">点击标签进行选择，支持多选</p>
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
                  <Button type="submit" className="w-full" disabled={isSubmitting} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? '保存中...' : '保存草稿'}
                  </Button>
                  {formData.publishStatus !== 'published' && (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      className="w-full"
                      onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'publish')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      发布项目
                    </Button>
                  )}
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
