'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Trophy, Building2, FolderKanban, Eye, Search, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AchievementTypeBadge } from '@/components/shared/status-badge'
import { achievements } from '@/lib/mock-data'
import { ACHIEVEMENT_TYPE_LABELS, BRAND_STATUS_LABELS } from '@/lib/types'

const IMAGES = [
  "/images/landingpage/agreement.jpg",
  "/images/landingpage/startup.jpg",
  "/images/landingpage/coding.jpg",
  "/images/landingpage/workshop.jpg",
  "/images/landingpage/team.jpg",
  "/images/landingpage/campus.jpg",
]

function getImage(index: number) {
  return IMAGES[index % IMAGES.length]
}

export default function PublicAchievementsPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    type: 'all',
    status: 'all',
  })

  const publishedAchievements = achievements.filter((a) => a.status === 'published')

  const filteredAchievements = useMemo(() => {
    return publishedAchievements.filter((achievement) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          achievement.name.toLowerCase().includes(searchLower) ||
          achievement.description?.toLowerCase().includes(searchLower) ||
          achievement.partnerName?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      if (filters.type !== 'all' && achievement.type !== filters.type) return false
      if (filters.status !== 'all' && achievement.status !== filters.status) return false
      return true
    })
  }, [search, filters, publishedAchievements])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({ type: 'all', status: 'all' })
  }

  const hasActiveFilters = search || Object.values(filters).some((v) => v !== 'all')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-emerald-50/20">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-blue-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            成果展示
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            展示产教融合取得的各类成果
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl bg-white/80 backdrop-blur-sm mb-10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索成果名称、描述..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {Object.entries(ACHIEVEMENT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="rounded-xl">
                      <X className="h-4 w-4 mr-1" />
                      清除筛选
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 text-sm">
              共 <span className="font-bold text-slate-900">{filteredAchievements.length}</span> 个成果
            </p>
          </div>

          {filteredAchievements.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredAchievements.map((achievement, index) => (
                <Link key={achievement.id} href={`/achievements/${achievement.id}`}>
                  <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white h-full hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImage(index)}
                        alt={achievement.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <AchievementTypeBadge type={achievement.type} />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={achievement.status === 'published' ? 'secondary' : 'outline'} className="text-[10px]">
                          {BRAND_STATUS_LABELS[achievement.status]}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">{achievement.description}</p>
                      <div className="space-y-2 text-xs text-slate-500 mb-4">
                        {achievement.partnerName && (
                          <p className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" /> {achievement.partnerName}
                          </p>
                        )}
                        {achievement.projectName && (
                          <p className="flex items-center gap-1.5">
                            <FolderKanban className="h-3.5 w-3.5" /> {achievement.projectName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" /> {achievement.viewCount}
                        </span>
                        <span>{achievement.publishDate.toLocaleDateString('zh-CN')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <Trophy className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无成果数据</p>
              <Button variant="outline" className="rounded-full px-6" onClick={handleClearFilters}>
                清除筛选条件
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
