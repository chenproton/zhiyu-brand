'use client'

import { useRef, useState } from 'react'
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Underline, Strikethrough, Image, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface FakeRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function FakeRichTextEditor({
  value,
  onChange,
  placeholder = '请输入内容...',
  className,
  minHeight = '160px',
}: FakeRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const exec = (command: string, valueArg: string | undefined = undefined) => {
    document.execCommand(command, false, valueArg)
    editorRef.current?.focus()
    updateActiveFormats()
  }

  const toggleFormat = (format: string) => {
    exec(format)
  }

  const updateActiveFormats = () => {
    const formats = new Set<string>()
    if (document.queryCommandState('bold')) formats.add('bold')
    if (document.queryCommandState('italic')) formats.add('italic')
    if (document.queryCommandState('underline')) formats.add('underline')
    if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough')
    if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList')
    if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList')
    if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft')
    if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter')
    if (document.queryCommandState('justifyRight')) formats.add('justifyRight')
    setActiveFormats(formats)
  }

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || '')
    updateActiveFormats()
  }

  const insertLink = () => {
    const url = window.prompt('请输入链接地址')
    if (url) {
      exec('createLink', url)
    }
  }

  const insertImage = () => {
    const url = window.prompt('请输入图片地址')
    if (url) {
      exec('insertImage', url)
    }
  }

  const ToolButton = ({
    active,
    onClick,
    children,
    title,
  }: {
    active?: boolean
    onClick: () => void
    children: React.ReactNode
    title?: string
  }) => (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="icon-sm"
      className="size-7"
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  )

  return (
    <div className={cn('border rounded-md overflow-hidden bg-background', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/50 px-2 py-1">
        <ToolButton active={activeFormats.has('bold')} onClick={() => toggleFormat('bold')} title="加粗">
          <Bold className="size-4" />
        </ToolButton>
        <ToolButton active={activeFormats.has('italic')} onClick={() => toggleFormat('italic')} title="斜体">
          <Italic className="size-4" />
        </ToolButton>
        <ToolButton active={activeFormats.has('underline')} onClick={() => toggleFormat('underline')} title="下划线">
          <Underline className="size-4" />
        </ToolButton>
        <ToolButton active={activeFormats.has('strikeThrough')} onClick={() => toggleFormat('strikeThrough')} title="删除线">
          <Strikethrough className="size-4" />
        </ToolButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolButton active={activeFormats.has('justifyLeft')} onClick={() => toggleFormat('justifyLeft')} title="左对齐">
          <AlignLeft className="size-4" />
        </ToolButton>
        <ToolButton active={activeFormats.has('justifyCenter')} onClick={() => toggleFormat('justifyCenter')} title="居中">
          <AlignCenter className="size-4" />
        </ToolButton>
        <ToolButton active={activeFormats.has('justifyRight')} onClick={() => toggleFormat('justifyRight')} title="右对齐">
          <AlignRight className="size-4" />
        </ToolButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolButton active={activeFormats.has('insertUnorderedList')} onClick={() => toggleFormat('insertUnorderedList')} title="无序列表">
          <List className="size-4" />
        </ToolButton>
        <ToolButton active={activeFormats.has('insertOrderedList')} onClick={() => toggleFormat('insertOrderedList')} title="有序列表">
          <ListOrdered className="size-4" />
        </ToolButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolButton onClick={insertLink} title="插入链接">
          <Link2 className="size-4" />
        </ToolButton>
        <ToolButton onClick={insertImage} title="插入图片">
          <Image className="size-4" />
        </ToolButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className="p-3 outline-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}
