'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  count?: number
  countLabel?: string
  actions?: ReactNode
  backHref?: string
}

export function AdminPageHeader({
  title,
  subtitle,
  count,
  countLabel = '条',
  actions,
  backHref,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="mt-0.5">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          {count !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              共 {count} {countLabel}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
