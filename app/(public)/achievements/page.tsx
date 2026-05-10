"use client"

import { useState, useMemo } from "react"
import { Search, Filter, FileText, Award, BookOpen, Lightbulb, FileCheck, GraduationCap, Calendar, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { achievements } from "@/lib/mock-data"
import { ACHIEVEMENT_TYPE_LABELS, type AchievementType } from "@/lib/types"

const typeIcons: Record<AchievementType, React.ReactNode> = {
  "joint-build": <Building2 className="h-4 w-4" />,
  "training-base": <GraduationCap className="h-4 w-4" />,
  "education-reform": <BookOpen className="h-4 w-4" />,
  "case-study": <FileText className="h-4 w-4" />,
  patent: <FileCheck className="h-4 w-4" />,
  award: <Award className="h-4 w-4" />,
}

const typeColors: Record<AchievementType, string> = {
  "joint-build": "bg-blue-100 text-blue-800 border-blue-200",
  "training-base": "bg-green-100 text-green-800 border-green-200",
  "education-reform": "bg-purple-100 text-purple-800 border-purple-200",
  "case-study": "bg-orange-100 text-orange-800 border-orange-200",
  patent: "bg-cyan-100 text-cyan-800 border-cyan-200",
  award: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  const publishedAchievements = achievements.filter(a => a.status === "published")

  const filteredAchievements = useMemo(() => {
    return publishedAchievements.filter((achievement) => {
      const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.partnerName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === "all" || achievement.type === selectedType
      return matchesSearch && matchesType
    })
  }, [searchTerm, selectedType, publishedAchievements])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: publishedAchievements.length }
    Object.keys(ACHIEVEMENT_TYPE_LABELS).forEach(type => {
      counts[type] = publishedAchievements.filter(a => a.type === type).length
    })
    return counts
  }, [publishedAchievements])

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">成果展示</h1>
          <p className="text-muted-foreground">
            展示产教融合取得的各类成果
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(ACHIEVEMENT_TYPE_LABELS).map(([type, label]) => (
            <Card key={type} className="text-center">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg mb-2 ${typeColors[type as AchievementType]}`}>
                  {typeIcons[type as AchievementType]}
                </div>
                <div className="text-2xl font-bold">{typeCounts[type] || 0}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索成果名称、描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="flex-wrap h-auto p-1">
              <TabsTrigger value="all">
                全部
                <Badge variant="secondary" className="ml-1 text-xs">{typeCounts.all}</Badge>
              </TabsTrigger>
              {Object.entries(ACHIEVEMENT_TYPE_LABELS).map(([type, label]) => (
                <TabsTrigger key={type} value={type} className="gap-1">
                  {typeIcons[type as AchievementType]}
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{filteredAchievements.length}</span> 项成果
          </p>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无符合条件的成果</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedType("all") }}>
              清除筛选条件
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <Card key={achievement.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`gap-1 ${typeColors[achievement.type]}`}
                    >
                      {typeIcons[achievement.type]}
                      {ACHIEVEMENT_TYPE_LABELS[achievement.type]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {achievement.publishDate.toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{achievement.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {achievement.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {achievement.description}
                    </p>
                  )}
                  {achievement.partnerName && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="line-clamp-1">{achievement.partnerName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
