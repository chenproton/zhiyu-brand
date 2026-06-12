'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  BookOpen,
  Calendar,
  Upload,
  X,
  School,
} from 'lucide-react'
import { schoolInfo } from '@/lib/mock-data'
import type { SecondaryCollege } from '@/lib/types'

const NAV_ITEMS = [
  { id: 'school', name: schoolInfo.name, type: 'school' as const },
  ...(schoolInfo.secondaryColleges || []).map((college) => ({
    id: college.id,
    name: college.name,
    type: 'college' as const,
  })),
]

export default function SchoolInfoPage() {
  const [selectedId, setSelectedId] = useState<string>('school')

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div className="w-64 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">组织导航</h2>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1 pr-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                selectedId === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {item.type === 'school' ? (
                <School className="h-4 w-4 shrink-0" />
              ) : (
                <GraduationCap className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-w-0">
        {selectedId === 'school' ? (
          <SchoolEditForm />
        ) : (
          <CollegeEditForm collegeId={selectedId} />
        )}
      </div>
    </div>
  )
}

function SchoolEditForm() {
  const [logo, setLogo] = useState<string>(schoolInfo.logo || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLogo(url)
    }
  }

  const handleRemoveLogo = () => {
    setLogo('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学校信息管理</h1>
          <p className="text-muted-foreground">维护学校基础信息与办学特色</p>
        </div>
        <Button onClick={() => alert('学校信息已保存（演示）')}>保存修改</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                校徽图片
              </CardTitle>
              <CardDescription>上传学校校徽或标志图片，将展示在首页学校信息卡片中</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {logo ? (
                    <div className="relative">
                      <img
                        src={logo}
                        alt="校徽预览"
                        className="w-20 h-20 rounded-xl object-cover border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                      <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {logo ? '更换图片' : '上传校徽'}
                  </Button>
                  <p className="text-xs text-muted-foreground">支持 JPG、PNG 格式，建议尺寸 200×200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                基本信息
              </CardTitle>
              <CardDescription>学校名称、类型、办学层次等核心信息</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>学校全称</Label>
                <Input defaultValue={schoolInfo.name} />
              </div>
              <div className="space-y-2">
                <Label>学校简称</Label>
                <Input defaultValue={schoolInfo.shortName} />
              </div>
              <div className="space-y-2">
                <Label>院校类型</Label>
                <Input defaultValue={schoolInfo.type} />
              </div>
              <div className="space-y-2">
                <Label>建校年份</Label>
                <Input type="number" defaultValue={schoolInfo.establishedYear} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>学校简介</Label>
                <Textarea rows={8} defaultValue={schoolInfo.introduction} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                办学规模
              </CardTitle>
              <CardDescription>在校学生、教师、专业数量</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Users className="h-3 w-3" />学生人数</Label>
                <Input type="number" defaultValue={schoolInfo.studentCount} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><BookOpen className="h-3 w-3" />教师人数</Label>
                <Input type="number" defaultValue={schoolInfo.teacherCount} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Calendar className="h-3 w-3" />专业数量</Label>
                <Input type="number" defaultValue={schoolInfo.majorCount} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                联系信息
              </CardTitle>
              <CardDescription>学校地址与联系方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><MapPin className="h-3 w-3" />详细地址</Label>
                <Input defaultValue={schoolInfo.address} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Phone className="h-3 w-3" />联系电话</Label>
                <Input defaultValue={schoolInfo.contactPhone} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Mail className="h-3 w-3" />联系邮箱</Label>
                <Input defaultValue={schoolInfo.contactEmail} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Globe className="h-3 w-3" />学校官网</Label>
                <Input defaultValue={schoolInfo.website} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CollegeEditForm({ collegeId }: { collegeId: string }) {
  const college = schoolInfo.secondaryColleges?.find((c) => c.id === collegeId)

  if (!college) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">学院不存在</h1>
        <p className="text-muted-foreground">该学院可能已被删除或 ID 不正确</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{college.name}</h1>
          <p className="text-muted-foreground">维护二级学院基础信息与办学特色</p>
        </div>
        <Button onClick={() => alert('学院信息已保存（演示）')}>保存修改</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                学院标识
              </CardTitle>
              <CardDescription>上传二级学院标志图片</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <School className="h-4 w-4" />
                基本信息
              </CardTitle>
              <CardDescription>学院名称、代码、简介等核心信息</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>学院名称</Label>
                <Input placeholder="请输入学院名称" />
              </div>
              <div className="space-y-2">
                <Label>学院代码</Label>
                <Input placeholder="请输入学院代码" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>学院简介</Label>
                <Textarea rows={8} placeholder="请输入学院简介" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                办学规模
              </CardTitle>
              <CardDescription>在校学生、教师、专业数量</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Users className="h-3 w-3" />学生人数</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><BookOpen className="h-3 w-3" />教师人数</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Calendar className="h-3 w-3" />专业数量</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Calendar className="h-3 w-3" />成立年份</Label>
                <Input type="number" placeholder="2000" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                联系信息
              </CardTitle>
              <CardDescription>学院联系方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Phone className="h-3 w-3" />联系电话</Label>
                <Input placeholder="请输入联系电话" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Mail className="h-3 w-3" />联系邮箱</Label>
                <Input placeholder="请输入联系邮箱" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
