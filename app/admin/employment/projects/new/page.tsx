'use client'

import { useRouter } from 'next/navigation'
import EmploymentProjectForm from '@/app/admin/employment/projects/_components/employment-project-form'
import { employmentProjects } from '@/lib/mock-data'
import type { EmploymentProjectType } from '@/lib/types'

export default function NewEmploymentProjectPage() {
  const router = useRouter()

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
    const newProject = {
      id: `ep${String(employmentProjects.length + 1).padStart(3, '0')}`,
      name: data.name,
      type: data.type as EmploymentProjectType,
      partnerIds: data.partnerIds,
      targetStudentGroups: data.targetStudentGroups,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'preparing' as const,
      jobCount: 0,
      applicationCount: 0,
      description: data.description,
      organizer: data.organizer,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    employmentProjects.push(newProject)
    router.push('/admin/employment/projects')
  }

  return <EmploymentProjectForm mode="new" onSubmit={handleSubmit} />
}
