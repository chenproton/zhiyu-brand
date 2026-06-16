'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { FakeRichTextEditor } from '@/components/shared/fake-rich-text-editor'
import {
  StudentGroupTree,
  STUDENT_GROUP_TREE,
  useStudentGroupSelection,
} from '@/app/admin/employment/projects/_components/student-group-selector'
import { enterprises } from '@/lib/mock-data'
import { SECONDARY_COLLEGES } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const PROJECT_TYPE_OPTIONS = [
  { value: 'spring', label: '春季招聘' },
  { value: 'autumn', label: '秋季招聘' },
  { value: '定向招聘', label: '定向招聘' },
  { value: 'order', label: '订单班招聘' },
  { value: 'custom', label: '自定义' },
]

interface EmploymentProjectFormProps {
  mode: 'new' | 'edit'
  initialData?: {
    name: string
    type: string
    partnerIds: string[]
    targetStudentGroups: string[]
    startDate: Date
    endDate: Date
    description: string
    organizer?: string
  }
  onSubmit: (data: {
    name: string
    type: string
    partnerIds: string[]
    targetStudentGroups: string[]
    startDate: Date
    endDate: Date
    description: string
    organizer: string
  }) => void
}

interface OrganizerNode {
  id: string
  label: string
  children?: OrganizerNode[]
}

const ORGANIZER_TREE: OrganizerNode[] = [
  {
    id: 'school',
    label: '学校',
    children: SECONDARY_COLLEGES.filter((c) => c !== '校本级').map((college) => ({
      id: `school-${college}`,
      label: college,
      children: [
        { id: `school-${college}-office`, label: '就业办公室' },
        { id: `school-${college}-teaching`, label: '教学办公室' },
      ],
    })),
  },
]

function useOrganizerSelection(initialOrganizer?: string) {
  const getInitialSelectedIds = () => {
    const initial = new Set<string>()
    if (!initialOrganizer) return initial
    const findNode = (nodes: OrganizerNode[], path: string[] = []): string[] | null => {
      for (const node of nodes) {
        if (initialOrganizer === node.label || initialOrganizer.startsWith(`${node.label} /`)) {
          return [...path, node.id]
        }
        if (node.children) {
          const found = findNode(node.children, [...path, node.id])
          if (found) return found
        }
      }
      return null
    }
    const matched = findNode(ORGANIZER_TREE)
    if (matched) {
      matched.forEach((id) => initial.add(id))
    }
    return initial
  }

  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(getInitialSelectedIds)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set())

  const toggleNodeSelection = (node: OrganizerNode, selected: boolean) => {
    setSelectedNodeIds(() => {
      const next = new Set<string>()
      if (selected) next.add(node.id)
      return next
    })
  }

  const toggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const selectedOrganizer = useMemo(() => {
    const findLabel = (nodes: OrganizerNode[]): string | null => {
      for (const node of nodes) {
        if (selectedNodeIds.has(node.id)) {
          if (node.children) {
            for (const child of node.children) {
              if (selectedNodeIds.has(child.id)) {
                if (child.children) {
                  for (const grandChild of child.children) {
                    if (selectedNodeIds.has(grandChild.id)) {
                      return `${node.label} / ${child.label} / ${grandChild.label}`
                    }
                  }
                }
                return `${node.label} / ${child.label}`
              }
            }
            return node.label
          }
          return node.label
        }
        if (node.children) {
          const found = findLabel(node.children)
          if (found) return found
        }
      }
      return null
    }
    return findLabel(ORGANIZER_TREE)
  }, [selectedNodeIds])

  return {
    selectedNodeIds,
    expandedNodeIds,
    toggleNodeSelection,
    toggleExpand,
    selectedOrganizer,
  }
}

