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
import { Search, X } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
}

interface FilterBarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filters: FilterConfig[]
  filterValues: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  onClearFilters?: () => void
}

export function FilterBar({
  searchPlaceholder = '搜索...',
  searchValue,
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = searchValue || Object.values(filterValues).some(v => v && v !== 'all')

  return (
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
            onValueChange={(value) => onFilterChange(filter.key, value)}
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
  )
}
