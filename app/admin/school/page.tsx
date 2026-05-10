'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GraduationCap, MapPin, Phone, Mail, Globe, Users, BookOpen, Calendar } from 'lucide-react'
import { schoolInfo } from '@/lib/mock-data'

export default function SchoolInfoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学校信息管理</h1>
          <p className="text-muted-foreground">维护学校基础信息与办学特色</p>
        </div>
        <Button>保存修改</Button>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            基本信息
          </CardTitle>
          <CardDescription>学校名称、类型、办学层次等核心信息</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
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
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            联系信息
          </CardTitle>
          <CardDescription>学校地址与联系方式</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>详细地址</Label>
            <Input defaultValue={schoolInfo.address} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Phone className="h-4 w-4" />联系电话</Label>
            <Input defaultValue={schoolInfo.contactPhone} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Mail className="h-4 w-4" />联系邮箱</Label>
            <Input defaultValue={schoolInfo.contactEmail} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Globe className="h-4 w-4" />学校官网</Label>
            <Input defaultValue={schoolInfo.website} />
          </div>
        </CardContent>
      </Card>

      {/* 办学规模 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            办学规模
          </CardTitle>
          <CardDescription>在校学生、教师、专业数量</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Users className="h-4 w-4" />学生人数</Label>
            <Input type="number" defaultValue={schoolInfo.studentCount} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><BookOpen className="h-4 w-4" />教师人数</Label>
            <Input type="number" defaultValue={schoolInfo.teacherCount} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Calendar className="h-4 w-4" />专业数量</Label>
            <Input type="number" defaultValue={schoolInfo.majorCount} />
          </div>
        </CardContent>
      </Card>

      {/* 学校简介 */}
      <Card>
        <CardHeader>
          <CardTitle>学校简介</CardTitle>
          <CardDescription>办学理念、特色与历史沿革</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea rows={6} defaultValue={schoolInfo.introduction} />
        </CardContent>
      </Card>
    </div>
  )
}
