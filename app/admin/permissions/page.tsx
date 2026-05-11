'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, Shield, Building2, User, Briefcase, Map, BookOpen } from 'lucide-react'
import { permissionConfigs } from '@/lib/mock-data'
import { PERMISSION_SUBJECT_TYPE_LABELS, FUNCTION_PERMISSION_LABELS } from '@/lib/types'
import type { PermissionConfig, PermissionSubjectType, FunctionPermission } from '@/lib/types'

const permissionIcons: Record<FunctionPermission, React.ReactNode> = {
  job_manage: <Briefcase className="h-4 w-4" />,
  scene_manage: <Map className="h-4 w-4" />,
  course_manage: <BookOpen className="h-4 w-4" />,
}

export default function PermissionsPage() {
  const [configs, setConfigs] = useState<PermissionConfig[]>(permissionConfigs)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<PermissionConfig | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingConfig, setDeletingConfig] = useState<PermissionConfig | null>(null)

  const [formData, setFormData] = useState<Partial<PermissionConfig>>({
    subjectType: 'enterprise',
    subjectId: '',
    subjectName: '',
    permissions: [],
    enabled: true,
  })

  const handleAdd = () => {
    setEditingConfig(null)
    setFormData({
      subjectType: 'enterprise',
      subjectId: '',
      subjectName: '',
      permissions: [],
      enabled: true,
    })
    setDialogOpen(true)
  }

  const handleEdit = (config: PermissionConfig) => {
    setEditingConfig(config)
    setFormData({ ...config })
    setDialogOpen(true)
  }

  const handleDelete = (config: PermissionConfig) => {
    setDeletingConfig(config)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingConfig) {
      setConfigs(configs.filter(c => c.id !== deletingConfig.id))
      setDeleteDialogOpen(false)
      setDeletingConfig(null)
    }
  }

  const handleToggleEnabled = (config: PermissionConfig) => {
    setConfigs(configs.map(c => c.id === config.id ? { ...c, enabled: !c.enabled } : c))
  }

  const handleSave = () => {
    if (!formData.subjectName || !formData.subjectId) return

    if (editingConfig) {
      setConfigs(configs.map(c => c.id === editingConfig.id ? { ...c, ...formData } as PermissionConfig : c))
    } else {
      const newConfig: PermissionConfig = {
        id: `perm${Date.now()}`,
        subjectType: formData.subjectType as PermissionSubjectType,
        subjectId: formData.subjectId || '',
        subjectName: formData.subjectName || '',
        permissions: formData.permissions as FunctionPermission[] || [],
        enabled: formData.enabled ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setConfigs([...configs, newConfig])
    }
    setDialogOpen(false)
  }

  const togglePermission = (perm: FunctionPermission) => {
    const current = formData.permissions || []
    if (current.includes(perm)) {
      setFormData({ ...formData, permissions: current.filter(p => p !== perm) })
    } else {
      setFormData({ ...formData, permissions: [...current, perm] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">合作权限管理</h1>
          <p className="text-muted-foreground">为企业类型和专家类型开通账号并授权功能权限</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          新增权限配置
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">权限配置数</p>
                <p className="text-3xl font-bold">{configs.length}</p>
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
                <p className="text-sm text-muted-foreground">已启用</p>
                <p className="text-3xl font-bold">{configs.filter(c => c.enabled).length}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已停用</p>
                <p className="text-3xl font-bold">{configs.filter(c => !c.enabled).length}</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 权限配置列表 */}
      <Card>
        <CardHeader>
          <CardTitle>权限配置列表</CardTitle>
          <CardDescription>管理各类型主体的功能权限授权</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>主体类型</TableHead>
                <TableHead>主体名称</TableHead>
                <TableHead>授权权限</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {PERMISSION_SUBJECT_TYPE_LABELS[config.subjectType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{config.subjectName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {config.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs flex items-center gap-1">
                          {permissionIcons[perm]}
                          {FUNCTION_PERMISSION_LABELS[perm]}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={() => handleToggleEnabled(config)}
                      />
                      <span className={`text-sm ${config.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {config.enabled ? '已启用' : '已停用'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(config)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(config)}>
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

      {/* 权限说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            权限说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="font-medium">岗位管理</span>
              </div>
              <p className="text-sm text-muted-foreground">允许发布、编辑和管理岗位信息，查看投递记录</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Map className="h-5 w-5 text-green-600" />
                <span className="font-medium">场景管理</span>
              </div>
              <p className="text-sm text-muted-foreground">允许创建、编辑和管理实训场景、项目场景</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="font-medium">课程管理</span>
              </div>
              <p className="text-sm text-muted-foreground">允许开发、编辑和管理课程资源、教学内容</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 编辑/新增对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingConfig ? '编辑权限配置' : '新增权限配置'}</DialogTitle>
            <DialogDescription>
              {editingConfig ? '修改权限配置信息' : '为新的主体类型配置功能权限'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>主体类型</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.subjectType === 'enterprise' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, subjectType: 'enterprise' })}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  企业类型
                </Button>
                <Button
                  type="button"
                  variant={formData.subjectType === 'expert' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, subjectType: 'expert' })}
                >
                  <User className="h-4 w-4 mr-2" />
                  专家类型
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>主体标识</Label>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                placeholder="如：platform / gold"
              />
            </div>
            <div className="space-y-2">
              <Label>主体名称</Label>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                placeholder="如：平台企业 / 金牌专家"
              />
            </div>
            <div className="space-y-2">
              <Label>授权权限</Label>
              <div className="space-y-2">
                {(Object.entries(FUNCTION_PERMISSION_LABELS) as [FunctionPermission, string][]).map(([perm, label]) => (
                  <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                      id={perm}
                      checked={(formData.permissions || []).includes(perm)}
                      onCheckedChange={() => togglePermission(perm)}
                    />
                    <Label htmlFor={perm} className="flex items-center gap-2 cursor-pointer">
                      {permissionIcons[perm]}
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
              <Label>启用该配置</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除「{deletingConfig?.subjectName}」的权限配置吗？此操作不可撤销。
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
