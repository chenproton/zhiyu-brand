"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Building2, MapPin, Users, Briefcase, ArrowRight } from "lucide-react"
import { partners } from "@/lib/mock-data"
import { PARTNER_TYPE_LABELS, COOPERATION_RATING_LABELS, INDUSTRIES } from "@/lib/types"

export default function PartnerBrandPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || partner.type === typeFilter
    const matchesIndustry = industryFilter === "all" || partner.industry === industryFilter
    const matchesRating = ratingFilter === "all" || partner.rating === ratingFilter
    return matchesSearch && matchesType && matchesIndustry && matchesRating && partner.status === "active"
  })

  const strategicPartners = filteredPartners.filter(p => p.rating === "strategic")
  const deepPartners = filteredPartners.filter(p => p.rating === "deep")
  const generalPartners = filteredPartners.filter(p => p.rating === "general")

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "strategic":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "deep":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              合作主体品牌
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              合作主体品牌墙
            </h1>
            <p className="text-muted-foreground">
              展示与学校建立合作关系的企业、行业协会、产业园区、机构等合作伙伴
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
              placeholder="搜索主体名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="主体类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="enterprise">企业</SelectItem>
              <SelectItem value="association">行业协会</SelectItem>
              <SelectItem value="park">产业园区</SelectItem>
              <SelectItem value="institution">机构</SelectItem>
            </SelectContent>
          </Select>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[140px]">
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
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="合作深度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="strategic">战略合作</SelectItem>
              <SelectItem value="deep">深度合作</SelectItem>
              <SelectItem value="general">一般合作</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strategic Partners */}
        {strategicPartners.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-amber-500 rounded" />
              <h2 className="text-xl font-semibold">战略合作伙伴</h2>
              <Badge className="bg-amber-100 text-amber-700">{strategicPartners.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategicPartners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 rounded-lg">
                        <AvatarImage src={partner.logo} className="object-cover" />
                        <AvatarFallback className="rounded-lg">
                          <Building2 className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{partner.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {PARTNER_TYPE_LABELS[partner.type]}
                              </Badge>
                              <Badge className={getRatingColor(partner.rating)}>
                                {COOPERATION_RATING_LABELS[partner.rating]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                      {partner.description}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{partner.region}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{partner.industry}</span>
                      </div>
                      {partner.employeeCount && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{partner.employeeCount}人</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4">
                      {partner.cooperationTypes.slice(0, 4).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/partners/${partner.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          查看详情
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Deep Partners */}
        {deepPartners.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-blue-500 rounded" />
              <h2 className="text-xl font-semibold">深度合作伙伴</h2>
              <Badge className="bg-blue-100 text-blue-700">{deepPartners.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deepPartners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12 rounded-lg">
                        <AvatarImage src={partner.logo} className="object-cover" />
                        <AvatarFallback className="rounded-lg">
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {PARTNER_TYPE_LABELS[partner.type]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {partner.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{partner.region}</span>
                      <span>|</span>
                      <span>{partner.industry}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* General Partners */}
        {generalPartners.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gray-400 rounded" />
              <h2 className="text-xl font-semibold">合作伙伴</h2>
              <Badge variant="secondary">{generalPartners.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generalPartners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={partner.logo} className="object-cover" />
                        <AvatarFallback className="rounded-lg text-sm">
                          <Building2 className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{partner.name}</h3>
                        <p className="text-xs text-muted-foreground">{partner.industry}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无符合条件的合作主体</p>
          </div>
        )}
      </section>
    </div>
  )
}
