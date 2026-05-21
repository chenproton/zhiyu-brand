"use client"

import { usePathname } from "next/navigation"
import { PlatformShell } from "@/components/platform-shell"
import { publicNavigationConfig } from "@/lib/navigation-config"
import { SiteFooter } from "@/components/public/site-footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLandingPage = pathname?.startsWith("/landingpage")

  return (
    <PlatformShell config={publicNavigationConfig}>
      {children}
      {!isLandingPage && <SiteFooter />}
    </PlatformShell>
  )
}
