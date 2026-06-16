'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface StudentGroupNode {
  id: string
  label: string
  children?: StudentGroupNode[]
}

export const STUDENT_GROUP_TREE: StudentGroupNode[] = [
  {
    id: 'znzz',
    label: '智能制造学院',
    children: [
      {
        id: 'jdyth',
        label: '机电一体化技术',
        children: [
          { id: 'jdyth-2022', label: '2022级', children: [{ id: 'jdyth-2022-1', label: '1班' }, { id: 'jdyth-2022-2', label: '2班' }] },
          { id: 'jdyth-2023', label: '2023级', children: [{ id: 'jdyth-2023-1', label: '1班' }, { id: 'jdyth-2023-2', label: '2班' }] },
          { id: 'jdyth-2024', label: '2024级', children: [{ id: 'jdyth-2024-1', label: '1班' }, { id: 'jdyth-2024-2', label: '2班' }] },
        ],
      },
      {
        id: 'gyjq',
        label: '工业机器人技术',
        children: [
          { id: 'gyjq-2023', label: '2023级', children: [{ id: 'gyjq-2023-1', label: '1班' }] },
          { id: 'gyjq-2024', label: '2024级', children: [{ id: 'gyjq-2024-1', label: '1班' }] },
        ],
      },
    ],
  },
  {
    id: 'xxjs',
    label: '信息技术学院',
    children: [
      {
        id: 'rjjs',
        label: '软件技术',
        children: [
          { id: 'rjjs-2022', label: '2022级', children: [{ id: 'rjjs-2022-1', label: '1班' }, { id: 'rjjs-2022-2', label: '2班' }] },
          { id: 'rjjs-2023', label: '2023级', children: [{ id: 'rjjs-2023-1', label: '1班' }, { id: 'rjjs-2023-2', label: '2班' }] },
          { id: 'rjjs-2024', label: '2024级', children: [{ id: 'rjjs-2024-1', label: '1班' }, { id: 'rjjs-2024-2', label: '2班' }] },
        ],
      },
      {
        id: 'dsj',
        label: '大数据技术',
        children: [
          { id: 'dsj-2023', label: '2023级', children: [{ id: 'dsj-2023-1', label: '1班' }] },
          { id: 'dsj-2024', label: '2024级', children: [{ id: 'dsj-2024-1', label: '1班' }] },
        ],
      },
    ],
  },
  {
    id: 'jjgl',
    label: '经济管理学院',
    children: [
      {
        id: 'dzsw',
        label: '电子商务',
        children: [
          { id: 'dzsw-2022', label: '2022级', children: [{ id: 'dzsw-2022-1', label: '1班' }, { id: 'dzsw-2022-2', label: '2班' }] },
          { id: 'dzsw-2023', label: '2023级', children: [{ id: 'dzsw-2023-1', label: '1班' }, { id: 'dzsw-2023-2', label: '2班' }] },
        ],
      },
      {
        id: 'wlgl',
        label: '物流管理',
        children: [
          { id: 'wlgl-2023', label: '2023级', children: [{ id: 'wlgl-2023-1', label: '1班' }] },
          { id: 'wlgl-2024', label: '2024级', children: [{ id: 'wlgl-2024-1', label: '1班' }] },
        ],
      },
    ],
  },
]

export function getAllDescendantIds(node: StudentGroupNode): string[] {
  const ids = [node.id]
  if (node.children) {
    node.children.forEach((child) => ids.push(...getAllDescendantIds(child)))
  }
  return ids
}

