'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type IconComponent = LucideIcon | React.ComponentType<{ className?: string }>

export interface StatsCardItem {
  key: string
  label: string
  value: number
  icon?: IconComponent
  color?: 'slate' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'indigo'
}

interface AdminStatsCardsProps {
  items: StatsCardItem[]
  columns?: number
}

const colorMap = {
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  indigo: 'bg-indigo-100 text-indigo-600',
}

export function AdminStatsCards({
  items,
  columns = 4,
}: AdminStatsCardsProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-2 lg:grid-cols-6',
  }

  return (
    <div className={cn('grid gap-4 mb-6', gridCols[columns as keyof typeof gridCols] || gridCols[4])}>
      {items.map((item) => (
        <Card key={item.key} className="transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
              {item.icon && (
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', colorMap[item.color || 'slate'])}>
                  <item.icon className="h-5 w-5" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
