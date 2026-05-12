'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Briefcase, Sparkles, Building2, LogOut } from 'lucide-react'
import { enterprises } from '@/lib/mock-data'
import { PartnerProvider, usePartner } from './partner-context'

function PartnerLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, selectedEnterpriseId, selectEnterprise, logout } = usePartner()

  useEffect(() => {
    if (!isLoggedIn && pathname !== '/partner/login') {
      router.replace('/partner/login')
    }
  }, [isLoggedIn, pathname, router])

  const handleLogout = () => {
    logout()
    router.replace('/partner/login')
  }

  if (pathname === '/partner/login' || pathname === '/partner/select-enterprise') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex">
      {/* 侧边栏 */}
      <aside className="w-56 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">企业门户</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/partner/jobs"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === '/partner/jobs'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            岗位管理
          </Link>
          <Link
            href="/partner/recommendations"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === '/partner/recommendations'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            就业推荐
          </Link>
        </nav>
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-14 border-b flex items-center justify-between px-6 bg-background">
          <div className="text-sm text-muted-foreground">
            当前企业
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedEnterpriseId} onValueChange={selectEnterprise}>
              <SelectTrigger className="w-[260px]">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="请选择企业" />
              </SelectTrigger>
              <SelectContent>
                {enterprises.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-6 overflow-auto">
          {!selectedEnterpriseId ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="text-lg font-medium">请先选择企业</h2>
                <p className="text-sm text-muted-foreground">
                  在右上角选择您所属的企业后，即可查看对应数据
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PartnerProvider>
      <PartnerLayoutInner>{children}</PartnerLayoutInner>
    </PartnerProvider>
  )
}
