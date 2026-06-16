'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TableRowActionsProps {
  children: ReactNode
  className?: string
}

export function TableRowActions({ children, className }: TableRowActionsProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
        'absolute right-0 top-1/2 -translate-y-1/2',
        'bg-white/95 backdrop-blur-sm z-10 px-2 py-1 rounded-lg shadow-sm border border-slate-100',
        className
      )}
    >
      {children}
    </div>
  )
}
