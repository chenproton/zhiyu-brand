'use client'

import CooperationRatingManager from '@/components/admin/cooperation-rating-manager'

export default function RatingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">合作评级管理</h1>
        <p className="text-muted-foreground">维护合作深度评级的字典定义，评级与企业关联在企业档案中管理</p>
      </div>
      <CooperationRatingManager />
    </div>
  )
}
