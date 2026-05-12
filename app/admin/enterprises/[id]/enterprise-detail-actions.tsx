'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Link2, Search, Save, X } from 'lucide-react'
import { partners, projects } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'
import type { Achievement, ProjectPhase, ProjectSupportingResult, ProjectAgreement, ProjectPhaseItem } from '@/lib/types'
import { SupportingResultsTab } from '../../projects/_components/supporting-results-tab'

const PROJECT_TYPES = [
  '人才培养项目',
  '技术研发项目',
  '基地建设项目',
  '技能竞赛项目',
  '创新创业项目',
  '师资培训项目',
  '课程开发项目',
]

export function NewProjectButton({ defaultPartnerIds }: { defaultPartnerIds?: string[] }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    partnerIds: defaultPartnerIds || [] as string[],
    type: '',
    phase: 'initiation' as ProjectPhase,
    description: '',
    startDate: '',
    endDate: '',
    supportingResults: [] as ProjectSupportingResult[],
    projectAgreements: [] as ProjectAgreement[],
    phases: [] as ProjectPhaseItem[],
  })

  const [newAgreement, setNewAgreement] = useState({ name: '', type: '', startDate: '', endDate: '', content: '' })
  const [newPhase, setNewPhase] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'pending' as ProjectPhaseItem['status'] })

  const togglePartner = (partnerId: string) => {
    setFormData((prev) => ({
      ...prev,
      partnerIds: prev.partnerIds.includes(partnerId)
        ? prev.partnerIds.filter((id) => id !== partnerId)
        : [...prev.partnerIds, partnerId],
    }))
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
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      milestones: [],
      supportingResults: formData.supportingResults,
      projectAgreements: formData.projectAgreements,
      phases: formData.phases,
      publishStatus: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    projects.push(newProject as any)

    alert('项目已新增（演示）')
    setIsSubmitting(false)
    setOpen(false)
    // Reset form
    setFormData({
      name: '',
      partnerIds: defaultPartnerIds || [],
      type: '',
      phase: 'initiation',
      description: '',
      startDate: '',
      endDate: '',
      supportingResults: [],
      projectAgreements: [],
      phases: [],
    })
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        新增项目
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[1100px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增合作项目</DialogTitle>
            <DialogDescription>填写项目信息并保存</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">项目信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>项目名称 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="请输入项目名称"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>合作类型 *</Label>
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
                        <Label>项目阶段</Label>
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

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>开始日期 *</Label>
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>结束日期 *</Label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>项目简介</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="请输入项目简介"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Supporting Results */}
                <Tabs defaultValue="supportingResults" className="space-y-3">
                  <TabsList>
                    <TabsTrigger value="supportingResults">配套成果 ({formData.supportingResults.length})</TabsTrigger>
                    <TabsTrigger value="projectAgreements">项目协议 ({formData.projectAgreements.length})</TabsTrigger>
                    <TabsTrigger value="phases">项目阶段 ({formData.phases.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="supportingResults">
                    <SupportingResultsTab
                      results={formData.supportingResults}
                      onChange={(results) => setFormData((prev) => ({ ...prev, supportingResults: results }))}
                    />
                  </TabsContent>

                  <TabsContent value="projectAgreements">
                    <Card>
                      <CardContent className="space-y-3 pt-4">
                        <div className="grid md:grid-cols-2 gap-2">
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
                              <div key={agreement.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-sm">{agreement.name}</p>
                                  <p className="text-xs text-muted-foreground">{agreement.type} · {agreement.startDate.toLocaleDateString('zh-CN')} 至 {agreement.endDate.toLocaleDateString('zh-CN')}</p>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeAgreement(agreement.id)}>
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
                      <CardContent className="space-y-3 pt-4">
                        <div className="grid md:grid-cols-3 gap-2">
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
                        <div className="grid md:grid-cols-2 gap-2">
                          <Input type="date" placeholder="开始日期" value={newPhase.startDate} onChange={(e) => setNewPhase({ ...newPhase, startDate: e.target.value })} />
                          <Input type="date" placeholder="结束日期" value={newPhase.endDate} onChange={(e) => setNewPhase({ ...newPhase, endDate: e.target.value })} />
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addPhase}>
                          <Plus className="h-4 w-4 mr-1" />添加阶段
                        </Button>
                        {formData.phases.length > 0 && (
                          <div className="space-y-2">
                            {formData.phases.map((phase) => (
                              <div key={phase.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{phase.name}</p>
                                    <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'} className="text-[10px]">
                                      {phase.status === 'completed' ? '已完成' : phase.status === 'in-progress' ? '进行中' : phase.status === 'delayed' ? '延期' : '待开始'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{phase.description} · {phase.startDate.toLocaleDateString('zh-CN')} {phase.endDate ? `至 ${phase.endDate.toLocaleDateString('zh-CN')}` : ''}</p>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removePhase(phase.id)}>
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

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">操作</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => setOpen(false)}>
                      取消
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

const TYPE_TABS: { value: string; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'job', label: '岗位' },
  { value: 'scene', label: '场景' },
  { value: 'course', label: '课程' },
]

const SOURCE_TABS = [
  { value: 'mine', label: '我的' },
  { value: 'joint', label: '共建' },
  { value: 'public', label: '公共' },
] as const

export function LinkAchievementButton({ availableAchievements }: { availableAchievements: Achievement[] }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('mine')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let result = availableAchievements
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter)
    }
    // 模拟来源筛选
    result = result.filter((a) => {
      const hash = a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const sourceMap: Record<number, string> = { 0: 'mine', 1: 'joint', 2: 'public' }
      return sourceMap[hash % 3] === sourceFilter
    })
    if (search) {
      const s = search.toLowerCase()
      result = result.filter((a) =>
        a.name.toLowerCase().includes(s) ||
        a.type.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s)
      )
    }
    return result
  }, [search, typeFilter, sourceFilter, availableAchievements])

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleLink = () => {
    if (selectedIds.size === 0) {
      alert('请先选择要关联的成果')
      return
    }
    alert(`已关联 ${selectedIds.size} 项成果（演示）`)
    setOpen(false)
    setSelectedIds(new Set())
    setSearch('')
    setTypeFilter('all')
    setSourceFilter('mine')
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Link2 className="h-4 w-4 mr-1" />
        关联成果
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[900px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>关联合作成果</DialogTitle>
            <DialogDescription>搜索并选择要关联到该企业的合作成果</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* 一级分类：全部/岗位/场景/课程 */}
            <div className="flex gap-2">
              {TYPE_TABS.map((tab) => (
                <Button
                  key={tab.value}
                  variant={typeFilter === tab.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索成果名称、类型、描述..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 二级分类：我的/共建/公共 */}
            <div className="flex gap-2 border-t pt-3">
              {SOURCE_TABS.map((tab) => (
                <Button
                  key={tab.value}
                  variant={sourceFilter === tab.value ? 'secondary' : 'ghost'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSourceFilter(tab.value)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {filtered.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggle(achievement.id)}
                  >
                    <Checkbox
                      checked={selectedIds.has(achievement.id)}
                      onCheckedChange={() => toggle(achievement.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <Badge variant="secondary" className="text-[10px]">{achievement.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {achievement.publishDate.toLocaleDateString('zh-CN')} 发布 · {achievement.status === 'published' ? '已发布' : '草稿'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {search || typeFilter !== 'all' ? '未找到匹配的成果' : '暂无可关联的成果'}
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                已选择 {selectedIds.size} 项
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); setSelectedIds(new Set()); setSearch(''); setTypeFilter('all'); setSourceFilter('mine') }}>
                  取消
                </Button>
                <Button size="sm" onClick={handleLink} disabled={selectedIds.size === 0}>
                  确认关联
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
