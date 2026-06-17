import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
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

export default async function PublicExpertDetailPage({ params }: PageProps) {
  const { id } = await params
  const expert = getExpertById(id)

  if (!expert) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-violet-50/30">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-indigo-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/experts">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回列表
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="h-28 w-28 ring-4 ring-white shadow-2xl shrink-0">
              <AvatarImage src={expert.avatar} className="object-cover" />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                {expert.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-2">
                {expert.name}
              </h1>
              <p className="text-slate-500 text-lg">{[expert.title, expert.position].filter(Boolean).join(' · ') || '-'}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-500">
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
                {expert.isPublicDisplay && (
                  <Badge variant="outline" className="text-xs border-violet-200 text-violet-700 bg-violet-50">
                    认证专家
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
                    擅长领域
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {expert.specialties && expert.specialties.length > 0 ? (
                      expert.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-sm py-1 px-3 border-violet-200 text-violet-700 bg-violet-50">
                          {specialty}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <School className="h-4 w-4 text-violet-500" />
                    关联二级学院
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-slate-600">
                    {expert.secondaryColleges && expert.secondaryColleges.length > 0
                      ? expert.secondaryColleges.join('、')
                      : '-'}
                  </span>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-violet-500" />
                    教育背景
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-slate-600">{expert.education || '-'}</span>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-violet-500" />
                    行业/岗位方向
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0">行业方向：</span>
                    <span className="text-slate-700">{expert.industryDirection || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0">岗位方向：</span>
                    <span className="text-slate-700">{expert.positionDirection || '-'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4 text-violet-500" />
                    专家简介
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{expert.introduction || '-'}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-violet-500" />
                    从业经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{expert.workExperience || '-'}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-4 w-4 text-violet-500" />
                    资质荣誉（佐证材料）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expert.attachments && expert.attachments.length > 0 ? (
                    <div className="space-y-3">
                      {expert.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-700 truncate">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">-</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
