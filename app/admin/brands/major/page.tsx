"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { TableRowActions } from "@/components/admin/table-row-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import { Eye, Pencil, Settings, Trash2 } from "lucide-react"
import { majorBrands } from "@/lib/mock-data"
import { BRAND_LEVEL_LABELS, BRAND_STATUS_LABELS } from "@/lib/types"
import type { MajorBrand } from "@/lib/types"

export default function MajorBrandPage() {
  const [data, setData] = useState<MajorBrand[]>(majorBrands)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [enabledMajors, setEnabledMajors] = useState<Record<string, boolean>>(
    Object.fromEntries(majorBrands.map((item) => [item.id, item.status !== "archived"]))
  )

  const filteredMajors = data.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && enabledMajors[major.id] !== false
  })

  const enabledCount = useMemo(() => Object.values(enabledMajors).filter(Boolean).length, [enabledMajors])

  const deleteMajor = (id: string) => {
    if (confirm("确定要删除该专业品牌吗？")) setData((prev) => prev.filter((item) => item.id !== id))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({})
  }

  const filterConfigs: { key: string; label: string; options: { value: string; label: string }[] }[] = []

  const columns = [
    { key: "name", title: "专业名称", render: (major: MajorBrand) => <span className="font-medium">{major.name}</span> },
    { key: "department", title: "所属院系", render: (major: MajorBrand) => major.department },
    {
      key: "level",
      title: "品牌类型",
      render: (major: MajorBrand) => <Badge variant="outline">{BRAND_LEVEL_LABELS[major.level]}</Badge>,
    },
    {
      key: "status",
      title: "状态",
      render: (major: MajorBrand) => (
        <Badge variant={major.status === "published" ? "secondary" : "outline"}>
          {BRAND_STATUS_LABELS[major.status]}
        </Badge>
      ),
    },
    { key: "studentCount", title: "在校生", render: (major: MajorBrand) => major.studentCount },
    { key: "employmentRate", title: "就业率", render: (major: MajorBrand) => `${major.employmentRate}%` },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (major: MajorBrand) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/brands/major/${major.id}/preview`}>
              <Eye className="mr-1 h-3 w-3" />
              预览
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/brands/major/${major.id}`}>
              <Pencil className="mr-1 h-3 w-3" />
              编辑
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => deleteMajor(major.id)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  const tagExamples = [
    "推荐品牌",
    "重点品牌",
    "标准品牌",
    "省级特色专业",
    "教育部1+X试点",
    "省技能竞赛一等奖",
    "校企共建实训室",
    "产教融合示范基地",
    "高水平专业群",
    "现代学徒制试点",
  ]

  return (
    <AdminListPage
      title="专业品牌管理"
      subtitle="管理各专业的品牌展示内容"
      count={filteredMajors.length}
      countLabel="个专业"
      backHref="/admin/brands"
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索专业名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <Button variant="outline" size="sm" onClick={() => setConfigDialogOpen(true)}>
          <Settings className="mr-1 h-4 w-4" />
          专业启用管理
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {tagExamples.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
        ))}
      </div>
      <AdminDataTable
        columns={columns}
        data={filteredMajors}
        rowKey={(m) => m.id}
        emptyText="暂无符合条件的专业品牌"
      />

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
    </AdminListPage>
  )
}
