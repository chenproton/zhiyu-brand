"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus, Check, Search } from "lucide-react"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
import { jobBrands, partners } from "@/lib/mock-data"
import {
  JOB_TYPE_LABELS,
  WORK_NATURE_LABELS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
} from "@/lib/types"

export default function NewJobPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [search, setSearch] = useState("")
  const [selectedBrandId, setSelectedBrandId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 补充信息表单
  const [formData, setFormData] = useState({
    partnerId: "",
    type: "full-time",
    workNature: "on-site",
    department: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    headcount: "1",
    education: "不限",
    experience: "不限",
    deadline: "",
    description: "",
    isUrgent: false,
    isRecommended: false,
  })

  const selectedBrand = jobBrands.find((jb) => jb.id === selectedBrandId)

  const filteredBrands = jobBrands.filter((jb) =>
    jb.name.toLowerCase().includes(search.toLowerCase()) ||
    jb.industry.toLowerCase().includes(search.toLowerCase())
  )

  const enterprisePartners = partners.filter((p) => p.type === "enterprise")

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId)
    const brand = jobBrands.find((b) => b.id === brandId)
    if (brand) {
      setFormData((prev) => ({
        ...prev,
        description: brand.description,
      }))
    }
  }

  const handleNext = () => {
    if (!selectedBrandId) {
      alert("请先选择一个岗位成果")
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.partnerId) {
      alert("请选择招聘企业")
      return
    }
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("岗位发布成功！系统将自动为该岗位匹配推荐优质毕业生。")
    router.push("/admin/employment/jobs")
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/employment/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">发布岗位</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "第一步：从岗位成果库中选择基础岗位" : "第二步：补充发布信息"}
          </p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</div>
          <span className="text-sm font-medium">选择岗位成果</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</div>
          <span className="text-sm font-medium">补充发布信息</span>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索岗位成果名称或行业..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 岗位成果列表 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBrands.map((brand) => (
              <Card
                key={brand.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBrandId === brand.id
                    ? "ring-2 ring-primary border-primary"
                    : ""
                }`}
                onClick={() => handleSelectBrand(brand.id)}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{brand.name}</h3>
                        {selectedBrandId === brand.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{brand.industry}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {brand.averageSalary}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {brand.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {brand.suitableMajors.slice(0, 3).map((major) => (
                      <Badge key={major} variant="secondary" className="text-xs">
                        {major}
                      </Badge>
                    ))}
                    {brand.suitableMajors.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{brand.suitableMajors.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    能力模型: {brand.abilityModel.slice(0, 3).join("、")}
                    {brand.abilityModel.length > 3 && "..."}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              未找到匹配的岗位成果
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              取消
            </Button>
            <Button onClick={handleNext} disabled={!selectedBrandId}>
              下一步
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 左侧主要信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 已选岗位成果 */}
              {selectedBrand && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">已选岗位成果</p>
                        <p className="font-medium">{selectedBrand.name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(1)}
                      >
                        重新选择
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="partnerId">招聘企业 *</Label>
                      <Select
                        value={formData.partnerId}
                        onValueChange={(v) =>
                          setFormData({ ...formData, partnerId: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择企业" />
                        </SelectTrigger>
                        <SelectContent>
                          {enterprisePartners.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id}>
                              {partner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">岗位类型 *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData({ ...formData, type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="workNature">工作性质 *</Label>
                      <Select
                        value={formData.workNature}
                        onValueChange={(v) =>
                          setFormData({ ...formData, workNature: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(WORK_NATURE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">所属部门</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        placeholder="例如：技术部"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">工作地点 *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="例如：江苏省苏州市"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="headcount">招聘人数 *</Label>
                      <Input
                        id="headcount"
                        type="number"
                        min="1"
                        value={formData.headcount}
                        onChange={(e) =>
                          setFormData({ ...formData, headcount: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">截止时间</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData({ ...formData, deadline: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>薪资范围（千元/月）</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="最低"
                        value={formData.salaryMin}
                        onChange={(e) =>
                          setFormData({ ...formData, salaryMin: e.target.value })
                        }
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        placeholder="最高"
                        value={formData.salaryMax}
                        onChange={(e) =>
                          setFormData({ ...formData, salaryMax: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">岗位描述</Label>
                    <FakeRichTextEditor
                      value={formData.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value })
                      }
                      placeholder="描述岗位职责和要求..."
                      minHeight="140px"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧 */}
            <div className="space-y-6">
              {/* 招聘条件 */}
              <Card>
                <CardHeader>
                  <CardTitle>招聘条件</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>学历要求</Label>
                    <Select
                      value={formData.education}
                      onValueChange={(v) =>
                        setFormData({ ...formData, education: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>经验要求</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(v) =>
                        setFormData({ ...formData, experience: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* 发布设置 */}
              <Card>
                <CardHeader>
                  <CardTitle>发布设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isUrgent: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="isUrgent">设为紧急招聘</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecommended"
                      checked={formData.isRecommended}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isRecommended: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="isRecommended">设为推荐岗位</Label>
                  </div>
                </CardContent>
              </Card>

              {/* 提交按钮 */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  上一步
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "发布中..." : "发布并生成推荐"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
