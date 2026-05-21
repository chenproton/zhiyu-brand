import { PlatformShell } from "@/components/platform-shell"
import { brandNavigationConfig } from "@/lib/navigation-config"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PlatformShell config={brandNavigationConfig}>
      {children}
    </PlatformShell>
  )
}
