import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Clock,
  EyeOff,
  User,
  School,
  Briefcase,
  Tag,
} from 'lucide-react'
import { getExpertById, getEnterpriseById } from '@/lib/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicExpertDetailPage({ params }: PageProps) {
  const { id } = await params
  const expert = getExpertById(id)

  if (!expert) {
    notFound()
  }

  const enterprise = expert.partnerId ? getEnterpriseById(expert.partnerId) : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start gap-4 mb-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
          {expert.avatar ? (
            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
          ) : (
            <Users className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{expert.name}</h1>
          <p className="text-muted-foreground">{expert.title}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {expert.gender === 'male' ? '男' : expert.gender === 'female' ? '女' : '未设置'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {expert.experience}年经验
            </span>
            {expert.expertType && (
              <Badge variant="outline" className="text-xs">
                {expert.expertType}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                所属行业领域
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expert.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-sm py-1 px-3">
                    {specialty}
                  </Badge>
                ))}
                {expert.specialties.length === 0 && (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                擅长岗位领域
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expert.relatedPositions && expert.relatedPositions.length > 0 ? (
                  expert.relatedPositions.map((pos) => (
                    <Badge key={pos} variant="secondary" className="text-sm py-1 px-3">
                      {pos}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4" />
                联系方式
              </CardTitle>
              {expert.isContactHidden && (
                <Badge variant="secondary" className="text-xs">
                  <EyeOff className="h-3 w-3 mr-1" />
                  已隐藏
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {expert.isContactHidden ? (
                <p className="text-sm text-muted-foreground">该专家的联系方式已设置为隐藏</p>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{expert.contactEmail || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{expert.contactPhone || '-'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                所属企业
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enterprise ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <Link
                      href={`/partners/${enterprise.id}`}
                      className="font-medium hover:underline"
                    >
                      {enterprise.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{enterprise.industry}</p>
                  </div>                </div>
              ) : expert.partnerName ? (
                <span className="text-sm text-gray-600">{expert.partnerName}</span>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">从业经历</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 whitespace-pre-line">{expert.workExperience || '-'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
