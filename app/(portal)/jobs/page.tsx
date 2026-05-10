"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  Building2, 
  Clock,
  Briefcase,
  Filter,
  Heart,
  Star,
  Users,
  DollarSign,
  Flame,
} from "lucide-react"
import { jobs, partners } from "@/lib/mock-data"
import { 
  JOB_TYPE_LABELS, 
  WORK_NATURE_LABELS,
  EDUCATION_LEVELS,
  INDUSTRIES,
  type JobType,
} from "@/lib/types"

export default function JobsPortalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const publishedJobs = jobs.filter(j => j.status === "published")

  const filteredJobs = useMemo(() => {
    return publishedJobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = typeFilter === "all" || job.type === typeFilter
      const partner = partners.find(p => p.id === job.partnerId)
      const matchesIndustry = industryFilter === "all" || partner?.industry === industryFilter
      return matchesSearch && matchesType && matchesIndustry
    })
  }, [searchTerm, typeFilter, industryFilter, publishedJobs])

  const recommendedJobs = filteredJobs.filter(j => j.isRecommended).slice(0, 3)
  const urgentJobs = filteredJobs.filter(j => j.isUrgent).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">校企合作岗位大厅</h1>
            <p className="text-lg text-gray-300 mb-8">
              汇聚优质企业资源，助力职业发展起航
            </p>
            
            {/* 搜索框 */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="搜索岗位、公司或技能..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base bg-white text-gray-900"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                搜索
              </Button>
            </div>

            {/* 快捷筛选 */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge 
                variant={typeFilter === "all" ? "default" : "secondary"}
                className="cursor-pointer px-4 py-1"
                onClick={() => setTypeFilter("all")}
              >
                全部
              </Badge>
              {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                <Badge 
                  key={value}
                  variant={typeFilter === value ? "default" : "secondary"}
                  className="cursor-pointer px-4 py-1"
                  onClick={() => setTypeFilter(value)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 统计数字 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">{publishedJobs.length}</p>
              <p className="text-sm text-muted-foreground">在招岗位</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {new Set(publishedJobs.map(j => j.partnerId)).size}
              </p>
              <p className="text-sm text-muted-foreground">招聘企业</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {publishedJobs.reduce((sum, j) => sum + j.headcount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">招聘人数</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-primary">
                {publishedJobs.filter(j => j.isUrgent).length}
              </p>
              <p className="text-sm text-muted-foreground">急招岗位</p>
            </CardContent>
          </Card>
        </div>

        {/* 推荐岗位 */}
        {recommendedJobs.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-bold">推荐岗位</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recommendedJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={job.partnerLogo} />
                            <AvatarFallback>{job.partnerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.partnerName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold">
                          {job.salaryMin && job.salaryMax 
                            ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` 
                            : '面议'}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location.split('省')[1]?.slice(0, 3) || job.location.slice(0, 5)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 急招岗位 */}
        {urgentJobs.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold">急招岗位</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {urgentJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow border-red-200 bg-red-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={job.partnerLogo} />
                            <AvatarFallback>{job.partnerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{job.title}</h3>
                              <Badge variant="destructive" className="text-xs">急招</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{job.partnerName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          招 {job.headcount} 人
                        </span>
                        <span>{JOB_TYPE_LABELS[job.type]}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold">
                          {job.salaryMin && job.salaryMax 
                            ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` 
                            : '面议'}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location.split('省')[1]?.slice(0, 3) || job.location.slice(0, 5)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 筛选栏 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">全部岗位 ({filteredJobs.length})</h2>
          <div className="flex gap-2">
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 岗位列表 */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                没有找到符合条件的岗位，请尝试调整筛选条件
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={job.partnerLogo} />
                          <AvatarFallback>{job.partnerName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            {job.isUrgent && <Badge variant="destructive" className="text-xs">急招</Badge>}
                            {job.isRecommended && <Badge variant="secondary" className="text-xs">推荐</Badge>}
                          </div>
                          <p className="text-muted-foreground mb-2">{job.partnerName}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {JOB_TYPE_LABELS[job.type]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              招 {job.headcount} 人
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {job.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {job.salaryMin && job.salaryMax 
                            ? `${job.salaryMin/1000}-${job.salaryMax/1000}K` 
                            : '面议'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {job.education} | {job.experience}
                        </p>
                        <div className="flex items-center justify-end gap-4 mt-3 text-xs text-muted-foreground">
                          <span>{job.viewCount} 次浏览</span>
                          <span>{job.applicationCount} 人投递</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
