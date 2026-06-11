import { PlatformShell } from "@/platform-navigation-shell"
import { publicNavigationConfig } from "@/lib/navigation-config"
import { SiteFooter } from "@/components/public/site-footer"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={publicNavigationConfig}>
      {children}
      <SiteFooter />
    </PlatformShell>
  )
}
