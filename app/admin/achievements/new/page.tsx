"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/lib/mock-data"
import { ACHIEVEMENT_TYPE_LABELS } from "@/lib/types"
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
                    <Label htmlFor="type">成果类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value as AchievementType })}
                      required
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="选择成果类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ACHIEVEMENT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
