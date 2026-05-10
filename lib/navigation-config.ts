import type { PlatformNavigationConfig } from "@/platform-navigation-shell"

export const brandNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "产业联盟与人资品牌服务平台",
  currentPlatformId: "brand",
  currentPlatformLabel: "产教融合管理平台",
  brandHref: "/admin",
  brandIcon: "settings",
  platformIcon: "settings",
  sideBackHref: "/admin",
  currentUserName: "管理员",
  currentUserRoleLabel: "产教融合管理平台",
  showCurrentTime: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: "/admin", icon: "home", matchers: ["/admin"] },
    { id: "workspace", label: "我的服务台", href: "/admin", icon: "briefcase", matchers: ["/admin/workspace"] },
    { id: "apps", label: "应用服务中心", href: "/admin", icon: "layoutGrid", matchers: ["/admin/apps"] },
  ],
  sideNavItems: [
    { id: "overview", label: "仪表盘", href: "/admin", icon: "barChart3", matchers: ["/admin"] },
    { id: "school", label: "学校信息", href: "/admin/school", icon: "graduationCap", matchers: ["/admin/school"] },
    { id: "partners", label: "合作主体", href: "/admin/partners", icon: "folderKanban", matchers: ["/admin/partners"] },
    { id: "agreements", label: "合作协议", href: "/admin/agreements", icon: "fileText", matchers: ["/admin/agreements"] },
    { id: "projects", label: "合作项目", href: "/admin/projects", icon: "folderKanban", matchers: ["/admin/projects"] },
    { id: "experts", label: "专家资源库", href: "/admin/experts", icon: "user", matchers: ["/admin/experts"] },
    { id: "achievements", label: "合作成果", href: "/admin/achievements", icon: "badgeCheck", matchers: ["/admin/achievements"] },
    { id: "activities", label: "联盟活动", href: "/admin/activities", icon: "calendar", matchers: ["/admin/activities"] },
    { id: "ratings", label: "合作评级", href: "/admin/ratings", icon: "badgeCheck", matchers: ["/admin/ratings"] },
    { id: "cooperation-types", label: "合作类型", href: "/admin/cooperation-types", icon: "bookOpen", matchers: ["/admin/cooperation-types"] },
    { id: "brands", label: "品牌运营", href: "/admin/brands", icon: "share2", matchers: ["/admin/brands"], children: [
      { id: "brand-overview", label: "品牌概览", href: "/admin/brands", matchers: ["/admin/brands"] },
      { id: "brand-topics", label: "专题页管理", href: "/admin/brands/topics", matchers: ["/admin/brands/topics"] },
    ]},
    { id: "employment", label: "就业服务", href: "/admin/employment", icon: "briefcase", matchers: ["/admin/employment"], children: [
      { id: "employment-overview", label: "就业概览", href: "/admin/employment", matchers: ["/admin/employment"] },
      { id: "employment-projects", label: "就业项目", href: "/admin/employment/projects", matchers: ["/admin/employment/projects"] },
      { id: "employment-jobs", label: "岗位管理", href: "/admin/employment/jobs", matchers: ["/admin/employment/jobs"] },
      { id: "employment-applications", label: "投递管理", href: "/admin/employment/applications", matchers: ["/admin/employment/applications"] },
    ]},
  ],
}
