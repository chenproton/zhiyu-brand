'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react'

interface CooperationType {
  id: string
  name: string
  description: string
  tags: string[]
}

const initialTypes: CooperationType[] = [
  { id: 'ct001', name: '人才培养', description: '校企联合开展订单班、现代学徒制等人才培养模式', tags: ['订单班', '学徒制', '双元制'] },
  { id: 'ct002', name: '实习实训', description: '建立校外实习实训基地，接收学生顶岗实习', tags: ['实习基地', '顶岗实习', '实训基地'] },
  { id: 'ct003', name: '技术研发', description: '联合开展技术攻关、产品研发等科研合作', tags: ['联合研发', '技术攻关', '成果转化'] },
  { id: 'ct004', name: '课程共建', description: '共同开发专业课程、教材及教学资源', tags: ['课程开发', '教材编写', '教学资源'] },
  { id: 'ct005', name: '师资培训', description: '企业工程师进课堂、教师下企业实践', tags: ['双师型', '企业导师', '教师实践'] },
  { id: 'ct006', name: '就业合作', description: '建立就业推荐渠道，优先录用毕业生', tags: ['就业推荐', '定向招聘', '校园招聘'] },
  { id: 'ct007', name: '产学研合作', description: '开展产业研究、技术服务和成果转化', tags: ['技术服务', '产业研究', '专利申报'] },
  { id: 'ct008', name: '创新创业', description: '共建创业孵化基地，支持学生创新创业', tags: ['创业孵化', '创新项目', '创业大赛'] },
  { id: 'ct009', name: '技能竞赛', description: '联合举办或参加各类职业技能竞赛', tags: ['技能竞赛', '技能大赛', '竞赛培训'] },
  { id: 'ct010', name: '社会服务', description: '开展职业培训、技术咨询等社会服务', tags: ['职业培训', '技术咨询', '社区服务'] },
]

export default function CooperationTypeManager() {
  const [types, setTypes] = useState<CooperationType[]>(initialTypes)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CooperationType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<CooperationType | null>(null)

  const [formData, setFormData] = useState<Partial<CooperationType>>({
    name: '',
    description: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: '', description: '', tags: [] })
    setTagInput('')
    setDialogOpen(true)
  }

  const handleEdit = (item: CooperationType) => {
    setEditingItem(item)
    setFormData({ ...item })
    setTagInput('')
    setDialogOpen(true)
  }

  const handleDelete = (item: CooperationType) => {
    setDeletingItem(item)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setTypes(types.filter((t) => t.id !== deletingItem.id))
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    }
  }

  const handleSave = () => {
    if (!formData.name) return
    if (editingItem) {
      setTypes(types.map((t) => (t.id === editingItem.id ? { ...t, ...formData } as CooperationType : t)))
    } else {
      const newItem: CooperationType = {
        id: `ct${Date.now()}`,
        name: formData.name || '',
        description: formData.description || '',
        tags: formData.tags || [],
      }
      setTypes([...types, newItem])
    }
    setDialogOpen(false)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags?.filter((t) => t !== tag) || [] }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">合作类型字典</h2>
          <p className="text-sm text-muted-foreground">平台内所有合作类型的基础配置</p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          新增类型
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类型名称</TableHead>
                <TableHead>类型说明</TableHead>
                <TableHead>关联标签</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      {type.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm">{type.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {type.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(type)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(type)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? '编辑类型' : '新增类型'}</DialogTitle>
            <DialogDescription>{editingItem ? '修改合作类型配置' : '添加新的合作类型'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>类型名称</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="如：人才培养" />
            </div>
            <div className="space-y-2">
              <Label>类型说明</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="简要说明该合作类型的含义" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>关联标签</Label>
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="输入标签后按回车添加" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
                <Button type="button" variant="outline" onClick={addTag}>添加</Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>确定要删除类型「{deletingItem?.name}」吗？此操作不可撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
