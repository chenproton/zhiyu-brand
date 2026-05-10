import Link from "next/link"
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
