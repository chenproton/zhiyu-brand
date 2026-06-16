'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface ItemPublicDisplaySwitchProps {
  defaultChecked?: boolean
  onChange?: (value: boolean) => void
}

export function ItemPublicDisplaySwitch({ defaultChecked = false, onChange }: ItemPublicDisplaySwitchProps) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value)
          onChange?.(value)
        }}
      />
      <span className={`text-sm ${checked ? 'text-green-600' : 'text-gray-400'}`}>
        {checked ? '展示' : '隐藏'}
      </span>
    </div>
  )
}
