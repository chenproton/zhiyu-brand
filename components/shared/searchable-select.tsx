'use client'

import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  multiple?: boolean
  className?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = '请选择',
  searchPlaceholder = '搜索...',
  multiple = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedValues = React.useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : []
    return value ? [value as string] : []
  }, [value, multiple])
  const selectedSet = React.useMemo(
    () => new Set(selectedValues),
    [selectedValues]
  )

  const toggle = (val: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : []
      if (arr.includes(val)) {
        onChange(arr.filter((v) => v !== val))
      } else {
        onChange([...arr, val])
      }
    } else {
      onChange(val)
      setOpen(false)
    }
  }

  const remove = (val: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : []
      onChange(arr.filter((v) => v !== val))
    } else {
      onChange('')
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="truncate">{placeholder}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>未找到匹配项</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedSet.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggle(option.value)}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((val) => {
            const label = options.find((o) => o.value === val)?.label || val
            return (
              <Badge key={val} variant="secondary" className="gap-1">
                {label}
                <button
                  type="button"
                  onClick={() => remove(val)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
