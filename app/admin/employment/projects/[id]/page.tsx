'use client'

import { useState, use } from 'react'
import { useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { enterprises, employmentProjects } from '@/lib/mock-data'
import { EMPLOYMENT_PROJECT_TYPE_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const STUDENT_GROUP_OPTIONS = ['全部', '2024届', '2025届', '2026届', '2027届']

export default function EditEmploymentProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const project = employmentProjects.find((ep) => ep.id === id)

  if (!project) {
    notFound()
  }

  const [name, setName] = useState(project.name)
  const [type, setType] = useState<string>(project.type)
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>(project.partnerIds)
  const [selectedStudentGroups, setSelectedStudentGroups] = useState<string[]>(project.targetStudentGroups)
  const [startDate, setStartDate] = useState<Date | undefined>(project.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(project.endDate)
  const [description, setDescription] = useState(project.description || '')
  const [enterprisePopoverOpen, setEnterprisePopoverOpen] = useState(false)

  const togglePartner = (id: string) => {
    setSelectedPartnerIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const toggleStudentGroup = (group: string) => {
    setSelectedStudentGroups((prev) => {
      if (group === '全部') {
        return prev.includes('全部') ? [] : ['全部']
      }
      const filtered = prev.filter((g) => g !== '全部')
      if (prev.includes(group)) {
        return filtered.filter((g) => g !== group)
      }
      return [...filtered, group]
    })
  }

  const handleSubmit = () => {
    if (!name || !type || selectedPartnerIds.length === 0 || selectedStudentGroups.length === 0 || !startDate || !endDate) {
      alert('请填写所有必填项')
      return
    }

    const index = employmentProjects.findIndex((ep) => ep.id === id)
    if (index !== -1) {
      employmentProjects[index] = {
        ...employmentProjects[index],
        name,
        type: type as any,
        partnerIds: selectedPartnerIds,
        targetStudentGroups: selectedStudentGroups,
        startDate,
        endDate,
        description,
        updatedAt: new Date(),
      }
    }

    router.push('/admin/employment/projects')
  }

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
          <h1 className="text-2xl font-bold">编辑就业项目</h1>
          <p className="text-muted-foreground">修改就业项目信息</p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
          <CardDescription>修改就业项目的基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 项目名称 */}
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

          {/* 项目类型 */}
          <div className="space-y-2">
            <Label>
              就业项目类型 <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">{EMPLOYMENT_PROJECT_TYPE_LABELS.spring}</SelectItem>
                <SelectItem value="autumn">{EMPLOYMENT_PROJECT_TYPE_LABELS.autumn}</SelectItem>
                <SelectItem value="定向招聘">{EMPLOYMENT_PROJECT_TYPE_LABELS['定向招聘']}</SelectItem>
                <SelectItem value="other">{EMPLOYMENT_PROJECT_TYPE_LABELS['other']}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 面向企业 */}
          <div className="space-y-2">
            <Label>
              面向企业 <span className="text-red-500">*</span>
            </Label>
            <Popover open={enterprisePopoverOpen} onOpenChange={setEnterprisePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedPartnerIds.length > 0
                    ? `已选择 ${selectedPartnerIds.length} 家企业`
                    : '选择企业'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                  {enterprises.map((enterprise) => (
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

          {/* 面向学生群体 */}
          <div className="space-y-2">
            <Label>
              面向学生群体 <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-4">
              {STUDENT_GROUP_OPTIONS.map((group) => (
                <div key={group} className="flex items-center gap-2">
                  <Checkbox
                    id={`group-${group}`}
                    checked={selectedStudentGroups.includes(group)}
                    onCheckedChange={() => toggleStudentGroup(group)}
                  />
                  <Label htmlFor={`group-${group}`} className="cursor-pointer font-normal">
                    {group}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 起止时间 */}
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

          {/* 项目描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">项目描述</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="简要描述该就业项目的目标和特点..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
