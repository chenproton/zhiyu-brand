"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Calendar, MapPin, Users, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { activities } from "@/lib/mock-data"
import { ACTIVITY_STATUS_LABELS, ACTIVITY_TYPES, type ActivityStatus } from "@/lib/types"

const statusColors: Record<ActivityStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  ended: "bg-purple-100 text-purple-800",
}

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Only show public activities (not draft)
  const publicActivities = activities.filter(a => a.status !== "draft")

  const filteredActivities = useMemo(() => {
    return publicActivities.filter((activity) => {
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || activity.type === typeFilter
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, typeFilter, statusFilter, publicActivities])

  // Group activities
  const upcomingActivities = filteredActivities.filter(a => a.status === "published")
  const pastActivities = filteredActivities.filter(a => a.status === "ended")

  return (
    <div className="py-8 lg:py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">活动资讯</h1>
          <p className="text-muted-foreground">
            查看即将举办和正在进行的产教融合活动
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索活动名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="活动类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {ACTIVITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="published">报名中</TabsTrigger>
              <TabsTrigger value="ended">已结束</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Upcoming Activities */}
        {upcomingActivities.length > 0 && (statusFilter === "all" || statusFilter === "published") && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              即将举办
              <Badge variant="secondary">{upcomingActivities.length}</Badge>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingActivities.map((activity) => (
                <Card key={activity.id} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline">{activity.type}</Badge>
                      <Badge className={statusColors[activity.status]}>
                        {ACTIVITY_STATUS_LABELS[activity.status]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {activity.description}
                      </p>
                    )}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{activity.date.toLocaleDateString('zh-CN')}</span>
                        {activity.endDate && (
                          <span>- {activity.endDate.toLocaleDateString('zh-CN')}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{activity.currentParticipants}/{activity.maxParticipants || '不限'} 人已报名</span>
                      </div>
                    </div>
                    {activity.status === "published" && (
                      <Button className="w-full mt-4">立即报名</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Past Activities */}
        {pastActivities.length > 0 && (statusFilter === "all" || statusFilter === "ended") && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              往期活动
              <Badge variant="secondary">{pastActivities.length}</Badge>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastActivities.map((activity) => (
                <Card key={activity.id} className="h-full hover:shadow-lg transition-shadow opacity-80">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline">{activity.type}</Badge>
                      <Badge className={statusColors[activity.status]}>
                        {ACTIVITY_STATUS_LABELS[activity.status]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {activity.description}
                      </p>
                    )}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{activity.date.toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{activity.currentParticipants} 人参与</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无符合条件的活动</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setTypeFilter("all"); setStatusFilter("all") }}>
              清除筛选条件
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
