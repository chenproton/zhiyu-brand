'use client'

import { useState } from 'react'
import { AchievementManager } from '../../projects/_components/achievement-manager'

interface AchievementItem {
  id: string
  name: string
  type: string
  description: string
  createdAt: Date
}

export function EnterpriseAchievementActions() {
  const [items, setItems] = useState<AchievementItem[]>([])

  return (
    <AchievementManager
      items={items}
      onChange={setItems}
    />
  )
}
