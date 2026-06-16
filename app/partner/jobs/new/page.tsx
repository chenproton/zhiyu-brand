'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Search,
  Check,
  BookOpen,
  Briefcase,
  ChevronDown,
} from 'lucide-react'
import { jobs, jobBrands, enterprises } from '@/lib/mock-data'
import { usePartner } from '../../partner-context'
import { INDUSTRIES, MAJORS } from '@/lib/types'
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

type Step = 'select-type' | 'form'

export default function NewPartnerJobPage() {
  const router = useRouter()
  const { selectedEnterpriseId } = usePartner()

  const [step, setStep] = useState<Step>('select-type')
  const [category, setCategory] = useState<'teaching' | 'non-teaching' | null>(null)

  // 教学岗位选择
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)

  // 表单字段
  const [title, setTitle] = useState('')
  const [industry, setIndustry] = useState('')
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [responsibilities, setResponsibilities] = useState('')
  const [requirements, setRequirements] = useState('')
  const [majorsOpen, setMajorsOpen] = useState(false)

  const filteredBrands = jobBrands.filter(
    (b) =>
      b.status === 'published' &&
      (b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectedBrand = jobBrands.find((b) => b.id === selectedBrandId)

  const selectBrand = (brand: (typeof jobBrands)[0]) => {
    setSelectedBrandId(brand.id)
    setTitle(brand.name)
    setIndustry(brand.industry)
    setSelectedMajors(brand.suitableMajors)
    setDescription(brand.description)
    setSalaryMin(brand.averageSalary?.split('-')[0].replace('K', '') || '')
    setSalaryMax(brand.averageSalary?.split('-')[1]?.replace('K', '') || '')
  }

  const getPartnerName = () => {
    if (!selectedEnterpriseId) return ''
    const e = enterprises.find((ent) => ent.id === selectedEnterpriseId)
    return e?.name || ''
  }

  const handleSubmit = () => {
    if (!selectedEnterpriseId) {
      alert('请先选择企业')
      return
    }
    if (!title) {
      alert('请填写岗位名称')
      return
    }
    if (category === 'teaching' && !selectedBrandId) {
      alert('请选择一个教学成果库中的岗位')
      return
    }

    const newJob = {
      id: `j${String(jobs.length + 1).padStart(3, '0')}`,
      title,
      partnerId: selectedEnterpriseId,
      partnerName: getPartnerName(),
      partnerLogo: '/placeholder.svg?height=64&width=64',
      jobBrandId: category === 'teaching' ? selectedBrandId || undefined : undefined,
      jobBrandName: category === 'teaching' ? selectedBrand?.name : undefined,
      jobCategory: category!,
      industry,
      type: 'full-time' as const,
      workNature: 'on-site' as const,
      department: '',
      location: '',
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      salaryUnit: 'month' as const,
      requirements: requirements
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: [],
      education: '不限',
      experience: '不限',
      headcount: 1,
      suitableMajors: selectedMajors,
      skills: [],
      description,
      status: 'draft' as const,
      isUrgent: false,
      isRecommended: false,
      viewCount: 0,
      applicationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    jobs.push(newJob)
    router.push('/partner/jobs')
  }

  // Step 1: 选择类型
  if (step === 'select-type') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/partner/jobs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">新建岗位</h1>
            <p className="text-muted-foreground">请选择岗位类型</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card
            className={`cursor-pointer hover:shadow-lg transition-all ${
              category === 'teaching' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => {
              setCategory('teaching')
              setStep('form')
            }}
          >
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">教学岗位</h3>
              <p className="text-sm text-muted-foreground">
                从教学成果库中选择已有岗位成果进行引用
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:shadow-lg transition-all ${
              category === 'non-teaching' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => {
              setCategory('non-teaching')
              setStep('form')
            }}
          >
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">非教学岗位</h3>
              <p className="text-sm text-muted-foreground">
                企业自主创建新的招聘岗位
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 2: 表单
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
          <h1 className="text-2xl font-bold">
            {category === 'teaching' ? '新建教学岗位' : '新建非教学岗位'}
          </h1>
          <p className="text-muted-foreground">
            {category === 'teaching'
              ? '从教学成果库中选择岗位成果'
              : '填写岗位基本信息'}
          </p>
        </div>
      </div>

      {/* 教学岗位：仅搜索选择 */}
      {category === 'teaching' && (
        <Card>
          <CardHeader>
            <CardTitle>选择教学岗位</CardTitle>
            <CardDescription>搜索并选择教学成果库中的岗位</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索岗位名称或行业..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
              {filteredBrands.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  未找到匹配的岗位成果
                </div>
              ) : (
                filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`flex items-center justify-between p-3 cursor-pointer hover:bg-accent border-b last:border-b-0 ${
                      selectedBrandId === brand.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => selectBrand(brand)}
                  >
                    <div>
                      <p className="font-medium text-sm">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {brand.industry} · {brand.suitableMajors.join('、')}
                      </p>
                    </div>
                    {selectedBrandId === brand.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>
            {selectedBrand && (
              <Badge variant="secondary">
                已选择：{selectedBrand.name}
              </Badge>
            )}

            <div className="flex justify-end gap-4 pt-2">
              <Button variant="outline" asChild>
                <Link href="/partner/jobs">取消</Link>
              </Button>
              <Button onClick={handleSubmit} disabled={!selectedBrandId}>
                新建
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 非教学岗位：完整表单 */}
      {category === 'non-teaching' && (
        <Card>
          <CardHeader>
            <CardTitle>岗位信息</CardTitle>
            <CardDescription>填写岗位基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 岗位名称 */}
            <div className="space-y-2">
              <Label htmlFor="title">
                岗位名称 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="请输入岗位名称"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 所属行业 + 面向专业 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">所属行业</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
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
              </div>
              <div className="space-y-2">
                <Label>面向专业</Label>
                <Popover open={majorsOpen} onOpenChange={setMajorsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={majorsOpen}
                      className="w-full justify-between font-normal h-auto min-h-9 py-1.5 px-3"
                    >
                      <div className="flex flex-wrap gap-1">
                        {selectedMajors.length === 0 ? (
                          <span className="text-muted-foreground">选择面向专业</span>
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
                            setSelectedMajors((prev) =>
                              prev.includes(major)
                                ? prev.filter((m) => m !== major)
                                : [...prev, major]
                            )
                          }}
                        >
                          <Checkbox checked={selectedMajors.includes(major)} />
                          <span className="text-sm">{major}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
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
            </div>

            {/* 岗位介绍 */}
            <div className="space-y-2">
              <Label htmlFor="description">岗位介绍</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="简要描述该岗位的职责和要求..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

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
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/partner/jobs">取消</Link>
              </Button>
              <Button onClick={handleSubmit}>新建</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
