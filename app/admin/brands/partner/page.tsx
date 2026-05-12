"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Search, Plus, Pencil, Trash2, Building2, MapPin, Users, Briefcase } from "lucide-react"
import { partners } from "@/lib/mock-data"
import {
  PARTNER_TYPE_LABELS,
  COOPERATION_RATING_LABELS,
  COOPERATION_STATUS_LABELS,
  INDUSTRIES,
} from "@/lib/types"
import type { Partner } from "@/lib/types"

export default function PartnerBrandPage() {
  const [displayedPartners, setDisplayedPartners] = useState<Partner[]>([...partners])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [selectedPartnerId, setSelectedPartnerId] = useState("")

  // Edit form states
  const [formDescription, setFormDescription] = useState("")
  const [formCooperationTypes, setFormCooperationTypes] = useState("")
  const [formContactPerson, setFormContactPerson] = useState("")
  const [formContactPhone, setFormContactPhone] = useState("")
  const [formIndustry, setFormIndustry] = useState("")
  const [formRegion, setFormRegion] = useState("")
  const [formStatus, setFormStatus] = useState<Partner["status"]>("active")

  const filteredPartners = displayedPartners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || partner.type === typeFilter
    const matchesIndustry = industryFilter === "all" || partner.industry === industryFilter
    const matchesRating = ratingFilter === "all" || partner.rating === ratingFilter
    return matchesSearch && matchesType && matchesIndustry && matchesRating
  })

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "strategic":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "deep":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const openEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormDescription(partner.description)
    setFormCooperationTypes(partner.cooperationTypes.join(", "))
    setFormContactPerson(partner.contactPerson || "")
    setFormContactPhone(partner.contactPhone || "")
    setFormIndustry(partner.industry)
    setFormRegion(partner.region)
    setFormStatus(partner.status)
    setEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingPartner) return
    setDisplayedPartners((prev) =>
      prev.map((p) =>
        p.id === editingPartner.id
          ? {
              ...p,
              description: formDescription,
              cooperationTypes: formCooperationTypes
                .split(/,|，/)
                .map((s) => s.trim())
                .filter(Boolean),
              contactPerson: formContactPerson || undefined,
              contactPhone: formContactPhone || undefined,
              industry: formIndustry,
              region: formRegion,
              status: formStatus,
              updatedAt: new Date(),
            }
          : p
      )
    )
    setEditDialogOpen(false)
    setEditingPartner(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该雇主品牌吗？")) {
      setDisplayedPartners((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const unreferencedPartners = partners.filter(
    (p) => !displayedPartners.some((dp) => dp.id === p.id)
  )

  const handleAdd = () => {
    const partner = partners.find((p) => p.id === selectedPartnerId)
    if (!partner) return
    setDisplayedPartners((prev) => [...prev, partner])
    setSelectedPartnerId("")
    setDialogOpen(false)
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
          <h1 className="text-2xl font-semibold text-foreground">雇主品牌管理</h1>
          <p className="text-muted-foreground">管理合作主体的品牌展示配置</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索主体名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="主体类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="enterprise">企业</SelectItem>
              <SelectItem value="association">行业协会</SelectItem>
              <SelectItem value="park">产业园区</SelectItem>
              <SelectItem value="institution">机构</SelectItem>
            </SelectContent>
          </Select>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="所属行业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部行业</SelectItem>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="合作深度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部深度</SelectItem>
              <SelectItem value="strategic">战略合作</SelectItem>
              <SelectItem value="deep">深度合作</SelectItem>
              <SelectItem value="general">一般合作</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          引用合作主体
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{partner.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {PARTNER_TYPE_LABELS[partner.type]}
                      </Badge>
                      <Badge className={`text-xs ${getRatingColor(partner.rating)}`}>
                        {COOPERATION_RATING_LABELS[partner.rating]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{partner.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{partner.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{partner.industry}</span>
                </div>
                {partner.employeeCount && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{partner.employeeCount}人</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {partner.cooperationTypes.slice(0, 4).map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
                {partner.cooperationTypes.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{partner.cooperationTypes.length - 4}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <Badge
                  variant={partner.status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {COOPERATION_STATUS_LABELS[partner.status]}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(partner)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(partner.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredPartners.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            没有找到符合条件的雇主品牌
          </div>
        )}
      </div>

      {/* 引用合作主体 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>引用合作主体</DialogTitle>
            <DialogDescription>从合作主体库中选择要展示的品牌</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择合作主体</Label>
              <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择合作主体" />
                </SelectTrigger>
                <SelectContent>
                  {unreferencedPartners.length === 0 && (
                    <SelectItem value="" disabled>
                      没有可引用的主体
                    </SelectItem>
                  )}
                  {unreferencedPartners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} — {partner.industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedPartnerId(""); setDialogOpen(false) }}>
              取消
            </Button>
            <Button onClick={handleAdd} disabled={!selectedPartnerId || unreferencedPartners.length === 0}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑 Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑雇主品牌</DialogTitle>
            <DialogDescription>修改合作主体的品牌展示信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>主体名称</Label>
              <Input value={editingPartner?.name || ""} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>所属行业</Label>
                <Select value={formIndustry} onValueChange={setFormIndustry}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label>合作状态</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as Partner["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">合作中</SelectItem>
                    <SelectItem value="negotiating">洽谈中</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                    <SelectItem value="terminated">已终止</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>地区</Label>
              <Input
                value={formRegion}
                onChange={(e) => setFormRegion(e.target.value)}
                placeholder="如 江苏省苏州市"
              />
            </div>
            <div className="space-y-2">
              <Label>联系人</Label>
              <Input
                value={formContactPerson}
                onChange={(e) => setFormContactPerson(e.target.value)}
                placeholder="请输入联系人姓名"
              />
            </div>
            <div className="space-y-2">
              <Label>联系电话</Label>
              <Input
                value={formContactPhone}
                onChange={(e) => setFormContactPhone(e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
            <div className="space-y-2">
              <Label>合作类型（逗号分隔）</Label>
              <Input
                value={formCooperationTypes}
                onChange={(e) => setFormCooperationTypes(e.target.value)}
                placeholder="如 人才培养, 实习实训, 技术研发"
              />
            </div>
            <div className="space-y-2">
              <Label>品牌描述</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                placeholder="请输入品牌描述..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdate}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
