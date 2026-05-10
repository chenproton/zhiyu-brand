"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus, X } from "lucide-react"
import { partners } from "@/lib/mock-data"
import { 
  JOB_TYPE_LABELS, 
  WORK_NATURE_LABELS, 
  EDUCATION_LEVELS, 
  EXPERIENCE_LEVELS,
  INDUSTRIES,
} from "@/lib/types"

export default function NewJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    partnerId: "",
    type: "full-time",
    workNature: "on-site",
    department: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    education: "不限",
    experience: "不限",
    headcount: "1",
    description: "",
    isUrgent: false,
    isRecommended: false,
  })
  const [requirements, setRequirements] = useState<string[]>([])
  const [responsibilities, setResponsibilities] = useState<string[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [majors, setMajors] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newMajor, setNewMajor] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/admin/employment/jobs")
  }

  const addItem = (list: string[], setList: (items: string[]) => void, value: string, setValue: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()])
      setValue("")
    }
  }

  const removeItem = (list: string[], setList: (items: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  const enterprisePartners = partners.filter(p => p.type === "enterprise")

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/employment/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">发布岗位</h1>
          <p className="text-muted-foreground">发布新的招聘岗位信息</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">岗位名称 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="例如：Java开发工程师"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerId">招聘企业 *</Label>
                    <Select
                      value={formData.partnerId}
                      onValueChange={(v) => setFormData({...formData, partnerId: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择企业" />
                      </SelectTrigger>
                      <SelectContent>
                        {enterprisePartners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="type">岗位类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData({...formData, type: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workNature">工作性质 *</Label>
                    <Select
                      value={formData.workNature}
                      onValueChange={(v) => setFormData({...formData, workNature: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(WORK_NATURE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">所属部门</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="例如：技术部"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">工作地点 *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="例如：江苏省苏州市工业园区"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headcount">招聘人数 *</Label>
                    <Input
                      id="headcount"
                      type="number"
                      min="1"
                      value={formData.headcount}
                      onChange={(e) => setFormData({...formData, headcount: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>薪资范围（元/月）</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="最低"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder="最高"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">岗位描述</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="详细描述岗位信息..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 岗位职责 */}
            <Card>
              <CardHeader>
                <CardTitle>岗位职责</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="输入岗位职责"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addItem(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addItem(responsibilities, setResponsibilities, newResponsibility, setNewResponsibility)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {responsibilities.length > 0 && (
                  <ul className="space-y-2">
                    {responsibilities.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(responsibilities, setResponsibilities, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* 任职要求 */}
            <Card>
              <CardHeader>
                <CardTitle>任职要求</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="输入任职要求"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addItem(requirements, setRequirements, newRequirement, setNewRequirement)
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => addItem(requirements, setRequirements, newRequirement, setNewRequirement)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {requirements.length > 0 && (
                  <ul className="space-y-2">
                    {requirements.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(requirements, setRequirements, index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右侧其他信息 */}
          <div className="space-y-6">
            {/* 招聘条件 */}
            <Card>
              <CardHeader>
                <CardTitle>招聘条件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>学历要求</Label>
                  <Select
                    value={formData.education}
                    onValueChange={(v) => setFormData({...formData, education: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>经验要求</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(v) => setFormData({...formData, experience: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 技能要求 */}
            <Card>
              <CardHeader>
                <CardTitle>技能要求</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="添加技能"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addItem(skills, setSkills, newSkill, setNewSkill)
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => addItem(skills, setSkills, newSkill, setNewSkill)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeItem(skills, setSkills, index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 福利待遇 */}
            <Card>
              <CardHeader>
                <CardTitle>福利待遇</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="添加福利"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addItem(benefits, setBenefits, newBenefit, setNewBenefit)
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => addItem(benefits, setBenefits, newBenefit, setNewBenefit)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeItem(benefits, setBenefits, index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 发布设置 */}
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked as boolean})}
                  />
                  <Label htmlFor="isUrgent">设为紧急招聘</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecommended"
                    checked={formData.isRecommended}
                    onCheckedChange={(checked) => setFormData({...formData, isRecommended: checked as boolean})}
                  />
                  <Label htmlFor="isRecommended">设为推荐岗位</Label>
                </div>
              </CardContent>
            </Card>

            {/* 提交按钮 */}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "发布中..." : "发布岗位"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
