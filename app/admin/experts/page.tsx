'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Building2, Search, Mail, Phone, EyeOff, Plus, Users, Pencil, Trash2 } from 'lucide-react'
import { experts, enterprises } from '@/lib/mock-data'
import { EXPERT_TYPES } from '@/lib/types'
import type { Expert } from '@/lib/types'

const GENDER_LABELS: Record<string, string> = {
  male: '男',
  female: '女',
}

export default function ExpertsListPage() {
  const [search, setSearch] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingExpert, setDeletingExpert] = useState<Expert | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // 左侧导航：按企业来源分组
  const partnerGroups = useMemo(() => {
    const cooperationGroups = new Map<string, { name: string; count: number }>()
    let thirdPartyCount = 0

    experts.forEach((expert) => {
      if (expert.partnerSource === 'third-party') {
        thirdPartyCount += 1
      } else if (expert.partnerId && expert.partnerName) {
        const existing = cooperationGroups.get(expert.partnerId)
        if (existing) {
          existing.count += 1
        } else {
          cooperationGroups.set(expert.partnerId, { name: expert.partnerName, count: 1 })
        }
      }
    })

    return {
      cooperationGroups: Array.from(cooperationGroups.entries()).map(([id, data]) => ({ id, ...data })),
      thirdPartyCount,
    }
  }, [refreshKey])

  // 右侧列表筛选
  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      if (selectedPartner !== 'all') {
        if (selectedPartner === 'third-party') {
          if (expert.partnerSource !== 'third-party') return false
        } else if (expert.partnerId !== selectedPartner) {
          return false
        }
      }

      if (search) {
        const s = search.toLowerCase()
        const matches =
          expert.name.toLowerCase().includes(s) ||
          expert.title.toLowerCase().includes(s) ||
          (expert.partnerName && expert.partnerName.toLowerCase().includes(s)) ||
          (expert.expertType && expert.expertType.toLowerCase().includes(s)) ||
          (expert.education && expert.education.toLowerCase().includes(s)) ||
          expert.specialties.some((sp) => sp.toLowerCase().includes(s)) ||
          expert.relatedPositions?.some((pos) => pos.toLowerCase().includes(s))
        if (!matches) return false
      }

      if (typeFilter !== 'all' && expert.expertType !== typeFilter) return false

      return true
    })
  }, [search, selectedPartner, typeFilter, refreshKey])

  const totalCount = experts.length
  const cooperationCount = experts.filter((e) => e.partnerSource !== 'third-party').length
  const thirdPartyCount = experts.filter((e) => e.partnerSource === 'third-party').length

  const handleDelete = (expert: Expert) => {
    setDeletingExpert(expert)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    // 模拟删除，实际项目中应调用 API
    setDeleteDialogOpen(false)
    setDeletingExpert(null)
  }

  const handleTogglePublicDisplay = (expert: Expert) => {
    if (!expert.partnerId) return
    const enterprise = enterprises.find((e) => e.id === expert.partnerId)
    if (!enterprise) return
    enterprise.isPublicDisplay = !enterprise.isPublicDisplay
    enterprise.updatedAt = new Date()
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* 左侧导航 */}
      <div className="w-64 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">所属单位</h2>
          <span className="text-xs text-muted-foreground">{totalCount} 位</span>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1 pr-1">
          {/* 全部 */}
          <button
            onClick={() => setSelectedPartner('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              selectedPartner === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              全部专家
            </span>
            <Badge variant={selectedPartner === 'all' ? 'secondary' : 'outline'} className="text-xs">
              {totalCount}
            </Badge>
          </button>

          <div className="pt-2 pb-1">
            <p className="text-xs text-muted-foreground px-3 mb-1">合作企业</p>
          </div>

          {/* 合作企业分组 */}
          {partnerGroups.cooperationGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedPartner(group.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                selectedPartner === group.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{group.name}</span>
              </span>
              <Badge
                variant={selectedPartner === group.id ? 'secondary' : 'outline'}
                className="text-xs shrink-0 ml-1"
              >
                {group.count}
              </Badge>
            </button>
          ))}

          <div className="pt-2 pb-1">
            <p className="text-xs text-muted-foreground px-3 mb-1">第三方企业</p>
          </div>

          <button
            onClick={() => setSelectedPartner('third-party')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              selectedPartner === 'third-party'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              第三方企业
            </span>
            <Badge
              variant={selectedPartner === 'third-party' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {partnerGroups.thirdPartyCount}
            </Badge>
          </button>
        </div>
      </div>

      {/* 右侧列表 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索专家姓名、职称、领域..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {EXPERT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Link href="/admin/experts/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              新增专家
            </Button>
          </Link>
        </div>

        {/* 统计 */}
        <div className="text-sm text-muted-foreground mb-3">
          共 {filteredExperts.length} 位专家
          {selectedPartner === 'all' && `（合作企业 ${cooperationCount} / 第三方企业 ${thirdPartyCount}）`}
        </div>

        {/* 专家列表 — 横向滚动 + 每行固定高度 */}
        <div className="flex-1 overflow-auto border rounded-lg">
          {filteredExperts.length > 0 ? (
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-muted sticky top-0 z-10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">姓名</th>
                  <th className="text-left px-4 py-3 font-medium">性别</th>
                  <th className="text-left px-4 py-3 font-medium">职务/职称</th>
                  <th className="text-left px-4 py-3 font-medium">专家类型</th>
                  <th className="text-left px-4 py-3 font-medium">所属企业</th>
                  <th className="text-left px-4 py-3 font-medium">前台展示</th>
                  <th className="text-left px-4 py-3 font-medium">教育背景</th>
                  <th className="text-left px-4 py-3 font-medium">从业年限</th>
                  <th className="text-left px-4 py-3 font-medium">行业领域</th>
                  <th className="text-left px-4 py-3 font-medium">擅长岗位</th>
                  <th className="text-left px-4 py-3 font-medium">联系方式</th>
                  <th className="text-left px-4 py-3 font-medium">状态</th>
                  <th className="text-right px-4 py-3 font-medium sticky right-0 bg-muted">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExperts.map((expert) => (
                  <tr
                    key={expert.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/experts/${expert.id}`}
                        className="font-medium hover:underline"
                      >
                        {expert.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expert.gender ? GENDER_LABELS[expert.gender] : '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{expert.title}</td>
                    <td className="px-4 py-3">
                      {expert.expertType ? (
                        <Badge variant="outline" className="text-xs">
                          {expert.expertType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {expert.partnerName ? (
                        <span className="text-muted-foreground max-w-[140px] truncate inline-block" title={expert.partnerName}>
                          {expert.partnerName}
                        </span>
                      ) : (
                        <Badge variant="secondary" className="text-xs">独立专家</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {expert.partnerId ? (() => {
                        const enterprise = enterprises.find((e) => e.id === expert.partnerId)
                        return enterprise ? (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={enterprise.isPublicDisplay}
                              onCheckedChange={() => handleTogglePublicDisplay(expert)}
                            />
                            <span className={`text-sm ${enterprise.isPublicDisplay ? 'text-green-600' : 'text-gray-400'}`}>
                              {enterprise.isPublicDisplay ? '展示' : '隐藏'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )
                      })() : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate" title={expert.education || ''}>
                      {expert.education || '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{expert.experience}年</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate" title={expert.specialties.join('、')}>
                      {expert.specialties.join('、') || '-'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate" title={expert.relatedPositions?.join('、') || ''}>
                      {expert.relatedPositions?.join('、') || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {expert.isContactHidden ? (
                        <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                          <EyeOff className="h-3 w-3" />
                          已隐藏
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                          {expert.contactPhone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {expert.contactPhone}
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={expert.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {expert.status === 'active' ? '启用' : '禁用'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right sticky right-0 bg-background">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/experts/${expert.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDelete(expert)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>暂无符合条件的专家</p>
            </div>
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除专家「{deletingExpert?.name}」吗？此操作不可撤销。
            </DialogDescription>
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
