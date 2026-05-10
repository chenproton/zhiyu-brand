'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, ExternalLink, User, Settings, LogOut } from 'lucide-react'
import { schoolInfo } from '@/lib/mock-data'

interface AdminHeaderProps {
  title?: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div>
        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
      </div>
      
      <div className="flex items-center gap-4">
        {/* View Frontend */}
        <Link href="/partners" target="_blank">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            前台预览
          </Button>
        </Link>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-900 text-white text-xs">
                  管理
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">管理员</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{schoolInfo.shortName}</p>
              <p className="text-xs text-muted-foreground">admin@hdvtc.edu.cn</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              个人信息
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              系统设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
