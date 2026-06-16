'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Download, Eye, Plus, Upload, X } from 'lucide-react'
import type { EnterpriseAgreement } from '@/lib/types'
import { AgreementStatusBadge } from '@/components/shared/status-badge'
import { Switch } from '@/components/ui/switch'

const AGREEMENT_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '生效中' },
  { value: 'expired', label: '已过期' },
  { value: 'renewed', label: '已续签' },
  { value: 'terminated', label: '已终止' },
]

export function AddAgreementButton() {
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    status: 'draft' as EnterpriseAgreement['status'],
    content: '',
    attachments: [] as string[],
    isPublicDisplay: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`协议「${formData.name}」已新增（演示）\n前台展示：${formData.isPublicDisplay ? '展示' : '隐藏'}`)
    setOpen(false)
    setFormData({ name: '', type: '', startDate: '', endDate: '', status: 'draft', content: '', attachments: [], isPublicDisplay: false })
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        新增协议
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增协议</DialogTitle>
            <DialogDescription>填写协议基本信息</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>协议名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入协议名称"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>协议类型 *</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  placeholder="如：校企合作协议"
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label>协议状态 *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as EnterpriseAgreement['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGREEMENT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>前台展示</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={formData.isPublicDisplay}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublicDisplay: checked }))}
                  />
                  <span className={`text-sm ${formData.isPublicDisplay ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.isPublicDisplay ? '展示' : '隐藏'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>协议简介</Label>
              <Textarea
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="请输入协议内容..."
              />
            </div>
            <div className="space-y-2">
              <Label>附件</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    const newFiles = Array.from(files).map((file) => file.name)
                    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }))
                  }
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              />
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between px-3 py-2 bg-muted rounded-md text-sm">
                    <span className="truncate max-w-[300px]">{file}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-muted-foreground hover:text-red-600 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  上传附件
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function AgreementDetailButton({ agreement }: { agreement: EnterpriseAgreement }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-3.5 w-3.5 mr-1" />
        查看详情
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{agreement.name}</DialogTitle>
            <DialogDescription>协议详情信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">协议类型</p>
                <p className="font-medium">{agreement.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">协议状态</p>
                <AgreementStatusBadge status={agreement.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">开始日期</p>
                <p className="font-medium">{agreement.startDate.toLocaleDateString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">结束日期</p>
                <p className="font-medium">{agreement.endDate.toLocaleDateString('zh-CN')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">协议简介</p>
              <div className="text-sm bg-muted p-3 rounded-md leading-relaxed">
                {agreement.content || '暂无内容'}
              </div>
            </div>
            {agreement.attachments && agreement.attachments.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">附件</p>
                <div className="flex flex-wrap gap-2">
                  {agreement.attachments.map((file) => (
                    <Button key={file} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      {file}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
