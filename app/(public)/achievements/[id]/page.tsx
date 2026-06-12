import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Award,
  Building2,
  FolderKanban,
  FileText,
  Eye,
} from 'lucide-react'
import { getAchievementById } from '@/lib/mock-data'
import { ACHIEVEMENT_TYPE_LABELS } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档',
}

const STATUS_VARIANTS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-amber-100 text-amber-800',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicAchievementDetailPage({ params }: PageProps) {
  const { id } = await params
  const achievement = getAchievementById(id)

  if (!achievement) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
          <Award className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{achievement.name}</h1>
          <p className="text-muted-foreground">{ACHIEVEMENT_TYPE_LABELS[achievement.type]}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={STATUS_VARIANTS[achievement.status]}>
              {STATUS_LABELS[achievement.status]}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Eye className="h-3 w-3 mr-1" />
              {achievement.viewCount} 次浏览
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">成果简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
            </CardContent>
          </Card>

          {achievement.images && achievement.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">成果图片</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {achievement.images.map((img, idx) => (
                    <div key={idx} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img src={img} alt={`成果图片 ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">关联信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievement.partnerId && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">关联主体</p>
                    <Link
                      href={`/partners/${achievement.partnerId}`}
                      className="font-medium hover:underline text-sm"
                    >
                      {achievement.partnerName}
                    </Link>
                  </div>
                </div>
              )}

              {achievement.projectId && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">关联项目</p>
                    <span className="font-medium text-sm">{achievement.projectName}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">成果信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">成果类型</p>
                <p className="font-medium">{ACHIEVEMENT_TYPE_LABELS[achievement.type]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">关联二级学院</p>
                <p className="font-medium">{achievement.secondaryColleges?.join('、') || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">发布日期</p>
                <p className="font-medium">{achievement.publishDate.toLocaleDateString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">创建时间</p>
                <p className="font-medium">{achievement.createdAt.toLocaleDateString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">更新时间</p>
                <p className="font-medium">{achievement.updatedAt.toLocaleDateString('zh-CN')}</p>
              </div>
            </CardContent>
          </Card>

          {achievement.attachments && achievement.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">附件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {achievement.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{file}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
