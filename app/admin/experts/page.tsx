'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FilterBar } from '@/components/shared/filter-bar'
import { ExpertRatingBadge } from '@/components/shared/status-badge'
import { Plus, Users, Mail, Phone, Building2, User } from 'lucide-react'
import { experts } from '@/lib/mock-data'
import { EXPERT_RATING_LABELS, EXPERT_FIELDS, EXPERT_ROLES } from '@/lib/types'

export default function ExpertsListPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({
    rating: 'all',
    field: 'all',
    role: 'all',
    affiliation: 'all',
  })

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          expert.name.toLowerCase().includes(searchLower) ||
          expert.title.toLowerCase().includes(searchLower) ||
          expert.field.toLowerCase().includes(searchLower) ||
          (expert.partnerName && expert.partnerName.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      if (filters.rating !== 'all' && expert.rating !== filters.rating) return false
      if (filters.field !== 'all' && expert.field !== filters.field) return false
      if (filters.role !== 'all' && !expert.roles.includes(filters.role)) return false
      if (filters.affiliation !== 'all') {
        const hasPartner = !!expert.partnerId
        if (filters.affiliation === 'enterprise' && !hasPartner) return false
        if (filters.affiliation === 'independent' && hasPartner) return false
      }

      return true
    })
  }, [search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setSearch('')
    setFilters({
      rating: 'all',
      field: 'all',
      role: 'all',
      affiliation: 'all',
    })
  }

  const filterConfigs = [
    {
      key: 'rating',
      label: '全部评级',
      options: Object.entries(EXPERT_RATING_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      key: 'field',
      label: '全部领域',
      options: EXPERT_FIELDS.map((field) => ({ value: field, label: field })),
    },
    {
      key: 'role',
      label: '全部角色',
      options: EXPERT_ROLES.map((role) => ({ value: role, label: role })),
    },
    {
      key: 'affiliation',
      label: '全部来源',
      options: [
        { value: 'enterprise', label: '企业内专家' },
        { value: 'independent', label: '独立专家' },
      ],
    },
  ]

  const enterpriseExperts = experts.filter(e => !!e.partnerId).length
  const independentExperts = experts.filter(e => !e.partnerId).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            共 {filteredExperts.length} 位专家（企业内 {enterpriseExperts} / 独立 {independentExperts}）
          </p>
        </div>
        <Link href="/admin/experts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新增专家
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <FilterBar
            searchPlaceholder="搜索专家姓名、职称、领域、单位..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={filterConfigs}
            filterValues={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/admin/experts/${expert.id}`}
                        className="font-medium hover:underline truncate"
                      >
                        {expert.name}
                      </Link>
                      <ExpertRatingBadge rating={expert.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {expert.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {expert.field} · {expert.experience}年经验
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {expert.roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>

                {expert.partnerName ? (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <Link
                      href={`/admin/partners/${expert.partnerId}`}
                      className="hover:underline truncate"
                    >
                      {expert.partnerName}
                    </Link>
                    <Badge variant="secondary" className="text-xs ml-auto">企业内</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>独立专家</span>
                    <Badge variant="outline" className="text-xs ml-auto">独立</Badge>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  {expert.contactEmail && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{expert.contactEmail}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>暂无符合条件的专家</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
