'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Users, X, Building2, GraduationCap } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { experts } from '@/lib/mock-data'
import { SECONDARY_COLLEGES } from '@/lib/types'

const AVATARS = Array.from({ length: 16 }, (_, i) => `/images/avatars/p${i + 1}.jpg`)
function getAvatar(index: number) {
  return AVATARS[index % AVATARS.length]
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let state = seed
  for (let i = result.length - 1; i > 0; i--) {
    state = (state * 9301 + 49297) % 233280
    const j = Math.floor((state / 233280) * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function ExpertsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [collegeFilter, setCollegeFilter] = useState<string>('all')
  const [sortMode, setSortMode] = useState<'default' | 'name' | 'cooperation'>('default')

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const s = searchTerm.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        expert.name.toLowerCase().includes(s) ||
        (expert.title && expert.title.toLowerCase().includes(s)) ||
        (expert.position && expert.position.toLowerCase().includes(s)) ||
        (expert.organization && expert.organization.toLowerCase().includes(s)) ||
        (expert.partnerName && expert.partnerName.toLowerCase().includes(s)) ||
        (expert.industryDirection && expert.industryDirection.toLowerCase().includes(s)) ||
        expert.specialties?.some((sp) => sp.toLowerCase().includes(s))
      const matchesCollege =
        collegeFilter === 'all' || expert.secondaryColleges?.includes(collegeFilter)
      return matchesSearch && matchesCollege
    })
  }, [searchTerm, collegeFilter])

  const sortedExperts = useMemo(() => {
    const arr = [...filteredExperts]
    if (sortMode === 'name') {
      return arr.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    }
    if (sortMode === 'cooperation') {
      return arr.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
    return arr
  }, [filteredExperts, sortMode])

  const hasActiveFilters = searchTerm || collegeFilter !== 'all'

  const handleClear = () => {
    setSearchTerm('')
    setCollegeFilter('all')
    setSortMode('default')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-violet-50/30">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-indigo-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            专家资源库
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            汇聚各领域的产业专家与学术带头人
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
                    placeholder="搜索专家姓名、职称、机构、领域..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl">
                      <SelectValue placeholder="关联学院" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部学院</SelectItem>
                      {SECONDARY_COLLEGES.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClear} className="rounded-xl">
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
              共 <span className="font-bold text-slate-900">{filteredExperts.length}</span> 位专家
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={sortMode === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortMode('name')}
                className="rounded-xl"
              >
                按姓名排序
              </Button>
              <Button
                variant={sortMode === 'default' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortMode('default')}
                className="rounded-xl"
              >
                随机排序
              </Button>
              <Button
                variant={sortMode === 'cooperation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortMode('cooperation')}
                className="rounded-xl"
              >
                按合作时间排序
              </Button>
            </div>
          </div>

          {sortedExperts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedExperts.map((expert, index) => {
                const avatarSrc = expert.avatar || getAvatar(index)
                const coverSrc = "/images/landingpage/tech.jpg"
                const genderLabel = expert.gender === 'male' ? '男' : expert.gender === 'female' ? '女' : '—'
                return (
                  <Link key={expert.id} href={`/experts/${expert.id}`}>
                    <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white text-center h-full flex flex-col hover:-translate-y-1">
                      <div className="h-24 relative">
                        <img
                          src={coverSrc}
                          alt={expert.organization || expert.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                          <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                            <AvatarImage src={avatarSrc} />
                            <AvatarFallback className="text-xl font-bold bg-white text-slate-800">
                              {expert.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <CardContent className="pt-12 pb-6 px-4 flex-1 flex flex-col text-left">
                        <h4 className="font-bold text-slate-900 text-center truncate">{expert.name}</h4>
                        <p className="text-xs text-slate-500 text-center truncate mt-0.5">{expert.title || expert.position || '—'}</p>
                        <div className="mt-4 space-y-2 text-xs text-slate-600">
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">年龄/性别</span>
                            <span className="text-right">{expert.age ? `${expert.age}岁` : '—'} / {genderLabel}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">从业年限</span>
                            <span className="text-right">{expert.experience && expert.experience > 0 ? `${expert.experience} 年` : '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">教育背景</span>
                            <span className="text-right truncate">{expert.education || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">行业方向</span>
                            <span className="text-right truncate">{expert.industryDirection || '—'}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400 shrink-0">岗位方向</span>
                            <span className="text-right truncate">{expert.positionDirection || '—'}</span>
                          </div>
                        </div>
                        {expert.specialties && expert.specialties.length > 0 && (
                          <div className="mt-4">
                            <p className="text-[11px] text-slate-400 mb-1.5">擅长领域</p>
                            <div className="flex flex-wrap gap-1">
                              {expert.specialties.slice(0, 4).map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-5">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg mb-5">暂无符合条件的专家</p>
              <Button variant="outline" className="rounded-full px-6" onClick={handleClear}>
                清除筛选条件
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
