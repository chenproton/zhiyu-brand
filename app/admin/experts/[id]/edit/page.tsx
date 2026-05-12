'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { experts } from '@/lib/mock-data'
import { EXPERT_TYPES, EXPERT_RATING_LABELS } from '@/lib/types'
import type { ExpertRating, ExpertGender, ExpertType } from '@/lib/types'

const RATINGS: ExpertRating[] = ['gold', 'silver', 'bronze']

export default function EditExpertPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [gender, setGender] = useState<ExpertGender>('male')
  const [title, setTitle] = useState('')
  const [field, setField] = useState('')
  const [expertType, setExpertType] = useState<ExpertType | ''>('')
  const [experience, setExperience] = useState('')
  const [rating, setRating] = useState<ExpertRating>('bronze')
  const [education, setEducation] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isContactHidden, setIsContactHidden] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')

  const [roles, setRoles] = useState<string[]>([])
  const [newRole, setNewRole] = useState('')

  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState('')

  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState('')

  useEffect(() => {
    const expert = experts.find((e) => e.id === id)
    if (!expert) {
      setNotFound(true)
      return
    }
    setName(expert.name)
    setGender(expert.gender || 'male')
    setTitle(expert.title)
    setField(expert.field)
    setExpertType(expert.expertType || '')
    setExperience(String(expert.experience))
    setRating(expert.rating)
    setEducation(expert.education || '')
    setContactEmail(expert.contactEmail || '')
    setContactPhone(expert.contactPhone || '')
    setIsContactHidden(expert.isContactHidden || false)
    setStatus(expert.status)
    setRoles(expert.roles || [])
    setSpecialties(expert.specialties || [])
    setAchievements(expert.achievements || [])
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

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()])
      setNewRole('')
    }
  }

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index))
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

  const handleAddAchievement = () => {
    if (newAchievement.trim() && !achievements.includes(newAchievement.trim())) {
      setAchievements([...achievements, newAchievement.trim()])
      setNewAchievement('')
    }
  }

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
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
          <p className="text-sm text-muted-foreground mt-1">修改专家的基本资料、专业特长及联系方式</p>
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
                    <Label htmlFor="field">所属领域 *</Label>
                    <Input
                      id="field"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      placeholder="如：人工智能"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
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
                    <Label htmlFor="rating">专家评级</Label>
                    <Select value={rating} onValueChange={(v) => setRating(v as ExpertRating)}>
                      <SelectTrigger id="rating">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RATINGS.map((r) => (
                          <SelectItem key={r} value={r}>{EXPERT_RATING_LABELS[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>专家角色</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="输入角色后按回车添加"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddRole()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddRole}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {role}
                      <button type="button" onClick={() => handleRemoveRole(index)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>专业特长</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="输入特长后按回车添加"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSpecialty()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddSpecialty}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {specialty}
                      <button type="button" onClick={() => handleRemoveSpecialty(index)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>主要成就</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="输入成就后按回车添加"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddAchievement()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddAchievement}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                      <span>{achievement}</span>
                      <button type="button" onClick={() => handleRemoveAchievement(index)} className="hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
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
