'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, X } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
}

interface AdminFilterBarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClearFilters?: () => void
  tabs?: FilterOption[]
  activeTab?: string
  onTabChange?: (value: string) => void
}

export function AdminFilterBar({
  searchPlaceholder = '搜索...',
  searchValue,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearFilters,
  tabs,
  activeTab,
  onTabChange,
}: AdminFilterBarProps) {
  const hasActiveFilters =
    searchValue ||
    Object.values(filterValues).some((v) => v && v !== 'all') ||
    (activeTab && activeTab !== '全部')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] || 'all'}
              onValueChange={(value) => onFilterChange?.(filter.key, value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {hasActiveFilters && onClearFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      </div>

      {tabs && tabs.length > 0 && onTabChange && (
        <Tabs value={activeTab || '全部'} onValueChange={onTabChange}>
          <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:shadow-none rounded-md px-3 py-1.5 text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
    </div>
  )
}
