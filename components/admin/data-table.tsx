'use client'

import { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DataTableColumn<T> {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render: (row: T, index: number) => ReactNode
}

interface AdminDataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string
  emptyText?: string
  emptyIcon?: ReactNode
}

export function AdminDataTable<T>({
  columns,
  data,
  rowKey,
  emptyText = '暂无数据',
  emptyIcon,
}: AdminDataTableProps<T>) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">序号</TableHead>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(col.width, col.align === 'right' && 'text-right')}
              >
                {col.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={rowKey(row)} className="group">
                <TableCell className="text-center">{index + 1}</TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(col.align === 'right' && 'text-right relative')}
                  >
                    {col.render(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            )))
            : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-12 text-muted-foreground"
                >
                  {emptyIcon && <div className="mb-3 opacity-50 flex justify-center">{emptyIcon}</div>}
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </Card>
  )
}
