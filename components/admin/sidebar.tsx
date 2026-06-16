'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  FolderKanban,
  Award,
  Calendar,
  Star,
  School,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navigation = [
  {
    name: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: '学校信息',
    href: '/admin/school',
    icon: School,
  },
  {
    name: '合作主体',
    href: '/admin/partners',
    icon: Building2,
  },
  {
    name: '合作协议',
    href: '/admin/agreements',
    icon: FileText,
  },
  {
    name: '合作项目',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    name: '专家资源库',
    href: '/admin/experts',
    icon: Users,
  },
  {
    name: '合作成果',
    href: '/admin/achievements',
    icon: Award,
  },
  {
    name: '联盟活动',
    href: '/admin/activities',
    icon: Calendar,
  },
  {
    name: '合作评级',
    href: '/admin/ratings',
    icon: Star,
  },
  {
    name: '就业供需',
    href: '/admin/employment',
    icon: Briefcase,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col bg-white border-r h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">产教融合运营</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mx-auto">
            <Building2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>收起菜单</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
