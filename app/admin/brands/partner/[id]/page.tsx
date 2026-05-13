"use client"

import { useState, useMemo } from "react"
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
} from "lucide-react"
import { partners, jobs as mockJobs } from "@/lib/mock-data"
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

  // Dialogs for job association
  const [associateNonTeachingOpen, setAssociateNonTeachingOpen] = useState(false)
  const [associateTeachingOpen, setAssociateTeachingOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const associatedJobs = useMemo(
    () => localJobs.filter((j) => j.partnerId === id),
    [localJobs, id]
  )

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
      </Tabs>

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
