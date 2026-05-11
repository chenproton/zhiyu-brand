'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { ENTERPRISE_TYPE_LABELS, COOPERATION_STATUS_LABELS, COOPERATION_RATING_LABELS, INDUSTRIES } from '@/lib/types'

export default function NewEnterprisePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/enterprises">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">新增企业</h1>
        <p className="text-muted-foreground">录入新的企业档案信息</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>企业名称</Label>
                <Input placeholder="请输入企业全称" />
              </div>
              <div className="space-y-2">
                <Label>企业类型</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择企业类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform">平台企业</SelectItem>
                    <SelectItem value="school-based">校本企业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>所属行业</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择行业" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>合作状态</Label>
                <Select defaultValue="negotiating">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COOPERATION_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>合作评级</Label>
                <Select defaultValue="general">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COOPERATION_RATING_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>企业简介</Label>
                <Textarea rows={4} placeholder="请输入企业简介..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">联系信息</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>联系人</Label>
                <Input placeholder="请输入联系人姓名" />
              </div>
              <div className="space-y-2">
                <Label>联系电话</Label>
                <Input placeholder="请输入联系电话" />
              </div>
              <div className="space-y-2">
                <Label>联系邮箱</Label>
                <Input placeholder="请输入联系邮箱" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>详细地址</Label>
                <Input placeholder="请输入企业地址" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">其他信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>成立年份</Label>
                <Input type="number" placeholder="如：2010" />
              </div>
              <div className="space-y-2">
                <Label>员工规模</Label>
                <Input type="number" placeholder="如：500" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1">保存</Button>
            <Button variant="outline" asChild>
              <Link href="/admin/enterprises">取消</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
