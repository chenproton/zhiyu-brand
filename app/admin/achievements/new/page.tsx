"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/lib/mock-data"
import { ACHIEVEMENT_TYPE_LABELS, SECONDARY_COLLEGES } from "@/lib/types"
import type { AchievementType } from "@/lib/types"

export default function NewAchievementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "" as AchievementType | "",
    description: "",
    projectId: "",
    date: "",
    authors: [] as string[],
    newAuthor: "",
    attachments: [] as string[],
    secondaryColleges: [] as string[],
  })

  const handleAddAuthor = () => {
    if (formData.newAuthor.trim()) {
      setFormData({
        ...formData,
        authors: [...formData.authors, formData.newAuthor.trim()],
        newAuthor: "",
      })
    }
  }

  const handleRemoveAuthor = (index: number) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index),
    })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
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
          <h1 className="text-2xl font-semibold text-foreground">添加自定义成果</h1>
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
                  <Textarea
                    id="description"
                    placeholder="请输入成果简介"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>作者/发明人</CardTitle>
                <CardDescription>添加成果的作者或发明人</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="输入姓名"
                    value={formData.newAuthor}
                    onChange={(e) => setFormData({ ...formData, newAuthor: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddAuthor()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddAuthor}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.authors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.authors.map((author, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {author}
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
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
                <CardTitle>关联项目</CardTitle>
                <CardDescription>关联到具体的合作项目</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择关联项目（可选）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不关联项目</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
