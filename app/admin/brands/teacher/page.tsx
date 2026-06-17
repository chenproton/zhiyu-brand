"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableRowActions } from "@/components/admin/table-row-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminPageHeader } from "@/components/admin/page-header"
import { AdminDataTable } from "@/components/admin/data-table"
import { Plus, Pencil, Trash2, Star, ChevronRight, FileText, Search, X, Upload } from "lucide-react"
import { teacherBrands, experts, enterprises } from "@/lib/mock-data"
import { TEACHER_TYPE_LABELS, BRAND_STATUS_LABELS, SECONDARY_COLLEGES } from "@/lib/types"
import type { TeacherBrand, Expert, ExpertGender, ExpertAttachment } from "@/lib/types"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const emptyTeacherForm = {
  name: "",
  gender: "male" as ExpertGender,
  age: "",
  city: "",
  title: "",
  position: "",
  organization: "",
  experience: "",
  education: "",
  industryDirection: "",
  positionDirection: "",
  introduction: "",
  workExperience: "",
  partnerSource: "" as "cooperation" | "third-party" | "",
  partnerId: "",
  thirdPartyName: "",
  status: "active" as "active" | "inactive",
  isPublicDisplay: true,
  secondaryColleges: [] as string[],
}

const emptyExpertForm = {
  name: "",
  gender: "male" as ExpertGender,
  age: "",
  city: "",
  title: "",
  position: "",
  organization: "",
  education: "",
  industryDirection: "",
  positionDirection: "",
  introduction: "",
  workExperience: "",
  experience: "",
  partnerSource: "" as "cooperation" | "third-party" | "",
  partnerId: "",
  thirdPartyName: "",
  secondaryColleges: [] as string[],
  status: "active" as "active" | "inactive",
  isPublicDisplay: true,
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
  const [search, setSearch] = useState("")
  const [teachers, setTeachers] = useState<TeacherBrand[]>([...teacherBrands])
  const [displayedExperts, setDisplayedExperts] = useState<Expert[]>([...experts])

  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherBrand | null>(null)
  const [teacherForm, setTeacherForm] = useState(emptyTeacherForm)
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([])
  const [teacherSpecialties, setTeacherSpecialties] = useState<string[]>([])
  const [newTeacherSpecialty, setNewTeacherSpecialty] = useState("")
  const [teacherAvatar, setTeacherAvatar] = useState("")
  const [teacherAttachments, setTeacherAttachments] = useState<ExpertAttachment[]>([])
  const teacherFileInputRef = useRef<HTMLInputElement>(null)
  const teacherAttachmentInputRef = useRef<HTMLInputElement>(null)

  const [expertDialogOpen, setExpertDialogOpen] = useState(false)
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null)
  const [expertForm, setExpertForm] = useState(emptyExpertForm)
  const [expertSpecialties, setExpertSpecialties] = useState<string[]>([])
  const [newExpertSpecialty, setNewExpertSpecialty] = useState("")
  const [selectedExpertIds, setSelectedExpertIds] = useState<string[]>([])
  const [expertAvatar, setExpertAvatar] = useState("")
  const [expertAttachments, setExpertAttachments] = useState<ExpertAttachment[]>([])
  const expertFileInputRef = useRef<HTMLInputElement>(null)
  const expertAttachmentInputRef = useRef<HTMLInputElement>(null)

  const toggleTeacherSecondaryCollege = (college: string) => {
    setTeacherForm((prev) => ({
      ...prev,
      secondaryColleges: prev.secondaryColleges.includes(college)
        ? prev.secondaryColleges.filter((c) => c !== college)
        : [...prev.secondaryColleges, college],
    }))
  }

  const handleAddTeacherSpecialty = () => {
    if (newTeacherSpecialty.trim() && !teacherSpecialties.includes(newTeacherSpecialty.trim())) {
      setTeacherSpecialties([...teacherSpecialties, newTeacherSpecialty.trim()])
      setNewTeacherSpecialty('')
    }
  }

  const handleRemoveTeacherSpecialty = (index: number) => {
    setTeacherSpecialties(teacherSpecialties.filter((_, i) => i !== index))
  }

  const handleTeacherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setTeacherAvatar(URL.createObjectURL(files[0]))
    }
    e.target.value = ''
  }

  const handleTeacherAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newAttachments = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setTeacherAttachments((prev) => [...prev, ...newAttachments])
    e.target.value = ''
  }

  const handleRemoveTeacherAttachment = (index: number) => {
    setTeacherAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateTeacherAttachmentName = (index: number, value: string) => {
    setTeacherAttachments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    )
  }

  const toggleExpertSecondaryCollege = (college: string) => {
    setExpertForm((prev) => ({
      ...prev,
      secondaryColleges: prev.secondaryColleges.includes(college)
        ? prev.secondaryColleges.filter((c) => c !== college)
        : [...prev.secondaryColleges, college],
    }))
  }

  const handleAddExpertSpecialty = () => {
    if (newExpertSpecialty.trim() && !expertSpecialties.includes(newExpertSpecialty.trim())) {
      setExpertSpecialties([...expertSpecialties, newExpertSpecialty.trim()])
      setNewExpertSpecialty('')
    }
  }

  const handleRemoveExpertSpecialty = (index: number) => {
    setExpertSpecialties(expertSpecialties.filter((_, i) => i !== index))
  }

  const handleExpertFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setExpertAvatar(URL.createObjectURL(files[0]))
    }
    e.target.value = ''
  }

  const handleExpertAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newAttachments = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setExpertAttachments((prev) => [...prev, ...newAttachments])
    e.target.value = ''
  }

  const handleRemoveExpertAttachment = (index: number) => {
    setExpertAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateExpertAttachmentName = (index: number, value: string) => {
    setExpertAttachments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, name: value } : item))
    )
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.department.toLowerCase().includes(search.toLowerCase())
  )

  const filteredExperts = displayedExperts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(search.toLowerCase()) ||
      (expert.partnerName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  function openAddTeacherDialog() {
    setEditingTeacher(null)
    setSelectedTeacherIds([])
    setTeacherForm(emptyTeacherForm)
    setTeacherSpecialties([])
    setTeacherAvatar("")
    setTeacherAttachments([])
    setTeacherDialogOpen(true)
  }

  function openEditTeacherDialog(teacher: TeacherBrand) {
    setEditingTeacher(teacher)
    setTeacherForm({
      name: teacher.name,
      gender: teacher.gender || "male",
      age: teacher.age ? String(teacher.age) : "",
      city: teacher.city || "",
      title: teacher.title,
      position: teacher.position || "",
      organization: teacher.organization || "",
      experience: teacher.experience ? String(teacher.experience) : "",
      education: teacher.education || "",
      industryDirection: teacher.industryDirection || "",
      positionDirection: teacher.positionDirection || "",
      introduction: teacher.introduction,
      workExperience: teacher.workExperience || "",
      partnerSource: teacher.partnerSource || "",
      partnerId: teacher.partnerId || "",
      thirdPartyName: teacher.partnerSource === 'third-party' ? teacher.partnerName || '' : '',
      status: teacher.status === 'published' ? 'active' : 'inactive',
      isPublicDisplay: teacher.isPublicDisplay || false,
      secondaryColleges: teacher.secondaryColleges || (teacher.secondaryCollege ? [teacher.secondaryCollege] : []),
    })
    setTeacherSpecialties(teacher.specialties || teacher.researchFields || [])
    setTeacherAvatar(teacher.avatar || "")
    setTeacherAttachments(teacher.attachments || [])
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
    const specialties = teacherSpecialties
    const age = teacherForm.age ? parseInt(teacherForm.age) : undefined
    const experienceNum = teacherForm.experience ? parseInt(teacherForm.experience) : undefined

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editingTeacher.id
            ? {
                ...t,
                name: teacherForm.name,
                gender: teacherForm.gender,
                age,
                city: teacherForm.city || undefined,
                title: teacherForm.title,
                position: teacherForm.position || undefined,
                organization: teacherForm.organization || undefined,
                experience: experienceNum,
                education: teacherForm.education || undefined,
                industryDirection: teacherForm.industryDirection || undefined,
                positionDirection: teacherForm.positionDirection || undefined,
                introduction: teacherForm.introduction,
                workExperience: teacherForm.workExperience || undefined,
                specialties,
                researchFields: specialties,
                avatar: teacherAvatar || undefined,
                attachments: teacherAttachments.length > 0 ? teacherAttachments : undefined,
                partnerSource: teacherForm.partnerSource || undefined,
                partnerId: teacherForm.partnerSource === 'cooperation' ? teacherForm.partnerId || undefined : undefined,
                partnerName: teacherForm.partnerSource === 'cooperation'
                  ? enterprises.find((e) => e.id === teacherForm.partnerId)?.name
                  : teacherForm.partnerSource === 'third-party'
                  ? teacherForm.thirdPartyName || undefined
                  : undefined,
                status: teacherForm.status === 'active' ? 'published' : 'draft',
                isPublicDisplay: teacherForm.isPublicDisplay,
                secondaryColleges: teacherForm.secondaryColleges.length > 0 ? teacherForm.secondaryColleges : undefined,
                updatedAt: new Date(),
              }
            : t
        )
      )
    } else {
      const newTeacher: TeacherBrand = {
        id: generateId("tb"),
        name: teacherForm.name,
        gender: teacherForm.gender,
        age,
        city: teacherForm.city || undefined,
        title: teacherForm.title,
        position: teacherForm.position || undefined,
        organization: teacherForm.organization || undefined,
        experience: experienceNum,
        education: teacherForm.education || undefined,
        industryDirection: teacherForm.industryDirection || undefined,
        positionDirection: teacherForm.positionDirection || undefined,
        introduction: teacherForm.introduction,
        workExperience: teacherForm.workExperience || undefined,
        specialties,
        researchFields: specialties,
        achievements: [],
        courses: [],
        awards: [],
        avatar: teacherAvatar || undefined,
        attachments: teacherAttachments.length > 0 ? teacherAttachments : undefined,
        isFeatured: false,
        isPublicDisplay: teacherForm.isPublicDisplay,
        status: teacherForm.status === 'active' ? 'published' : 'draft',
        viewCount: 0,
        secondaryColleges: teacherForm.secondaryColleges.length > 0 ? teacherForm.secondaryColleges : undefined,
        partnerSource: teacherForm.partnerSource || undefined,
        partnerId: teacherForm.partnerSource === 'cooperation' ? teacherForm.partnerId || undefined : undefined,
        partnerName: teacherForm.partnerSource === 'cooperation'
          ? enterprises.find((e) => e.id === teacherForm.partnerId)?.name
          : teacherForm.partnerSource === 'third-party'
          ? teacherForm.thirdPartyName || undefined
          : undefined,
        department: "",
        type: "dual-qualified",
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

  function openAddExpertDialog() {
    setEditingExpert(null)
    setSelectedExpertIds([])
    setExpertForm(emptyExpertForm)
    setExpertSpecialties([])
    setExpertAvatar("")
    setExpertAttachments([])
    setExpertDialogOpen(true)
  }

  function openEditExpertDialog(expert: Expert) {
    setEditingExpert(expert)
    setExpertForm({
      name: expert.name,
      gender: expert.gender || "male",
      age: expert.age ? String(expert.age) : "",
      city: expert.city || "",
      title: expert.title || "",
      position: expert.position || "",
      organization: expert.organization || "",
      education: expert.education || "",
      industryDirection: expert.industryDirection || "",
      positionDirection: expert.positionDirection || "",
      introduction: expert.introduction || "",
      workExperience: expert.workExperience || "",
      experience: String(expert.experience || ""),
      partnerSource: expert.partnerSource || "",
      partnerId: expert.partnerId || "",
      thirdPartyName: expert.partnerSource === 'third-party' ? expert.partnerName || '' : '',
      secondaryColleges: expert.secondaryColleges || [],
      status: expert.status,
      isPublicDisplay: expert.isPublicDisplay || false,
    })
    setExpertSpecialties(expert.specialties || [])
    setExpertAvatar(expert.avatar || "")
    setExpertAttachments(expert.attachments || [])
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
    const specialties = expertSpecialties
    const age = expertForm.age ? parseInt(expertForm.age) : undefined
    const experienceNum = expertForm.experience ? parseInt(expertForm.experience) : undefined

    if (editingExpert) {
      setDisplayedExperts((prev) =>
        prev.map((e) =>
          e.id === editingExpert.id
            ? {
                ...e,
                name: expertForm.name,
                gender: expertForm.gender,
                age,
                city: expertForm.city || undefined,
                title: expertForm.title,
                position: expertForm.position,
                organization: expertForm.organization || undefined,
                education: expertForm.education || undefined,
                industryDirection: expertForm.industryDirection || undefined,
                positionDirection: expertForm.positionDirection || undefined,
                introduction: expertForm.introduction || undefined,
                workExperience: expertForm.workExperience || undefined,
                specialties,
                experience: experienceNum,
                avatar: expertAvatar || undefined,
                attachments: expertAttachments.length > 0 ? expertAttachments : undefined,
                partnerSource: expertForm.partnerSource || undefined,
                partnerId: expertForm.partnerSource === 'cooperation' ? expertForm.partnerId || undefined : undefined,
                partnerName: expertForm.partnerSource === 'cooperation'
                  ? enterprises.find((e) => e.id === expertForm.partnerId)?.name
                  : expertForm.partnerSource === 'third-party'
                  ? expertForm.thirdPartyName || undefined
                  : undefined,
                secondaryColleges: expertForm.secondaryColleges.length > 0 ? expertForm.secondaryColleges : undefined,
                status: expertForm.status,
                isPublicDisplay: expertForm.isPublicDisplay,
                updatedAt: new Date(),
              }
            : e
        )
      )
    } else {
      const newExpert: Expert = {
        id: generateId("ex"),
        name: expertForm.name,
        gender: expertForm.gender,
        age,
        city: expertForm.city || undefined,
        title: expertForm.title,
        position: expertForm.position,
        organization: expertForm.organization || undefined,
        education: expertForm.education || undefined,
        industryDirection: expertForm.industryDirection || undefined,
        positionDirection: expertForm.positionDirection || undefined,
        introduction: expertForm.introduction || undefined,
        workExperience: expertForm.workExperience || undefined,
        specialties,
        experience: experienceNum,
        avatar: expertAvatar || undefined,
        attachments: expertAttachments.length > 0 ? expertAttachments : undefined,
        partnerSource: expertForm.partnerSource || undefined,
        partnerId: expertForm.partnerSource === 'cooperation' ? expertForm.partnerId || undefined : undefined,
        partnerName: expertForm.partnerSource === 'cooperation'
          ? enterprises.find((e) => e.id === expertForm.partnerId)?.name
          : expertForm.partnerSource === 'third-party'
          ? expertForm.thirdPartyName || undefined
          : undefined,
        secondaryColleges: expertForm.secondaryColleges.length > 0 ? expertForm.secondaryColleges : undefined,
        status: expertForm.status,
        isPublicDisplay: expertForm.isPublicDisplay,
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

  const teacherColumns = [
    {
      key: "name",
      title: "姓名",
      render: (teacher: TeacherBrand) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{teacher.name}</span>
          {teacher.isFeatured && <Star className="h-3.5 w-3.5 text-amber-500" />}
        </div>
      ),
    },
    { key: "department", title: "院系", render: (teacher: TeacherBrand) => teacher.department },
    { key: "title", title: "职称", render: (teacher: TeacherBrand) => teacher.title },
    {
      key: "type",
      title: "类型",
      render: (teacher: TeacherBrand) => (
        <Badge variant="secondary" className="text-xs">{TEACHER_TYPE_LABELS[teacher.type]}</Badge>
      ),
    },
    {
      key: "researchFields",
      title: "研究领域",
      render: (teacher: TeacherBrand) => (
        <div className="flex flex-wrap gap-1">
          {teacher.researchFields.map((field) => (
            <Badge key={field} variant="outline" className="text-xs">{field}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: "awards",
      title: "获奖荣誉",
      render: (teacher: TeacherBrand) => (
        <div className="flex flex-wrap gap-1">
          {teacher.awards.slice(0, 2).map((award) => (
            <Badge key={award} variant="secondary" className="text-xs">{award}</Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      title: "状态",
      render: (teacher: TeacherBrand) => (
        <Badge variant={teacher.status === "published" ? "secondary" : "outline"} className="text-xs">
          {BRAND_STATUS_LABELS[teacher.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (teacher: TeacherBrand) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEditTeacherDialog(teacher)}>
            <Pencil className="mr-1 h-3 w-3" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDeleteTeacher(teacher.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  const expertColumns = [
    { key: "name", title: "姓名", render: (expert: Expert) => <span className="font-medium">{expert.name}</span> },
    { key: "title", title: "职称", render: (expert: Expert) => expert.title || expert.position || "-" },
    { key: "organization", title: "所属机构", render: (expert: Expert) => expert.organization || expert.partnerName || "-" },
    {
      key: "specialties",
      title: "专业领域",
      render: (expert: Expert) => (
        <div className="flex flex-wrap gap-1">
          {expert.specialties?.map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">{specialty}</Badge>
          ))}
        </div>
      ),
    },
    { key: "experience", title: "行业经验", render: (expert: Expert) => expert.experience ? `${expert.experience} 年` : '-' },
    {
      key: "organization",
      title: "来源类型",
      render: (expert: Expert) => (
        <Badge variant="outline" className="text-xs">
          {expert.partnerSource === 'cooperation' ? '合作企业' : expert.partnerSource === 'third-party' ? '第三方机构' : '独立'}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (expert: Expert) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEditExpertDialog(expert)}>
            <Pencil className="mr-1 h-3 w-3" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDeleteExpert(expert.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="师资品牌管理"
        subtitle="管理校本师资和企业专家的品牌展示"
        backHref="/admin/brands"
      />

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button size="sm" onClick={openAddTeacherDialog}>
              <Plus className="h-4 w-4 mr-1" />
              引用教师
            </Button>
          </div>

          <AdminDataTable
            columns={teacherColumns}
            data={filteredTeachers}
            rowKey={(t) => t.id}
            emptyText="暂无符合条件的教师"
          />
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索专家姓名或所属机构..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={openAddExpertDialog}>
              <Plus className="h-4 w-4 mr-1" />
              引用专家
            </Button>
          </div>

          <AdminDataTable
            columns={expertColumns}
            data={filteredExperts}
            rowKey={(e) => e.id}
            emptyText="暂无符合条件的专家"
          />
        </TabsContent>
      </Tabs>

      {/* Teacher Dialog */}
      <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>基础信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="t-name">姓名 *</Label>
                          <Input
                            id="t-name"
                            value={teacherForm.name}
                            onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                            placeholder="请输入姓名"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="t-gender">性别</Label>
                          <Select
                            value={teacherForm.gender}
                            onValueChange={(v) => setTeacherForm({ ...teacherForm, gender: v as ExpertGender })}
                          >
                            <SelectTrigger id="t-gender">
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
                          <Label htmlFor="t-age">年龄</Label>
                          <Input
                            id="t-age"
                            type="number"
                            value={teacherForm.age}
                            onChange={(e) => setTeacherForm({ ...teacherForm, age: e.target.value })}
                            placeholder="如：42"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="t-city">所在城市</Label>
                          <Input
                            id="t-city"
                            value={teacherForm.city}
                            onChange={(e) => setTeacherForm({ ...teacherForm, city: e.target.value })}
                            placeholder="如：上海"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="t-title">职称/职位</Label>
                          <Input
                            id="t-title"
                            value={teacherForm.title}
                            onChange={(e) => setTeacherForm({ ...teacherForm, title: e.target.value })}
                            placeholder="如：高级工程师 / 副院长"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="t-position">任职岗位</Label>
                          <Input
                            id="t-position"
                            value={teacherForm.position}
                            onChange={(e) => setTeacherForm({ ...teacherForm, position: e.target.value })}
                            placeholder="如：产业咨询与企业服务负责人"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="t-organization">所属机构</Label>
                        <Input
                          id="t-organization"
                          value={teacherForm.organization}
                          onChange={(e) => setTeacherForm({ ...teacherForm, organization: e.target.value })}
                          placeholder="如：上海智能制造产业研究院"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="t-experience">从业年限（年）</Label>
                          <Input
                            id="t-experience"
                            type="number"
                            value={teacherForm.experience}
                            onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                            placeholder="如：18"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="t-education">教育背景</Label>
                          <Input
                            id="t-education"
                            value={teacherForm.education}
                            onChange={(e) => setTeacherForm({ ...teacherForm, education: e.target.value })}
                            placeholder="如：浙江大学 机械工程专业 硕士"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="t-industryDirection">行业方向</Label>
                          <Input
                            id="t-industryDirection"
                            value={teacherForm.industryDirection}
                            onChange={(e) => setTeacherForm({ ...teacherForm, industryDirection: e.target.value })}
                            placeholder="如：智能制造、工业互联网、高端装备"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="t-positionDirection">岗位方向</Label>
                          <Input
                            id="t-positionDirection"
                            value={teacherForm.positionDirection}
                            onChange={(e) => setTeacherForm({ ...teacherForm, positionDirection: e.target.value })}
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
                        <Label htmlFor="t-avatar">专家头像</Label>
                        <input
                          ref={teacherFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleTeacherFileChange}
                        />
                        <div className="flex items-center gap-3">
                          {teacherAvatar && (
                            <div className="relative">
                              <img src={teacherAvatar} alt="专家头像" className="w-24 h-32 object-cover rounded-lg border" />
                              <button
                                type="button"
                                onClick={() => setTeacherAvatar('')}
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
                            onClick={() => teacherFileInputRef.current?.click()}
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
                            value={newTeacherSpecialty}
                            onChange={(e) => setNewTeacherSpecialty(e.target.value)}
                            placeholder="输入擅长领域，按回车添加"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddTeacherSpecialty()
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={handleAddTeacherSpecialty}>添加</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {teacherSpecialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              {specialty}
                              <button
                                type="button"
                                onClick={() => handleRemoveTeacherSpecialty(index)}
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
                        value={teacherForm.introduction}
                        onChange={(v) => setTeacherForm({ ...teacherForm, introduction: v })}
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
                        value={teacherForm.workExperience}
                        onChange={(v) => setTeacherForm({ ...teacherForm, workExperience: v })}
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
                        ref={teacherAttachmentInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleTeacherAttachmentChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => teacherAttachmentInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        上传佐证材料
                      </Button>
                      <div className="space-y-2">
                        {teacherAttachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <Input
                                value={attachment.name}
                                onChange={(e) => handleUpdateTeacherAttachmentName(index, e.target.value)}
                                placeholder="请输入材料名称"
                                className="h-8 text-sm"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-red-500 hover:text-red-600 shrink-0"
                              onClick={() => handleRemoveTeacherAttachment(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {teacherAttachments.length === 0 && (
                          <p className="text-sm text-muted-foreground">暂未上传佐证材料</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>所属机构来源</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>来源</Label>
                        <Select
                          value={teacherForm.partnerSource}
                          onValueChange={(v) => {
                            setTeacherForm((prev) => ({
                              ...prev,
                              partnerSource: v as 'cooperation' | 'third-party',
                              partnerId: v !== 'cooperation' ? '' : prev.partnerId,
                              thirdPartyName: v !== 'third-party' ? '' : prev.thirdPartyName,
                            }))
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

                      {teacherForm.partnerSource === 'cooperation' && (
                        <div className="space-y-2">
                          <Label>选择企业</Label>
                          <Select
                            value={teacherForm.partnerId}
                            onValueChange={(v) => setTeacherForm((prev) => ({ ...prev, partnerId: v }))}
                          >
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

                      {teacherForm.partnerSource === 'third-party' && (
                        <div className="space-y-2">
                          <Label>机构名称</Label>
                          <Input
                            value={teacherForm.thirdPartyName}
                            onChange={(e) => setTeacherForm((prev) => ({ ...prev, thirdPartyName: e.target.value }))}
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
                            variant={teacherForm.secondaryColleges.includes(college) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleTeacherSecondaryCollege(college)}
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
                        <Label htmlFor="t-status">状态</Label>
                        <Select
                          value={teacherForm.status}
                          onValueChange={(v) => setTeacherForm({ ...teacherForm, status: v as 'active' | 'inactive' })}
                        >
                          <SelectTrigger id="t-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">启用</SelectItem>
                            <SelectItem value="inactive">禁用</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="t-isPublicDisplay" className="flex-1">前台展示</Label>
                        <Switch
                          id="t-isPublicDisplay"
                          checked={teacherForm.isPublicDisplay}
                          onCheckedChange={(v) => setTeacherForm({ ...teacherForm, isPublicDisplay: v })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
                subtitle: expert.title || expert.position || "未设置",
                group: expert.organization || expert.partnerName || "未归属企业",
              }))}
              selectedItems={experts
                .filter((expert) => selectedExpertIds.includes(expert.id))
                .map((expert) => ({
                  id: expert.id,
                  title: expert.name,
                  subtitle: `${expert.title || expert.position || "未设置"} · ${expert.organization || expert.partnerName || "未归属企业"}`,
                }))}
              selectedIds={selectedExpertIds}
              onSelectedIdsChange={setSelectedExpertIds}
              availableTitle="专家名单"
              selectedTitle="已选专家"
            />
          ) : (
            <div className="space-y-4 py-2">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>基础信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="e-name">姓名 *</Label>
                          <Input
                            id="e-name"
                            value={expertForm.name}
                            onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })}
                            placeholder="请输入姓名"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="e-gender">性别</Label>
                          <Select
                            value={expertForm.gender}
                            onValueChange={(v) => setExpertForm({ ...expertForm, gender: v as ExpertGender })}
                          >
                            <SelectTrigger id="e-gender">
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
                          <Label htmlFor="e-age">年龄</Label>
                          <Input
                            id="e-age"
                            type="number"
                            value={expertForm.age}
                            onChange={(e) => setExpertForm({ ...expertForm, age: e.target.value })}
                            placeholder="如：42"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="e-city">所在城市</Label>
                          <Input
                            id="e-city"
                            value={expertForm.city}
                            onChange={(e) => setExpertForm({ ...expertForm, city: e.target.value })}
                            placeholder="如：上海"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="e-title">职称/职位</Label>
                          <Input
                            id="e-title"
                            value={expertForm.title}
                            onChange={(e) => setExpertForm({ ...expertForm, title: e.target.value })}
                            placeholder="如：高级工程师 / 副院长"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="e-position">任职岗位</Label>
                          <Input
                            id="e-position"
                            value={expertForm.position}
                            onChange={(e) => setExpertForm({ ...expertForm, position: e.target.value })}
                            placeholder="如：产业咨询与企业服务负责人"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="e-organization">所属机构</Label>
                        <Input
                          id="e-organization"
                          value={expertForm.organization}
                          onChange={(e) => setExpertForm({ ...expertForm, organization: e.target.value })}
                          placeholder="如：上海智能制造产业研究院"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="e-experience">从业年限（年）</Label>
                          <Input
                            id="e-experience"
                            type="number"
                            value={expertForm.experience}
                            onChange={(e) => setExpertForm({ ...expertForm, experience: e.target.value })}
                            placeholder="如：18"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="e-education">教育背景</Label>
                          <Input
                            id="e-education"
                            value={expertForm.education}
                            onChange={(e) => setExpertForm({ ...expertForm, education: e.target.value })}
                            placeholder="如：浙江大学 机械工程专业 硕士"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="e-industryDirection">行业方向</Label>
                          <Input
                            id="e-industryDirection"
                            value={expertForm.industryDirection}
                            onChange={(e) => setExpertForm({ ...expertForm, industryDirection: e.target.value })}
                            placeholder="如：智能制造、工业互联网、高端装备"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="e-positionDirection">岗位方向</Label>
                          <Input
                            id="e-positionDirection"
                            value={expertForm.positionDirection}
                            onChange={(e) => setExpertForm({ ...expertForm, positionDirection: e.target.value })}
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
                        <Label htmlFor="e-avatar">专家头像</Label>
                        <input
                          ref={expertFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleExpertFileChange}
                        />
                        <div className="flex items-center gap-3">
                          {expertAvatar && (
                            <div className="relative">
                              <img src={expertAvatar} alt="专家头像" className="w-24 h-32 object-cover rounded-lg border" />
                              <button
                                type="button"
                                onClick={() => setExpertAvatar('')}
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
                            onClick={() => expertFileInputRef.current?.click()}
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
                            value={newExpertSpecialty}
                            onChange={(e) => setNewExpertSpecialty(e.target.value)}
                            placeholder="输入擅长领域，按回车添加"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddExpertSpecialty()
                              }
                            }}
                          />
                          <Button type="button" variant="outline" onClick={handleAddExpertSpecialty}>添加</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {expertSpecialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              {specialty}
                              <button
                                type="button"
                                onClick={() => handleRemoveExpertSpecialty(index)}
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
                        value={expertForm.introduction}
                        onChange={(v) => setExpertForm({ ...expertForm, introduction: v })}
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
                        value={expertForm.workExperience}
                        onChange={(v) => setExpertForm({ ...expertForm, workExperience: v })}
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
                        ref={expertAttachmentInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleExpertAttachmentChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => expertAttachmentInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        上传佐证材料
                      </Button>
                      <div className="space-y-2">
                        {expertAttachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <Input
                                value={attachment.name}
                                onChange={(e) => handleUpdateExpertAttachmentName(index, e.target.value)}
                                placeholder="请输入材料名称"
                                className="h-8 text-sm"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-red-500 hover:text-red-600 shrink-0"
                              onClick={() => handleRemoveExpertAttachment(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {expertAttachments.length === 0 && (
                          <p className="text-sm text-muted-foreground">暂未上传佐证材料</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>所属机构来源</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>来源</Label>
                        <Select
                          value={expertForm.partnerSource}
                          onValueChange={(v) => {
                            setExpertForm((prev) => ({
                              ...prev,
                              partnerSource: v as 'cooperation' | 'third-party',
                              partnerId: v !== 'cooperation' ? '' : prev.partnerId,
                              thirdPartyName: v !== 'third-party' ? '' : prev.thirdPartyName,
                            }))
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

                      {expertForm.partnerSource === 'cooperation' && (
                        <div className="space-y-2">
                          <Label>选择企业</Label>
                          <Select
                            value={expertForm.partnerId}
                            onValueChange={(v) => setExpertForm((prev) => ({ ...prev, partnerId: v }))}
                          >
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

                      {expertForm.partnerSource === 'third-party' && (
                        <div className="space-y-2">
                          <Label>机构名称</Label>
                          <Input
                            value={expertForm.thirdPartyName}
                            onChange={(e) => setExpertForm((prev) => ({ ...prev, thirdPartyName: e.target.value }))}
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
                            variant={expertForm.secondaryColleges.includes(college) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleExpertSecondaryCollege(college)}
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
                        <Label htmlFor="e-status">状态</Label>
                        <Select
                          value={expertForm.status}
                          onValueChange={(v) => setExpertForm({ ...expertForm, status: v as 'active' | 'inactive' })}
                        >
                          <SelectTrigger id="e-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">启用</SelectItem>
                            <SelectItem value="inactive">禁用</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="e-isPublicDisplay" className="flex-1">前台展示</Label>
                        <Switch
                          id="e-isPublicDisplay"
                          checked={expertForm.isPublicDisplay}
                          onCheckedChange={(v) => setExpertForm({ ...expertForm, isPublicDisplay: v })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
