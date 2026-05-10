"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Building2, Factory, Users2, MapPin, UserCircle, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { partners } from "@/lib/mock-data"
import { PARTNER_TYPE_LABELS, type PartnerType } from "@/lib/types"

const typeIcons: Record<PartnerType, React.ReactNode> = {
  enterprise: <Factory className="h-4 w-4" />,
  association: <Users2 className="h-4 w-4" />,
  park: <MapPin className="h-4 w-4" />,
  institution: <Building2 className="h-4 w-4" />,
  expert: <UserCircle className="h-4 w-4" />,
}

const typeColors: Record<PartnerType, string> = {
  enterprise: "bg-green-100 text-green-800 border-green-200",
  association: "bg-purple-100 text-purple-800 border-purple-200",
  park: "bg-orange-100 text-orange-800 border-orange-200",
  institution: "bg-blue-100 text-blue-800 border-blue-200",
  expert: "bg-cyan-100 text-cyan-800 border-cyan-200",
}

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === "all" || partner.type === selectedType
      const isActive = partner.status === "active"
      return matchesSearch && matchesType && isActive
    })
  }, [searchTerm, selectedType])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: partners.filter(p => p.status === "active").length }
    Object.keys(PARTNER_TYPE_LABELS).forEach(type => {
      counts[type] = partners.filter(p => p.type === type && p.status === "active").length
    })
    return counts
  }, [])

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">合作主体</h1>
          <p className="text-muted-foreground">
            浏览和了解产教融合平台上的各类合作主体
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索主体名称、标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="flex-wrap h-auto p-1">
              <TabsTrigger value="all" className="gap-1">
                全部
                <Badge variant="secondary" className="ml-1 text-xs">{typeCounts.all}</Badge>
              </TabsTrigger>
              {Object.entries(PARTNER_TYPE_LABELS).map(([type, label]) => (
                <TabsTrigger key={type} value={type} className="gap-1">
                  {typeIcons[type as PartnerType]}
                  <span className="hidden sm:inline">{label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">{typeCounts[type]}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{filteredPartners.length}</span> 个合作主体
          </p>
        </div>

        {/* Partners Grid */}
        {filteredPartners.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无符合条件的合作主体</p>
            </div>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedType("all") }}>
              清除筛选条件
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPartners.map((partner) => (
              <Link key={partner.id} href={`/partners/${partner.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {partner.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1">
                          {partner.industry}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`shrink-0 ${typeColors[partner.type]}`}
                      >
                        {typeIcons[partner.type]}
                        <span className="ml-1">{PARTNER_TYPE_LABELS[partner.type]}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {partner.description || "暂无简介"}
                    </p>
                    {partner.cooperationTypes && partner.cooperationTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {partner.cooperationTypes.slice(0, 3).map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                        {partner.cooperationTypes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{partner.cooperationTypes.length - 3}
                          </Badge>
                        )}
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
