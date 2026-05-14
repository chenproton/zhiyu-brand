"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AssociatedJobsTable,
  JobActionButtons,
  NonTeachingJobDialog,
  TeachingJobDialog,
} from "@/components/admin/job-brand-tools"
import {
  CooperationStatusBadge,
  CooperationRatingBadge,
} from "@/components/shared/status-badge"
import {
  ArrowLeft,
  Pencil,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Search,
  Plus,
  X,
} from "lucide-react"
import { partners, jobs as mockJobs, talentProfiles } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PARTNER_TYPE_LABELS,
} from "@/lib/types"
import type { Job, Partner } from "@/lib/types"

const CUSTOM_PARTNERS_KEY = "brand_custom_partners"

function getStoredCustomPartnerById(id: string): Partner | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = localStorage.getItem(CUSTOM_PARTNERS_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    const arr = Array.isArray(parsed) ? parsed : []
    const found = arr.find((p) => p.id === id)
    if (!found) return undefined
    return { ...found, createdAt: new Date(found.createdAt), updatedAt: new Date(found.updatedAt) }
  } catch {
    return undefined
  }
}

export default function PartnerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const partner = useMemo(() => {
    const fromMock = partners.find((p) => p.id === id)
    if (fromMock) return fromMock
    return getStoredCustomPartnerById(id)
  }, [id])
  const isIndependent = partner?.id.startsWith("custom-") ?? false

  const [localJobs, setLocalJobs] = useState<Job[]>([...mockJobs])
  const [activeTab, setActiveTab] = useState("info")

  // Hired students: { studentId: string; jobId: string }[]
  const [hiredStudentsData, setHiredStudentsData] = useState<{ studentId: string; jobId: string }[]>([])

  // Migrate from old format on mount
  useEffect(() => {
    const old = partner?.hiredStudents || []
    if (old.length > 0 && typeof old[0] === 'string') {
      const firstJobId = mockJobs.find((j) => j.partnerId === id)?.id || ''
      setHiredStudentsData((old as string[]).map((sid) => ({ studentId: sid, jobId: firstJobId })))
    }
  }, [partner?.hiredStudents, id])
  const [studentPickerOpen, setStudentPickerOpen] = useState(false)
  const [studentSearch, setStudentSearch] = useState("")
  const [selectedJobForStudent, setSelectedJobForStudent] = useState("")

  // Dialogs for job association
  const [associateNonTeachingOpen, setAssociateNonTeachingOpen] = useState(false)
  const [associateTeachingOpen, setAssociateTeachingOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const associatedJobs = useMemo(
    () => localJobs.filter((j) => j.partnerId === id),
    [localJobs, id]
  )

  const hiredStudentIds = useMemo(() => hiredStudentsData.map((d) => d.studentId), [hiredStudentsData])

  const hiredStudents = useMemo(
    () => talentProfiles.filter((s) => hiredStudentIds.includes(s.id)),
    [hiredStudentIds]
  )

  // Group hired students by job
  const hiredStudentsByJob = useMemo(() => {
    const map = new Map<string, { student: typeof talentProfiles[0]; jobId: string }[]>()
    hiredStudentsData.forEach((d) => {
      const student = talentProfiles.find((s) => s.id === d.studentId)
      if (!student) return
      const list = map.get(d.jobId) || []
      list.push({ student, jobId: d.jobId })
      map.set(d.jobId, list)
    })
    return map
  }, [hiredStudentsData])

  const searchedStudents = useMemo(() => {
    if (!studentSearch.trim()) return []
    const term = studentSearch.toLowerCase()
    return talentProfiles.filter(
      (s) =>
        !hiredStudentIds.includes(s.id) &&
        (s.studentName.toLowerCase().includes(term) ||
          s.studentId.toLowerCase().includes(term) ||
          s.major.toLowerCase().includes(term))
    )
  }, [studentSearch, hiredStudentIds])

  const handleAssociateStudent = (studentId: string) => {
    if (!selectedJobForStudent) {
      alert('请先选择雇佣岗位')
      return
    }
    setHiredStudentsData((prev) => [...prev, { studentId, jobId: selectedJobForStudent }])
    setStudentSearch("")
  }

  const handleRemoveStudent = (studentId: string) => {
    if (confirm("确定要移除该学生的关联吗？")) {
      setHiredStudentsData((prev) => prev.filter((d) => d.studentId !== studentId))
    }
  }

  const handleSaveJob = (job: Job) => {
    setLocalJobs((prev) => {
      const exists = prev.some((item) => item.id === job.id)
      return exists ? prev.map((item) => (item.id === job.id ? job : item)) : [job, ...prev]
    })
    setEditingJob(null)
  }

  const handleRemoveJob = (jobId: string) => {
    if (confirm("确定要移除该岗位的关联吗？")) {
      setLocalJobs((prev) => prev.filter((j) => j.id !== jobId))
    }
  }

  if (!partner) {
    return (
      <div className="space-y-6">
        <Link href="/admin/brands/partner">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
        <div className="text-center py-12 text-muted-foreground">
          未找到该雇主品牌
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/brands/partner">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.name}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline">{PARTNER_TYPE_LABELS[partner.type]}</Badge>
              {isIndependent ? (
                <Badge variant="secondary">独立雇主品牌</Badge>
              ) : (
                <Badge variant="outline">合作企业</Badge>
              )}
              {!isIndependent && <CooperationStatusBadge status={partner.status} />}
              {!isIndependent && <CooperationRatingBadge rating={partner.rating} />}
            </div>
          </div>
        </div>
        <Button onClick={() => alert('编辑功能开发中')}>
          <Pencil className="h-4 w-4 mr-2" />
          编辑信息
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{associatedJobs.length}</p>
                <p className="text-xs text-muted-foreground">关联岗位</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {partner.employeeCount?.toLocaleString() || "-"}
                </p>
                <p className="text-xs text-muted-foreground">员工规模</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {partner.establishedYear || "-"}
                </p>
                <p className="text-xs text-muted-foreground">成立年份</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold truncate max-w-[120px]">
                  {partner.region || "-"}
                </p>
                <p className="text-xs text-muted-foreground">所在地区</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="jobs">关联岗位 ({associatedJobs.length})</TabsTrigger>
          <TabsTrigger value="hiredStudents">已招聘学生 ({hiredStudents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">品牌简介</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {partner.description || "暂无描述"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partner.contactPerson && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">联系人：{partner.contactPerson}</span>
                  </div>
                )}
                {partner.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{partner.contactPhone}</span>
                  </div>
                )}
                {partner.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{partner.contactEmail}</span>
                  </div>
                )}
                {partner.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{partner.address}</span>
                  </div>
                )}
                {!partner.contactPerson && !partner.contactPhone && !partner.contactEmail && !partner.address && (
                  <p className="text-sm text-muted-foreground">暂无联系信息</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">所属行业与地区</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">所属行业</span>
                  <span className="text-sm">{partner.industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">地区</span>
                  <span className="text-sm">{partner.region || "-"}</span>
                </div>
              </CardContent>
            </Card>

            {!isIndependent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">合作信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">合作状态</span>
                    <CooperationStatusBadge status={partner.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">合作深度</span>
                    <CooperationRatingBadge rating={partner.rating} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">合作类型</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {partner.cooperationTypes.length > 0 ? (
                        partner.cooperationTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm">-</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">主体类型</span>
                  <span className="text-sm">{PARTNER_TYPE_LABELS[partner.type]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">成立年份</span>
                  <span className="text-sm">{partner.establishedYear || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">员工规模</span>
                  <span className="text-sm">
                    {partner.employeeCount?.toLocaleString() || "-"} 人
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">创建时间</span>
                  <span className="text-sm">
                    {partner.createdAt.toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">更新时间</span>
                  <span className="text-sm">
                    {partner.updatedAt.toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">关联岗位</CardTitle>
              </div>
              <div className="flex gap-2">
                <JobActionButtons
                  onAddTeaching={() => setAssociateTeachingOpen(true)}
                  onAddNonTeaching={() => {
                    setEditingJob(null)
                    setAssociateNonTeachingOpen(true)
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <AssociatedJobsTable
                jobs={associatedJobs}
                onEdit={(job) => {
                  setEditingJob(job)
                  setAssociateNonTeachingOpen(true)
                }}
                onDelete={handleRemoveJob}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hiredStudents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">已招聘学生</CardTitle>
              </div>
              <Button size="sm" onClick={() => { setSelectedJobForStudent(associatedJobs[0]?.id || ''); setStudentPickerOpen(true) }}>
                <Plus className="h-4 w-4 mr-1" />
                关联学生
              </Button>
            </CardHeader>
            <CardContent>
              {hiredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无已招聘学生
                </div>
              ) : (
                <div className="space-y-6">
                  {Array.from(hiredStudentsByJob.entries()).map(([jobId, list]) => {
                    const job = associatedJobs.find((j) => j.id === jobId)
                    return (
                      <div key={jobId}>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          {job ? job.title : "未分配岗位"}
                        </h4>
                        <div className="space-y-2">
                          {list.map(({ student }) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                  {student.studentName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{student.studentName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {student.studentId} · {student.major} · {student.grade}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleRemoveStudent(student.id)}
                              >
                                移除
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 学生关联选择 Dialog */}
      <Dialog open={studentPickerOpen} onOpenChange={setStudentPickerOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle>关联学生</DialogTitle>
            <DialogDescription>选择雇佣岗位后搜索并选择要关联的学生</DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-2 space-y-3">
            <div className="space-y-1">
              <Label className="text-sm">雇佣岗位</Label>
              <Select value={selectedJobForStudent} onValueChange={setSelectedJobForStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="选择岗位" />
                </SelectTrigger>
                <SelectContent>
                  {associatedJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索学生姓名、学号或专业..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9"
              />
              {studentSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setStudentSearch("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto px-4 pb-4">
            {searchedStudents.length > 0 ? (
              <div className="space-y-1">
                {searchedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted text-sm border-b last:border-b-0"
                    onClick={() => handleAssociateStudent(student.id)}
                  >
                    <div>
                      <span className="font-medium">{student.studentName}</span>
                      <span className="text-muted-foreground ml-2">{student.studentId}</span>
                      <span className="text-muted-foreground ml-2">{student.major}</span>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : studentSearch.trim() ? (
              <p className="text-sm text-muted-foreground text-center py-4">未找到匹配的学生</p>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">请输入搜索关键词</p>
            )}
          </div>
          <DialogFooter className="px-4 pb-4">
            <Button variant="outline" onClick={() => { setStudentSearch(""); setStudentPickerOpen(false) }}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NonTeachingJobDialog
        open={associateNonTeachingOpen}
        onOpenChange={(open) => {
          setAssociateNonTeachingOpen(open)
          if (!open) setEditingJob(null)
        }}
        partner={partner}
        initialJob={editingJob}
        onSave={handleSaveJob}
      />
      <TeachingJobDialog
        open={associateTeachingOpen}
        onOpenChange={setAssociateTeachingOpen}
        partner={partner}
        onSave={handleSaveJob}
      />
    </div>
  )
}
