'use client'

import { AdminPageHeader } from '@/components/admin/page-header'
import CooperationRatingManager from '@/components/admin/cooperation-rating-manager'

export default function RatingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="合作评级管理"
        subtitle="维护合作深度评级的字典定义，评级与企业关联在企业档案中管理"
      />
      <CooperationRatingManager />
    </div>
  )
}
