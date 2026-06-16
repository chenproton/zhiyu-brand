"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderKanban, Sparkles, Briefcase } from "lucide-react"

const navGroups = [
  {
    title: "产教融合",
    icon: FolderKanban,
    links: [
      { label: "合作主体墙", href: "/partners" },
      { label: "合作项目墙", href: "/projects" },
      { label: "合作成果墙", href: "/achievements" },
      { label: "专家资源库", href: "/experts" },
      { label: "活动资讯", href: "/activities" },
    ],
  },
  {
    title: "品牌展示",
    icon: Sparkles,
    links: [
      { label: "人才品牌墙", href: "/brands/talent" },
      { label: "合作主体品牌墙", href: "/brands/partner" },
      { label: "岗位品牌墙", href: "/brands/job" },
      { label: "专业品牌墙", href: "/brands/major" },
      { label: "师资品牌墙", href: "/brands/teacher" },
      { label: "文化思政品牌墙", href: "/brands/culture" },
    ],
  },
  {
    title: "岗位大厅",
    icon: Briefcase,
    links: [
      { label: "岗位大厅", href: "/jobs" },
      { label: "优质毕业生推荐", href: "/brands/talent" },
    ],
  },
]

export function SiteFooter() {
  const pathname = usePathname()

  if (pathname === "/jobs/project/ep004") {
    return (
      <footer className="bg-slate-950 text-slate-500 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-200 block leading-tight">产教融合平台</span>
                <span className="text-xs text-slate-600">产业联盟与人资品牌服务平台</span>
              </div>
            </div>
            <p className="text-sm">© {new Date().getFullYear()} 产教融合平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t bg-muted/10 py-10">
      <div className="container mx-auto">
        <h3 className="text-sm font-semibold text-muted-foreground mb-5">快捷导航</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {navGroups.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.title}>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {group.title}
                </h4>
                <div className="space-y-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
