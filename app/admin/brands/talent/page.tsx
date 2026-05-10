"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ArrowLeft, Search, Star, Eye, Plus, MoreHorizontal, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { talentProfiles, employmentCases } from "@/lib/mock-data"
import { BRAND_STATUS_LABELS } from "@/lib/types"

export default function TalentBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")

  const majors = [...new Set(talentProfiles.map((t) => t.major))]

  const filteredProfiles = talentProfiles.filter((profile) => {
    const matchesSearch =
      profile.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMajor = majorFilter === "all" || profile.major === majorFilter
    return matchesSearch && matchesMajor
  })

  const filteredCases = employmentCases.filter((case_) =>
    case_.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.company.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  同步数据
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
                    <TableHead className="w-[80px]">操作</TableHead>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>查看详情</DropdownMenuItem>
                            <DropdownMenuItem>
                              {profile.isFeatured ? "取消特色展示" : "设为特色展示"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>生成就业案例</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新增案例
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
                          <Button variant="outline" size="sm">
                            编辑
                          </Button>
                          <Button variant="ghost" size="sm">
                            预览
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
