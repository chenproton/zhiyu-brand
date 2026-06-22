import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-white transition-colors">返回首页</Link>
          <span className="hover:text-white cursor-pointer transition-colors">关于平台</span>
          <span className="hover:text-white cursor-pointer transition-colors">使用帮助</span>
        </div>
        <span className="hidden sm:inline">杭州知与未来科技有限公司 · 浙ICP xxxxxxxx</span>
      </div>
    </footer>
  )
}
