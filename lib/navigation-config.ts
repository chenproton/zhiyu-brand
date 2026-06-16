import type { PlatformNavigationConfig } from "@/platform-navigation-shell"
import { SECONDARY_COLLEGES } from "@/lib/types"

const externalPortalUrl = "http://111.170.170.202:3001/portal"
const externalWorkspaceUrl = "http://111.170.170.202:3001/portal/workspace"
const externalAppsUrl = "http://111.170.170.202:3001/portal/apps"

export const publicNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "产业联盟与人资品牌服务平台",
  currentPlatformId: "public",
  currentPlatformLabel: "门户首页",
  brandHref: "/",
  brandIcon: "settings",
  platformIcon: "settings",
  sideBackHref: "/",
  showCurrentTime: true,
  showUserMenu: false,
  hideSideNav: true,
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [],
  shellClassName: "bg-background",
  mainClassName: "min-w-0 flex-1",
  contentClassName: "p-0",
  showCollegeFilter: true,
  collegeOptions: SECONDARY_COLLEGES,
  enterpriseLoginHref: "/partner/login",
}

export const brandNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "产业联盟与人资品牌服务平台",
  currentPlatformId: "brand",
  currentPlatformLabel: "产教融合管理平台",
  brandHref: "/admin/enterprises",
  brandIcon: "settings",
  platformIcon: "settings",
  sideBackHref: "/admin/enterprises",
  currentUserName: "管理员",
  currentUserRoleLabel: "产教融合管理平台",
  showCurrentTime: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: externalPortalUrl, icon: "home" },
    { id: "workspace", label: "我的服务台", href: externalWorkspaceUrl, icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: externalAppsUrl, icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "cooperation",
      label: "产教融合管理",
      icon: "folderKanban",
      children: [
        { id: "school", label: "学校信息", href: "/admin/school", matchers: ["/admin/school"] },
        { id: "enterprises", label: "合作企业", href: "/admin/enterprises", matchers: ["/admin/enterprises"] },
        { id: "projects", label: "合作项目", href: "/admin/projects", matchers: ["/admin/projects"] },
        { id: "achievements", label: "合作成果", href: "/admin/achievements", matchers: ["/admin/achievements"] },
        { id: "experts", label: "专家资源库", href: "/admin/experts", matchers: ["/admin/experts"] },
        { id: "permissions", label: "合作权限", href: "/admin/permissions", matchers: ["/admin/permissions"] },
      ],
    },
    {
      id: "brand",
      label: "品牌运营管理",
      icon: "share2",
      children: [
        { id: "brand-talent", label: "人才品牌管理", href: "/admin/brands/talent", matchers: ["/admin/brands/talent"] },
        { id: "brand-partner", label: "雇主品牌管理", href: "/admin/brands/partner", matchers: ["/admin/brands/partner"] },
        { id: "brand-job", label: "岗位品牌管理", href: "/admin/brands/job", matchers: ["/admin/brands/job"] },
        { id: "brand-major", label: "专业品牌管理", href: "/admin/brands/major", matchers: ["/admin/brands/major"] },
        { id: "brand-teacher", label: "师资品牌管理", href: "/admin/brands/teacher", matchers: ["/admin/brands/teacher"] },
        { id: "brand-culture", label: "文化思政品牌管理", href: "/admin/brands/culture", matchers: ["/admin/brands/culture"] },
      ],
    },
    {
      id: "employment",
      label: "就业服务管理",
      icon: "briefcase",
      children: [
        { id: "employment-projects", label: "就业项目", href: "/admin/employment/projects", matchers: ["/admin/employment/projects"] },
      ],
    },
  ],
}
