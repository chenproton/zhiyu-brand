'use client'

import { useState, use } from 'react'
import { useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { jobs } from '@/lib/mock-data'
import { JOB_CATEGORY_LABELS, INDUSTRIES, MAJORS } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

export default function EditPartnerJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const job = jobs.find((j) => j.id === id)

  if (!job) {
    notFound()
  }

  const isTeaching = job.jobCategory === 'teaching'

  // 通用可编辑字段
  const [title, setTitle] = useState(job.title)
  const [salaryMin, setSalaryMin] = useState(job.salaryMin?.toString() || '')
  const [salaryMax, setSalaryMax] = useState(job.salaryMax?.toString() || '')
  const [responsibilities, setResponsibilities] = useState(
    job.responsibilities.join('\n')
  )
  const [requirements, setRequirements] = useState(
    job.requirements.join('\n')
  )

  // 非教学岗位额外字段
  const [industry, setIndustry] = useState(job.industry || '')
  const [selectedMajors, setSelectedMajors] = useState<string[]>(job.suitableMajors || [])
  const [description, setDescription] = useState(job.description)
  const [majorsOpen, setMajorsOpen] = useState(false)

  const handleSubmit = () => {
    if (!title) {
      alert('岗位名称为必填项')
      return
    }

    const index = jobs.findIndex((j) => j.id === id)
    if (index !== -1) {
      jobs[index] = {
        ...jobs[index],
        title,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        responsibilities: responsibilities
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: requirements
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        updatedAt: new Date(),
        ...(isTeaching
          ? {}
          : {
              industry,
              suitableMajors: selectedMajors,
              description,
            }),
      }
    }

    router.push(`/partner/jobs/${id}/ability`)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/partner/jobs">
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">编辑岗位</h1>
          <p className="text-muted-foreground">
            {isTeaching
              ? '教学岗位：部分字段引用自岗位库'
              : '非教学岗位：可修改全部字段'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>岗位信息</CardTitle>
            {job.jobCategory && (
              <Badge variant="outline">
                {JOB_CATEGORY_LABELS[job.jobCategory]}
              </Badge>
            )}
          </div>
          <CardDescription>修改岗位基本信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 岗位名称 */}
          <div className="space-y-2">
            <Label htmlFor="title">
              岗位名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {isTeaching && (
              <p className="text-xs text-muted-foreground">
                仅用于展示调整，不会修改岗位库中的原始数据
              </p>
            )}
          </div>

          {/* 所属行业 + 关联专业 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">所属行业</Label>
              <Select
                value={industry}
                disabled={isTeaching}
                onValueChange={setIndustry}
              >
                <SelectTrigger id="industry" className={isTeaching ? 'bg-muted' : ''}>
                  <SelectValue placeholder="选择所属行业" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isTeaching && (
                <p className="text-xs text-muted-foreground">
                  引用自岗位库，不可修改
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>关联专业</Label>
              <Popover open={majorsOpen} onOpenChange={setMajorsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={majorsOpen}
                    className="w-full justify-between font-normal h-auto min-h-9 py-1.5 px-3"
                    disabled={isTeaching}
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedMajors.length === 0 ? (
                        <span className="text-muted-foreground">选择关联专业</span>
                      ) : (
                        selectedMajors.map((m) => (
                          <Badge key={m} variant="secondary" className="text-xs">
                            {m}
                          </Badge>
                        ))
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-2" align="start">
                  <div className="max-h-[240px] overflow-y-auto space-y-1">
                    {MAJORS.map((major) => (
                      <div
                        key={major}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                        onClick={() => {
                          if (isTeaching) return
                          setSelectedMajors((prev) =>
                            prev.includes(major)
                              ? prev.filter((m) => m !== major)
                              : [...prev, major]
                          )
                        }}
                      >
                        <Checkbox
                          checked={selectedMajors.includes(major)}
                          disabled={isTeaching}
                        />
                        <span className="text-sm">{major}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {isTeaching && (
                <p className="text-xs text-muted-foreground">
                  引用自岗位库，不可修改
                </p>
              )}
            </div>
          </div>

          {/* 薪资范围 */}
          <div className="space-y-2">
            <Label>薪资范围（千元/月）</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="最低"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-32"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="最高"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-32"
              />
              <span className="text-muted-foreground">K</span>
            </div>
            {isTeaching && (
              <p className="text-xs text-muted-foreground">
                仅用于展示调整，不会修改岗位库中的原始数据
              </p>
            )}
          </div>

          {/* 岗位介绍 */}
          <div className="space-y-2">
            <Label htmlFor="description">岗位介绍</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={description}
              disabled={isTeaching}
              onChange={(e) => setDescription(e.target.value)}
            />
            {isTeaching && (
              <p className="text-xs text-muted-foreground">
                引用自岗位库，不可修改
              </p>
            )}
          </div>

          <Separator />

          {/* 工作职责 */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">工作职责</Label>
            <textarea
              id="responsibilities"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="每行一条职责..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
            />
            {isTeaching && (
              <p className="text-xs text-muted-foreground">
                仅用于展示调整，不会修改岗位库中的原始数据
              </p>
            )}
          </div>

          {/* 任职要求 */}
          <div className="space-y-2">
            <Label htmlFor="requirements">任职要求</Label>
            <textarea
              id="requirements"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="每行一条要求..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
            {isTeaching && (
              <p className="text-xs text-muted-foreground">
                仅用于展示调整，不会修改岗位库中的原始数据
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/partner/jobs">取消</Link>
            </Button>
            <Button onClick={handleSubmit}>保存并配置能力模型</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
