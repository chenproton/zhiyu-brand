"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Briefcase, GraduationCap, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { experts } from "@/lib/mock-data"

export default function ExpertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = typeFilter === "all" || expert.expertType === typeFilter
      return matchesSearch && matchesType
    })
  }, [searchTerm, typeFilter])

  // Get all unique expert types
  const allTypes = [...new Set(experts.map(e => e.expertType).filter(Boolean))] as string[]

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">专家资源库</h1>
          <p className="text-muted-foreground">
            汇聚各领域的行业专家和学术带头人
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索专家姓名、职称、研究领域..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="专业领域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部领域</SelectItem>
              {allTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{filteredExperts.length}</span> 位专家
          </p>
        </div>

        {/* Experts Grid */}
        {filteredExperts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无符合条件的专家</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setTypeFilter("all") }}>
              清除筛选条件
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperts.map((expert) => (
              <Link key={expert.id} href={`/experts/${expert.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader className="text-center pb-2">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarFallback className="text-xl bg-muted">
                        {expert.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {expert.name}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {expert.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                      <GraduationCap className="h-3 w-3" />
                      {expert.partnerName || expert.title}
                    </div>
                    {expert.expertType && (
                      <Badge variant="outline" className="mb-3">
                        {expert.expertType}
                      </Badge>
                    )}
                    {expert.specialties && expert.specialties.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {expert.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
