'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AdminPageHeader } from './page-header'
import { AdminStatsCards, type StatsCardItem } from './stats-cards'
import { AdminFilterBar, type FilterConfig } from './filter-bar'

interface FilterOption {
  value: string
  label: string
}

interface AdminListPageProps {
  title: string
  subtitle?: string
  count?: number
  countLabel?: string
  actions?: ReactNode
  backHref?: string
  stats?: StatsCardItem[]
  statsColumns?: number
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  activeFilters?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClearFilters?: () => void
  tabs?: FilterOption[]
  activeTab?: string
  onTabChange?: (value: string) => void
  children: ReactNode
}

export function AdminListPage({
  title,
  subtitle,
  count,
  countLabel,
  actions,
  backHref,
  stats,
  statsColumns,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
  filterValues,
  activeFilters,
  onFilterChange,
  onClearFilters,
  tabs,
  activeTab,
  onTabChange,
  children,
}: AdminListPageProps) {
  return (
    <div>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        count={count}
        countLabel={countLabel}
        actions={actions}
        backHref={backHref}
      />

      {stats && stats.length > 0 && (
        <AdminStatsCards items={stats} columns={statsColumns} />
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <AdminFilterBar
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            filters={filters}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </CardContent>
      </Card>

      {children}
    </div>
  )
}
