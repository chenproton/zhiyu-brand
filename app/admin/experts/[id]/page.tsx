import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Pencil,
  Users,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Clock,
  EyeOff,
  User,
  Award,
  School,
} from 'lucide-react'
import { getExpertById, getPartnerById } from '@/lib/mock-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExpertDetailPage({ params }: PageProps) {
  const { id } = await params
  const expert = getExpertById(id)

  if (!expert) {
    notFound()
  }

  const partner = expert.partnerId ? getPartnerById(expert.partnerId) : null

  return (
    <div>
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/experts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>

        {/* Header */}
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
              </div>
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
          <Link href={`/admin/experts/${id}/edit`}>
            <Button>
              <Pencil className="h-4 w-4 mr-2" />
              编辑信息
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Related Industries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">所属行业领域</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-sm py-1 px-3">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            {expert.workExperience && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">从业经历</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{expert.workExperience}</p>
                </CardContent>
              </Card>
            )}

            {/* Related Positions */}
            {expert.relatedPositions && expert.relatedPositions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">擅长岗位领域</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {expert.relatedPositions.map((pos) => (
                      <Badge key={pos} variant="secondary" className="text-sm py-1 px-3">
                        {pos}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Secondary College */}
            {expert.secondaryColleges && expert.secondaryColleges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">关联二级学院</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <School className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{expert.secondaryColleges.join('、')}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">联系方式</CardTitle>
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
                    {expert.contactEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${expert.contactEmail}`} className="text-sm hover:underline">
                          {expert.contactEmail}
                        </a>
                      </div>
                    )}
                    {expert.contactPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${expert.contactPhone}`} className="text-sm hover:underline">
                          {expert.contactPhone}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            {expert.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">教育背景</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{expert.education}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Partner */}
            {partner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">所属单位</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <Link
                        href={`/admin/partners/${partner.id}`}
                        className="font-medium hover:underline"
                      >
                        {partner.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{partner.industry}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">其他信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">状态</span>
                  <Badge variant={expert.status === 'active' ? 'default' : 'secondary'}>
                    {expert.status === 'active' ? '启用' : '禁用'}
                  </Badge>
                </div>
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
