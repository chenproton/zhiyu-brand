'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableRowActions } from '@/components/admin/table-row-actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react'

interface CooperationType {
  id: string
  name: string
  description: string
}

const initialTypes: CooperationType[] = [
  { id: 'ct001', name: '人才培养', description: '校企联合开展订单班、现代学徒制等人才培养模式' },
  { id: 'ct002', name: '实习实训', description: '建立校外实习实训基地，接收学生顶岗实习' },
  { id: 'ct003', name: '技术研发', description: '联合开展技术攻关、产品研发等科研合作' },
  { id: 'ct004', name: '课程共建', description: '共同开发专业课程、教材及教学资源' },
  { id: 'ct005', name: '师资培训', description: '企业工程师进课堂、教师下企业实践' },
  { id: 'ct006', name: '就业合作', description: '建立就业推荐渠道，优先录用毕业生' },
  { id: 'ct007', name: '产学研合作', description: '开展产业研究、技术服务和成果转化' },
  { id: 'ct008', name: '创新创业', description: '共建创业孵化基地，支持学生创新创业' },
  { id: 'ct009', name: '技能竞赛', description: '联合举办或参加各类职业技能竞赛' },
  { id: 'ct010', name: '社会服务', description: '开展职业培训、技术咨询等社会服务' },
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
  })

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: '', description: '' })
    setDialogOpen(true)
  }

  const handleEdit = (item: CooperationType) => {
    setEditingItem(item)
    setFormData({ ...item })
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
      }
      setTypes([...types, newItem])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
                <TableHead className="w-12 text-center">序号</TableHead>
                <TableHead>类型名称</TableHead>
                <TableHead>类型说明</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type, index) => (
                <TableRow key={type.id} className="group">
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      {type.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm">{type.description}</TableCell>
                  <TableCell className="text-right relative">
                    <TableRowActions>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleEdit(type)}>
                        <Pencil className="mr-1 h-3 w-3" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600" onClick={() => handleDelete(type)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        删除
                      </Button>
                    </TableRowActions>
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
