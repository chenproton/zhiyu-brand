"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Search, Eye, Plus, MoreHorizontal, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { jobBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS, INDUSTRIES } from "@/lib/types"

export default function JobBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

  const filteredJobs = jobBrands.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || job.level === levelFilter
    const matchesIndustry = industryFilter === "all" || job.industry === industryFilter
    return matchesSearch && matchesLevel && matchesIndustry
  })

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "recommended":
        return "default"
      case "key":
        return "secondary"
      default:
        return "outline"
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
          <h1 className="text-2xl font-semibold text-foreground">岗位品牌管理</h1>
          <p className="text-muted-foreground">管理职业岗位的品牌化展示配置</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>岗位品牌列表</CardTitle>
              <CardDescription>从职业岗位平台同步岗位，进行品牌化配置</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                同步岗位
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新增岗位
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索岗位名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="品牌等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部等级</SelectItem>
                <SelectItem value="recommended">推荐品牌</SelectItem>
                <SelectItem value="key">重点品牌</SelectItem>
                <SelectItem value="standard">标准品牌</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="所属行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>岗位名称</TableHead>
                <TableHead>所属行业</TableHead>
                <TableHead>品牌等级</TableHead>
                <TableHead>适用专业</TableHead>
                <TableHead>薪资范围</TableHead>
                <TableHead>需求量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>浏览量</TableHead>
                <TableHead className="w-[80px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.name}</p>
                      <div className="flex gap-1 mt-1">
                        {job.featureTags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{job.industry}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(job.level)}>
                      {BRAND_LEVEL_LABELS[job.level]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {job.suitableMajors.slice(0, 2).map((major) => (
                        <Badge key={major} variant="secondary" className="text-xs">
                          {major}
                        </Badge>
                      ))}
                      {job.suitableMajors.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.suitableMajors.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-emerald-600 font-medium">{job.averageSalary}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{job.demandCount}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={job.status === "published" ? "default" : "secondary"}
                    >
                      {BRAND_STATUS_LABELS[job.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{job.viewCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem>预览</DropdownMenuItem>
                        <DropdownMenuItem>调整等级</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">下架</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
