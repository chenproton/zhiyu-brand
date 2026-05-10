"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Heart, Eye, Calendar, BookOpen, Trophy, PartyPopper } from "lucide-react"
import { cultureBrands } from "@/lib/mock-data"
import { CULTURE_TYPE_LABELS } from "@/lib/types"
import type { CultureBrand } from "@/lib/types"

export default function CultureBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredCultures = cultureBrands.filter((culture) => {
    const matchesSearch = culture.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || culture.type === typeFilter
    return matchesSearch && matchesType && culture.status === "published"
  })

  const getTypeIcon = (type: CultureBrand["type"]) => {
    switch (type) {
      case "case":
        return BookOpen
      case "resource":
        return Heart
      case "activity":
        return PartyPopper
      case "award":
        return Trophy
      default:
        return Heart
    }
  }

  const getTypeColor = (type: CultureBrand["type"]) => {
    switch (type) {
      case "case":
        return "bg-blue-100 text-blue-700"
      case "resource":
        return "bg-emerald-100 text-emerald-700"
      case "activity":
        return "bg-amber-100 text-amber-700"
      case "award":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              文化思政品牌
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              校园文化与思政教育
            </h1>
            <p className="text-muted-foreground">
              展示学校文化建设与思政教育的典型案例、优质资源和获奖成果
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="内容类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="case">典型案例</SelectItem>
              <SelectItem value="resource">思政资源</SelectItem>
              <SelectItem value="activity">文化活动</SelectItem>
              <SelectItem value="award">获奖成果</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCultures.map((culture) => {
            const TypeIcon = getTypeIcon(culture.type)
            return (
              <Card key={culture.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={culture.coverImage || "/placeholder.svg?height=200&width=300"}
                    alt={culture.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getTypeColor(culture.type)}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {CULTURE_TYPE_LABELS[culture.type]}
                    </Badge>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-2">{culture.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {culture.description}
                  </p>

                  {culture.relatedMajor && (
                    <Badge variant="outline" className="mb-4">
                      {culture.relatedMajor}
                    </Badge>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{culture.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{culture.updatedAt.toLocaleDateString("zh-CN")}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredCultures.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无符合条件的内容</p>
          </div>
        )}
      </section>
    </div>
  )
}
