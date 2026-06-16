"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Eye, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableRowActions } from "@/components/admin/table-row-actions"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminListPage } from "@/components/admin/list-page"
import { AdminDataTable } from "@/components/admin/data-table"
import { activities } from "@/lib/mock-data"
import { ACTIVITY_STATUS_LABELS, ACTIVITY_TYPES } from "@/lib/types"
import type { Activity, ActivityStatus } from "@/lib/types"

const statusColors: Record<ActivityStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  ended: "bg-purple-100 text-purple-800",
}

export default function ActivitiesPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({
    type: "all",
    status: "all",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filters.type === "all" || activity.type === filters.type
    const matchesStatus = filters.status === "all" || activity.status === filters.status
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDeleteClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false)
    setSelectedActivity(null)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setFilters({ type: "all", status: "all" })
  }

  const filterConfigs = [
    {
      key: "type",
      label: "全部类型",
      options: ACTIVITY_TYPES.map((type) => ({ value: type, label: type })),
    },
    {
      key: "status",
      label: "全部状态",
      options: Object.entries(ACTIVITY_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    },
  ]

  const stats = [
    { key: "total", label: "活动总数", value: activities.length, icon: Calendar, color: "blue" as const },
    { key: "published", label: "已发布", value: activities.filter((a) => a.status === "published").length, icon: Calendar, color: "green" as const, filterKey: "status", filterValue: "published" },
    { key: "ended", label: "已结束", value: activities.filter((a) => a.status === "ended").length, icon: Calendar, color: "purple" as const, filterKey: "status", filterValue: "ended" },
    { key: "participants", label: "总参与人数", value: activities.reduce((sum, a) => sum + a.currentParticipants, 0), icon: Users, color: "amber" as const },
  ]

  const columns = [
    {
      key: "name",
      title: "活动名称",
      render: (activity: Activity) => (
        <div>
          <div className="font-medium">{activity.name}</div>
          {activity.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">{activity.description}</div>
          )}
        </div>
      ),
    },
    {
      key: "type",
      title: "类型",
      render: (activity: Activity) => <Badge variant="outline">{activity.type}</Badge>,
    },
    {
      key: "status",
      title: "状态",
      render: (activity: Activity) => <Badge className={statusColors[activity.status]}>{ACTIVITY_STATUS_LABELS[activity.status]}</Badge>,
    },
    {
      key: "date",
      title: "时间",
      render: (activity: Activity) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {activity.date.toLocaleDateString("zh-CN")}
          </div>
          {activity.endDate && (
            <div className="text-xs text-muted-foreground">至 {activity.endDate.toLocaleDateString("zh-CN")}</div>
          )}
        </div>
      ),
    },
    {
      key: "location",
      title: "地点",
      render: (activity: Activity) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {activity.location}
        </div>
      ),
    },
    {
      key: "participants",
      title: "报名情况",
      render: (activity: Activity) => (
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-3 w-3 text-muted-foreground" />
          {activity.currentParticipants}/{activity.maxParticipants || "-"}
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      width: "w-[50px]",
      align: "right" as const,
      render: (activity: Activity) => (
        <TableRowActions>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={`/admin/activities/${activity.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              查看
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert("编辑功能开发中")}>
            <Edit className="mr-1 h-3 w-3" />
            编辑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
            onClick={() => handleDeleteClick(activity)}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            删除
          </Button>
        </TableRowActions>
      ),
    },
  ]

  return (
    <AdminListPage
      title="活动管理"
      subtitle="管理研讨会、培训、论坛、考察等各类活动"
      count={filteredActivities.length}
      countLabel="个活动"
      stats={stats}
      activeFilters={filters}
      onFilterChange={handleFilterChange}
      searchPlaceholder="搜索活动名称..."
      searchValue={search}
      onSearchChange={setSearch}
      filters={filterConfigs}
      filterValues={filters}
      onClearFilters={handleClearFilters}
      actions={
        <Button asChild size="sm">
          <Link href="/admin/activities/new">
            <Plus className="mr-1 h-4 w-4" />
            新建活动
          </Link>
        </Button>
      }
    >
      <AdminDataTable
        columns={columns}
        data={filteredActivities}
        rowKey={(a) => a.id}
        emptyText="暂无活动数据"
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除活动「{selectedActivity?.name}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminListPage>
  )
}
