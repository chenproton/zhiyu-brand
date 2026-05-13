"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Eye, Pencil, Plus, Search, Settings, Trash2, TrendingUp, Users } from "lucide-react"
import { majorBrands, partners } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"
import type { MajorBrand } from "@/lib/types"

type EvidenceRow = { id: string; title: string; description: string; attachments: string }

function generateId(prefix = "mb") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function splitByComma(value: string) {
  return value.split(/[,，]/).map((item) => item.trim()).filter(Boolean)
}

function rowsFromStrings(items: string[], prefix: string): EvidenceRow[] {
  return items.map((item, index) => ({ id: `${prefix}-${index}`, title: item, description: "", attachments: "" }))
}

const departments = ["智能制造学院", "信息工程学院", "数字商务学院", "现代服务学院", "设计艺术学院"]

export default function MajorBrandPage() {
  const [data, setData] = useState<MajorBrand[]>(majorBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MajorBrand | null>(null)
  const [enabledMajors, setEnabledMajors] = useState<Record<string, boolean>>(
    Object.fromEntries(majorBrands.map((item) => [item.id, item.status !== "archived"]))
  )

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [levels, setLevels] = useState<EvidenceRow[]>([])
  const [directions, setDirections] = useState<EvidenceRow[]>([])
  const [companies, setCompanies] = useState<EvidenceRow[]>([])
  const [achievements, setAchievements] = useState<EvidenceRow[]>([])
  const [courses, setCourses] = useState<EvidenceRow[]>([])
  const [partnerSelect, setPartnerSelect] = useState("")

  const filteredMajors = data.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || major.level === levelFilter
    return matchesSearch && matchesLevel && enabledMajors[major.id] !== false
  })

  const enabledCount = useMemo(() => Object.values(enabledMajors).filter(Boolean).length, [enabledMajors])

  const openEdit = (item: MajorBrand) => {
    setEditingItem({ ...item })
    setSelectedDepartments(item.department ? splitByComma(item.department) : [])
    setLevels([{ id: "level-0", title: BRAND_LEVEL_LABELS[item.level], description: "专业品牌等级说明", attachments: "" }])
    setDirections(rowsFromStrings(item.employmentDirections, "direction"))
    setCompanies(rowsFromStrings(item.cooperationPartners, "company"))
    setAchievements(rowsFromStrings(item.featuredAchievements, "achievement"))
    setCourses(rowsFromStrings(item.coreCourses, "course"))
    setEditDialogOpen(true)
  }

  const updateEditing = (patch: Partial<MajorBrand>) => {
    setEditingItem((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const updateRow = (setter: (rows: EvidenceRow[]) => void, rows: EvidenceRow[], id: string, patch: Partial<EvidenceRow>) => {
    setter(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const addRow = (setter: (rows: EvidenceRow[]) => void, rows: EvidenceRow[], prefix: string, title = "") => {
    setter([...rows, { id: generateId(prefix), title, description: "", attachments: "" }])
  }

  const removeRow = (setter: (rows: EvidenceRow[]) => void, rows: EvidenceRow[], id: string) => {
    setter(rows.filter((row) => row.id !== id))
  }

  const saveEdit = () => {
    if (!editingItem) return
    const next: MajorBrand = {
      ...editingItem,
      department: selectedDepartments.join("，"),
      employmentDirections: directions.map((row) => row.title).filter(Boolean),
      cooperationPartners: companies.map((row) => row.title).filter(Boolean),
      featuredAchievements: achievements.map((row) => row.title).filter(Boolean),
      coreCourses: courses.map((row) => row.title).filter(Boolean),
      updatedAt: new Date(),
    }
    setData((prev) => prev.map((item) => (item.id === next.id ? next : item)))
    setEditDialogOpen(false)
  }

  const deleteMajor = (id: string) => {
    if (confirm("确定要删除该专业品牌吗？")) setData((prev) => prev.filter((item) => item.id !== id))
  }

  const addIndependentPartner = () => {
    addRow(setCompanies, companies, "company", "新增独立雇主品牌")
  }

  const quotePartner = () => {
    if (!partnerSelect) return
    const partner = partners.find((item) => item.id === partnerSelect)
    if (!partner) return
    addRow(setCompanies, companies, "company", partner.name)
    setPartnerSelect("")
  }

  const renderRows = (
    rows: EvidenceRow[],
    setter: (rows: EvidenceRow[]) => void,
    prefix: string,
    titlePlaceholder: string,
    descriptionPlaceholder: string
  ) => (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="rounded-md border p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Input value={row.title} onChange={(e) => updateRow(setter, rows, row.id, { title: e.target.value })} placeholder={titlePlaceholder} />
            <Input value={row.attachments} onChange={(e) => updateRow(setter, rows, row.id, { attachments: e.target.value })} placeholder="附件佐证，可填多个文件名" />
            <Button variant="ghost" size="icon" onClick={() => removeRow(setter, rows, row.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <Textarea className="mt-3" rows={2} value={row.description} onChange={(e) => updateRow(setter, rows, row.id, { description: e.target.value })} placeholder={descriptionPlaceholder} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => addRow(setter, rows, prefix)}>
        <Plus className="mr-1 h-4 w-4" />新增一行
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">专业品牌管理</h1>
          <p className="text-muted-foreground">管理各专业的品牌展示内容</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索专业名称..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="品牌等级" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="recommended">推荐品牌</SelectItem>
              <SelectItem value="key">重点品牌</SelectItem>
              <SelectItem value="standard">标准品牌</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => setConfigDialogOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />专业启用管理
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredMajors.map((major) => (
          <Card key={major.id} className="text-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{major.name}</CardTitle>
                  <CardDescription className="mt-0.5">{major.department}</CardDescription>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Badge variant="outline" className="text-xs">{BRAND_LEVEL_LABELS[major.level]}</Badge>
                  <Badge variant={major.status === "published" ? "secondary" : "outline"} className="text-xs">{BRAND_STATUS_LABELS[major.status]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="line-clamp-1 text-muted-foreground">{major.introduction}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{major.studentCount} 在校生</div>
                <div className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{major.employmentRate}%</span>就业率</div>
                <div className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{major.viewCount} 浏览</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {major.coreCourses.slice(0, 3).map((course) => <Badge key={course} variant="outline" className="text-xs font-normal">{course}</Badge>)}
              </div>
              <div className="flex gap-2 border-t pt-4">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => alert("预览功能开发中")}><Eye className="mr-1 h-3.5 w-3.5" />预览</Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(major)}><Pencil className="mr-1 h-3.5 w-3.5" />编辑</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => deleteMajor(major.id)}><Trash2 className="mr-1 h-3.5 w-3.5" />删除</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>专业启用管理</DialogTitle>
            <DialogDescription>控制学校已有专业是否展示在专业品牌管理中。</DialogDescription>
          </DialogHeader>
          <div className="max-h-[420px] space-y-2 overflow-y-auto py-2">
            {data.map((major) => (
              <div key={major.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium">{major.name}</div>
                  <div className="text-xs text-muted-foreground">{major.department}</div>
                </div>
                <Switch checked={enabledMajors[major.id] !== false} onCheckedChange={(checked) => setEnabledMajors((prev) => ({ ...prev, [major.id]: checked }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <div className="mr-auto text-sm text-muted-foreground">已启用 {enabledCount} 个专业</div>
            <Button onClick={() => setConfigDialogOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑专业品牌</DialogTitle>
            <DialogDescription>按专业基本信息、等级、就业、合作、成果和课程维护品牌内容。</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <Tabs defaultValue="basic" className="py-2">
              <TabsList className="flex h-auto flex-wrap">
                <TabsTrigger value="basic">专业基本信息</TabsTrigger>
                <TabsTrigger value="levels">专业品牌等级</TabsTrigger>
                <TabsTrigger value="directions">专业就业方向</TabsTrigger>
                <TabsTrigger value="companies">专业合作企业</TabsTrigger>
                <TabsTrigger value="achievements">专业特色成果</TabsTrigger>
                <TabsTrigger value="courses">专业核心课程</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>专业名称</Label><Input value={editingItem.name} disabled /></div>
                  <div className="space-y-2">
                    <Label>状态</Label>
                    <Select value={editingItem.status} onValueChange={(status) => updateEditing({ status: status as MajorBrand["status"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Label>所属二级学院（可多选）</Label>
                  <div className="grid gap-2 rounded-md border p-3 md:grid-cols-3">
                    {departments.map((dept) => (
                      <label key={dept} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selectedDepartments.includes(dept)} onChange={() => setSelectedDepartments((prev) => prev.includes(dept) ? prev.filter((item) => item !== dept) : [...prev, dept])} />
                        {dept}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>在校生人数</Label><Input type="number" value={editingItem.studentCount} onChange={(e) => updateEditing({ studentCount: Number(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>就业率(%)</Label><Input type="number" value={editingItem.employmentRate} onChange={(e) => updateEditing({ employmentRate: Number(e.target.value) })} /></div>
                </div>
                <div className="space-y-2"><Label>专业简介</Label><Textarea rows={4} value={editingItem.introduction} onChange={(e) => updateEditing({ introduction: e.target.value })} /></div>
                <div className="space-y-2"><Label>专业简介附件</Label><Input placeholder="可填写多个附件名，用逗号分隔" /></div>
              </TabsContent>
              <TabsContent value="levels" className="pt-4">{renderRows(levels, setLevels, "level", "等级描述", "填写该等级的认定依据、建设目标或佐证说明")}</TabsContent>
              <TabsContent value="directions" className="pt-4">{renderRows(directions, setDirections, "direction", "就业方向", "填写岗位方向、面向行业或典型工作任务")}</TabsContent>
              <TabsContent value="companies" className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={addIndependentPartner}><Plus className="mr-1 h-4 w-4" />新增独立雇主品牌</Button>
                  <div className="flex gap-2">
                    <Select value={partnerSelect} onValueChange={setPartnerSelect}>
                      <SelectTrigger className="w-64"><SelectValue placeholder="选择已有企业" /></SelectTrigger>
                      <SelectContent>{partners.map((partner) => <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="outline" onClick={quotePartner}>引用已有企业</Button>
                  </div>
                </div>
                {renderRows(companies, setCompanies, "company", "合作企业", "填写合作内容、共建基础或合作成效")}
              </TabsContent>
              <TabsContent value="achievements" className="pt-4">{renderRows(achievements, setAchievements, "achievement", "特色成果", "填写成果简介、获奖情况或应用价值")}</TabsContent>
              <TabsContent value="courses" className="pt-4">{renderRows(courses, setCourses, "course", "核心课程", "填写课程定位、课程特色或课程成果")}</TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={saveEdit}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
