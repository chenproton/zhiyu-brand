"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Building2, FolderKanban, Users, Trophy, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "首页", href: "/" },
  { 
    name: "产教融合", 
    href: "/partners",
    children: [
      { name: "合作主体墙", href: "/partners" },
      { name: "合作项目墙", href: "/projects" },
      { name: "专家资源库", href: "/experts" },
      { name: "成果展示", href: "/achievements" },
      { name: "活动资讯", href: "/activities" },
    ]
  },
  { 
    name: "品牌展示", 
    href: "/brands",
    children: [
      { name: "人才品牌", href: "/brands/talent" },
      { name: "合作主体品牌", href: "/brands/partner" },
      { name: "岗位品牌", href: "/brands/job" },
      { name: "专业品牌", href: "/brands/major" },
      { name: "师资品牌", href: "/brands/teacher" },
      { name: "文化思政", href: "/brands/culture" },
    ]
  },
  { name: "岗位大厅", href: "/jobs" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">产教融合服务平台</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            item.children ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "gap-1",
                      pathname.startsWith(item.href) && "bg-accent"
                    )}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href}>{child.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className={cn(
                  pathname === item.href && "bg-accent"
                )}
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            )
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">管理后台</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            {navigation.map((item) => (
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    {item.name}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block px-6 py-2 text-sm rounded-md hover:bg-accent",
                        pathname === child.href && "bg-accent"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm rounded-md hover:bg-accent",
                    pathname === item.href && "bg-accent"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            <div className="pt-2 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin">管理后台</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
