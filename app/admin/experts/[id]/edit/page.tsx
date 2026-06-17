'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import { ArrowLeft, Save, X, Upload, FileText, Trash2 } from 'lucide-react'
import { FakeRichTextEditor } from '@/components/shared/fake-rich-text-editor'
import { experts, enterprises } from '@/lib/mock-data'
import { SECONDARY_COLLEGES } from '@/lib/types'
import type { ExpertGender, ExpertAttachment } from '@/lib/types'

export default function EditExpertPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [gender, setGender] = useState<ExpertGender>('male')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [title, setTitle] = useState('')
  const [position, setPosition] = useState('')
  const [organization, setOrganization] = useState('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  const [industryDirection, setIndustryDirection] = useState('')
  const [positionDirection, setPositionDirection] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [workExperience, setWorkExperience] = useState('')
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState('')

  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [isPublicDisplay, setIsPublicDisplay] = useState(false)

  const [partnerSource, setPartnerSource] = useState<'cooperation' | 'third-party' | ''>('')
  const [partnerId, setPartnerId] = useState('')
  const [thirdPartyName, setThirdPartyName] = useState('')

  const [secondaryColleges, setSecondaryColleges] = useState<string[]>([])
  const [avatar, setAvatar] = useState('')
  const [attachments, setAttachments] = useState<ExpertAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const expert = experts.find((e) => e.id === id)
    if (!expert) {
      setNotFound(true)
      return
    }
    setName(expert.name)
    setGender(expert.gender || 'male')
    setAge(expert.age ? String(expert.age) : '')
    setCity(expert.city || '')
    setTitle(expert.title || '')
    setPosition(expert.position || '')
    setOrganization(expert.organization || '')
    setExperience(expert.experience ? String(expert.experience) : '')
    setEducation(expert.education || '')
    setIndustryDirection(expert.industryDirection || '')
    setPositionDirection(expert.positionDirection || '')
    setIntroduction(expert.introduction || '')
    setWorkExperience(expert.workExperience || '')
    setSpecialties(expert.specialties || [])
    setStatus(expert.status)
    setIsPublicDisplay(expert.isPublicDisplay || false)
    setPartnerSource(expert.partnerSource || '')
    setPartnerId(expert.partnerId || '')
    setThirdPartyName(expert.partnerSource === 'third-party' ? expert.partnerName || '' : '')
    setSecondaryColleges(expert.secondaryColleges || [])
    setAvatar(expert.avatar || '')
    setAttachments(expert.attachments || [])
  }, [id])

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">专家不存在</h1>
        <p className="text-muted-foreground mb-6">该专家可能已被删除或 ID 不正确</p>
        <Link href="/admin/experts">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>
    )
  }

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty('')
    }
  }

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setAvatar(URL.createObjectURL(files[0]))
    }
    e.target.value = ''
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newAttachments = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
    e.target.value = ''
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateAttachmentName = (index: number, value: string) => {
    setAttachments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const expert = experts.find((e) => e.id === id)
    if (expert) {
      expert.name = name
      expert.gender = gender
      expert.age = age ? parseInt(age) : undefined
      expert.city = city || undefined
      expert.title = title || undefined
      expert.position = position || undefined
      expert.organization = organization || undefined
      expert.experience = experience ? parseInt(experience) : undefined
      expert.education = education || undefined
      expert.industryDirection = industryDirection || undefined
      expert.positionDirection = positionDirection || undefined
      expert.introduction = introduction || undefined
      expert.workExperience = workExperience || undefined
      expert.specialties = specialties
      expert.status = status
      expert.isPublicDisplay = isPublicDisplay
      expert.partnerSource = partnerSource || undefined
      if (partnerSource === 'cooperation') {
        const selectedEnterprise = enterprises.find((e) => e.id === partnerId)
        expert.partnerId = partnerId || undefined
        expert.partnerName = selectedEnterprise?.name
        expert.organization = selectedEnterprise?.name || expert.organization
      } else if (partnerSource === 'third-party') {
        expert.partnerId = undefined
        expert.partnerName = thirdPartyName || undefined
        expert.organization = thirdPartyName || expert.organization
      } else {
        expert.partnerId = undefined
        expert.partnerName = undefined
      }
      expert.secondaryColleges = secondaryColleges.length > 0 ? secondaryColleges : undefined
      expert.avatar = avatar || undefined
      expert.attachments = attachments.length > 0 ? attachments : undefined
      expert.updatedAt = new Date()
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    router.push(`/admin/experts/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/experts/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">编辑专家信息</h1>
          <p className="text-sm text-muted-foreground mt-1">修改专家档案，完善产业联盟专家信息表字段</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基础信息</CardTitle>
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
                    <Label htmlFor="age">年龄</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="如：42"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">所在城市</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="如：上海"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">职称/职位</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="如：高级工程师 / 副院长"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">任职岗位</Label>
                    <Input
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="如：产业咨询与企业服务负责人"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">所属机构</Label>
                  <Input
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="如：上海智能制造产业研究院"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="experience">从业年限（年）</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="如：18"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">教育背景</Label>
                    <Input
                      id="education"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="如：浙江大学 机械工程专业 硕士"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industryDirection">行业方向</Label>
                    <Input
                      id="industryDirection"
                      value={industryDirection}
                      onChange={(e) => setIndustryDirection(e.target.value)}
                      placeholder="如：智能制造、工业互联网、高端装备"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positionDirection">岗位方向</Label>
                    <Input
                      id="positionDirection"
                      value={positionDirection}
                      onChange={(e) => setPositionDirection(e.target.value)}
                      placeholder="如：企业战略、技术研发、数字化转型"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>专家照片与擅长领域</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">专家头像</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex items-center gap-3">
                    {avatar && (
                      <div className="relative">
                        <img src={avatar} alt="专家头像" className="w-24 h-32 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => setAvatar('')}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-24 h-32 flex flex-col items-center justify-center gap-2 border-dashed"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">上传头像</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>擅长领域</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="输入擅长领域，按回车添加"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSpecialty()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddSpecialty}>添加</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {specialty}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialty(index)}
                          className="ml-1 hover:text-destructive"
                        >
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
                <CardTitle>专家简介</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FakeRichTextEditor
                  value={introduction}
                  onChange={setIntroduction}
                  placeholder="请输入专家简介..."
                  minHeight="160px"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>从业经历</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FakeRichTextEditor
                  value={workExperience}
                  onChange={setWorkExperience}
                  placeholder="请输入从业经历描述..."
                  minHeight="160px"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>资质荣誉（佐证材料）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={attachmentInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAttachmentChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => attachmentInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  上传佐证材料
                </Button>
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Input
                          value={attachment.name}
                          onChange={(e) => handleUpdateAttachmentName(index, e.target.value)}
                          placeholder="请输入材料名称"
                          className="h-8 text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-red-500 hover:text-red-600 shrink-0"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {attachments.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂未上传佐证材料</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>所属机构来源</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>来源</Label>
                  <Select
                    value={partnerSource}
                    onValueChange={(v) => {
                      setPartnerSource(v as 'cooperation' | 'third-party')
                      if (v !== 'cooperation') setPartnerId('')
                      if (v !== 'third-party') setThirdPartyName('')
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooperation">合作企业库</SelectItem>
                      <SelectItem value="third-party">自定义机构名称</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {partnerSource === 'cooperation' && (
                  <div className="space-y-2">
                    <Label>选择企业</Label>
                    <Select value={partnerId} onValueChange={setPartnerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择合作企业" />
                      </SelectTrigger>
                      <SelectContent>
                        {enterprises.map((enterprise) => (
                          <SelectItem key={enterprise.id} value={enterprise.id}>
                            {enterprise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {partnerSource === 'third-party' && (
                  <div className="space-y-2">
                    <Label>机构名称</Label>
                    <Input
                      value={thirdPartyName}
                      onChange={(e) => setThirdPartyName(e.target.value)}
                      placeholder="请输入机构名称"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>关联二级学院</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SECONDARY_COLLEGES.map((college) => (
                    <Badge
                      key={college}
                      variant={secondaryColleges.includes(college) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() =>
                        setSecondaryColleges((prev) =>
                          prev.includes(college)
                            ? prev.filter((c) => c !== college)
                            : [...prev, college]
                        )
                      }
                    >
                      {college}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">点击标签进行选择，支持多选</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>状态与展示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>状态</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'inactive')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">启用</SelectItem>
                      <SelectItem value="inactive">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isPublicDisplay" className="flex-1">前台展示</Label>
                  <Switch
                    id="isPublicDisplay"
                    checked={isPublicDisplay}
                    onCheckedChange={setIsPublicDisplay}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '保存中...' : '保存修改'}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={`/admin/experts/${id}`}>取消</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
