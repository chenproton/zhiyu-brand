"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FakeRichTextEditor } from "@/components/shared/fake-rich-text-editor"
import { SearchableSelect } from "@/components/shared/searchable-select"
import {
  partners,
  projects,
  achievements,
} from "@/lib/mock-data"
import { SECONDARY_COLLEGES } from "@/lib/types"
import type { Achievement } from "@/lib/types"

const projectOptions = projects.map((project) => ({ value: project.id, label: project.name }))
const partnerOptions = partners.map((partner) => ({ value: partner.id, label: partner.name }))

export default function NewAchievementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    projectId: "",
    partnerIds: [] as string[],
    coverImage: "",
    attachments: [] as string[],
    secondaryColleges: [] as string[],
  })

  const coverInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, coverImage: url }))
    e.target.value = ""
  }

  const removeCover = () => {
    setFormData((prev) => ({ ...prev, coverImage: "" }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files).map((f) => f.name)
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }))
    e.target.value = ""
  }

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const partnerId = formData.partnerIds[0] || ""
    const projectId = formData.projectId || undefined

    const newAchievement = {
      id: `ach${Date.now()}`,
      name: formData.title,
      type: "custom" as const,
      partnerId,
      partnerName: partners.find((p) => p.id === partnerId)?.name || "",
      partnerIds: formData.partnerIds.length > 0 ? formData.partnerIds : undefined,
      projectId,
      projectName: projectId ? projects.find((p) => p.id === projectId)?.name : undefined,
      description: formData.description,
      publishDate: new Date(formData.date),
      status: "draft" as const,
      viewCount: 0,
      isPublicDisplay: true,
      secondaryColleges: formData.secondaryColleges.length > 0 ? formData.secondaryColleges : undefined,
      coverImage: formData.coverImage || undefined,
      attachments: formData.attachments.length > 0 ? formData.attachments : undefined,
      createdBy: "管理员",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    achievements.push(newAchievement as Achievement)
    alert("成果已新增（演示）")
    setLoading(false)
    router.push("/admin/achievements")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/achievements">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">新增成果</h1>
          <p className="text-sm text-muted-foreground mt-1">
            录入专利、论文、奖项等各类成果信息
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>填写成果的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">成果名称 *</Label>
                  <Input
                    id="title"
                    placeholder="请输入成果名称"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">发布/获得日期 *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">成果简介</Label>
                  <FakeRichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="请输入成果简介"
                    minHeight="120px"
                  />
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>附件上传</CardTitle>
                <CardDescription>上传相关附件材料</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-muted transition-colors"
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">点击上传附件</span>
                </button>
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm truncate">{file}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>归属项目</CardTitle>
                <CardDescription>选择该成果归属的合作项目（可选）</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchableSelect
                  options={projectOptions}
                  value={formData.projectId}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, projectId: value as string }))
                  }
                  placeholder="选择归属项目（可选）"
                  searchPlaceholder="搜索项目..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>合作企业</CardTitle>
                <CardDescription>搜索并选择合作企业</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchableSelect
                  options={partnerOptions}
                  value={formData.partnerIds}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, partnerIds: value as string[] }))
                  }
                  multiple
                  placeholder="搜索并选择合作企业"
                  searchPlaceholder="搜索企业..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>成果封面</CardTitle>
                <CardDescription>上传成果封面图片</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  className="hidden"
                  onChange={handleCoverChange}
                />
                {formData.coverImage ? (
                  <div className="relative w-fit">
                    <img
                      src={formData.coverImage}
                      alt="成果封面"
                      className="h-40 w-auto rounded-lg border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={removeCover}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg hover:bg-muted transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">点击上传封面图片</span>
                  </button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>关联二级学院</CardTitle>
                <CardDescription>选择成果归属的二级学院</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SECONDARY_COLLEGES.map((college) => (
                    <Badge
                      key={college}
                      variant={formData.secondaryColleges.includes(college) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          secondaryColleges: prev.secondaryColleges.includes(college)
                            ? prev.secondaryColleges.filter((c) => c !== college)
                            : [...prev.secondaryColleges, college],
                        }))
                      }
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
                <CardTitle>操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "保存中..." : "保存成果"}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/admin/achievements">取消</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
