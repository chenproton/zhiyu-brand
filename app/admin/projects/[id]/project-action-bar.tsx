'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Send, Eye } from 'lucide-react'
import { projects } from '@/lib/mock-data'
import type { ProjectPublishStatus } from '@/lib/types'

export default function ProjectActionBar({ projectId, publishStatus }: { projectId: string; publishStatus: ProjectPublishStatus }) {
  const router = useRouter()

  const handlePublish = () => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      project.publishStatus = 'published'
      project.updatedAt = new Date()
    }
    window.location.reload()
  }

  const handleUnpublish = () => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      project.publishStatus = 'draft'
      project.updatedAt = new Date()
    }
    window.location.reload()
  }

  if (publishStatus === 'draft') {
    return (
      <Button variant="default" onClick={handlePublish}>
        <Send className="h-4 w-4 mr-2" />
        发布项目
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={handleUnpublish}>
      <Eye className="h-4 w-4 mr-2" />
      撤销发布
    </Button>
  )
}
