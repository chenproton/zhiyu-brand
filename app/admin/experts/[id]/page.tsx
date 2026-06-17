import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Pencil,
  Users,
  User,
  School,
  GraduationCap,
  Clock,
  MapPin,
  Briefcase,
  Tag,
  FileText,
  Award,
} from 'lucide-react'
import { getExpertById } from '@/lib/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExpertDetailPage({ params }: PageProps) {
  const { id } = await params
  const expert = getExpertById(id)

  if (!expert) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/experts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {expert.avatar ? (
              <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{expert.name}</h1>
              <Badge variant={expert.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                {expert.status === 'active' ? '启用' : '禁用'}
              </Badge>
              {expert.isPublicDisplay && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">前台展示</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{[expert.title, expert.position].filter(Boolean).join(' · ') || '-'}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {expert.gender === 'male' ? '男' : expert.gender === 'female' ? '女' : '未设置'}
                {expert.age ? ` · ${expert.age}岁` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {expert.experience ? `${expert.experience}年经验` : '未设置'}
              </span>
              {expert.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {expert.city}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/admin/experts/${id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            编辑信息
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                擅长领域
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expert.specialties && expert.specialties.length > 0 ? (
                  expert.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-sm py-1 px-3">
                      {specialty}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <School className="h-4 w-4" />
                关联二级学院
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-gray-600">
                {expert.secondaryColleges && expert.secondaryColleges.length > 0
                  ? expert.secondaryColleges.join('、')
                  : '-'}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                教育背景
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm text-gray-600">{expert.education || '-'}</span>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                行业/岗位方向
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground shrink-0">行业方向：</span>
                <span className="text-gray-600">{expert.industryDirection || '-'}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground shrink-0">岗位方向：</span>
                <span className="text-gray-600">{expert.positionDirection || '-'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">专家简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{expert.introduction || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">从业经历</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{expert.workExperience || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4" />
                资质荣誉（佐证材料）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expert.attachments && expert.attachments.length > 0 ? (
                <div className="space-y-2">
                  {expert.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline truncate"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">其他信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">入库时间</span>
                <span>{expert.createdAt.toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">更新时间</span>
                <span>{expert.updatedAt.toLocaleDateString('zh-CN')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
