'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { CooperationRating } from '@/lib/types'

interface RatingDictItem {
  id: string
  rating: CooperationRating
  label: string
  description: string
  criteria: string
  sortOrder: number
}

const initialRatings: RatingDictItem[] = [
  {
    id: 'r001',
    rating: 'strategic',
    label: '战略合作',
    description: '双方建立全面、长期、深度的战略合作关系',
    criteria: '合作年限≥3年，年度合作项目≥3个，有共建实体（产业学院/实验室等）',
    sortOrder: 1,
  },
  {
    id: 'r002',
    rating: 'deep',
    label: '深度合作',
    description: '在多个领域开展持续深入的合作',
    criteria: '合作年限≥2年，年度合作项目≥2个，有稳定的合作机制',
    sortOrder: 2,
  },
  {
    id: 'r003',
    rating: 'general',
    label: '一般合作',
    description: '在单一领域开展常规合作',
    criteria: '合作年限≥1年，有正在执行的合作项目',
    sortOrder: 3,
  },
]

const ratingColors: Record<string, string> = {
  strategic: 'bg-emerald-100 text-emerald-800',
  deep: 'bg-blue-100 text-blue-800',
  general: 'bg-gray-100 text-gray-800',
}

export default function CooperationRatingManager() {
  const [ratings, setRatings] = useState<RatingDictItem[]>(initialRatings)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RatingDictItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<RatingDictItem | null>(null)

  const [formData, setFormData] = useState<Partial<RatingDictItem>>({
    rating: 'general',
    label: '',
    description: '',
    criteria: '',
    sortOrder: 1,
  })

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      rating: 'general',
      label: '',
      description: '',
      criteria: '',
      sortOrder: ratings.length + 1,
    })
    setDialogOpen(true)
  }

  const handleEdit = (item: RatingDictItem) => {
    setEditingItem(item)
    setFormData({ ...item })
    setDialogOpen(true)
  }

  const handleDelete = (item: RatingDictItem) => {
    setDeletingItem(item)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setRatings(ratings.filter((r) => r.id !== deletingItem.id))
      setDeleteDialogOpen(false)
      setDeletingItem(null)
    }
  }

  const handleSave = () => {
    if (!formData.label) return
    if (editingItem) {
      setRatings(ratings.map((r) => (r.id === editingItem.id ? { ...r, ...formData } as RatingDictItem : r)))
    } else {
      const newItem: RatingDictItem = {
        id: `r${Date.now()}`,
        rating: formData.rating as CooperationRating,
        label: formData.label || '',
        description: formData.description || '',
        criteria: formData.criteria || '',
        sortOrder: formData.sortOrder || ratings.length + 1,
      }
      setRatings([...ratings, newItem])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" />
          新增评级
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>排序</TableHead>
                <TableHead>评级名称</TableHead>
                <TableHead>评级标识</TableHead>
                <TableHead>说明</TableHead>
                <TableHead>评定条件</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.sortOrder}</TableCell>
                  <TableCell>
                    <Badge className={ratingColors[item.rating]}>{item.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.rating}</code>
                  </TableCell>
                  <TableCell className="max-w-xs text-sm">{item.description}</TableCell>
                  <TableCell className="max-w-xs text-sm">{item.criteria}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item)}>
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
            <DialogTitle>{editingItem ? '编辑评级' : '新增评级'}</DialogTitle>
            <DialogDescription>{editingItem ? '修改评级字典项的配置' : '添加新的合作深度评级'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>评级名称</Label>
              <Input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="如：战略合作" />
            </div>
            <div className="space-y-2">
              <Label>评级标识</Label>
              <Input value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value as CooperationRating })} placeholder="如：strategic" />
            </div>
            <div className="space-y-2">
              <Label>说明</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="评级的简要说明" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>评定条件</Label>
              <Textarea value={formData.criteria} onChange={(e) => setFormData({ ...formData, criteria: e.target.value })} placeholder="达到该评级需要满足的条件" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>排序</Label>
              <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} />
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
            <DialogDescription>确定要删除评级「{deletingItem?.label}」吗？此操作不可撤销。</DialogDescription>
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