export function buildSelectedGroups(selectedNodeIds: Set<string>): string[] {
  const groups: string[] = []
  STUDENT_GROUP_TREE.forEach((college) => {
    if (!selectedNodeIds.has(college.id)) return
    const selectedMajors = college.children?.filter((m) => selectedNodeIds.has(m.id)) || []
    if (selectedMajors.length === 0) {
      groups.push(college.label)
      return
    }
    selectedMajors.forEach((major) => {
      const selectedGrades = major.children?.filter((g) => selectedNodeIds.has(g.id)) || []
      if (selectedGrades.length === 0) {
        groups.push(`${college.label} / ${major.label}`)
        return
      }
      selectedGrades.forEach((grade) => {
        const selectedClasses = grade.children?.filter((c) => selectedNodeIds.has(c.id)) || []
        if (selectedClasses.length === 0) {
          groups.push(`${college.label} / ${major.label} / ${grade.label}`)
          return
        }
        selectedClasses.forEach((cls) => {
          groups.push(`${college.label} / ${major.label} / ${grade.label} / ${cls.label}`)
        })
      })
    })
  })
  return groups
}

interface StudentGroupTreeProps {
  nodes: StudentGroupNode[]
  selectedNodeIds: Set<string>
  expandedNodeIds: Set<string>
  onToggleSelect: (node: StudentGroupNode, selected: boolean) => void
  onToggleExpand: (nodeId: string) => void
  depth?: number
}

export function StudentGroupTree({
  nodes,
  selectedNodeIds,
  expandedNodeIds,
  onToggleSelect,
  onToggleExpand,
  depth = 0,
}: StudentGroupTreeProps) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = expandedNodeIds.has(node.id)
        const selected = selectedNodeIds.has(node.id)

        const descendantIds = hasChildren ? getAllDescendantIds(node).slice(1) : []
        const selectedDescendants = descendantIds.filter((id) => selectedNodeIds.has(id))
        const indeterminate =
          hasChildren && selectedDescendants.length > 0 && selectedDescendants.length < descendantIds.length

        return (
          <div key={node.id}>
            <div
              className={cn(
                'flex items-center gap-1.5 py-1.5 pr-2 rounded-md hover:bg-accent',
                depth > 0 && 'ml-4'
              )}
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => onToggleExpand(node.id)}
                  className="flex items-center justify-center w-5 h-5 rounded hover:bg-muted"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              ) : (
                <span className="w-5" />
              )}
              <Checkbox
                id={`sg-${node.id}`}
                checked={selected || indeterminate}
                data-state={indeterminate ? 'indeterminate' : selected ? 'checked' : 'unchecked'}
                onCheckedChange={(checked) => onToggleSelect(node, checked === true)}
              />
              <label
                htmlFor={`sg-${node.id}`}
                className="text-sm cursor-pointer select-none flex-1"
              >
                {node.label}
              </label>
            </div>
            {hasChildren && isExpanded && (
              <StudentGroupTree
                nodes={node.children!}
                selectedNodeIds={selectedNodeIds}
                expandedNodeIds={expandedNodeIds}
                onToggleSelect={onToggleSelect}
                onToggleExpand={onToggleExpand}
                depth={depth + 1}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function useStudentGroupSelection(initialGroups: string[] = []) {
  const getInitialSelectedIds = () => {
    const initial = new Set<string>()
    initialGroups.forEach((group) => {
      const parts = group.split(' / ')
      let nodes = STUDENT_GROUP_TREE
      for (const part of parts) {
        const node = nodes.find((n) => n.label === part)
        if (node) {
          initial.add(node.id)
          nodes = node.children || []
        }
      }
    })
    return initial
  }

  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(getInitialSelectedIds)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set())

  const toggleNodeSelection = (node: StudentGroupNode, selected: boolean) => {
    setSelectedNodeIds((prev) => {
      const next = new Set(prev)
      const allIds = getAllDescendantIds(node)
      allIds.forEach((id) => {
        if (selected) next.add(id)
        else next.delete(id)
      })
      return next
    })
  }

  const toggleExpand = (nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const buildGroups = () => buildSelectedGroups(selectedNodeIds)

  return {
    selectedNodeIds,
    expandedNodeIds,
    toggleNodeSelection,
    toggleExpand,
    buildGroups,
  }
}
