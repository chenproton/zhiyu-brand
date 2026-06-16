'use client'

import { AdminPageHeader } from '@/components/admin/page-header'
import CooperationTypeManager from '@/components/admin/cooperation-type-manager'

export default function CooperationTypesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="合作类型管理"
        subtitle="维护平台合作类型字典与分类体系"
      />
      <CooperationTypeManager />
    </div>
  )
}
