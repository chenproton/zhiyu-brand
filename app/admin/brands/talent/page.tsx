"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Search, Eye, Plus, Trash2, Pencil, Settings, X } from "lucide-react"
import {
  talentProfiles as initialTalentProfiles,
  employmentCases as initialEmploymentCases,
  enterprises,
  jobs,
} from "@/lib/mock-data"
import { BRAND_STATUS_LABELS, type BrandStatus, type TalentProfile, type EmploymentCase } from "@/lib/types"

interface MajorRankingConfig {
  major: string
  enabled: boolean
  limit: number
}

export default function TalentBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>(initialTalentProfiles)
  const [employmentCases, setEmploymentCases] = useState<EmploymentCase[]>(initialEmploymentCases)

  // Major ranking configs
  const allMajors = useMemo(
    () => [...new Set(initialTalentProfiles.map((t) => t.major))].sort(),
    []
  )
  const [majorConfigs, setMajorConfigs] = useState<MajorRankingConfig[]>(
    allMajors.map((m) => ({ major: m, enabled: true, limit: 10 }))
  )
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [editingConfigs, setEditingConfigs] = useState<MajorRankingConfig[]>([])

  const enabledMajors = useMemo(
    () => majorConfigs.filter((c) => c.enabled).map((c) => c.major),
    [majorConfigs]
  )
  const [activeMajorTab, setActiveMajorTab] = useState<string>(enabledMajors[0] || "")

  // Profile edit
  const [profileEditDialogOpen, setProfileEditDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<TalentProfile | null>(null)
  const [editCertificationLevel, setEditCertificationLevel] = useState("")
  const [editAbilityTags, setEditAbilityTags] = useState("")

  // Case add/edit
  const [caseDialogOpen, setCaseDialogOpen] = useState(false)
  const [caseEditDialogOpen, setCaseEditDialogOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<EmploymentCase | null>(null)

  // Case form
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [studentSearch, setStudentSearch] = useState("")
  const [caseCompany, setCaseCompany] = useState("")
  const [casePosition, setCasePosition] = useState("")
  const [caseSalary, setCaseSalary] = useState("")
  const [caseStory, setCaseStory] = useState("")
  const [caseStatus, setCaseStatus] = useState<BrandStatus>("draft")

  const companyOptions = useMemo(() => enterprises.map((e) => e.name), [])
  const positionOptions = useMemo(() => [...new Set(jobs.map((j) => j.title))], [])

  const getMajorProfiles = (major: string) => {
    const config = majorConfigs.find((c) => c.major === major)
    if (!config) return []
    return talentProfiles
      .filter((p) => p.major === major)
      .filter(
        (p) =>
          p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.abilityScore - a.abilityScore)
      .slice(0, config.limit)
      .map((p, idx) => ({ ...p, rank: idx + 1 }))
  }

  const filteredCases = employmentCases.filter(
    (case_) =>
      case_.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const searchedStudents = useMemo(() => {
    if (!studentSearch.trim()) return []
    const term = studentSearch.toLowerCase()
    return talentProfiles.filter(
      (s) =>
        s.studentName.toLowerCase().includes(term) ||
        s.studentId.toLowerCase().includes(term) ||
        s.major.toLowerCase().includes(term)
    )
  }, [talentProfiles, studentSearch])

  const openProfileEdit = (profile: TalentProfile) => {
    setEditingProfile(profile)
    setEditCertificationLevel(profile.certificationLevel)
    setEditAbilityTags(profile.abilityTags.join(","))
    setProfileEditDialogOpen(true)
  }

  const handleUpdateProfile = () => {
    if (!editingProfile) return
    setTalentProfiles((prev) =>
      prev.map((p) =>
        p.id === editingProfile.id
          ? {
              ...p,
              certificationLevel: editCertificationLevel,
              abilityTags: editAbilityTags.split(",").map((t) => t.trim()).filter(Boolean),
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

  const resetCaseForm = () => {
    setSelectedStudentId("")
    setStudentSearch("")
    setCaseCompany("")
    setCasePosition("")
    setCaseSalary("")
    setCaseStory("")
    setCaseStatus("draft")
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

  const openConfigDialog = () => {
    setEditingConfigs([...majorConfigs])
    setConfigDialogOpen(true)
  }

  const handleSaveConfigs = () => {
    setMajorConfigs([...editingConfigs])
    setConfigDialogOpen(false)
  }

  const selectedStudent = useMemo(
    () => talentProfiles.find((s) => s.id === selectedStudentId) || null,
    [talentProfiles, selectedStudentId]
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
          <h1 className="text-2xl font-semibold text-foreground">人才品牌管理</h1>
          <p className="text-muted-foreground">管理学生能力画像排名和就业案例</p>
        </div>
      </div>

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiles">人才画像排名</TabsTrigger>
          <TabsTrigger value="cases">就业案例</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>人才画像排名</CardTitle>
                  <CardDescription>基于能力认证结果的学生综合排名</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={openConfigDialog}>
                  <Settings className="h-4 w-4 mr-2" />
                  专业排名启用管理
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
              </div>

              {enabledMajors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  请在"专业排名启用管理"中启用至少一个专业
                </div>
              ) : (
                <Tabs
                  value={activeMajorTab}
                  onValueChange={setActiveMajorTab}
                >
                  <TabsList className="mb-4 flex flex-wrap h-auto">
                    {enabledMajors.map((major) => (
                      <TabsTrigger key={major} value={major}>
                        {major}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {enabledMajors.map((major) => {
                    const profiles = getMajorProfiles(major)
                    const config = majorConfigs.find((c) => c.major === major)
                    return (
                      <TabsContent key={major} value={major}>
                        <div className="mb-3 text-sm text-muted-foreground">
                          展示范围：前 {config?.limit || 0} 名 · 当前显示 {profiles.length} 人
                        </div>
                        {profiles.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            没有找到符合条件的人才画像
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {profiles.map((profile) => (
                              <Card key={profile.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-sm font-semibold shrink-0">
                                      {profile.rank}
                                    </div>
                                    <Avatar className="h-10 w-10 shrink-0">
                                      <AvatarImage src={profile.avatar} />
                                      <AvatarFallback className="text-sm">{profile.studentName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-medium text-sm truncate">{profile.studentName}</span>
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] px-1 py-0 h-4"
                                        >
                                          {profile.certificationLevel}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{profile.studentId}</p>
                                      <p className="text-xs text-muted-foreground">{profile.major} · {profile.grade}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 mt-3 py-2 border-y">
                                    <div className="text-center">
                                      <p className="text-lg font-bold text-foreground">{profile.abilityScore}</p>
                                      <p className="text-[10px] text-muted-foreground">能力分数</p>
                                    </div>
                                    <div className="text-center">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] px-1 py-0 h-4"
                                      >
                                        {profile.employmentStatus === "employed"
                                          ? "已就业"
                                          : profile.employmentStatus === "seeking"
                                          ? "求职中"
                                          : "在读"}
                                      </Badge>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">就业状态</p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1 mt-3">
                                    {profile.abilityTags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {profile.abilityTags.length > 3 && (
                                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                        +{profile.abilityTags.length - 3}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openProfileEdit(profile)}>
                                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteProfile(profile.id)}>
                                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    )
                  })}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>就业案例</CardTitle>
                  <CardDescription>展示优秀毕业生的就业故事</CardDescription>
                </div>
                <Button onClick={() => setCaseDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  新增就业案例
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
                          <span className="text-foreground font-medium">{case_.salary}</span>
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
                          <Eye className="h-4 w-4 text-muted-foreground" />
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

      {/* 专业排名启用管理 Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>专业排名启用管理</DialogTitle>
            <DialogDescription>配置各专业的排名展示范围</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {editingConfigs.map((config, idx) => (
              <div key={config.major} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{config.major}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Label className="text-xs whitespace-nowrap text-muted-foreground">排名范围</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    className="w-16 h-8 text-center"
                    value={config.limit}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      if (val < 1) return
                      const newConfigs = [...editingConfigs]
                      newConfigs[idx] = { ...newConfigs[idx], limit: val }
                      setEditingConfigs(newConfigs)
                    }}
                    disabled={!config.enabled}
                  />
                  <Label className="text-xs whitespace-nowrap text-muted-foreground">名</Label>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Label className="text-xs whitespace-nowrap">{config.enabled ? "已启用" : "未启用"}</Label>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={(checked) => {
                      const newConfigs = [...editingConfigs]
                      newConfigs[idx] = { ...newConfigs[idx], enabled: checked }
                      setEditingConfigs(newConfigs)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveConfigs}>保存</Button>
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
              <Label>能力分数</Label>
              <Input type="number" value={editingProfile?.abilityScore || ""} disabled />
              <p className="text-xs text-muted-foreground">能力分数由系统数据自动计算，不可编辑</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCertificationLevel">认证等级</Label>
              <Input
                id="editCertificationLevel"
                value={editCertificationLevel}
                onChange={(e) => setEditCertificationLevel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAbilityTags">能力标签（逗号分隔）</Label>
              <Input
                id="editAbilityTags"
                value={editAbilityTags}
                onChange={(e) => setEditAbilityTags(e.target.value)}
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

      {/* 新增就业案例 Dialog */}
      <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增就业案例</DialogTitle>
            <DialogDescription>选择人才并填写就业案例信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>选择学生</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索学生姓名、学号或专业..."
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value)
                    if (selectedStudentId) setSelectedStudentId("")
                  }}
                  className="pl-10"
                />
                {selectedStudentId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setSelectedStudentId("")
                      setStudentSearch("")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {!selectedStudentId && studentSearch.trim() && searchedStudents.length > 0 && (
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {searchedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-2 cursor-pointer hover:bg-muted text-sm border-b last:border-b-0"
                      onClick={() => {
                        setSelectedStudentId(student.id)
                        setStudentSearch(`${student.studentName} — ${student.studentId} — ${student.major}`)
                      }}
                    >
                      <span className="font-medium">{student.studentName}</span>
                      <span className="text-muted-foreground ml-2">{student.studentId}</span>
                      <span className="text-muted-foreground ml-2">{student.major}</span>
                    </div>
                  ))}
                </div>
              )}
              {!selectedStudentId && studentSearch.trim() && searchedStudents.length === 0 && (
                <p className="text-xs text-muted-foreground">未找到匹配的学生</p>
              )}
              {selectedStudent && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span>已选择：{selectedStudent.studentName}（{selectedStudent.studentId}，{selectedStudent.major}）</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>就业企业</Label>
              <Select value={caseCompany} onValueChange={setCaseCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择企业" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>岗位</Label>
              <Select value={casePosition} onValueChange={setCasePosition}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择岗位" />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button onClick={handleAddCase} disabled={!selectedStudentId || !caseCompany || !casePosition}>
              确认新增
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
              <Label>就业企业</Label>
              <Select value={caseCompany} onValueChange={setCaseCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择企业" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>岗位</Label>
              <Select value={casePosition} onValueChange={setCasePosition}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择岗位" />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
