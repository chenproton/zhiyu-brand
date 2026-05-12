'use client'

import { Button } from '@/components/ui/button'

export function AchievementViewButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => alert('跳转到对应系统中查看')}>
      查看详情
    </Button>
  )
}
