'use client'

import * as React from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  className,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const isInitial = React.useRef(true)

  React.useEffect(() => {
    if (editorRef.current && isInitial.current) {
      editorRef.current.innerHTML = value
      isInitial.current = false
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const exec = (command: string, valueArg: string = '') => {
    document.execCommand(command, false, valueArg)
    editorRef.current?.focus()
    handleInput()
  }

  const addLink = () => {
    const url = prompt('请输入链接地址')
    if (url) exec('createLink', url)
  }

  const toolbar = [
    { icon: Bold, action: () => exec('bold'), title: '加粗' },
    { icon: Italic, action: () => exec('italic'), title: '斜体' },
    { icon: Underline, action: () => exec('underline'), title: '下划线' },
    { icon: List, action: () => exec('insertUnorderedList'), title: '无序列表' },
    { icon: ListOrdered, action: () => exec('insertOrderedList'), title: '有序列表' },
    { icon: Link, action: addLink, title: '插入链接' },
  ]

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        {toolbar.map((item, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={item.action}
            title={item.title}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[160px] p-3 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  )
}
