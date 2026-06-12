import { notFound } from "next/navigation"
import { getMajorBrandById } from "@/lib/mock-data"
import { MajorDetailView } from "../../_components/major-detail-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MajorBrandPreviewPage({ params }: PageProps) {
  const { id } = await params
  const major = getMajorBrandById(id)
  if (!major) {
    notFound()
  }
  return <MajorDetailView major={major} mode="admin-preview" />
}
