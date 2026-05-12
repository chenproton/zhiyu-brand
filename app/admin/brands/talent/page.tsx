"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Star, Eye, Plus, MoreHorizontal, RefreshCw, Trash2, Pencil, Link2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { talentProfiles as initialTalentProfiles, employmentCases as initialEmploymentCases, experts } from "@/lib/mock-data"
import { BRAND_STATUS_LABELS, type BrandStatus, type TalentProfile, type EmploymentCase } from "@/lib/types"

export default function TalentBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")

  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>(initialTalentProfiles)
  const [employmentCases, setEmploymentCases] = useState<EmploymentCase[]>(initialEmploymentCases)

  // Profile dialogs
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [profileEditDialogOpen, setProfileEditDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<TalentProfile | null>(null)

  // Profile form state
  const [selectedExpertId, setSelectedExpertId] = useState("")
  const [profileAbilityScore, setProfileAbilityScore] = useState("")
  const [profileCertificationLevel, setProfileCertificationLevel] = useState("")
  const [profileAbilityTags, setProfileAbilityTags] = useState("")
  const [profileIsFeatured, setProfileIsFeatured] = useState(false)

  // Case dialogs
  const [caseDialogOpen, setCaseDialogOpen] = useState(false)
  const [caseEditDialogOpen, setCaseEditDialogOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<EmploymentCase | null>(null)

  // Case form state
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [caseCompany, setCaseCompany] = useState("")
  const [casePosition, setCasePosition] = useState("")
  const [caseSalary, setCaseSalary] = useState("")
  const [caseStory, setCaseStory] = useState("")
  const [caseStatus, setCaseStatus] = useState<BrandStatus>("draft")

  const majors = [...new Set(talentProfiles.map((t) => t.major))]

  const filteredProfiles = talentProfiles.filter((profile) => {
    const matchesSearch =
      profile.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMajor = majorFilter === "all" || profile.major === majorFilter
    return matchesSearch && matchesMajor
  })

  const filteredCases = employmentCases.filter(
    (case_) =>
      case_.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetProfileForm = () => {
    setSelectedExpertId("")
    setProfileAbilityScore("")
    setProfileCertificationLevel("")
    setProfileAbilityTags("")
    setProfileIsFeatured(false)
  }

  const resetCaseForm = () => {
    setSelectedStudentId("")
    setCaseCompany("")
    setCasePosition("")
    setCaseSalary("")
    setCaseStory("")
    setCaseStatus("draft")
  }

  const openProfileEdit = (profile: TalentProfile) => {
    setEditingProfile(profile)
    setProfileAbilityScore(String(profile.abilityScore))
    setProfileCertificationLevel(profile.certificationLevel)
    setProfileAbilityTags(profile.abilityTags.join(","))
    setProfileIsFeatured(profile.isFeatured)
    setProfileEditDialogOpen(true)
  }

  const openCaseEdit = (caseItem: EmploymentCase) => {
    setEditingCase(caseItem)
    setCaseCompany(caseItem.company)
    setCasePosition(caseItem.position)
    setCaseSalary(caseItem.salary || "")
    setCaseStory(caseItem.story)
    setCaseStatus(caseItem.status)
    setCaseEditDialogOpen(true)
  }

  const handleAddProfile = () => {
    const expert = experts.find((e) => e.id === selectedExpertId)
    if (!expert) return

    const maxRank = talentProfiles.length > 0
      ? Math.max(...talentProfiles.map((p) => p.comprehensiveRank))
      : 0

    const newProfile: TalentProfile = {
      id: `tp-${Date.now()}`,
      studentId: `S${Date.now()}`,
      studentName: expert.name,
      major: expert.field,
      department: expert.partnerName || "",
      grade: "",
      avatar: expert.avatar,
      abilityScore: Number(profileAbilityScore) || 0,
      certificationLevel: profileCertificationLevel,
      taskCompletionRate: 0,
      comprehensiveRank: maxRank + 1,
      abilityTags: profileAbilityTags.split(",").map((t) => t.trim()).filter(Boolean),
      employmentStatus: "studying",
      isFeatured: profileIsFeatured,
      updatedAt: new Date(),
    }

    setTalentProfiles((prev) => [...prev, newProfile])
    resetProfileForm()
    setProfileDialogOpen(false)
  }

  const handleUpdateProfile = () => {
    if (!editingProfile) return
    setTalentProfiles((prev) =>
      prev.map((p) =>
        p.id === editingProfile.id
          ? {
              ...p,
              abilityScore: Number(profileAbilityScore) || 0,
              certificationLevel: profileCertificationLevel,
              abilityTags: profileAbilityTags.split(",").map((t) => t.trim()).filter(Boolean),
              isFeatured: profileIsFeatured,
              updatedAt: new Date(),
            }
          : p
      )
    )
    setProfileEditDialogOpen(false)
    setEditingProfile(null)
  }

  const handleDeleteProfile = (id: string) => {
    if (confirm("确定要删除该人才画像吗？")) {
      setTalentProfiles((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleAddCase = () => {
    const student = talentProfiles.find((s) => s.id === selectedStudentId)
    if (!student) return

    const newCase: EmploymentCase = {
      id: `ec-${Date.now()}`,
      studentName: student.studentName,
      major: student.major,
      graduationYear: new Date().getFullYear(),
      company: caseCompany,
      companyLogo: "/placeholder.svg?height=64&width=64",
      position: casePosition,
      salary: caseSalary || undefined,
      abilityTags: student.abilityTags.slice(0, 3),
      story: caseStory,
      photo: "/placeholder.svg?height=200&width=200",
      status: caseStatus,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setEmploymentCases((prev) => [...prev, newCase])
    resetCaseForm()
    setCaseDialogOpen(false)
  }

  const handleUpdateCase = () => {
    if (!editingCase) return
    setEmploymentCases((prev) =>
      prev.map((c) =>
        c.id === editingCase.id
          ? {
              ...c,
              company: caseCompany,
              position: casePosition,
              salary: caseSalary || undefined,
              story: caseStory,
              status: caseStatus,
              updatedAt: new Date(),
            }
          : c
      )
    )
    setCaseEditDialogOpen(false)
    setEditingCase(null)
  }

  const handleDeleteCase = (id: string) => {
    if (confirm("确定要删除该就业案例吗？")) {
      setEmploymentCases((prev) => prev.filter((c) => c.id !== id))
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
          <h1 className="text-2xl font-semibold text-foreground">人才品牌管理</h1>
          <p className="text-muted-foreground">管理学生能力画像排名和典型就业案例</p>
        </div>
      </div>

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiles">人才画像排名</TabsTrigger>
          <TabsTrigger value="cases">典型就业案例</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>人才画像排名</CardTitle>
                  <CardDescription>基于能力认证结果的学生综合排名</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setProfileDialogOpen(true)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  引用人才
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索学生姓名或学号..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={majorFilter} onValueChange={setMajorFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="选择专业" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部专业</SelectItem>
                    {majors.map((major) => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">排名</TableHead>
                    <TableHead>学生信息</TableHead>
                    <TableHead>专业</TableHead>
                    <TableHead>能力分数</TableHead>
                    <TableHead>认证等级</TableHead>
                    <TableHead>能力标签</TableHead>
                    <TableHead>就业状态</TableHead>
                    <TableHead>特色展示</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold">
                          {profile.comprehensiveRank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={profile.avatar} />
                            <AvatarFallback>{profile.studentName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile.studentName}</p>
                            <p className="text-sm text-muted-foreground">{profile.studentId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{profile.major}</p>
                          <p className="text-sm text-muted-foreground">{profile.grade}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-lg">{profile.abilityScore}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            profile.certificationLevel === "高级"
                              ? "default"
                              : profile.certificationLevel === "中级"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {profile.certificationLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {profile.abilityTags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {profile.abilityTags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.abilityTags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            profile.employmentStatus === "employed"
                              ? "default"
                              : profile.employmentStatus === "seeking"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {profile.employmentStatus === "employed"
                            ? "已就业"
                            : profile.employmentStatus === "seeking"
                            ? "求职中"
                            : "在读"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {profile.isFeatured ? (
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <Star className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openProfileEdit(profile)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(profile.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        没有找到符合条件的人才画像
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>典型就业案例</CardTitle>
                  <CardDescription>展示优秀毕业生的就业故事</CardDescription>
                </div>
                <Button onClick={() => setCaseDialogOpen(true)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  引用就业案例
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生或企业..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((case_) => (
                  <Card key={case_.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={case_.photo || "/placeholder.svg?height=200&width=300"}
                        alt={case_.studentName}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={case_.status === "published" ? "default" : "secondary"}
                      >
                        {BRAND_STATUS_LABELS[case_.status]}
                      </Badge>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage src={case_.companyLogo} />
                          <AvatarFallback>{case_.company[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{case_.studentName}</p>
                          <p className="text-sm text-muted-foreground">{case_.major}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">就业企业</span>
                          <span className="font-medium">{case_.company}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">岗位</span>
                          <span>{case_.position}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">薪资</span>
                          <span className="text-emerald-600 font-medium">{case_.salary}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {case_.abilityTags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{case_.viewCount}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openCaseEdit(case_)}>
                            编辑
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCase(case_.id)}>
                            删除
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredCases.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    没有找到符合条件的就业案例
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 引用人才 Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>引用人才</DialogTitle>
            <DialogDescription>从专家库中选择人才并填写品牌展示字段</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择专家</Label>
              <Select value={selectedExpertId} onValueChange={setSelectedExpertId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择专家" />
                </SelectTrigger>
                <SelectContent>
                  {experts.map((expert) => (
                    <SelectItem key={expert.id} value={expert.id}>
                      {expert.name} — {expert.field} — {expert.partnerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="abilityScore">能力分数</Label>
              <Input
                id="abilityScore"
                type="number"
                placeholder="请输入能力分数"
                value={profileAbilityScore}
                onChange={(e) => setProfileAbilityScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificationLevel">认证等级</Label>
              <Input
                id="certificationLevel"
                placeholder="如：高级、中级、初级"
                value={profileCertificationLevel}
                onChange={(e) => setProfileCertificationLevel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abilityTags">能力标签（逗号分隔）</Label>
              <Input
                id="abilityTags"
                placeholder="如：机器学习, 深度学习, Python"
                value={profileAbilityTags}
                onChange={(e) => setProfileAbilityTags(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isFeatured">设为特色展示</Label>
                <p className="text-sm text-muted-foreground">开启后该人才将在首页特色展示</p>
              </div>
              <Switch
                id="isFeatured"
                checked={profileIsFeatured}
                onCheckedChange={setProfileIsFeatured}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetProfileForm(); setProfileDialogOpen(false) }}>
              取消
            </Button>
            <Button onClick={handleAddProfile} disabled={!selectedExpertId}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑人才 Dialog */}
      <Dialog open={profileEditDialogOpen} onOpenChange={setProfileEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑人才画像</DialogTitle>
            <DialogDescription>修改人才品牌展示字段</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>学生姓名</Label>
              <Input value={editingProfile?.studentName || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAbilityScore">能力分数</Label>
              <Input
                id="editAbilityScore"
                type="number"
                value={profileAbilityScore}
                onChange={(e) => setProfileAbilityScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCertificationLevel">认证等级</Label>
              <Input
                id="editCertificationLevel"
                value={profileCertificationLevel}
                onChange={(e) => setProfileCertificationLevel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAbilityTags">能力标签（逗号分隔）</Label>
              <Input
                id="editAbilityTags"
                value={profileAbilityTags}
                onChange={(e) => setProfileAbilityTags(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="editIsFeatured">设为特色展示</Label>
                <p className="text-sm text-muted-foreground">开启后该人才将在首页特色展示</p>
              </div>
              <Switch
                id="editIsFeatured"
                checked={profileIsFeatured}
                onCheckedChange={setProfileIsFeatured}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateProfile}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 引用就业案例 Dialog */}
      <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>引用就业案例</DialogTitle>
            <DialogDescription>选择人才并填写就业案例信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择学生</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择学生" />
                </SelectTrigger>
                <SelectContent>
                  {talentProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.studentName} — {profile.major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseCompany">就业企业</Label>
              <Input
                id="caseCompany"
                placeholder="请输入企业名称"
                value={caseCompany}
                onChange={(e) => setCaseCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="casePosition">岗位</Label>
              <Input
                id="casePosition"
                placeholder="请输入岗位名称"
                value={casePosition}
                onChange={(e) => setCasePosition(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseSalary">薪资</Label>
              <Input
                id="caseSalary"
                placeholder="如：8-12K"
                value={caseSalary}
                onChange={(e) => setCaseSalary(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseStory">就业故事</Label>
              <Textarea
                id="caseStory"
                placeholder="请输入就业故事..."
                rows={4}
                value={caseStory}
                onChange={(e) => setCaseStory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>发布状态</Label>
              <Select value={caseStatus} onValueChange={(v) => setCaseStatus(v as BrandStatus)}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetCaseForm(); setCaseDialogOpen(false) }}>
              取消
            </Button>
            <Button onClick={handleAddCase} disabled={!selectedStudentId}>
              确认引用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑就业案例 Dialog */}
      <Dialog open={caseEditDialogOpen} onOpenChange={setCaseEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑就业案例</DialogTitle>
            <DialogDescription>修改就业案例信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>学生姓名</Label>
              <Input value={editingCase?.studentName || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCaseCompany">就业企业</Label>
              <Input
                id="editCaseCompany"
                value={caseCompany}
                onChange={(e) => setCaseCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCasePosition">岗位</Label>
              <Input
                id="editCasePosition"
                value={casePosition}
                onChange={(e) => setCasePosition(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCaseSalary">薪资</Label>
              <Input
                id="editCaseSalary"
                value={caseSalary}
                onChange={(e) => setCaseSalary(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCaseStory">就业故事</Label>
              <Textarea
                id="editCaseStory"
                rows={4}
                value={caseStory}
                onChange={(e) => setCaseStory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>发布状态</Label>
              <Select value={caseStatus} onValueChange={(v) => setCaseStatus(v as BrandStatus)}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaseEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateCase}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
