'use client'

import { useState, useMemo } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import React from 'react'
import {
  Plus, Pencil, Trash2, Shield, Building2, User, Eye, MapPin,
  Briefcase, BookOpen, CheckSquare, X, ChevronDown, ChevronUp, Check, Share2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { permissionGrants, cooperationAccounts, enterprises, experts } from '@/lib/mock-data'
import {
  COOPERATION_ACCOUNT_TYPE_LABELS,
  RESOURCE_TYPE_LABELS,
  OPERATION_TYPE_LABELS,
  ASSESSMENT_TYPE_LABELS,
  PLATFORM_TYPE_LABELS,
} from '@/lib/types'
import type {
  PermissionGrant,
  ResourcePermissionItem,
  ResourceType,
  OperationType,
  AssessmentType,
  CooperationAccount,
  PlatformType,
} from '@/lib/types'

// 批次与子项映射
const BATCH_ITEMS: Record<ResourceType, Record<string, string[]>> = {
  position: {
    '2025年春季上线岗位': ['前端开发工程师', 'Java后端工程师', '产品经理', 'UI设计师'],
    '2025年秋季上线岗位': ['算法工程师', '数据分析师', '测试工程师'],
    '2024年存量岗位': ['运维工程师', '项目经理'],
    '2024年秋季上线岗位': ['全栈工程师', 'DevOps工程师'],
  },
  scene: {
    '2025年AI实训场景': ['机器学习实训室', '深度学习实验室', '计算机视觉工坊'],
    '2025年生物医药实训场景': ['生物制药实验室', '医疗器械实训室'],
    '2025年智能制造实训场景': ['工业机器人实训室', '智能工厂模拟中心', 'PLC编程实验室'],
    '2024年存量场景': ['传统制造实训室', '电子装配工坊'],
  },
  course: {
    '2025年新课程开发': ['人工智能导论', 'Python编程基础', '工业互联网技术'],
    '2024年存量课程': ['计算机基础', '数据库原理'],
    '2025年春季课程': ['Web前端开发', 'Java程序设计'],
    '2025年秋季课程': ['大数据技术', '云计算基础'],
  },
}

const BATCH_OPTIONS: Record<ResourceType, string[]> = {
  position: Object.keys(BATCH_ITEMS.position),
  scene: Object.keys(BATCH_ITEMS.scene),
  course: Object.keys(BATCH_ITEMS.course),
}

const ALL_RESOURCE_TYPES: ResourceType[] = ['position', 'scene', 'course']

const OPERATIONS: OperationType[] = ['view', 'edit', 'review', 'publish', 'delete', 'create']
const SCENE_OPERATIONS: OperationType[] = ['view', 'edit', 'review', 'publish', 'delete', 'create', 'assess']
const ASSESSMENTS: AssessmentType[] = ['on_site_qa', 'on_site_review', 'question_bank', 'exam_paper']
const PLATFORMS: PlatformType[] = ['job', 'scene', 'brand']

const resourceIcons: Record<ResourceType, React.ReactNode> = {
  position: <Briefcase className="h-3.5 w-3.5" />,
  scene: <MapPin className="h-3.5 w-3.5" />,
  course: <BookOpen className="h-3.5 w-3.5" />,
}

const batchSelectLabels: Record<ResourceType, string> = {
  position: '批次与岗位选择',
  scene: '批次与场景选择',
  course: '批次与课程选择',
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function createDefaultResourcePermissions(): ResourcePermissionItem[] {
  return ALL_RESOURCE_TYPES.map((rt) => ({
    id: generateId('rp'),
    resourceType: rt,
    batchName: '',
    operations: [],
    selectedItems: [],
  }))
}

export default function PermissionsPage() {
  const [accounts, setAccounts] = useState<CooperationAccount[]>([...cooperationAccounts])
  const [grants, setGrants] = useState<PermissionGrant[]>([...permissionGrants])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGrant, setEditingGrant] = useState<PermissionGrant | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailGrant, setDetailGrant] = useState<PermissionGrant | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingGrant, setDeletingGrant] = useState<PermissionGrant | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareGrant, setShareGrant] = useState<PermissionGrant | null>(null)

  // 弹窗表单状态
  const [activeTab, setActiveTab] = useState('account')
  // 账号信息
  const [ownerEntityType, setOwnerEntityType] = useState<'enterprise' | 'expert'>('enterprise')
  const [ownerId, setOwnerId] = useState('')
  const [accountName, setAccountName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // 权限
  const [resourcePermissions, setResourcePermissions] = useState<ResourcePermissionItem[]>(createDefaultResourcePermissions())
  const [assessmentPermissions, setAssessmentPermissions] = useState<AssessmentType[]>([])
  const [authorizedPlatforms, setAuthorizedPlatforms] = useState<PlatformType[]>([])
  const [enabled, setEnabled] = useState(true)

  const stats = useMemo(() => {
    const total = grants.length
    const enterpriseCount = grants.filter(g => g.accountType === 'enterprise_public').length
    const expertCount = grants.filter(g => g.accountType === 'expert_personal').length
    const activeCount = grants.filter(g => g.enabled).length
    return { total, enterpriseCount, expertCount, activeCount }
  }, [grants])

  const resetForm = () => {
    setOwnerEntityType('enterprise')
    setOwnerId('')
    setAccountName('')
    setUsername('')
    setPassword('')
    setResourcePermissions(createDefaultResourcePermissions())
    setAssessmentPermissions([])
    setAuthorizedPlatforms([])
    setEnabled(true)
    setActiveTab('account')
    setEditingGrant(null)
  }

  const handleAdd = () => {
    resetForm()
    setDialogOpen(true)
  }

  const handleEdit = (grant: PermissionGrant) => {
    setEditingGrant(grant)
    // 查找对应账号
    const account = accounts.find(a => a.id === grant.accountId)
    if (account) {
      setOwnerEntityType(account.ownerEntityType)
      setOwnerId(account.ownerId)
      setAccountName(account.accountName)
      setUsername(account.username)
      setPassword('') // 编辑时不显示密码
    }
    // 规范化 resourcePermissions，确保三种资源类型都有
    const normalized: ResourcePermissionItem[] = ALL_RESOURCE_TYPES.map((rt) => {
      const existing = grant.resourcePermissions.find(rp => rp.resourceType === rt)
      if (existing) {
        return {
          ...existing,
          selectedItems: existing.selectedItems || [],
        }
      }
      return {
        id: generateId('rp'),
        resourceType: rt,
        batchName: '',
        operations: [],
        selectedItems: [],
      }
    })
    setResourcePermissions(normalized)
    setAssessmentPermissions([...grant.assessmentPermissions])
    setAuthorizedPlatforms([...grant.authorizedPlatforms])
    setEnabled(grant.enabled)
    setActiveTab('account')
    setDialogOpen(true)
  }

  const handleViewDetail = (grant: PermissionGrant) => {
    setDetailGrant(grant)
    setDetailDialogOpen(true)
  }

  const handleDelete = (grant: PermissionGrant) => {
    setDeletingGrant(grant)
    setDeleteDialogOpen(true)
  }

  const handleShare = (grant: PermissionGrant) => {
    setShareGrant(grant)
    setShareDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingGrant) {
      setGrants(grants.filter(g => g.id !== deletingGrant.id))
      setDeleteDialogOpen(false)
      setDeletingGrant(null)
    }
  }

  const handleToggleEnabled = (grant: PermissionGrant) => {
    setGrants(grants.map(g => g.id === grant.id ? { ...g, enabled: !g.enabled } : g))
  }

  const handleToggleRowExpand = (grantId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(grantId)) {
        next.delete(grantId)
      } else {
        next.add(grantId)
      }
      return next
    })
  }

  // 根据 ownerEntityType 获取可选主体列表
  const ownerOptions = useMemo(() => {
    if (ownerEntityType === 'enterprise') {
      return enterprises.map(e => ({ id: e.id, name: e.name, contact: e.contactPerson || '-', phone: e.contactPhone || '-' }))
    }
    return experts.map(e => ({ id: e.id, name: e.name, contact: e.name, phone: e.contactPhone || '-' }))
  }, [ownerEntityType])

  const selectedOwner = useMemo(() => {
    return ownerOptions.find(o => o.id === ownerId)
  }, [ownerOptions, ownerId])

  const handleSave = () => {
    let account: CooperationAccount | undefined

    if (editingGrant) {
      // 编辑模式：更新账号信息（除密码外）
      account = accounts.find(a => a.id === editingGrant.accountId)
      if (!account) return
      if (accountName && accountName !== account.accountName) {
        account = { ...account, accountName, updatedAt: new Date() }
      }
      if (password) {
        account = { ...account, password, updatedAt: new Date() }
      }
      // 如果所属主体发生变化，同步更新
      if (selectedOwner && (ownerId !== account.ownerId || ownerEntityType !== account.ownerEntityType)) {
        const newAccountType: CooperationAccount['accountType'] = ownerEntityType === 'enterprise' ? 'enterprise_public' : 'expert_personal'
        account = {
          ...account,
          ownerId,
          ownerName: selectedOwner.name,
          ownerEntityType,
          accountType: newAccountType,
          contactPerson: selectedOwner.contact,
          contactPhone: selectedOwner.phone,
          updatedAt: new Date(),
        }
      }
      setAccounts(prev => prev.map(a => a.id === account!.id ? account! : a))

      const updatedGrant: PermissionGrant = {
        ...editingGrant,
        accountName: account.accountName,
        accountType: account.accountType,
        ownerName: account.ownerName,
        resourcePermissions: resourcePermissions.map(rp => ({ ...rp })),
        assessmentPermissions: [...assessmentPermissions],
        authorizedPlatforms: [...authorizedPlatforms],
        enabled,
        updatedAt: new Date(),
      }
      setGrants(grants.map(g => g.id === editingGrant.id ? updatedGrant : g))
    } else {
      // 新建模式：创建账号 + 创建授权
      if (!ownerId || !accountName || !username || !password) return
      if (!selectedOwner) return

      const accountType: CooperationAccount['accountType'] = ownerEntityType === 'enterprise' ? 'enterprise_public' : 'expert_personal'

      const newAccount: CooperationAccount = {
        id: generateId('acc'),
        accountType,
        ownerId,
        ownerName: selectedOwner.name,
        ownerEntityType,
        accountName,
        username,
        password,
        contactPerson: selectedOwner.contact,
        contactPhone: selectedOwner.phone,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setAccounts(prev => [...prev, newAccount])

      const newGrant: PermissionGrant = {
        id: generateId('grant'),
        accountId: newAccount.id,
        accountName: newAccount.accountName,
        accountType: newAccount.accountType,
        ownerName: newAccount.ownerName,
        resourcePermissions: resourcePermissions.map(rp => ({ ...rp })),
        assessmentPermissions: [...assessmentPermissions],
        authorizedPlatforms: [...authorizedPlatforms],
        enabled,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setGrants(prev => [...prev, newGrant])
    }

    setDialogOpen(false)
    resetForm()
  }

  const updateResourcePermission = (index: number, updates: Partial<ResourcePermissionItem>) => {
    setResourcePermissions(prev => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }

  const toggleOperation = (index: number, op: OperationType) => {
    setResourcePermissions(prev => {
      const rp = prev[index]
      const nextOps = rp.operations.includes(op)
        ? rp.operations.filter(o => o !== op)
        : [...rp.operations, op]
      const next = [...prev]
      next[index] = { ...rp, operations: nextOps }
      return next
    })
  }

  const toggleAssessment = (type: AssessmentType) => {
    setAssessmentPermissions(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const togglePlatform = (platform: PlatformType) => {
    setAuthorizedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    )
  }

  const toggleBatchItem = (rpIndex: number, batchName: string, item: string) => {
    setResourcePermissions(prev => {
      const rp = prev[rpIndex]
      const currentItems = rp.selectedItems || []

      // 如果当前批次不是选中的批次，先切换批次
      if (rp.batchName !== batchName) {
        const next = [...prev]
        next[rpIndex] = { ...rp, batchName, selectedItems: [item] }
        return next
      }

      // 在同批次内切换子项
      const nextItems = currentItems.includes(item)
        ? currentItems.filter(i => i !== item)
        : [...currentItems, item]
      const next = [...prev]
      next[rpIndex] = { ...rp, selectedItems: nextItems }
      return next
    })
  }

  const toggleWholeBatch = (rpIndex: number, batchName: string) => {
    setResourcePermissions(prev => {
      const rp = prev[rpIndex]
      const batchItems = BATCH_ITEMS[rp.resourceType][batchName] || []
      const isCurrentlyAllSelected = rp.batchName === batchName && (rp.selectedItems || []).length === batchItems.length

      if (isCurrentlyAllSelected) {
        // 取消全选
        const next = [...prev]
        next[rpIndex] = { ...rp, selectedItems: [] }
        return next
      } else {
        // 全选该批次
        const next = [...prev]
        next[rpIndex] = { ...rp, batchName, selectedItems: [...batchItems] }
        return next
      }
    })
  }

  const isFormValid = editingGrant
    ? accountName.trim() !== '' && resourcePermissions.some(rp => rp.batchName && (rp.selectedItems || []).length > 0)
    : ownerId !== '' && accountName.trim() !== '' && username.trim() !== '' && password.trim() !== '' && resourcePermissions.some(rp => rp.batchName && (rp.selectedItems || []).length > 0)

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">合作权限管理</h1>
          <p className="text-muted-foreground">为企业/专家创建账号并分配资源权限与测评权限</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          新增权限授权
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">授权账号总数</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">企业公共账号</p>
                <p className="text-3xl font-bold">{stats.enterpriseCount}</p>
              </div>
              <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">专家个人账号</p>
                <p className="text-3xl font-bold">{stats.expertCount}</p>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已启用授权</p>
                <p className="text-3xl font-bold">{stats.activeCount}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 权限授权列表 */}
      <Card>
        <CardHeader>
          <CardTitle>权限授权列表</CardTitle>
          <CardDescription>管理各账号的功能权限与测评权限</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>账号名称</TableHead>
                <TableHead>账号类型</TableHead>
                <TableHead>所属主体</TableHead>
                <TableHead>资源权限</TableHead>
                <TableHead>测评权限</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.map((grant) => {
                const isExpanded = expandedRows.has(grant.id)
                return (
                  <React.Fragment key={grant.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => handleToggleRowExpand(grant.id)}>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleToggleRowExpand(grant.id) }}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{grant.accountName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={grant.accountType === 'enterprise_public' ? 'border-indigo-200 text-indigo-700' : 'border-amber-200 text-amber-700'}>
                          {COOPERATION_ACCOUNT_TYPE_LABELS[grant.accountType]}
                        </Badge>
                      </TableCell>
                      <TableCell>{grant.ownerName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {grant.resourcePermissions.slice(0, 2).map((rp) => (
                            <Badge key={rp.id} variant="secondary" className="text-xs flex items-center gap-1">
                              {resourceIcons[rp.resourceType]}
                              {RESOURCE_TYPE_LABELS[rp.resourceType]}
                            </Badge>
                          ))}
                          {grant.resourcePermissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{grant.resourcePermissions.length - 2}</Badge>
                          )}
                          {grant.resourcePermissions.length === 0 && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {grant.assessmentPermissions.slice(0, 2).map((at) => (
                            <Badge key={at} variant="outline" className="text-xs">
                              {ASSESSMENT_TYPE_LABELS[at]}
                            </Badge>
                          ))}
                          {grant.assessmentPermissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{grant.assessmentPermissions.length - 2}</Badge>
                          )}
                          {grant.assessmentPermissions.length === 0 && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={grant.enabled}
                            onCheckedChange={() => handleToggleEnabled(grant)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className={`text-sm ${grant.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                            {grant.enabled ? '已启用' : '已停用'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleShare(grant) }}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleViewDetail(grant) }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleEdit(grant) }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(grant) }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/30 p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold mb-2">功能权限明细（资源类型 + 批次 + 操作）</h4>
                              <div className="space-y-2">
                                {grant.resourcePermissions.map((rp) => (
                                  <div key={rp.id} className="flex items-center gap-3 text-sm bg-background rounded-md p-2 border">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                      {resourceIcons[rp.resourceType]}
                                      {RESOURCE_TYPE_LABELS[rp.resourceType]}
                                    </Badge>
                                    <span className="text-muted-foreground">·</span>
                                    <span>{rp.batchName || '—'}</span>
                                    <span className="text-muted-foreground">·</span>
                                    <div className="flex gap-1">
                                      {rp.operations.map((op) => (
                                        <Badge key={op} variant="outline" className="text-xs font-normal">
                                          {OPERATION_TYPE_LABELS[op]}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                {grant.resourcePermissions.length === 0 && (
                                  <p className="text-sm text-muted-foreground">暂无功能权限</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-6">
                              <div>
                                <h4 className="text-sm font-semibold mb-1">测评权限</h4>
                                <div className="flex flex-wrap gap-1">
                                  {grant.assessmentPermissions.map((at) => (
                                    <Badge key={at} variant="outline" className="text-xs">
                                      {ASSESSMENT_TYPE_LABELS[at]}
                                    </Badge>
                                  ))}
                                  {grant.assessmentPermissions.length === 0 && (
                                    <span className="text-sm text-muted-foreground">—</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
              {grants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无权限授权记录，点击右上角「新增权限授权」创建
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); resetForm() } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingGrant ? '编辑权限授权' : '新增权限授权'}</DialogTitle>
            <DialogDescription>
              {editingGrant ? '修改该账号的权限配置' : '为企业/专家创建账号并配置权限'}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">账号信息</TabsTrigger>
              <TabsTrigger value="resource">功能权限</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto mt-4 pr-2 min-h-0">
              {/* 账号信息 */}
              <TabsContent value="account" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label>所属主体类型</Label>
                  <Select value={ownerEntityType} onValueChange={(val) => { setOwnerEntityType(val as 'enterprise' | 'expert'); setOwnerId('') }}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择所属主体类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">企业</SelectItem>
                      <SelectItem value="expert">专家</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>选择{ownerEntityType === 'enterprise' ? '企业' : '专家'}</Label>
                  <Select value={ownerId} onValueChange={setOwnerId}>
                    <SelectTrigger>
                      <SelectValue placeholder={`请选择${ownerEntityType === 'enterprise' ? '企业' : '专家'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {ownerOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          <div className="flex items-center gap-2">
                            <span>{opt.name}</span>
                            <span className="text-muted-foreground text-xs">({opt.contact} / {opt.phone})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOwner && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-3 pb-3">
                      <div className="text-sm text-muted-foreground">
                        已选择：<span className="font-medium text-foreground">{selectedOwner.name}</span>
                        <span className="mx-1">·</span>
                        {selectedOwner.contact} / {selectedOwner.phone}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label>账号名称</Label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="如：智联科技-公共账号"
                  />
                </div>

                <div className="space-y-2">
                  <Label>登录用户名</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="如：zltech_admin"
                    disabled={!!editingGrant}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{editingGrant ? '登录密码（留空则不修改）' : '登录密码'}</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入登录密码"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                  <Label>启用该授权</Label>
                </div>
              </TabsContent>

              {/* 功能权限 */}
              <TabsContent value="resource" className="mt-0 space-y-4">
                <Label>资源权限配置</Label>
                <div className="space-y-4">
                  {resourcePermissions.map((rp, index) => {
                    const ops = rp.resourceType === 'scene' ? SCENE_OPERATIONS : OPERATIONS
                    const batchOptions = BATCH_OPTIONS[rp.resourceType]
                    const currentBatchItems = rp.batchName ? BATCH_ITEMS[rp.resourceType][rp.batchName] || [] : []
                    const selectedItems = rp.selectedItems || []
                    return (
                      <Card key={rp.id}>
                        <CardContent className="pt-4 pb-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {resourceIcons[rp.resourceType]}
                              {RESOURCE_TYPE_LABELS[rp.resourceType]}
                            </Badge>
                          </div>

                          {/* 批次与子项选择 */}
                          <div className="space-y-2">
                            <Label className="text-xs">{batchSelectLabels[rp.resourceType]}</Label>
                            <div className="border rounded-md overflow-hidden">
                              {batchOptions.map((batchName) => {
                                const items = BATCH_ITEMS[rp.resourceType][batchName] || []
                                const isExpanded = rp.batchName === batchName
                                const allSelected = items.length > 0 && items.every((item: string) => selectedItems.includes(item))
                                return (
                                  <div key={batchName} className="border-b last:border-b-0">
                                    <div className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50">
                                      <div className="flex items-center gap-2">
                                        <label className="inline-flex items-center cursor-pointer">
                                          <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={allSelected}
                                            onChange={() => toggleWholeBatch(index, batchName)}
                                          />
                                          <div className={cn(
                                            "size-4 shrink-0 rounded-[4px] border flex items-center justify-center transition-colors",
                                            allSelected ? "bg-primary border-primary text-primary-foreground" : "bg-background border-input"
                                          )}>
                                            {allSelected && <Check className="size-3.5" />}
                                          </div>
                                        </label>
                                        <button
                                          type="button"
                                          className="font-medium"
                                          onClick={() => {
                                            if (isExpanded) {
                                              updateResourcePermission(index, { batchName: '', selectedItems: [] })
                                            } else {
                                              updateResourcePermission(index, { batchName: batchName, selectedItems: [] })
                                            }
                                          }}
                                        >
                                          {batchName}
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        className="ml-2"
                                        onClick={() => {
                                          if (isExpanded) {
                                            updateResourcePermission(index, { batchName: '', selectedItems: [] })
                                          } else {
                                            updateResourcePermission(index, { batchName: batchName, selectedItems: [] })
                                          }
                                        }}
                                      >
                                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                      </button>
                                    </div>
                                    {isExpanded && (
                                      <div className="px-3 pb-2 pl-8 space-y-1">
                                        {items.map((item: string) => (
                                          <div key={item} className="flex items-center gap-2">
                                            <label className="inline-flex items-center cursor-pointer">
                                              <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={selectedItems.includes(item)}
                                                onChange={() => toggleBatchItem(index, batchName, item)}
                                              />
                                              <div className={cn(
                                                "size-4 shrink-0 rounded-[4px] border flex items-center justify-center transition-colors",
                                                selectedItems.includes(item) ? "bg-primary border-primary text-primary-foreground" : "bg-background border-input"
                                              )}>
                                                {selectedItems.includes(item) && <Check className="size-3.5" />}
                                              </div>
                                            </label>
                                            <span className="text-sm text-muted-foreground">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">操作权限</Label>
                            <div className="flex flex-wrap gap-3">
                              {ops.map((op) => (
                                <div key={op} className="flex items-center gap-1.5">
                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={rp.operations.includes(op)}
                                      onChange={() => toggleOperation(index, op)}
                                    />
                                    <div className={cn(
                                      "size-4 shrink-0 rounded-[4px] border flex items-center justify-center transition-colors",
                                      rp.operations.includes(op) ? "bg-primary border-primary text-primary-foreground" : "bg-background border-input"
                                    )}>
                                      {rp.operations.includes(op) && <Check className="size-3.5" />}
                                    </div>
                                  </label>
                                  <span className="text-xs cursor-pointer font-normal" onClick={() => toggleOperation(index, op)}>
                                    {OPERATION_TYPE_LABELS[op]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

            </div>
          </Tabs>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>取消</Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              {editingGrant ? '保存修改' : '创建授权'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情弹窗 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>权限授权详情</DialogTitle>
          </DialogHeader>
          {detailGrant && (
            <div className="space-y-6 pr-2 max-h-[60vh] overflow-y-auto">
              {/* 账号信息 */}
              <div>
                <h3 className="text-sm font-semibold mb-2">账号信息</h3>
                <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 rounded-lg p-3">
                  <div><span className="text-muted-foreground">账号名称：</span>{detailGrant.accountName}</div>
                  <div><span className="text-muted-foreground">账号类型：</span>{COOPERATION_ACCOUNT_TYPE_LABELS[detailGrant.accountType]}</div>
                  <div><span className="text-muted-foreground">所属主体：</span>{detailGrant.ownerName}</div>
                  <div><span className="text-muted-foreground">状态：</span>{detailGrant.enabled ? '已启用' : '已停用'}</div>
                </div>
              </div>

              {/* 功能权限 */}
              <div>
                <h3 className="text-sm font-semibold mb-2">功能权限（资源类型 + 批次 + 操作）</h3>
                <div className="space-y-2">
                  {detailGrant.resourcePermissions.map((rp) => (
                    <div key={rp.id} className="flex items-center gap-3 text-sm bg-background rounded-md p-3 border">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {resourceIcons[rp.resourceType]}
                        {RESOURCE_TYPE_LABELS[rp.resourceType]}
                      </Badge>
                      <span className="text-muted-foreground">·</span>
                      <span className="font-medium">{rp.batchName || '—'}</span>
                      <span className="text-muted-foreground">·</span>
                      <div className="flex gap-1 flex-wrap">
                        {rp.operations.map((op) => (
                          <Badge key={op} variant="outline" className="text-xs font-normal">
                            {OPERATION_TYPE_LABELS[op]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  {detailGrant.resourcePermissions.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无功能权限</p>
                  )}
                </div>
              </div>

              {/* 测评权限 */}
              <div>
                <h3 className="text-sm font-semibold mb-2">测评权限</h3>
                <div className="flex flex-wrap gap-2">
                  {detailGrant.assessmentPermissions.map((at) => (
                    <Badge key={at} variant="secondary" className="text-sm px-3 py-1">
                      {ASSESSMENT_TYPE_LABELS[at]}
                    </Badge>
                  ))}
                  {detailGrant.assessmentPermissions.length === 0 && (
                    <span className="text-sm text-muted-foreground">未配置测评权限</span>
                  )}
                </div>
              </div>

              {/* 授权平台 */}
              <div>
                <h3 className="text-sm font-semibold mb-2">授权平台</h3>
                <div className="flex flex-wrap gap-2">
                  {detailGrant.authorizedPlatforms.map((plat) => (
                    <Badge key={plat} variant="secondary" className="text-sm px-3 py-1 flex items-center gap-1">
                      {plat === 'job' && <Briefcase className="h-3.5 w-3.5" />}
                      {plat === 'scene' && <MapPin className="h-3.5 w-3.5" />}
                      {plat === 'brand' && <Shield className="h-3.5 w-3.5" />}
                      {PLATFORM_TYPE_LABELS[plat]}
                    </Badge>
                  ))}
                  {detailGrant.authorizedPlatforms.length === 0 && (
                    <span className="text-sm text-muted-foreground">未配置平台授权</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 分享弹窗 */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>分享账号信息</DialogTitle>
            <DialogDescription>
              将以下信息复制并发送给合作方
            </DialogDescription>
          </DialogHeader>
          {shareGrant && (() => {
            const account = accounts.find(a => a.id === shareGrant.accountId)
            const shareText = `您好！账号已为您准备就绪 🎉\n\n您可以通过以下地址登录平台：\nhttp://47.251.48.187:3001/partner/login\n\n登录账号：${account?.username ?? '—'}\n登录密码：${account?.password ?? '******'}\n\n如有任何问题，欢迎随时联系管理员。`
            return (
              <div className="space-y-4">
                <pre className="whitespace-pre-wrap break-all rounded-md bg-muted p-4 text-sm select-all">
                  {shareText}
                </pre>
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareText)
                    }}
                  >
                    复制
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除「{deletingGrant?.accountName}」的权限授权吗？此操作不可撤销。
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
