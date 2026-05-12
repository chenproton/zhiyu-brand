"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Search, Eye, Plus, Edit, Trash2, Star, RefreshCw } from "lucide-react"
import { teacherBrands, experts } from "@/lib/mock-data"
import { TEACHER_TYPE_LABELS, BRAND_STATUS_LABELS, EXPERT_RATING_LABELS } from "@/lib/types"
import type { TeacherBrand, Expert, BrandStatus } from "@/lib/types"

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const emptyTeacherForm = {
  name: "",
  department: "",
  title: "",
  type: "dual-qualified" as TeacherBrand["type"],
  introduction: "",
  researchFields: "",
  awards: "",
  isFeatured: false,
  status: "draft" as BrandStatus,
}

const emptyExpertForm = {
  name: "",
  title: "",
  partnerName: "",
  specialties: "",
  roles: "",
  experience: "",
  rating: "gold" as Expert["rating"],
  achievements: "",
}

export default function TeacherBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teachers, setTeachers] = useState<TeacherBrand[]>([...teacherBrands])
  const [displayedExperts, setDisplayedExperts] = useState<Expert[]>([...experts])

  // Teacher dialog
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherBrand | null>(null)
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm)

  // Expert dialog
  const [expertDialogOpen, setExpertDialogOpen] = useState(false)
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null)
  const [expertForm, setExpertForm] = useState(emptyExpertForm)
  const [selectedExpertId, setSelectedExpertId] = useState("")

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredExperts = displayedExperts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.partnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  // Teacher CRUD
  function openAddTeacherDialog() {
    setEditingTeacher(null)
    setTeacherForm(emptyTeacherForm)
    setTeacherDialogOpen(true)
  }

  function openEditTeacherDialog(teacher: TeacherBrand) {
    setEditingTeacher(teacher)
    setTeacherForm({
      name: teacher.name,
      department: teacher.department,
      title: teacher.title,
      type: teacher.type,
      introduction: teacher.introduction,
      researchFields: teacher.researchFields.join("，"),
      awards: teacher.awards.join("，"),
      isFeatured: teacher.isFeatured,
      status: teacher.status,
    })
    setTeacherDialogOpen(true)
  }

  function handleSaveTeacher() {
    const researchFields = teacherForm.researchFields
      .split(/,|，/)
      .map((s) => s.trim())
      .filter(Boolean)
    const awards = teacherForm.awards
      .split(/,|，/)
      .map((s) => s.trim())
      .filter(Boolean)

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editingTeacher.id
            ? {
                ...t,
                ...teacherForm,
                researchFields,
                courses: [],
                awards,
                updatedAt: new Date(),
              }
            : t
        )
      )
    } else {
      const newTeacher: TeacherBrand = {
        id: generateId("tb"),
        name: teacherForm.name,
        department: teacherForm.department,
        title: teacherForm.title,
        type: teacherForm.type,
        avatar: undefined,
        introduction: teacherForm.introduction,
        researchFields,
        achievements: [],
        courses: [],
        awards,
        isFeatured: teacherForm.isFeatured,
        status: teacherForm.status,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTeachers((prev) => [...prev, newTeacher])
    }
    setTeacherDialogOpen(false)
  }

  function handleDeleteTeacher(id: string) {
    if (confirm("确定要删除该教师吗？")) {
      setTeachers((prev) => prev.filter((t) => t.id !== id))
    }
  }

  // Expert CRUD
  function openAddExpertDialog() {
    setEditingExpert(null)
    setExpertForm(emptyExpertForm)
    setSelectedExpertId("")
    setExpertDialogOpen(true)
  }

  function openEditExpertDialog(expert: Expert) {
    setEditingExpert(expert)
    setExpertForm({
      name: expert.name,
      title: expert.title,
      partnerName: expert.partnerName || "",
      specialties: expert.specialties.join("，"),
      roles: expert.roles.join("，"),
      experience: String(expert.experience),
      rating: expert.rating,
      achievements: expert.achievements?.join("，") || "",
    })
    setExpertDialogOpen(true)
  }

  function handleSelectedExpertChange(id: string) {
    setSelectedExpertId(id)
    const expert = experts.find((e) => e.id === id)
    if (expert) {
      setExpertForm({
        name: expert.name,
        title: expert.title,
        partnerName: expert.partnerName || "",
        specialties: expert.specialties.join("，"),
        roles: expert.roles.join("，"),
        experience: String(expert.experience),
        rating: expert.rating,
        achievements: expert.achievements?.join("，") || "",
      })
    }
  }

  function handleSaveExpert() {
    const specialties = expertForm.specialties
      .split(/,|，/)
      .map((s) => s.trim())
      .filter(Boolean)
    const roles = expertForm.roles
      .split(/,|，/)
      .map((s) => s.trim())
      .filter(Boolean)
    const experience = Number(expertForm.experience) || 0
    const achievements = expertForm.achievements
      .split(/,|，/)
      .map((s) => s.trim())
      .filter(Boolean)

    if (editingExpert) {
      setDisplayedExperts((prev) =>
        prev.map((e) =>
          e.id === editingExpert.id
            ? {
                ...e,
                name: expertForm.name,
                title: expertForm.title,
                partnerName: expertForm.partnerName,
                specialties,
                roles,
                experience,
                rating: expertForm.rating,
                achievements,
                updatedAt: new Date(),
              }
            : e
        )
      )
    } else {
      const sourceExpert = experts.find((e) => e.id === selectedExpertId)
      const newExpert: Expert = {
        ...(sourceExpert || ({} as Expert)),
        id: generateId("ex"),
        name: expertForm.name,
        title: expertForm.title,
        partnerName: expertForm.partnerName,
        specialties,
        roles,
        experience,
        rating: expertForm.rating,
        achievements,
        updatedAt: new Date(),
        createdAt: new Date(),
      }
      setDisplayedExperts((prev) => [...prev, newExpert])
    }
    setExpertDialogOpen(false)
  }

  function handleDeleteExpert(id: string) {
    if (confirm("确定要删除该专家吗？")) {
      setDisplayedExperts((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">师资品牌管理</h1>
          <p className="text-muted-foreground">管理校本师资和企业专家的品牌展示</p>
        </div>
      </div>

      <Tabs defaultValue="teachers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teachers">校本师资</TabsTrigger>
          <TabsTrigger value="experts">企业专家</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索教师姓名或院系..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => alert('同步教务数据功能开发中')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                同步教务数据
              </Button>
              <Button onClick={openAddTeacherDialog}>
                <Plus className="h-4 w-4 mr-2" />
                引用教师
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback className="text-2xl">{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        {teacher.isFeatured && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{teacher.title}</p>
                      <p className="text-sm text-muted-foreground">{teacher.department}</p>
                      <Badge variant="secondary" className="mt-2">
                        {TEACHER_TYPE_LABELS[teacher.type]}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                    {teacher.introduction}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">研究领域</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.researchFields.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">获奖荣誉</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.awards.slice(0, 2).map((award) => (
                        <Badge key={award} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{teacher.viewCount}</span>
                      </div>
                      <Badge variant={teacher.status === "published" ? "default" : "secondary"}>
                        {BRAND_STATUS_LABELS[teacher.status]}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditTeacherDialog(teacher)}>
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteTeacher(teacher.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索专家姓名或所属机构..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={openAddExpertDialog}>
              <Plus className="h-4 w-4 mr-2" />
              引用专家
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={expert.avatar} />
                      <AvatarFallback className="text-2xl">{expert.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{expert.name}</h3>
                        <Badge
                          variant={
                            expert.rating === "gold"
                              ? "default"
                              : expert.rating === "silver"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {EXPERT_RATING_LABELS[expert.rating]}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{expert.title}</p>
                      <p className="text-sm text-muted-foreground">{expert.partnerName}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">专业领域</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">参与角色</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.roles.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t text-center">
                    <div>
                      <p className="text-lg font-semibold">{expert.experience}</p>
                      <p className="text-xs text-muted-foreground">行业经验(年)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{expert.achievements?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">成果数量</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditExpertDialog(expert)}>
                      <Edit className="h-4 w-4 mr-1" />
                      编辑
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={() => handleDeleteExpert(expert.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Teacher Dialog */}
      <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? "编辑教师" : "引用教师"}</DialogTitle>
            <DialogDescription>
              {editingTeacher ? "修改教师品牌展示信息" : "手动填写教师信息并添加到品牌展示"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">姓名</Label>
                <Input
                  id="t-name"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="请输入姓名"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-department">院系</Label>
                <Input
                  id="t-department"
                  value={teacherForm.department}
                  onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                  placeholder="请输入院系"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-title">职称</Label>
                <Input
                  id="t-title"
                  value={teacherForm.title}
                  onChange={(e) => setTeacherForm({ ...teacherForm, title: e.target.value })}
                  placeholder="请输入职称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-type">类型</Label>
                <Select
                  value={teacherForm.type}
                  onValueChange={(v) => setTeacherForm({ ...teacherForm, type: v as TeacherBrand["type"] })}
                >
                  <SelectTrigger id="t-type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dual-qualified">双师型教师</SelectItem>
                    <SelectItem value="teaching-master">教学名师</SelectItem>
                    <SelectItem value="backbone">骨干教师</SelectItem>
                    <SelectItem value="award-winning">获奖教师</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-intro">简介</Label>
              <Textarea
                id="t-intro"
                value={teacherForm.introduction}
                onChange={(e) => setTeacherForm({ ...teacherForm, introduction: e.target.value })}
                placeholder="请输入教师简介"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-fields">研究领域（逗号分隔）</Label>
              <Input
                id="t-fields"
                value={teacherForm.researchFields}
                onChange={(e) => setTeacherForm({ ...teacherForm, researchFields: e.target.value })}
                placeholder="例如：人工智能，大数据，智能制造"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-awards">获奖荣誉（逗号分隔）</Label>
              <Input
                id="t-awards"
                value={teacherForm.awards}
                onChange={(e) => setTeacherForm({ ...teacherForm, awards: e.target.value })}
                placeholder="例如：省级教学名师，国家级教学成果奖"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex items-center gap-2">
                <Switch
                  id="t-featured"
                  checked={teacherForm.isFeatured}
                  onCheckedChange={(v) => setTeacherForm({ ...teacherForm, isFeatured: v })}
                />
                <Label htmlFor="t-featured">重点展示</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-status">状态</Label>
                <Select
                  value={teacherForm.status}
                  onValueChange={(v) => setTeacherForm({ ...teacherForm, status: v as BrandStatus })}
                >
                  <SelectTrigger id="t-status">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="pending">待审核</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeacherDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveTeacher}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expert Dialog */}
      <Dialog open={expertDialogOpen} onOpenChange={setExpertDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExpert ? "编辑专家" : "引用专家"}</DialogTitle>
            <DialogDescription>
              {editingExpert ? "修改专家品牌展示信息" : "从专家库选择并配置品牌展示字段"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!editingExpert && (
              <div className="space-y-2">
                <Label>选择专家</Label>
                <Select value={selectedExpertId} onValueChange={handleSelectedExpertChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择要引用的专家" />
                  </SelectTrigger>
                  <SelectContent>
                    {experts.map((expert) => (
                      <SelectItem key={expert.id} value={expert.id}>
                        {expert.name} - {expert.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="e-name">姓名</Label>
              <Input
                id="e-name"
                value={expertForm.name}
                onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })}
                placeholder="请输入姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-title">职称</Label>
              <Input
                id="e-title"
                value={expertForm.title}
                onChange={(e) => setExpertForm({ ...expertForm, title: e.target.value })}
                placeholder="请输入职称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-partner">所属机构</Label>
              <Input
                id="e-partner"
                value={expertForm.partnerName}
                onChange={(e) => setExpertForm({ ...expertForm, partnerName: e.target.value })}
                placeholder="请输入所属机构"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-specialties">专业领域（逗号分隔）</Label>
              <Textarea
                id="e-specialties"
                value={expertForm.specialties}
                onChange={(e) => setExpertForm({ ...expertForm, specialties: e.target.value })}
                placeholder="例如：人工智能，大数据"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-roles">参与角色（逗号分隔）</Label>
              <Textarea
                id="e-roles"
                value={expertForm.roles}
                onChange={(e) => setExpertForm({ ...expertForm, roles: e.target.value })}
                placeholder="例如：客座教授，产业导师"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-rating">专家评级</Label>
              <Select
                value={expertForm.rating}
                onValueChange={(v) => setExpertForm({ ...expertForm, rating: v as Expert["rating"] })}
              >
                <SelectTrigger id="e-rating">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">金牌专家</SelectItem>
                  <SelectItem value="silver">银牌专家</SelectItem>
                  <SelectItem value="bronze">铜牌专家</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-experience">行业经验（年）</Label>
              <Input
                id="e-experience"
                type="number"
                value={expertForm.experience}
                onChange={(e) => setExpertForm({ ...expertForm, experience: e.target.value })}
                placeholder="请输入行业经验年数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-achievements">成果荣誉（逗号分隔）</Label>
              <Textarea
                id="e-achievements"
                value={expertForm.achievements}
                onChange={(e) => setExpertForm({ ...expertForm, achievements: e.target.value })}
                placeholder="例如：发明专利5项，省级科技进步奖"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpertDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveExpert} disabled={!editingExpert && !selectedExpertId}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
