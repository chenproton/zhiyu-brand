'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RESOURCE_TYPE_LABELS, OPERATION_TYPE_LABELS } from '@/lib/types'
import type { ResourceType, OperationType } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Briefcase,
  MapPin,
  BookOpen,
  Settings2,
  ChevronDown,
  ChevronRight,
  Check,
  Shield,
} from 'lucide-react'

interface RolePermissionConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TABS: { value: ResourceType; label: string; icon: React.ReactNode }[] = [
  { value: 'position', label: '岗位', icon: <Briefcase className="h-4 w-4" /> },
  { value: 'scene', label: '场景', icon: <MapPin className="h-4 w-4" /> },
  { value: 'course', label: '课程', icon: <BookOpen className="h-4 w-4" /> },
]

const ROLES: OperationType[] = ['view', 'edit', 'review', 'publish', 'delete', 'create']

const ROLE_BADGE_COLORS: Record<OperationType, string> = {
  view: 'bg-blue-50 text-blue-700 border-blue-200',
  edit: 'bg-amber-50 text-amber-700 border-amber-200',
  review: 'bg-purple-50 text-purple-700 border-purple-200',
  publish: 'bg-green-50 text-green-700 border-green-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
  create: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  assess: 'bg-cyan-50 text-cyan-700 border-cyan-200',
}

interface PermissionButton {
  id: string
  label: string
}

interface PermissionPage {
  id: string
  label: string
  buttons: PermissionButton[]
}

interface PermissionModule {
  id: string
  label: string
  pages: PermissionPage[]
}

type RawPermissionPage = Omit<PermissionPage, 'buttons'> & {
  buttons: (string | PermissionButton)[]
}

type RawPermissionModule = Omit<PermissionModule, 'pages'> & {
  pages: RawPermissionPage[]
}

const SYSTEM_PERMISSION_TREE: RawPermissionModule[] = [
  {
    id: 'cooperation',
    label: '产教融合管理',
    pages: [
      { id: 'school', label: '学校信息', buttons: ['查看列表', '新增', '编辑', '删除', '导入', '导出'] },
      { id: 'enterprises', label: '合作企业', buttons: ['查看列表', '新增', '编辑', '删除', '导入', '导出'] },
      { id: 'projects', label: '合作项目', buttons: ['查看列表', '新增', '编辑', '删除', '审核', '发布', '导入', '导出'] },
      { id: 'achievements', label: '合作成果', buttons: ['查看列表', '新增', '编辑', '删除', '审核', '发布', '导入', '导出'] },
      { id: 'experts', label: '专家资源库', buttons: ['查看列表', '新增', '编辑', '删除', '导入', '导出'] },
      { id: 'permissions', label: '合作权限', buttons: ['查看列表', '新增授权', '编辑授权', '删除授权', '角色权限配置'] },
    ],
  },
  {
    id: 'brand',
    label: '品牌运营管理',
    pages: [
      { id: 'brand-talent', label: '人才品牌管理', buttons: ['查看列表', '新增', '编辑', '删除', '发布', '导入', '导出'] },
      { id: 'brand-partner', label: '雇主品牌管理', buttons: ['查看列表', '新增', '编辑', '删除', '发布', '导入', '导出'] },
      { id: 'brand-job', label: '岗位品牌管理', buttons: ['查看列表', '新增', '编辑', '删除', '发布', '导入', '导出'] },
      { id: 'brand-major', label: '专业品牌管理', buttons: ['查看列表', '新增', '编辑', '删除', '发布', '导入', '导出'] },
      { id: 'brand-teacher', label: '师资品牌管理', buttons: ['查看列表', '新增', '编辑', '删除', '发布', '导入', '导出'] },
      { id: 'brand-culture', label: '文化思政品牌管理', buttons: ['查看列表', '新增', '编辑', '删除', '发布', '导入', '导出'] },
    ],
  },
  {
    id: 'employment',
    label: '就业服务管理',
    pages: [
      { id: 'employment-projects', label: '就业项目', buttons: ['查看列表', '新增', '编辑', '删除', '审核', '发布', '导入', '导出'] },
    ],
  },
]

function normalizeButton(button: string | PermissionButton): PermissionButton {
  return typeof button === 'string' ? { id: button, label: button } : button
}

const NORMALIZED_TREE: PermissionModule[] = SYSTEM_PERMISSION_TREE.map((menuModule) => ({
  ...menuModule,
  pages: menuModule.pages.map((page) => ({
    ...page,
    buttons: page.buttons.map(normalizeButton),
  })),
}))

function buttonKey(
  resourceType: ResourceType,
  operation: OperationType,
  moduleId: string,
  pageId: string,
  buttonId: string
) {
  return `${resourceType}:${operation}:${moduleId}:${pageId}:${buttonId}`
}

function pageExpandKey(
  resourceType: ResourceType,
  operation: OperationType,
  moduleId: string,
  pageId: string
) {
  return `${resourceType}:${operation}:page:${moduleId}:${pageId}`
}

function moduleExpandKey(
  resourceType: ResourceType,
  operation: OperationType,
  moduleId: string
) {
  return `${resourceType}:${operation}:module:${moduleId}`
}

