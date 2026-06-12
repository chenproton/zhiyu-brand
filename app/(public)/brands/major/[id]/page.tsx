import { notFound } from "next/navigation"
import { getMajorBrandById } from "@/lib/mock-data"
import { MajorDetailView } from "../../../../admin/brands/major/_components/major-detail-view"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicMajorBrandDetailPage({ params }: PageProps) {
  const { id } = await params
  const major = getMajorBrandById(id)
  if (!major) {
    notFound()
  }
  return <MajorDetailView major={major} mode="public" />
}