export default function EmploymentProjectForm({ mode, initialData, onSubmit }: EmploymentProjectFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState(initialData?.type || '')
  const [customType, setCustomType] = useState(() => {
    if (!initialData?.type) return ''
    const known = PROJECT_TYPE_OPTIONS.map((o) => o.value)
    return known.includes(initialData.type) ? '' : initialData.type
  })
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>(initialData?.partnerIds || [])
  const [selectedStudentGroups, setSelectedStudentGroups] = useState<string[]>(
    initialData?.targetStudentGroups || []
  )
  const [startDate, setStartDate] = useState<Date | undefined>(initialData?.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(initialData?.endDate)
  const [description, setDescription] = useState(initialData?.description || '')
  const [organizer, setOrganizer] = useState(initialData?.organizer || '')
  const [organizerMode, setOrganizerMode] = useState<'tree' | 'custom'>(
    initialData?.organizer && !initialData.organizer.startsWith('学校 /') ? 'custom' : 'tree'
  )
  const [enterprisePopoverOpen, setEnterprisePopoverOpen] = useState(false)
  const [studentGroupPopoverOpen, setStudentGroupPopoverOpen] = useState(false)
  const [organizerPopoverOpen, setOrganizerPopoverOpen] = useState(false)
  const [enterpriseCollegeFilter, setEnterpriseCollegeFilter] = useState('全部')

  const {
    selectedNodeIds,
    expandedNodeIds,
    toggleNodeSelection,
    toggleExpand,
    buildGroups,
  } = useStudentGroupSelection(initialData?.targetStudentGroups || [])

  const {
    selectedNodeIds: organizerSelectedNodeIds,
    expandedNodeIds: organizerExpandedNodeIds,
    toggleNodeSelection: toggleOrganizerSelection,
    toggleExpand: toggleOrganizerExpand,
    selectedOrganizer,
  } = useOrganizerSelection(organizerMode === 'tree' ? organizer : undefined)

  const togglePartner = (id: string) => {
    setSelectedPartnerIds((current) =>
      current.includes(id) ? current.filter((pid) => pid !== id) : [...current, id]
    )
  }

  const addStudentGroups = () => {
    const groups = buildGroups()
    setSelectedStudentGroups((prev) => {
      const merged = new Set([...prev, ...groups])
      return Array.from(merged)
    })
    setStudentGroupPopoverOpen(false)
  }

  const removeStudentGroup = (group: string) => {
    setSelectedStudentGroups((prev) => prev.filter((g) => g !== group))
  }

  const handleSubmit = () => {
    const finalType = type === 'custom' ? customType : type
    const finalOrganizer = organizerMode === 'custom' ? organizer : selectedOrganizer || organizer
    if (!name || !finalType || selectedPartnerIds.length === 0 || selectedStudentGroups.length === 0 || !startDate || !endDate || !finalOrganizer) {
      alert('请填写所有必填项')
      return
    }

    onSubmit({
      name,
      type: finalType,
      partnerIds: selectedPartnerIds,
      targetStudentGroups: selectedStudentGroups,
      startDate,
      endDate,
      description,
      organizer: finalOrganizer,
    })
  }

  const availableColleges = useMemo(() => {
    const set = new Set<string>()
    enterprises.forEach((e) => {
      e.secondaryColleges?.forEach((c) => set.add(c))
    })
    return ['全部', ...Array.from(set).sort()]
  }, [])

  const filteredEnterprises = useMemo(() => {
    if (enterpriseCollegeFilter === '全部') return enterprises
    return enterprises.filter((e) => e.secondaryColleges?.includes(enterpriseCollegeFilter))
  }, [enterpriseCollegeFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/employment/projects">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{mode === 'new' ? '新建就业项目' : '编辑就业项目'}</h1>
          <p className="text-muted-foreground">{mode === 'new' ? '创建新的就业招聘项目' : '修改就业项目信息'}</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
          <CardDescription>{mode === 'new' ? '填写就业项目的基本信息' : '修改就业项目的基本信息'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              就业项目名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="请输入项目名称，如：2025春季校园招聘"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>
              就业项目类型 <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {type === 'custom' && (
              <Input
                className="mt-2"
                placeholder="请输入自定义项目类型"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>
              发起单位 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Popover open={organizerPopoverOpen} onOpenChange={setOrganizerPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={organizerMode === 'custom'}
                  >
                    <span className={organizerMode === 'custom' ? 'text-muted-foreground' : ''}>
                      {organizerMode === 'custom'
                        ? '使用自定义输入'
                        : selectedOrganizer || organizer || '选择发起单位'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <div className="max-h-[360px] overflow-y-auto p-2">
                    <StudentGroupTree
                      nodes={ORGANIZER_TREE}
                      selectedNodeIds={organizerSelectedNodeIds}
                      expandedNodeIds={organizerExpandedNodeIds}
                      onToggleSelect={toggleOrganizerSelection}
                      onToggleExpand={toggleOrganizerExpand}
                    />
                  </div>
                  <div className="p-2 border-t">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      disabled={!selectedOrganizer}
                      onClick={() => {
                        if (selectedOrganizer) {
                          setOrganizer(selectedOrganizer)
                          setOrganizerPopoverOpen(false)
                        }
                      }}
                    >
                      确认选择
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant={organizerMode === 'tree' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setOrganizerMode('tree')}
              >
                从组织架构选择
              </Button>
              <Button
                type="button"
                variant={organizerMode === 'custom' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setOrganizerMode('custom')}
              >
                自定义输入
              </Button>
            </div>
            {organizerMode === 'custom' && (
              <Input
                className="mt-2"
                placeholder="请输入发起单位"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>
              参与企业 <span className="text-red-500">*</span>
            </Label>
            <Popover open={enterprisePopoverOpen} onOpenChange={setEnterprisePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedPartnerIds.length > 0
                    ? `已选择 ${selectedPartnerIds.length} 家企业`
                    : '选择企业'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <div className="p-2 border-b">
                  <div className="flex flex-wrap gap-1.5">
                    {availableColleges.map((college) => (
                      <button
                        key={college}
                        type="button"
                        onClick={() => setEnterpriseCollegeFilter(college)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          enterpriseCollegeFilter === college
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {college}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                  {filteredEnterprises.map((enterprise) => (
                    <div
                      key={enterprise.id}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => togglePartner(enterprise.id)}
                    >
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          selectedPartnerIds.includes(enterprise.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        )}
                      >
                        {selectedPartnerIds.includes(enterprise.id) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      <span className="text-sm">{enterprise.name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {selectedPartnerIds.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedPartnerIds.map((id) => {
                  const enterprise = enterprises.find((e) => e.id === id)
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                    >
                      {enterprise?.name}
                      <button
                        onClick={() => togglePartner(id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>
              面向学生群体 <span className="text-red-500">*</span>
            </Label>

            <Popover open={studentGroupPopoverOpen} onOpenChange={setStudentGroupPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedStudentGroups.length > 0
                    ? `已选择 ${selectedStudentGroups.length} 个群体`
                    : '选择学生群体'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <div className="max-h-[360px] overflow-y-auto p-2">
                  <StudentGroupTree
                    nodes={STUDENT_GROUP_TREE}
                    selectedNodeIds={selectedNodeIds}
                    expandedNodeIds={expandedNodeIds}
                    onToggleSelect={toggleNodeSelection}
                    onToggleExpand={toggleExpand}
                  />
                </div>
                <div className="p-2 border-t">
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    disabled={selectedNodeIds.size === 0}
                    onClick={addStudentGroups}
                  >
                    确认添加
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {selectedStudentGroups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedStudentGroups.map((group) => (
                  <span
                    key={group}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                  >
                    {group}
                    <button
                      type="button"
                      onClick={() => removeStudentGroup(group)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                开始时间 <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'yyyy-MM-dd') : '选择开始时间'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>
                结束时间 <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'yyyy-MM-dd') : '选择结束时间'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="description">招聘项目简介</Label>
            <FakeRichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="简要描述该就业项目的目标和特点..."
              minHeight="120px"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/employment/projects">取消</Link>
            </Button>
            <Button onClick={handleSubmit}>保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
