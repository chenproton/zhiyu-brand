"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Search, Plus, MoreHorizontal, RefreshCw, Building2, Pencil, Trash2, Link2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { partners } from "@/lib/mock-data"
import {
  PARTNER_TYPE_LABELS,
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  BRAND_LEVEL_LABELS,
  BRAND_STATUS_LABELS,
  type Partner,
  type BrandLevel,
  type BrandStatus,
} from "@/lib/types"

type PartnerBrand = Partner & {
  brandLevel: BrandLevel
  brandStatus: BrandStatus
  displayOrder: number
  isRecommended: boolean
  brandDescription: string
  featureTags: string[]
}

const initialPartnerBrands: PartnerBrand[] = partners.map((p) => ({
  ...p,
  brandLevel: "standard",
  brandStatus: "draft",
  displayOrder: 0,
  isRecommended: false,
  brandDescription: p.description,
  featureTags: [...p.cooperationTypes],
}))

export default function PartnerBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const [partnerBrands, setPartnerBrands] = useState<PartnerBrand[]>(initialPartnerBrands)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<PartnerBrand | null>(null)

  // Form state
  const [selectedPartnerId, setSelectedPartnerId] = useState("")
  const [brandLevel, setBrandLevel] = useState<BrandLevel>("standard")
  const [brandStatus, setBrandStatus] = useState<BrandStatus>("draft")
  const [displayOrder, setDisplayOrder] = useState("")
  const [isRecommended, setIsRecommended] = useState(false)
  const [brandDescription, setBrandDescription] = useState("")
  const [featureTags, setFeatureTags] = useState("")

  const filteredPartners = partnerBrands.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || partner.type === typeFilter
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter
    const matchesRating = ratingFilter === "all" || partner.rating === ratingFilter
    return matchesSearch && matchesType && matchesStatus && matchesRating
  })

  const getRatingBadgeVariant = (rating: string) => {
    switch (rating) {
      case "strategic":
        return "default"
      case "deep":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "negotiating":
        return "secondary"
      case "paused":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getBrandLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "recommended":
        return "default"
      case "key":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getBrandStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "pending":
        return "secondary"
      case "archived":
        return "destructive"
      default:
        return "outline"
    }
  }

  const resetForm = () => {
    setSelectedPartnerId("")
    setBrandLevel("standard")
    setBrandStatus("draft")
    setDisplayOrder("")
    setIsRecommended(false)
    setBrandDescription("")
    setFeatureTags("")
  }

  const openEdit = (partner: PartnerBrand) => {
    setEditingPartner(partner)
    setBrandLevel(partner.brandLevel)
    setBrandStatus(partner.brandStatus)
    setDisplayOrder(String(partner.displayOrder))
    setIsRecommended(partner.isRecommended)
    setBrandDescription(partner.brandDescription)
    setFeatureTags(partner.featureTags.join(","))
    setEditDialogOpen(true)
  }

  const handleAdd = () => {
    const partner = partners.find((p) => p.id === selectedPartnerId)
    if (!partner) return

    const newPartnerBrand: PartnerBrand = {
      ...partner,
      brandLevel,
      brandStatus,
      displayOrder: Number(displayOrder) || 0,
      isRecommended,
      brandDescription: brandDescription || partner.description,
      featureTags: featureTags.split(",").map((t) => t.trim()).filter(Boolean),
    }

    setPartnerBrands((prev) => [...prev, newPartnerBrand])
    resetForm()
    setDialogOpen(false)
  }

  const handleUpdate = () => {
    if (!editingPartner) return
    setPartnerBrands((prev) =>
      prev.map((p) =>
        p.id === editingPartner.id
          ? {
              ...p,
              brandLevel,
              brandStatus,
              displayOrder: Number(displayOrder) || 0,
              isRecommended,
              brandDescription,
              featureTags: featureTags.split(",").map((t) => t.trim()).filter(Boolean),
            }
          : p
      )
    )
    setEditDialogOpen(false)
    setEditingPartner(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除该雇主品牌吗？")) {
      setPartnerBrands((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const unreferencedPartners = partners.filter(
    (p) => !partnerBrands.some((pb) => pb.id === p.id)
  )

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
          <p className="text-muted-foreground">管理企业、协会、园区、机构等品牌化展示配置</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "合作中", value: partnerBrands.filter((p) => p.status === "active").length, color: "bg-emerald-50 text-emerald-700" },
          { label: "洽谈中", value: partnerBrands.filter((p) => p.status === "negotiating").length, color: "bg-blue-50 text-blue-700" },
          { label: "已暂停", value: partnerBrands.filter((p) => p.status === "paused").length, color: "bg-amber-50 text-amber-700" },
          { label: "已终止", value: partnerBrands.filter((p) => p.status === "terminated").length, color: "bg-gray-50 text-gray-700" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`text-sm mt-1 ${stat.color.split(" ")[1]}`}>{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>雇主品牌列表</CardTitle>
              <CardDescription>从合作主体库同步企业，进行品牌化展示配置</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => alert("同步主体功能开发中")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                同步主体
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <Link2 className="h-4 w-4 mr-2" />
                引用合作主体
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索主体名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="合作状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">合作中</SelectItem>
                <SelectItem value="negotiating">洽谈中</SelectItem>
                <SelectItem value="paused">已暂停</SelectItem>
                <SelectItem value="terminated">已终止</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>主体名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>所属行业</TableHead>
                <TableHead>地区</TableHead>
                <TableHead>合作深度</TableHead>
                <TableHead>合作状态</TableHead>
                <TableHead>品牌等级</TableHead>
                <TableHead>品牌状态</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <div className="flex gap-1 mt-1">
                          {partner.featureTags.slice(0, 2).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {partner.featureTags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{partner.featureTags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{PARTNER_TYPE_LABELS[partner.type]}</TableCell>
                  <TableCell>{partner.industry}</TableCell>
                  <TableCell>{partner.region}</TableCell>
                  <TableCell>
                    <Badge variant={getRatingBadgeVariant(partner.rating)}>
                      {COOPERATION_RATING_LABELS[partner.rating]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(partner.status)}>
                      {COOPERATION_STATUS_LABELS[partner.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBrandLevelBadgeVariant(partner.brandLevel)}>
                      {BRAND_LEVEL_LABELS[partner.brandLevel]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBrandStatusBadgeVariant(partner.brandStatus)}>
                      {BRAND_STATUS_LABELS[partner.brandStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{partner.contactPerson || "-"}</p>
                      <p className="text-muted-foreground text-xs">{partner.contactPhone || "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(partner)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(partner.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPartners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                    没有找到符合条件的雇主品牌
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 引用合作主体 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>引用合作主体</DialogTitle>
            <DialogDescription>从合作主体库中选择并配置品牌展示字段</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>品牌等级</Label>
                <Select value={brandLevel} onValueChange={(v) => setBrandLevel(v as BrandLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">推荐品牌</SelectItem>
                    <SelectItem value="key">重点品牌</SelectItem>
                    <SelectItem value="standard">标准品牌</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>品牌状态</Label>
                <Select value={brandStatus} onValueChange={(v) => setBrandStatus(v as BrandStatus)}>
                  <SelectTrigger>
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
              <Label htmlFor="displayOrder">展示顺序</Label>
              <Input
                id="displayOrder"
                type="number"
                placeholder="请输入数字"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isRecommended">设为推荐</Label>
                <p className="text-sm text-muted-foreground">开启后该主体将在首页推荐展示</p>
              </div>
              <Switch
                id="isRecommended"
                checked={isRecommended}
                onCheckedChange={setIsRecommended}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandDescription">品牌描述</Label>
              <Textarea
                id="brandDescription"
                placeholder="请输入品牌描述..."
                rows={3}
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featureTags">特色标签（逗号分隔）</Label>
              <Input
                id="featureTags"
                placeholder="如：人才培养, 实习实训, 技术研发"
                value={featureTags}
                onChange={(e) => setFeatureTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false) }}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑雇主品牌</DialogTitle>
            <DialogDescription>修改品牌化展示配置</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>主体名称</Label>
              <Input value={editingPartner?.name || ""} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>品牌等级</Label>
                <Select value={brandLevel} onValueChange={(v) => setBrandLevel(v as BrandLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">推荐品牌</SelectItem>
                    <SelectItem value="key">重点品牌</SelectItem>
                    <SelectItem value="standard">标准品牌</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>品牌状态</Label>
                <Select value={brandStatus} onValueChange={(v) => setBrandStatus(v as BrandStatus)}>
                  <SelectTrigger>
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
              <Label htmlFor="editDisplayOrder">展示顺序</Label>
              <Input
                id="editDisplayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="editIsRecommended">设为推荐</Label>
                <p className="text-sm text-muted-foreground">开启后该主体将在首页推荐展示</p>
              </div>
              <Switch
                id="editIsRecommended"
                checked={isRecommended}
                onCheckedChange={setIsRecommended}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editBrandDescription">品牌描述</Label>
              <Textarea
                id="editBrandDescription"
                rows={3}
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editFeatureTags">特色标签（逗号分隔）</Label>
              <Input
                id="editFeatureTags"
                value={featureTags}
                onChange={(e) => setFeatureTags(e.target.value)}
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
