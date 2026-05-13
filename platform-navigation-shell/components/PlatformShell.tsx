"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Building2 } from "lucide-react"
import type { PlatformNavigationConfig, SideNavItem, TopNavItem, UserMenuItem } from "../lib/config"
import { resolvePlatformIcon } from "../lib/icons"
import { cn, matchesPath } from "../lib/utils"

function isTopItemActive(pathname: string, item: TopNavItem) {
  return matchesPath(pathname, item.href, item.matchers)
}

function isSideItemActive(pathname: string, item: SideNavItem) {
  if (item.children?.length) {
    return item.children.some((child) => matchesPath(pathname, child.href, child.matchers))
  }
  return matchesPath(pathname, item.href, item.matchers)
}

const fallbackUserMenuItems: UserMenuItem[] = [
  { id: "profile", label: "个人中心", icon: "user" },
  { id: "account", label: "账号设置", icon: "settings" },
  { id: "logout", label: "退出登录", tone: "danger" },
]

export function PlatformTopNav({ config }: { config: PlatformNavigationConfig }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [currentTime, setCurrentTime] = useState("")
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const BrandIcon = resolvePlatformIcon(config.brandIcon || "settings")
  const userMenuItems = config.userMenuItems ?? fallbackUserMenuItems

  const selectedCollege = searchParams.get("college") || "all"
  const handleCollegeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("college")
    } else {
      params.set("college", value)
    }
    window.history.pushState(null, "", `${pathname}${params.toString() ? `?${params}` : ""}`)
    window.dispatchEvent(new Event("popstate"))
  }

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      const weekDay = weekDays[now.getDay()]
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      setCurrentTime(`${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}`)
    }

    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href={config.brandHref || "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BrandIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-gray-800">{config.brandTitle}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {config.topNavItems.map((item) => {
            const Icon = resolvePlatformIcon(item.icon)
            const active = isTopItemActive(pathname, item)
            const itemClassName = cn(
              "relative flex items-center gap-1.5 rounded-md px-4 py-2 text-sm transition-colors",
              item.disabled
                ? "cursor-default text-gray-400"
                : active
                  ? "font-medium text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            )
            return item.disabled ? (
              <span key={item.id} className={itemClassName}>
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className={itemClassName}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active ? <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" /> : null}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {config.showCurrentTime !== false && mounted ? <div className="text-sm text-gray-400">{currentTime}</div> : null}

        {config.showUserMenu !== false ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {(config.currentUserName || "管理员").slice(0, 1)}
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-700">{config.currentUserName || "管理员"}</div>
                <div className="text-xs text-gray-400">
                  {config.currentUserRoleLabel || config.currentPlatformLabel}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {menuOpen && userMenuItems.length > 0 ? (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                {userMenuItems.map((item, index) => {
                  const Icon = item.icon ? resolvePlatformIcon(item.icon) : null
                  const itemClassName =
                    item.tone === "danger"
                      ? "flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                      : "flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"

                  return (
                    <div key={item.id}>
                      {index > 0 && item.tone === "danger" ? <div className="my-1 h-px bg-gray-100" /> : null}
                      {item.href ? (
                        <Link href={item.href} className={itemClassName}>
                          {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                          {item.label}
                        </Link>
                      ) : (
                        <button type="button" className={itemClassName}>
                          {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                          {item.label}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}

export function PlatformSideNav({ config }: { config: PlatformNavigationConfig }) {
  const pathname = usePathname()
  const defaultExpanded = useMemo(
    () =>
      config.defaultExpandedSideNavIds?.length
        ? config.defaultExpandedSideNavIds
        : config.sideNavItems.filter((item) => item.children?.length).map((item) => item.id),
    [config.defaultExpandedSideNavIds, config.sideNavItems]
  )
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded)
  const PlatformIcon = resolvePlatformIcon(config.platformIcon || "settings")

  useEffect(() => {
    const activeParents = config.sideNavItems
      .filter((item) => item.children?.some((child) => matchesPath(pathname, child.href, child.matchers)))
      .map((item) => item.id)

    setExpandedItems((prev) => Array.from(new Set([...defaultExpanded, ...activeParents, ...prev])))
  }, [config.sideNavItems, defaultExpanded, pathname])

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((entry) => entry !== itemId) : [...prev, itemId]
    )
  }

  return (
    <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <Link
            href={config.sideBackHref}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <PlatformIcon className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-gray-800">{config.currentPlatformLabel}</h2>
          </div>
        </div>
      </div>

      <nav className="p-3">
        {config.sideNavItems.map((item) => {
          const Icon = resolvePlatformIcon(item.icon)
          const hasChildren = Boolean(item.children?.length)
          const active = isSideItemActive(pathname, item)
          const isExpanded = expandedItems.includes(item.id)

          return (
            <div key={item.id} className="mb-1">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-primary/5 font-medium text-primary" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href || "/"}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-primary text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )}

              {hasChildren && isExpanded ? (
                <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                  {item.children?.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        matchesPath(pathname, child.href, child.matchers)
                          ? "bg-primary text-white font-medium"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function SubNavBar({ config }: { config: PlatformNavigationConfig }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedCollege, setSelectedCollege] = useState("all")

  useEffect(() => {
    const college = searchParams.get("college") || "all"
    setSelectedCollege(college)
  }, [searchParams])

  const handleCollegeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("college")
    } else {
      params.set("college", value)
    }
    window.history.pushState(null, "", `${pathname}${params.toString() ? `?${params}` : ""}`)
    window.dispatchEvent(new Event("popstate"))
  }

  if (!config.showCollegeFilter && !config.enterpriseLoginHref) return null

  return (
    <div className="fixed top-14 left-0 right-0 z-40 flex h-10 items-center justify-end gap-4 border-b border-gray-100 bg-white/95 px-6 backdrop-blur-sm">
      {config.showCollegeFilter && config.collegeOptions && config.collegeOptions.length > 0 && (
        <select
          value={selectedCollege}
          onChange={(e) => handleCollegeChange(e.target.value)}
          className="h-7 rounded-md border border-gray-200 bg-white px-2 pr-7 text-xs text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">全校</option>
          {config.collegeOptions.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
      )}

      {config.enterpriseLoginHref && (
        <Link
          href={config.enterpriseLoginHref}
          className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Building2 className="h-3.5 w-3.5" />
          企业登录
        </Link>
      )}
    </div>
  )
}

export function PlatformShell({
  config,
  children,
}: {
  config: PlatformNavigationConfig
  children: React.ReactNode
}) {
  const hasSubNav = config.showCollegeFilter || !!config.enterpriseLoginHref
  const topOffset = hasSubNav ? "pt-24" : "pt-14"

  return (
    <>
      <PlatformTopNav config={config} />
      {hasSubNav && <SubNavBar config={config} />}
      <div className={cn("flex min-h-screen bg-[#f5f7fa]", topOffset, config.shellClassName)}>
        {config.hideSideNav ? null : <PlatformSideNav config={config} />}
        <main className={cn("min-w-0 flex-1", config.mainClassName)}>
          <div className={cn("p-6", config.contentClassName)}>{children}</div>
        </main>
      </div>
    </>
  )
}
