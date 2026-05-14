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
import { ArrowLeft, Search, Eye, Plus, Edit, Trash2, Star, ChevronRight, ChevronLeft, X, Award, FileText } from "lucide-react"
import { teacherBrands, experts } from "@/lib/mock-data"
import { TEACHER_TYPE_LABELS, BRAND_STATUS_LABELS, EXPERT_RATING_LABELS, SECONDARY_COLLEGES } from "@/lib/types"
import type { TeacherBrand, Expert, BrandStatus } from "@/lib/types"
import { AchievementManager } from "@/app/admin/projects/_components/achievement-manager"

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
  secondaryCollege: "",
  isFeatured: false,
  status: "draft" as BrandStatus,
}

const emptyExpertForm = {
  name: "",
  title: "",
  partnerName: "",
  specialties: "",
  experience: "",
  secondaryCollege: "",
  rating: "gold" as Expert["rating"],
}

function TransferPicker({
  items,
  selectedItems,
  selectedIds,
  onSelectedIdsChange,
  availableTitle,
  selectedTitle,
}: {
  items: { id: string; title: string; subtitle: string; group: string }[]
  selectedItems: { id: string; title: string; subtitle: string }[]
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
  availableTitle: string
  selectedTitle: string
}) {
  const add = (id: string) => {
    if (!selectedIds.includes(id)) onSelectedIdsChange([...selectedIds, id])
  }
  const remove = (id: string) => {
    onSelectedIdsChange(selectedIds.filter((item) => item !== id))
  }

  const groups = Array.from(new Set(items.map((item) => item.group)))
  const grouped = groups
    .map((group) => ({
      group,
      items: items.filter((item) => item.group === group && !selectedIds.includes(item.id)),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="grid gap-4 py-4 md:grid-cols-[1fr_1fr]">
      <div className="rounded-md border">
        <div className="border-b px-3 py-2 text-sm font-medium">{availableTitle}</div>
        <div className="max-h-80 overflow-y-auto p-2">
          {grouped.map(({ group, items }) => (
            <div key={group}>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 rounded mt-1">
                {group}
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => add(item.id)}
                >
                  <span>
                    <span className="block font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ))}
          {grouped.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">无可选项目</div>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium">{selectedTitle}（{selectedItems.length}）</span>
          {selectedItems.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => onSelectedIdsChange([])}>
              清空
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {selectedItems.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">暂无选择</div>
          ) : (
            selectedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => remove(item.id)}
              >
                <span>
                  <span className="block font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                </span>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeacherBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teachers, setTeachers] = useState<TeacherBrand[]>([...teacherBrands])
  const [displayedExperts, setDisplayedExperts] = useState<Expert[]>([...experts])

  // Teacher dialog
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherBrand | null>(null)
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm)
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([])
  const [teacherAchievements, setTeacherAchievements] = useState<{
    id: string
    name: string
    type: string
    description: string
    createdAt: Date
    attachments?: string[]
    secondaryColleges?: string[]
  }[]>([])
  const [teacherCourses, setTeacherCourses] = useState<string[]>([])
  const [teacherEditTab, setTeacherEditTab] = useState("basic")

  // Expert dialog
  const [expertDialogOpen, setExpertDialogOpen] = useState(false)
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null)
  const [expertForm, setExpertForm] = useState(emptyExpertForm)
  const [selectedExpertIds, setSelectedExpertIds] = useState<string[]>([])

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
    setSelectedTeacherIds([])
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
      secondaryCollege: teacher.secondaryCollege || "",
      isFeatured: teacher.isFeatured,
      status: teacher.status,
    })
    setTeacherAchievements(teacher.achievements.map((name, idx) => ({
      id: `ta-${idx}`,
      name,
      type: '自定义',
      description: '',
      createdAt: new Date(),
    })))
    setTeacherCourses([...teacher.courses])
    setTeacherEditTab("basic")
    setTeacherDialogOpen(true)
  }

  function handleImportTeacher() {
    const newTeachers = selectedTeacherIds
      .map((id) => teacherBrands.find((t) => t.id === id))
      .filter(Boolean)
      .map((source) => ({
        ...(source as TeacherBrand),
        id: generateId("tb"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    if (newTeachers.length === 0) return
    setTeachers((prev) => [...prev, ...newTeachers])
    setTeacherDialogOpen(false)
    setSelectedTeacherIds([])
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
    const achievements = teacherAchievements.map((a) => a.name)

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editingTeacher.id
            ? {
                ...t,
                ...teacherForm,
                name: t.name,
                researchFields,
                courses: teacherCourses,
                achievements,
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
        achievements,
        courses: teacherCourses,
        awards,
        secondaryCollege: teacherForm.secondaryCollege,
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
    setSelectedExpertIds([])
    setExpertDialogOpen(true)
  }

  function openEditExpertDialog(expert: Expert) {
    setEditingExpert(expert)
    setExpertForm({
      name: expert.name,
      title: expert.title,
      partnerName: expert.partnerName || "",
      specialties: expert.specialties.join("，"),
      experience: String(expert.experience),
      secondaryCollege: expert.secondaryColleges?.[0] || "",
      rating: expert.rating,
    })
    setExpertDialogOpen(true)
  }

  function handleImportExpert() {
    const newExperts = selectedExpertIds
      .map((id) => experts.find((e) => e.id === id))
      .filter(Boolean)
      .map((source) => ({
        ...(source as Expert),
        id: generateId("ex"),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    if (newExperts.length === 0) return
    setDisplayedExperts((prev) => [...prev, ...newExperts])
    setExpertDialogOpen(false)
    setSelectedExpertIds([])
  }

  function handleSaveExpert() {
    const specialties = expertForm.specialties
      .split(/,|，/)
      .map((s) => s.trim())
      .filter(Boolean)
    const experience = Number(expertForm.experience) || 0

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
                experience,
                secondaryColleges: expertForm.secondaryCollege ? [expertForm.secondaryCollege] : [],
                rating: expertForm.rating,
                updatedAt: new Date(),
              }
            : e
        )
      )
    } else {
      const newExpert: Expert = {
        id: generateId("ex"),
        name: expertForm.name,
        title: expertForm.title,
        partnerName: expertForm.partnerName,
        specialties,
        experience,
        secondaryColleges: expertForm.secondaryCollege ? [expertForm.secondaryCollege] : [],
        rating: expertForm.rating,
        status: "active",
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
          <TabsTrigger value="experts">企业专家师资</TabsTrigger>
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
            <Button onClick={openAddTeacherDialog}>
              <Plus className="h-4 w-4 mr-2" />
              引用教师
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback className="text-lg">{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base truncate">{teacher.name}</h3>
                        {teacher.isFeatured && (
                          <Star className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{teacher.title}</p>
                      <p className="text-xs text-muted-foreground">{teacher.department}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {TEACHER_TYPE_LABELS[teacher.type]}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {teacher.introduction}
                  </p>

                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">研究领域</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.researchFields.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">获奖荣誉</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.awards.slice(0, 2).map((award) => (
                        <Badge key={award} variant="secondary" className="text-xs">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{teacher.viewCount}</span>
                      </div>
                      <Badge variant={teacher.status === "published" ? "secondary" : "outline"} className="text-xs">
                        {BRAND_STATUS_LABELS[teacher.status]}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditTeacherDialog(teacher)}>
                        <Edit className="h-3 w-3 mr-1 text-muted-foreground" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTeacher(teacher.id)}>
                        <Trash2 className="h-3 w-3 mr-1 text-muted-foreground" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={expert.avatar} />
                      <AvatarFallback className="text-lg">{expert.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base truncate">{expert.name}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {EXPERT_RATING_LABELS[expert.rating]}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{expert.title}</p>
                      <p className="text-xs text-muted-foreground">{expert.partnerName}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">专业领域</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-base font-semibold">{expert.experience}</p>
                    <p className="text-xs text-muted-foreground">行业经验(年)</p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditExpertDialog(expert)}>
                      <Edit className="h-3 w-3 mr-1 text-muted-foreground" />
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDeleteExpert(expert.id)}>
                      <Trash2 className="h-3 w-3 mr-1 text-muted-foreground" />
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? "编辑教师" : "引用教师"}</DialogTitle>
            <DialogDescription>
              {editingTeacher ? "修改教师品牌展示信息" : "从教师库选择要引用的教师"}
            </DialogDescription>
          </DialogHeader>

          {!editingTeacher ? (
            <TransferPicker
              items={teacherBrands.map((teacher) => ({
                id: teacher.id,
                title: teacher.name,
                subtitle: teacher.title,
                group: teacher.department,
              }))}
              selectedItems={teacherBrands
                .filter((teacher) => selectedTeacherIds.includes(teacher.id))
                .map((teacher) => ({ id: teacher.id, title: teacher.name, subtitle: `${teacher.title} · ${teacher.department}` }))}
              selectedIds={selectedTeacherIds}
              onSelectedIdsChange={setSelectedTeacherIds}
              availableTitle="教师名单"
              selectedTitle="已选教师"
            />
          ) : (
            <div className="space-y-4 py-2">
              {/* Header - 模仿企业详情页风格 */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage src={editingTeacher.avatar} className="object-cover" />
                    <AvatarFallback className="rounded-lg text-lg">
                      {editingTeacher.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{editingTeacher.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {teacherForm.department} · {teacherForm.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{TEACHER_TYPE_LABELS[teacherForm.type]}</Badge>
                      <Badge variant={teacherForm.status === 'published' ? 'default' : 'secondary'}>
                        {BRAND_STATUS_LABELS[teacherForm.status]}
                      </Badge>
                      {teacherForm.isFeatured && (
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                          <Star className="h-3 w-3 mr-1" />
                          重点展示
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{teacherAchievements.length}</p>
                        <p className="text-xs text-muted-foreground">教师成果</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{teacherForm.awards.split(/,|，/).filter(Boolean).length}</p>
                        <p className="text-xs text-muted-foreground">荣誉奖项</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{teacherForm.researchFields.split(/,|，/).filter(Boolean).length}</p>
                        <p className="text-xs text-muted-foreground">研究领域</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={teacherEditTab} onValueChange={setTeacherEditTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="achievements">教师成果</TabsTrigger>
                </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="t-name">姓名</Label>
                    <Input
                      id="t-name"
                      value={teacherForm.name}
                      disabled
                      placeholder="请输入姓名"
                    />
                    <p className="text-xs text-muted-foreground">
                      教师名称不可修改，修改仅影响品牌展示，不会回写教师库
                    </p>
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
                <div className="space-y-2">
                  <Label htmlFor="t-secondaryCollege">关联二级学院</Label>
                  <Select
                    value={teacherForm.secondaryCollege || ""}
                    onValueChange={(v) => setTeacherForm({ ...teacherForm, secondaryCollege: v })}
                  >
                    <SelectTrigger id="t-secondaryCollege">
                      <SelectValue placeholder="选择二级学院" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECONDARY_COLLEGES.map((college) => (
                        <SelectItem key={college} value={college}>{college}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <AchievementManager
                  items={teacherAchievements}
                  onChange={setTeacherAchievements}
                  title="成果管理"
                  description="添加教师成果或引用成果库中的成果"
                />
              </TabsContent>

            </Tabs>
          </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setTeacherDialogOpen(false)}>
              取消
            </Button>
            {editingTeacher ? (
              <Button onClick={handleSaveTeacher}>保存</Button>
            ) : (
              <Button onClick={handleImportTeacher} disabled={selectedTeacherIds.length === 0}>
                确认引用
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expert Dialog */}
      <Dialog open={expertDialogOpen} onOpenChange={setExpertDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExpert ? "编辑专家" : "引用专家"}</DialogTitle>
            <DialogDescription>
              {editingExpert ? "修改专家品牌展示信息" : "从专家库选择要引用的专家"}
            </DialogDescription>
          </DialogHeader>

          {!editingExpert ? (
            <TransferPicker
              items={experts.map((expert) => ({
                id: expert.id,
                title: expert.name,
                subtitle: expert.title,
                group: expert.partnerName || "未归属企业",
              }))}
              selectedItems={experts
                .filter((expert) => selectedExpertIds.includes(expert.id))
                .map((expert) => ({ id: expert.id, title: expert.name, subtitle: `${expert.title} · ${expert.partnerName || "未归属企业"}` }))}
              selectedIds={selectedExpertIds}
              onSelectedIdsChange={setSelectedExpertIds}
              availableTitle="专家名单"
              selectedTitle="已选专家"
            />
          ) : (
            <div className="space-y-4 py-4">
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
                <Label htmlFor="e-secondaryCollege">关联二级学院</Label>
                <Select
                  value={expertForm.secondaryCollege || ""}
                  onValueChange={(v) => setExpertForm({ ...expertForm, secondaryCollege: v })}
                >
                  <SelectTrigger id="e-secondaryCollege">
                    <SelectValue placeholder="选择二级学院" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECONDARY_COLLEGES.map((college) => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setExpertDialogOpen(false)}>
              取消
            </Button>
            {editingExpert ? (
              <Button onClick={handleSaveExpert}>保存</Button>
            ) : (
              <Button onClick={handleImportExpert} disabled={selectedExpertIds.length === 0}>
                确认引用
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
