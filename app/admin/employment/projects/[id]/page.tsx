'use client'

import { use } from 'react'
import { useRouter, notFound } from 'next/navigation'
import EmploymentProjectForm from '@/app/admin/employment/projects/_components/employment-project-form'
import { employmentProjects } from '@/lib/mock-data'
import type { EmploymentProjectType } from '@/lib/types'

export default function EditEmploymentProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const project = employmentProjects.find((ep) => ep.id === id)

  if (!project) {
    notFound()
  }

  const handleSubmit = (data: {
    name: string
    type: string
    partnerIds: string[]
    targetStudentGroups: string[]
    startDate: Date
    endDate: Date
    description: string
    organizer: string
  }) => {
    const index = employmentProjects.findIndex((ep) => ep.id === id)
    if (index !== -1) {
      employmentProjects[index] = {
        ...employmentProjects[index],
        name: data.name,
        type: data.type as EmploymentProjectType,
        partnerIds: data.partnerIds,
        targetStudentGroups: data.targetStudentGroups,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        organizer: data.organizer,
        updatedAt: new Date(),
      }
    }

    router.push('/admin/employment/projects')
  }

  return (
    <EmploymentProjectForm
      mode="edit"
      initialData={{
        name: project.name,
        type: project.type,
        partnerIds: project.partnerIds,
        targetStudentGroups: project.targetStudentGroups,
        startDate: project.startDate,
        endDate: project.endDate,
        description: project.description || '',
        organizer: project.organizer,
      }}
      onSubmit={handleSubmit}
    />
  )
}
