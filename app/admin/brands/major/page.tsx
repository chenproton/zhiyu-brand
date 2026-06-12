"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ArrowLeft, Eye, Pencil, Search, Settings, MoreHorizontal, Trash2 } from "lucide-react"
import { majorBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"
import type { MajorBrand } from "@/lib/types"

export default function MajorBrandPage() {
  const [data, setData] = useState<MajorBrand[]>(majorBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [enabledMajors, setEnabledMajors] = useState<Record<string, boolean>>(
    Object.fromEntries(majorBrands.map((item) => [item.id, item.status !== "archived"]))
  )

  const filteredMajors = data.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || major.level === levelFilter
    return matchesSearch && matchesLevel && enabledMajors[major.id] !== false
  })

  const enabledCount = useMemo(() => Object.values(enabledMajors).filter(Boolean).length, [enabledMajors])

  const deleteMajor = (id: string) => {
    if (confirm("确定要删除该专业品牌吗？")) setData((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">专业品牌管理</h1>
          <p className="text-muted-foreground">管理各专业的品牌展示内容</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索专业名称..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="品牌等级" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="recommended">推荐品牌</SelectItem>
              <SelectItem value="key">重点品牌</SelectItem>
              <SelectItem value="standard">标准品牌</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => setConfigDialogOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />专业启用管理
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>专业名称</TableHead>
              <TableHead>所属院系</TableHead>
              <TableHead>品牌等级</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>在校生</TableHead>
              <TableHead>就业率</TableHead>
              <TableHead>浏览量</TableHead>
              <TableHead>核心课程</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMajors.length > 0 ? (
              filteredMajors.map((major) => (
                <TableRow key={major.id}>
                  <TableCell>
                    <span className="font-medium">{major.name}</span>
                  </TableCell>
                  <TableCell>{major.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{BRAND_LEVEL_LABELS[major.level]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={major.status === "published" ? "secondary" : "outline"}>
                      {BRAND_STATUS_LABELS[major.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{major.studentCount}</TableCell>
                  <TableCell>{major.employmentRate}%</TableCell>
                  <TableCell>{major.viewCount}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {major.coreCourses.slice(0, 3).map((course) => (
                        <Badge key={typeof course === 'string' ? course : course.name} variant="outline" className="text-xs font-normal">
                          {typeof course === 'string' ? course : course.name}
                        </Badge>
                      ))}
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/brands/major/${major.id}/preview`}>
                            <Eye className="h-4 w-4 mr-2" />
                            预览
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/brands/major/${major.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            编辑
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteMajor(major.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  暂无符合条件的专业品牌
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>专业启用管理</DialogTitle>
            <DialogDescription>控制学校已有专业是否展示在专业品牌管理中。</DialogDescription>
          </DialogHeader>
          <div className="max-h-[420px] space-y-2 overflow-y-auto py-2">
            {data.map((major) => (
              <div key={major.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <div className="font-medium">{major.name}</div>
                  <div className="text-xs text-muted-foreground">{major.department}</div>
                </div>
                <Switch checked={enabledMajors[major.id] !== false} onCheckedChange={(checked) => setEnabledMajors((prev) => ({ ...prev, [major.id]: checked }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <div className="mr-auto text-sm text-muted-foreground">已启用 {enabledCount} 个专业</div>
            <Button onClick={() => setConfigDialogOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}
