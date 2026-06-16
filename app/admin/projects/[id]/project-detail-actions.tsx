'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, X, Calendar, CheckCircle2, Clock, AlertCircle, Circle, FileText, Upload } from 'lucide-react'
import type { Milestone, ProjectAgreement } from '@/lib/types'
import { AGREEMENT_STATUS_LABELS } from '@/lib/types'

// ==================== 里程碑管理 ====================

const MILESTONE_STATUS_OPTIONS = [
  { value: 'pending', label: '待开始' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'delayed', label: '延期' },
] as const

function getMilestoneIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case 'in-progress':
      return <Clock className="h-5 w-5 text-blue-600" />
    case 'delayed':
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Circle className="h-5 w-5 text-gray-300" />
  }
}

function MilestoneStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { pending: '待开始', 'in-progress': '进行中', completed: '已完成', delayed: '延期' }
  const variants: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    delayed: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[status] || variants.pending}`}>
      {labels[status] || status}
    </span>
  )
}

interface ProjectMilestoneManagerProps {
  projectId: string
  milestones: Milestone[]
  onChange: (milestones: Milestone[]) => void
}

export function ProjectMilestoneManager({ projectId, milestones, onChange }: ProjectMilestoneManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    completedDate: '',
    status: 'pending' as Milestone['status'],
  })

  const resetForm = () => {
    setForm({ name: '', description: '', dueDate: '', completedDate: '', status: 'pending' })
    setEditingId(null)
  }

  const openAdd = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (m: Milestone) => {
    setForm({
      name: m.name,
      description: m.description,
      dueDate: m.dueDate.toISOString().split('T')[0],
      completedDate: m.completedDate ? m.completedDate.toISOString().split('T')[0] : '',
      status: m.status,
    })
    setEditingId(m.id)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.dueDate) return
    if (editingId) {
      onChange(
        milestones.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: form.name.trim(),
                description: form.description.trim(),
                dueDate: new Date(form.dueDate),
                completedDate: form.completedDate ? new Date(form.completedDate) : undefined,
                status: form.status,
              }
            : m
        )
      )
    } else {
      const item: Milestone = {
        id: `ms${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        dueDate: new Date(form.dueDate),
        completedDate: form.completedDate ? new Date(form.completedDate) : undefined,
        status: form.status,
      }
      onChange([...milestones, item])
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该里程碑吗？')) {
      onChange(milestones.filter((m) => m.id !== id))
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" />
          新增里程碑
        </Button>
      </div>

      {milestones.length > 0 ? (
        <div className="relative">
          <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="relative flex gap-4">
                <div className="relative z-10 bg-white">{getMilestoneIcon(milestone.status)}</div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{milestone.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MilestoneStatusBadge status={milestone.status} />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(milestone)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(milestone.id)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      计划: {milestone.dueDate.toLocaleDateString('zh-CN')}
                    </span>
                    {milestone.completedDate && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        完成: {milestone.completedDate.toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">暂无里程碑数据</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑里程碑' : '新增里程碑'}</DialogTitle>
            <DialogDescription>填写里程碑信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>里程碑名称 *</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="请输入里程碑名称" />
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="请输入描述" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>计划完成日期 *</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>实际完成日期</Label>
                <Input type="date" value={form.completedDate} onChange={(e) => setForm((prev) => ({ ...prev, completedDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v as Milestone['status'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MILESTONE_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>取消</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.dueDate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ==================== 协议管理 ====================

interface ProjectAgreementManagerProps {
  projectId: string
  agreements: ProjectAgreement[]
  onChange: (agreements: ProjectAgreement[]) => void
}

export function ProjectAgreementManager({ projectId, agreements, onChange }: ProjectAgreementManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    content: '',
    status: 'active' as ProjectAgreement['status'],
    attachments: [] as string[],
  })

  const resetForm = () => {
    setForm({ name: '', type: '', startDate: '', endDate: '', content: '', status: 'active', attachments: [] })
    setEditingId(null)
  }

  const openAdd = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (a: ProjectAgreement) => {
    setForm({
      name: a.name,
      type: a.type,
      startDate: a.startDate.toISOString().split('T')[0],
      endDate: a.endDate.toISOString().split('T')[0],
      content: a.content || '',
      status: a.status,
      attachments: a.attachments || [],
    })
    setEditingId(a.id)
    setDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newAttachments = Array.from(files).map((file) => URL.createObjectURL(file))
      setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }))
    }
    e.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setForm((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }))
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) return
    if (editingId) {
      onChange(
        agreements.map((a) =>
          a.id === editingId
            ? {
                ...a,
                name: form.name.trim(),
                type: form.type.trim() || '合作协议',
                startDate: new Date(form.startDate),
                endDate: new Date(form.endDate),
                content: form.content.trim(),
                status: form.status,
                attachments: form.attachments,
              }
            : a
        )
      )
    } else {
      const item: ProjectAgreement = {
        id: `pa${Date.now()}`,
        name: form.name.trim(),
        type: form.type.trim() || '合作协议',
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        status: form.status,
        content: form.content.trim(),
        attachments: form.attachments,
        isPublicDisplay: false,
        createdAt: new Date(),
      }
      onChange([...agreements, item])
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该协议吗？')) {
      onChange(agreements.filter((a) => a.id !== id))
    }
  }

  const togglePublicDisplay = (id: string) => {
    onChange(
      agreements.map((a) =>
        a.id === id ? { ...a, isPublicDisplay: !a.isPublicDisplay } : a
      )
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" />
          新增协议
        </Button>
      </div>

      {agreements.length > 0 ? (
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <p className="font-medium text-sm">{agreement.name}</p>
                  <Badge variant="secondary" className="text-[10px]">{agreement.type}</Badge>
                  <Badge variant={agreement.status === 'active' ? 'default' : 'outline'} className="text-[10px]">
                    {AGREEMENT_STATUS_LABELS[agreement.status] || agreement.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {agreement.startDate.toLocaleDateString('zh-CN')} 至 {agreement.endDate.toLocaleDateString('zh-CN')}
                </p>
                {agreement.attachments && agreement.attachments.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{agreement.attachments.length} 个附件</span>
                  </div>
                )}
                {agreement.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{agreement.content}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Switch
                  checked={agreement.isPublicDisplay ?? false}
                  onCheckedChange={() => togglePublicDisplay(agreement.id)}
                  className="mr-1"
                />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(agreement)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(agreement.id)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">暂无项目协议</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑协议' : '新增协议'}</DialogTitle>
            <DialogDescription>填写协议信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>协议名称 *</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="请输入协议名称" />
            </div>
            <div className="space-y-2">
              <Label>协议类型</Label>
              <Input value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} placeholder="如：合作协议、框架协议" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>开始日期 *</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>结束日期 *</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>备注</Label>
              <Textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} placeholder="请输入备注" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>协议状态</Label>
              <Select value={form.status} onValueChange={(v) => setForm((prev) => ({ ...prev, status: v as ProjectAgreement['status'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="active">生效中</SelectItem>
                  <SelectItem value="expired">已过期</SelectItem>
                  <SelectItem value="terminated">已终止</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>协议附件上传</Label>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" multiple className="hidden" onChange={handleFileChange} />
              <div className="flex flex-wrap gap-3">
                {form.attachments.map((file, index) => (
                  <div key={index} className="relative flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">附件 {index + 1}</span>
                    <button type="button" onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="outline" className="h-9 px-3 border-dashed" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-1" />
                  上传协议附件
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>取消</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.startDate || !form.endDate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
