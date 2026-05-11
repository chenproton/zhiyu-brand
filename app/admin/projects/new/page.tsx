'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { partners } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'
import type { ProjectPhase, ProjectSupportingResult, ProjectAgreement, ProjectPhaseItem } from '@/lib/types'

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
    description: '',
    startDate: '',
    endDate: '',
    supportingResults: [] as ProjectSupportingResult[],
    projectAgreements: [] as ProjectAgreement[],
    phases: [] as ProjectPhaseItem[],
  })

  const [newResult, setNewResult] = useState({ name: '', type: '', description: '' })
  const [newAgreement, setNewAgreement] = useState({ name: '', type: '', startDate: '', endDate: '', content: '' })
  const [newPhase, setNewPhase] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'pending' as ProjectPhaseItem['status'] })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('项目信息已保存（演示）')
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

  const addResult = () => {
    if (newResult.name.trim()) {
      const item: ProjectSupportingResult = {
        id: `sr${Date.now()}`,
        name: newResult.name.trim(),
        type: newResult.type.trim() || '其他',
        description: newResult.description.trim(),
        createdAt: new Date(),
      }
      setFormData((prev) => ({ ...prev, supportingResults: [...prev.supportingResults, item] }))
      setNewResult({ name: '', type: '', description: '' })
    }
  }

  const removeResult = (id: string) => {
    setFormData((prev) => ({ ...prev, supportingResults: prev.supportingResults.filter((r) => r.id !== id) }))
  }

  const addAgreement = () => {
    if (newAgreement.name.trim() && newAgreement.startDate && newAgreement.endDate) {
      const item: ProjectAgreement = {
        id: `pa${Date.now()}`,
        name: newAgreement.name.trim(),
        type: newAgreement.type.trim() || '合作协议',
        startDate: new Date(newAgreement.startDate),
        endDate: new Date(newAgreement.endDate),
        status: 'active',
        content: newAgreement.content.trim(),
        createdAt: new Date(),
      }
      setFormData((prev) => ({ ...prev, projectAgreements: [...prev.projectAgreements, item] }))
      setNewAgreement({ name: '', type: '', startDate: '', endDate: '', content: '' })
    }
  }

  const removeAgreement = (id: string) => {
    setFormData((prev) => ({ ...prev, projectAgreements: prev.projectAgreements.filter((a) => a.id !== id) }))
  }

  const addPhase = () => {
    if (newPhase.name.trim() && newPhase.startDate) {
      const item: ProjectPhaseItem = {
        id: `ph${Date.now()}`,
        name: newPhase.name.trim(),
        description: newPhase.description.trim(),
        startDate: new Date(newPhase.startDate),
        endDate: newPhase.endDate ? new Date(newPhase.endDate) : undefined,
        status: newPhase.status,
        progress: 0,
      }
      setFormData((prev) => ({ ...prev, phases: [...prev.phases, item] }))
      setNewPhase({ name: '', description: '', startDate: '', endDate: '', status: 'pending' })
    }
  }

  const removePhase = (id: string) => {
    setFormData((prev) => ({ ...prev, phases: prev.phases.filter((p) => p.id !== id) }))
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
                  <CardDescription>填写项目的基本信息</CardDescription>
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">项目类型 *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择项目类型" />
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

          <Tabs defaultValue="supportingResults" className="space-y-4">
            <TabsList>
              <TabsTrigger value="supportingResults">配套成果 ({formData.supportingResults.length})</TabsTrigger>
              <TabsTrigger value="projectAgreements">项目协议 ({formData.projectAgreements.length})</TabsTrigger>
              <TabsTrigger value="phases">项目阶段 ({formData.phases.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="supportingResults">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">配套成果管理</CardTitle>
                  <CardDescription>管理项目的配套产出成果</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input placeholder="成果名称" value={newResult.name} onChange={(e) => setNewResult({ ...newResult, name: e.target.value })} />
                    <Input placeholder="成果类型" value={newResult.type} onChange={(e) => setNewResult({ ...newResult, type: e.target.value })} />
                    <Input placeholder="成果描述" value={newResult.description} onChange={(e) => setNewResult({ ...newResult, description: e.target.value })} />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addResult}>
                    <Plus className="h-4 w-4 mr-1" />添加成果
                  </Button>
                  {formData.supportingResults.length > 0 && (
                    <div className="space-y-2">
                      {formData.supportingResults.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{result.name}</p>
                            <p className="text-xs text-muted-foreground">{result.type} · {result.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeResult(result.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projectAgreements">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">项目协议管理</CardTitle>
                  <CardDescription>管理项目相关的合作协议</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input placeholder="协议名称" value={newAgreement.name} onChange={(e) => setNewAgreement({ ...newAgreement, name: e.target.value })} />
                    <Input placeholder="协议类型" value={newAgreement.type} onChange={(e) => setNewAgreement({ ...newAgreement, type: e.target.value })} />
                    <Input type="date" placeholder="开始日期" value={newAgreement.startDate} onChange={(e) => setNewAgreement({ ...newAgreement, startDate: e.target.value })} />
                    <Input type="date" placeholder="结束日期" value={newAgreement.endDate} onChange={(e) => setNewAgreement({ ...newAgreement, endDate: e.target.value })} />
                  </div>
                  <Textarea placeholder="协议内容" value={newAgreement.content} onChange={(e) => setNewAgreement({ ...newAgreement, content: e.target.value })} rows={2} />
                  <Button type="button" variant="outline" size="sm" onClick={addAgreement}>
                    <Plus className="h-4 w-4 mr-1" />添加协议
                  </Button>
                  {formData.projectAgreements.length > 0 && (
                    <div className="space-y-2">
                      {formData.projectAgreements.map((agreement) => (
                        <div key={agreement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{agreement.name}</p>
                            <p className="text-xs text-muted-foreground">{agreement.type} · {agreement.startDate.toLocaleDateString('zh-CN')} 至 {agreement.endDate.toLocaleDateString('zh-CN')}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeAgreement(agreement.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phases">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">项目阶段管理</CardTitle>
                  <CardDescription>管理项目的阶段与进展</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input placeholder="阶段名称" value={newPhase.name} onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })} />
                    <Input placeholder="阶段描述" value={newPhase.description} onChange={(e) => setNewPhase({ ...newPhase, description: e.target.value })} />
                    <Select value={newPhase.status} onValueChange={(value) => setNewPhase({ ...newPhase, status: value as ProjectPhaseItem['status'] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">待开始</SelectItem>
                        <SelectItem value="in-progress">进行中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                        <SelectItem value="delayed">延期</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input type="date" placeholder="开始日期" value={newPhase.startDate} onChange={(e) => setNewPhase({ ...newPhase, startDate: e.target.value })} />
                    <Input type="date" placeholder="结束日期" value={newPhase.endDate} onChange={(e) => setNewPhase({ ...newPhase, endDate: e.target.value })} />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                    <Plus className="h-4 w-4 mr-1" />添加阶段
                  </Button>
                  {formData.phases.length > 0 && (
                    <div className="space-y-2">
                      {formData.phases.map((phase) => (
                        <div key={phase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{phase.name}</p>
                              <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'} className="text-[10px]">
                                {phase.status === 'completed' ? '已完成' : phase.status === 'in-progress' ? '进行中' : phase.status === 'delayed' ? '延期' : '待开始'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{phase.description} · {phase.startDate.toLocaleDateString('zh-CN')} {phase.endDate ? `至 ${phase.endDate.toLocaleDateString('zh-CN')}` : ''}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removePhase(phase.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </div>
  )
}
