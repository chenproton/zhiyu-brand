import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExpertRatingBadge } from '@/components/shared/status-badge'
import {
  ArrowLeft,
  Pencil,
  Users,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Award,
  Clock,
  Briefcase,
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
    <>
      <AdminHeader title="专家详情" />
      <main className="flex-1 overflow-y-auto p-6">
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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{expert.name}</h1>
                <ExpertRatingBadge rating={expert.rating} />
              </div>
              <p className="text-muted-foreground">{expert.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {expert.field}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {expert.experience}年经验
                </span>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专家角色</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {expert.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-sm py-1 px-3">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业特长</CardTitle>
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

            {/* Achievements */}
            {expert.achievements && expert.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">主要成就</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {expert.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">联系方式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    {expert.status === 'active' ? '在聘' : '离聘'}
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
      </main>
    </>
  )
}
