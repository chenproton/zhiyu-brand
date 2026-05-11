'use client'

import CooperationTypeManager from '@/components/admin/cooperation-type-manager'

export default function CooperationTypesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">合作类型管理</h1>
        <p className="text-muted-foreground">维护平台合作类型字典与分类体系</p>
      </div>
      <CooperationTypeManager />
    </div>
  )
}
