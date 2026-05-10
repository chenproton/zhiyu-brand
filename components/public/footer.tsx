import Link from "next/link"
import { Building2 } from "lucide-react"

const footerLinks = {
  platform: [
    { name: "合作主体", href: "/partners" },
    { name: "合作项目", href: "/projects" },
    { name: "专家资源库", href: "/experts" },
    { name: "成果展示", href: "/achievements" },
    { name: "活动资讯", href: "/activities" },
  ],
  about: [
    { name: "平台介绍", href: "/about" },
    { name: "联系我们", href: "/contact" },
    { name: "使用帮助", href: "/help" },
    { name: "隐私政策", href: "/privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg">产教融合服务平台</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              搭建产业与教育深度融合的桥梁，促进学校、企业、行业协会、产业园区等多元主体协同合作，共同培养适应产业发展需求的高素质人才。
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-medium mb-4">平台导航</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-medium mb-4">关于我们</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} 产教融合服务平台. 保留所有权利.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">服务条款</Link>
              <Link href="/privacy" className="hover:text-foreground">隐私政策</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
