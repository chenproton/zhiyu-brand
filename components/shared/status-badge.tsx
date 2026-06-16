'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type {
  CooperationStatus,
  CooperationRating,
  AgreementStatus,
  ProjectPhase,
  ProjectPublishStatus,
  ActivityStatus,
  AchievementType,
} from '@/lib/types'
import {
  COOPERATION_STATUS_LABELS,
  COOPERATION_RATING_LABELS,
  AGREEMENT_STATUS_LABELS,
  PROJECT_PHASE_LABELS,
  PROJECT_PUBLISH_STATUS_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACHIEVEMENT_TYPE_LABELS,
} from '@/lib/types'

interface StatusBadgeProps {
  status: CooperationStatus
  className?: string
}

export function CooperationStatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<CooperationStatus, string> = {
    negotiating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-gray-100 text-gray-800 border-gray-200',
    terminated: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {COOPERATION_STATUS_LABELS[status]}
    </Badge>
  )
}

interface RatingBadgeProps {
  rating: CooperationRating
  className?: string
}

export function CooperationRatingBadge({ rating, className }: RatingBadgeProps) {
  const variants: Record<CooperationRating, string> = {
    strategic: 'bg-blue-100 text-blue-800 border-blue-200',
    deep: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    general: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[rating], className)}>
      {COOPERATION_RATING_LABELS[rating]}
    </Badge>
  )
}

interface AgreementStatusBadgeProps {
  status: AgreementStatus
  className?: string
}

export function AgreementStatusBadge({ status, className }: AgreementStatusBadgeProps) {
  const variants: Record<AgreementStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    renewed: 'bg-blue-100 text-blue-800 border-blue-200',
    terminated: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {AGREEMENT_STATUS_LABELS[status]}
    </Badge>
  )
}

interface ProjectPhaseBadgeProps {
  phase: ProjectPhase
  className?: string
}

export function ProjectPhaseBadge({ phase, className }: ProjectPhaseBadgeProps) {
  const variants: Record<ProjectPhase, string> = {
    initiation: 'bg-blue-100 text-blue-800 border-blue-200',
    execution: 'bg-green-100 text-green-800 border-green-200',
    acceptance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    closure: 'bg-purple-100 text-purple-800 border-purple-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200',
    terminated: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[phase], className)}>
      {PROJECT_PHASE_LABELS[phase]}
    </Badge>
  )
}

interface ProjectPublishStatusBadgeProps {
  status: ProjectPublishStatus
  className?: string
}

export function ProjectPublishStatusBadge({ status, className }: ProjectPublishStatusBadgeProps) {
  const variants: Record<ProjectPublishStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    published: 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {PROJECT_PUBLISH_STATUS_LABELS[status]}
    </Badge>
  )
}

interface ActivityStatusBadgeProps {
  status: ActivityStatus
  className?: string
}

export function ActivityStatusBadge({ status, className }: ActivityStatusBadgeProps) {
  const variants: Record<ActivityStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    published: 'bg-green-100 text-green-800 border-green-200',
    ended: 'bg-blue-100 text-blue-800 border-blue-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {ACTIVITY_STATUS_LABELS[status]}
    </Badge>
  )
}

interface AchievementTypeBadgeProps {
  type: AchievementType
  className?: string
}

export function AchievementTypeBadge({ type, className }: AchievementTypeBadgeProps) {
  const variants: Record<AchievementType, string> = {
    job: 'bg-blue-100 text-blue-800 border-blue-200',
    scene: 'bg-green-100 text-green-800 border-green-200',
    course: 'bg-purple-100 text-purple-800 border-purple-200',
    custom: 'bg-orange-100 text-orange-800 border-orange-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[type], className)}>
      {ACHIEVEMENT_TYPE_LABELS[type]}
    </Badge>
  )
}

// 通用里程碑状态徽章
interface MilestoneStatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'delayed'
  className?: string
}

export function MilestoneStatusBadge({ status, className }: MilestoneStatusBadgeProps) {
  const labels = {
    pending: '待开始',
    'in-progress': '进行中',
    completed: '已完成',
    delayed: '已延期',
  }

  const variants = {
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    delayed: 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <Badge variant="outline" className={cn(variants[status], className)}>
      {labels[status]}
    </Badge>
  )
}
