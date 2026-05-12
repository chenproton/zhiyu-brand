'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, X, Search } from 'lucide-react'
import { EXPERT_TYPES, INDUSTRIES } from '@/lib/types'
import type { ExpertGender, ExpertType } from '@/lib/types'

// 模拟岗位数据
const MOCK_POSITIONS = [
  '前端开发工程师',
  '后端开发工程师',
  '算法工程师',
  '产品经理',
  'UI设计师',
  '测试工程师',
  '运维工程师',
  '数据分析师',
  '项目经理',
  '技术总监',
  '人力资源经理',
  '财务经理',
  '市场营销专员',
  '生产主管',
  '质量工程师',
  '安全工程师',
  '创意总监',
  '品牌设计师',
  '视觉设计师',
  '动画设计师',
]

export default function NewExpertPage() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [gender, setGender] = useState<ExpertGender>('male')
  const [title, setTitle] = useState('')
  const [expertType, setExpertType] = useState<ExpertType | ''>('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isContactHidden, setIsContactHidden] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const [specialties, setSpecialties] = useState<string[]>([])

  const [workExperience, setWorkExperience] = useState('')

  const [relatedPositions, setRelatedPositions] = useState<string[]>([])
  const [positionSearch, setPositionSearch] = useState('')
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false)

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index))
  }

  const togglePosition = (pos: string) => {
    setRelatedPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    )
  }

  const filteredPositions = MOCK_POSITIONS.filter(
    (pos) =>
      pos.toLowerCase().includes(positionSearch.toLowerCase()) &&
      !relatedPositions.includes(pos)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    alert('专家信息已保存（演示）')
    setIsSubmitting(false)
    router.push('/admin/experts')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/experts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">新增专家</h1>
          <p className="text-sm text-muted-foreground mt-1">录入新的专家信息</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入姓名"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">性别</Label>
                    <Select value={gender} onValueChange={(v) => setGender(v as ExpertGender)}>
                      <SelectTrigger id="gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">职称/头衔 *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="如：技术总监"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expertType">专家类型</Label>
                    <Select value={expertType} onValueChange={(v) => setExpertType(v as ExpertType)}>
                      <SelectTrigger id="expertType">
                        <SelectValue placeholder="请选择" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience">从业年限</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="如：10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">教育背景</Label>
                    <Input
                      id="education"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="如：清华大学计算机科学博士"
                    />
                  </div>
                </div>

                {/* 关联行业 */}
                <div className="space-y-2">
                  <Label>关联行业</Label>
                  <div className="flex gap-2">
                    <Select
                      value=""
                      onValueChange={(val) => {
                        if (val && !specialties.includes(val)) {
                          setSpecialties([...specialties, val])
                        }
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="选择行业" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {specialty}
                        <button type="button" onClick={() => handleRemoveSpecialty(index)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>工作经验</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  rows={5}
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  placeholder="请输入工作经验描述..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>关联岗位</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索岗位..."
                    value={positionSearch}
                    onChange={(e) => {
                      setPositionSearch(e.target.value)
                      setPositionDropdownOpen(true)
                    }}
                    onFocus={() => setPositionDropdownOpen(true)}
                    className="pl-9"
                  />
                  {positionDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setPositionDropdownOpen(false)}
                      />
                      <div className="absolute z-20 mt-1 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredPositions.length > 0 ? (
                          filteredPositions.map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                              onClick={() => {
                                togglePosition(pos)
                                setPositionSearch('')
                                setPositionDropdownOpen(false)
                              }}
                            >
                              {pos}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            {positionSearch ? '无匹配岗位' : '无更多岗位'}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatedPositions.map((pos) => (
                    <Badge key={pos} variant="secondary" className="gap-1">
                      {pos}
                      <button
                        type="button"
                        onClick={() => togglePosition(pos)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>联系方式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">电子邮箱</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="13800000000"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    id="isContactHidden"
                    checked={isContactHidden}
                    onCheckedChange={setIsContactHidden}
                  />
                  <Label htmlFor="isContactHidden">隐藏联系方式</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>状态</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'inactive')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">在聘</SelectItem>
                    <SelectItem value="inactive">离聘</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '保存中...' : '保存'}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/admin/experts">取消</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