export function RolePermissionConfigDialog({
  open,
  onOpenChange,
}: RolePermissionConfigDialogProps) {
  const [activeTab, setActiveTab] = useState<ResourceType>('position')
  const [selectedRole, setSelectedRole] = useState<OperationType | null>(null)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set())

  const selectedOperation = selectedRole

  const pageAllButtonKeys = useCallback(
    (moduleId: string, pageId: string) => {
      const menuModule = NORMALIZED_TREE.find((m) => m.id === moduleId)
      const page = menuModule?.pages.find((p) => p.id === pageId)
      if (!page) return []
      return page.buttons.map((button) =>
        buttonKey(activeTab, selectedOperation!, moduleId, pageId, button.id)
      )
    },
    [activeTab, selectedOperation]
  )

  const moduleAllButtonKeys = useCallback(
    (moduleId: string) => {
      const menuModule = NORMALIZED_TREE.find((m) => m.id === moduleId)
      if (!menuModule) return []
      return menuModule.pages.flatMap((page) => pageAllButtonKeys(moduleId, page.id))
    },
    [pageAllButtonKeys]
  )

  const allButtonKeysForCurrentSelection = useMemo(() => {
    if (!selectedOperation) return []
    return NORMALIZED_TREE.flatMap((menuModule) => moduleAllButtonKeys(menuModule.id))
  }, [selectedOperation, moduleAllButtonKeys])

  const isButtonChecked = (moduleId: string, pageId: string, buttonId: string) => {
    if (!selectedOperation) return false
    return checkedItems.has(buttonKey(activeTab, selectedOperation, moduleId, pageId, buttonId))
  }

  const isPageChecked = (moduleId: string, pageId: string) => {
    const keys = pageAllButtonKeys(moduleId, pageId)
    return keys.length > 0 && keys.every((key) => checkedItems.has(key))
  }

  const isPageIndeterminate = (moduleId: string, pageId: string) => {
    const keys = pageAllButtonKeys(moduleId, pageId)
    const checkedCount = keys.filter((key) => checkedItems.has(key)).length
    return checkedCount > 0 && checkedCount < keys.length
  }

  const isModuleChecked = (moduleId: string) => {
    const keys = moduleAllButtonKeys(moduleId)
    return keys.length > 0 && keys.every((key) => checkedItems.has(key))
  }

  const isModuleIndeterminate = (moduleId: string) => {
    const keys = moduleAllButtonKeys(moduleId)
    const checkedCount = keys.filter((key) => checkedItems.has(key)).length
    return checkedCount > 0 && checkedCount < keys.length
  }

  const isModuleExpanded = (moduleId: string) => {
    if (!selectedOperation) return false
    return expandedModules.has(moduleExpandKey(activeTab, selectedOperation, moduleId))
  }

  const isPageExpanded = (moduleId: string, pageId: string) => {
    if (!selectedOperation) return false
    return expandedPages.has(pageExpandKey(activeTab, selectedOperation, moduleId, pageId))
  }

  const toggleButton = (moduleId: string, pageId: string, buttonId: string) => {
    if (!selectedOperation) return
    const key = buttonKey(activeTab, selectedOperation, moduleId, pageId, buttonId)
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const togglePage = (moduleId: string, pageId: string) => {
    if (!selectedOperation) return
    const keys = pageAllButtonKeys(moduleId, pageId)
    const allChecked = isPageChecked(moduleId, pageId)
    setCheckedItems((prev) => {
      const next = new Set(prev)
      keys.forEach((key) => {
        if (allChecked) {
          next.delete(key)
        } else {
          next.add(key)
        }
      })
      return next
    })
  }

  const toggleModule = (moduleId: string) => {
    if (!selectedOperation) return
    const keys = moduleAllButtonKeys(moduleId)
    const allChecked = isModuleChecked(moduleId)
    setCheckedItems((prev) => {
      const next = new Set(prev)
      keys.forEach((key) => {
        if (allChecked) {
          next.delete(key)
        } else {
          next.add(key)
        }
      })
      return next
    })
  }

  const toggleModuleExpanded = (moduleId: string) => {
    if (!selectedOperation) return
    const key = moduleExpandKey(activeTab, selectedOperation, moduleId)
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const togglePageExpanded = (moduleId: string, pageId: string) => {
    if (!selectedOperation) return
    const key = pageExpandKey(activeTab, selectedOperation, moduleId, pageId)
    setExpandedPages((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const checkedCountForCurrentSelection = useMemo(() => {
    if (!selectedOperation) return 0
    return allButtonKeysForCurrentSelection.filter((key) => checkedItems.has(key)).length
  }, [checkedItems, allButtonKeysForCurrentSelection, selectedOperation])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            角色权限配置
          </DialogTitle>
          <DialogDescription>
            按资源类型与角色配置对应的系统菜单及功能按钮权限，勾选后即时生效
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as ResourceType)
            setSelectedRole(null)
          }}
          className="flex-1 flex flex-col min-h-0 px-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 min-h-0 py-4">
            {TABS.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 h-full data-[state=inactive]:hidden"
              >
                <div className="grid grid-cols-[280px_1fr] gap-4 h-full min-h-[420px]">
                  {/* 左侧角色列表 */}
                  <div className="border rounded-lg bg-muted/30 flex flex-col">
                    <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg">
                      <h4 className="text-sm font-medium">{RESOURCE_TYPE_LABELS[tab.value]}角色</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">选择角色后配置权限</p>
                    </div>
                    <ScrollArea className="flex-1 p-2">
                      <div className="space-y-1.5">
                        {ROLES.map((role) => {
                          const isSelected = selectedRole === role
                          return (
                            <div
                              key={role}
                              className={cn(
                                'flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors',
                                isSelected
                                  ? 'bg-background border-primary shadow-sm'
                                  : 'bg-background border-transparent hover:border-border'
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs px-1.5 py-0.5 font-normal',
                                    ROLE_BADGE_COLORS[role]
                                  )}
                                >
                                  {OPERATION_TYPE_LABELS[role]}
                                </Badge>
                              </div>
                              <Button
                                variant={isSelected ? 'default' : 'ghost'}
                                size="sm"
                                className="h-7 text-xs px-2.5"
                                onClick={() => setSelectedRole(role)}
                              >
                                <Settings2 className="h-3 w-3 mr-1" />
                                权限配置
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* 右侧权限树 */}
                  <div className="border rounded-lg bg-background flex flex-col">
                    {selectedRole ? (
                      <>
                        <div className="px-4 py-3 border-b bg-muted/30 rounded-t-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {OPERATION_TYPE_LABELS[selectedRole]}权限
                            </span>
                            <Badge variant="outline" className="text-xs font-normal">
                              {RESOURCE_TYPE_LABELS[tab.value]}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            已选 {checkedCountForCurrentSelection} 项
                          </span>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-2">
                            {NORMALIZED_TREE.map((menuModule) => {
                              const moduleExpanded = isModuleExpanded(menuModule.id)
                              const moduleChecked = isModuleChecked(menuModule.id)
                              const moduleIndeterminate = isModuleIndeterminate(menuModule.id)
                              return (
                                <div key={menuModule.id} className="rounded-md border overflow-hidden">
                                  <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <button
                                      type="button"
                                      className="text-muted-foreground hover:text-foreground"
                                      onClick={() => toggleModuleExpanded(menuModule.id)}
                                    >
                                      {moduleExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </button>
                                    <Label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer m-0">
                                      <Checkbox
                                        checked={
                                          moduleChecked
                                            ? true
                                            : moduleIndeterminate
                                              ? 'indeterminate'
                                              : false
                                        }
                                        onCheckedChange={() => toggleModule(menuModule.id)}
                                      />
                                      <span>{menuModule.label}</span>
                                    </Label>
                                  </div>
                                  {moduleExpanded && (
                                    <div className="bg-background">
                                      {menuModule.pages.map((page) => {
                                        const pageExpanded = isPageExpanded(menuModule.id, page.id)
                                        const pageChecked = isPageChecked(menuModule.id, page.id)
                                        const pageIndeterminate = isPageIndeterminate(
                                          menuModule.id,
                                          page.id
                                        )
                                        return (
                                          <div
                                            key={page.id}
                                            className="border-t first:border-t-0"
                                          >
                                            <div className="flex items-center gap-2 px-3 py-2 pl-9 bg-muted/10 hover:bg-muted/30 transition-colors">
                                              <button
                                                type="button"
                                                className="text-muted-foreground hover:text-foreground"
                                                onClick={() => togglePageExpanded(menuModule.id, page.id)}
                                              >
                                                {pageExpanded ? (
                                                  <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                  <ChevronRight className="h-4 w-4" />
                                                )}
                                              </button>
                                              <Label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer m-0">
                                                <Checkbox
                                                  checked={
                                                    pageChecked
                                                      ? true
                                                      : pageIndeterminate
                                                        ? 'indeterminate'
                                                        : false
                                                  }
                                                  onCheckedChange={() =>
                                                    togglePage(menuModule.id, page.id)
                                                  }
                                                />
                                                <span>{page.label}</span>
                                              </Label>
                                            </div>
                                            {pageExpanded && (
                                              <div className="px-3 py-2 pl-[4.5rem] space-y-1.5">
                                                {page.buttons.map((button) => (
                                                  <Label
                                                    key={button.id}
                                                    className="flex items-center gap-2 text-sm font-normal cursor-pointer hover:bg-muted/30 rounded px-2 py-1.5 -mx-2"
                                                  >
                                                    <Checkbox
                                                      checked={isButtonChecked(
                                                        menuModule.id,
                                                        page.id,
                                                        button.id
                                                      )}
                                                      onCheckedChange={() =>
                                                        toggleButton(menuModule.id, page.id, button.id)
                                                      }
                                                    />
                                                    <span>{button.label}</span>
                                                  </Label>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <Settings2 className="h-10 w-10 mb-3 opacity-20" />
                        <p className="text-sm">请在左侧选择角色并点击「权限配置」</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            <Check className="h-4 w-4 mr-1.5" />
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
