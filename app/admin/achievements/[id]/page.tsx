'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Award,
  Building2,
  FolderKanban,
  FileText,
  Layers,
  BookOpen,
  Briefcase,
  Plus,
  Pencil,
  ImageIcon,
  Users,
  Calendar,
  Handshake,
  Trash2,
} from 'lucide-react'
import { getAchievementById, partners, projects, jobs, achievements } from '@/lib/mock-data'
import { ACHIEVEMENT_TYPE_LABELS } from '@/lib/types'
import type { Achievement, RelatedReference } from '@/lib/types'

const sceneLibrary: RelatedReference[] = achievements
  .filter((a) => a.type === 'scene')
  .map((a) => ({ id: a.id, name: a.name }))

const courseLibrary: RelatedReference[] = achievements
  .filter((a) => a.type === 'course')
  .map((a) => ({ id: a.id, name: a.name }))

const positionLibrary: RelatedReference[] = jobs.map((j) => ({ id: j.id, name: j.title }))

interface RelatedResourceTabProps {
  title: string
  description: string
  icon: React.ReactNode
  options: RelatedReference[]
  items: RelatedReference[]
  onChange: (items: RelatedReference[]) => void
}

function RelatedResourceTab({ title, description, icon, options, items, onChange }: RelatedResourceTabProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const availableOptions = options.filter((opt) => !items.some((item) => item.id === opt.id))

  const handleOpen = () => {
    setSelectedId('')
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!selectedId) return
    const option = options.find((opt) => opt.id === selectedId)
    if (!option) return
    onChange([...items, option])
    setSelectedId('')
    setDialogOpen(false)
  }

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleOpen}
            disabled={availableOptions.length === 0}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {items.length > 0 ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <span className="font-medium text-slate-800 text-sm truncate">{item.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-400">暂无关联数据</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={handleOpen}
              disabled={availableOptions.length === 0}
            >
              <Plus className="h-4 w-4 mr-1" />
              立即添加
            </Button>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base">选择引用</DialogTitle>
              <DialogDescription>请选择要引用的资源</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2 max-h-[360px] overflow-auto">
              {availableOptions.length > 0 ? (
                availableOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedId === option.id
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="related-resource"
                      value={option.id}
                      checked={selectedId === option.id}
                      onChange={() => setSelectedId(option.id)}
                      className="h-4 w-4 text-emerald-600 accent-emerald-600"
                    />
                    <span className="text-sm font-medium text-slate-800">{option.name}</span>
                  </label>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">暂无可引用资源</div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSave} disabled={!selectedId}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default function AchievementDetailPage() {
  const params = useParams()
  const id = params.id as string

  const initialAchievement = useMemo(() => getAchievementById(id), [id])
  const [achievement, setAchievement] = useState<Achievement | null>(initialAchievement || null)

  if (!initialAchievement || !achievement) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Award className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">成果不存在</h1>
        <p className="text-slate-500 mb-6">该成果可能已被删除或 ID 不正确</p>
        <Link href="/admin/achievements">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Button>
        </Link>
      </div>
    )
  }

  const achievementPartners = (achievement.partnerIds?.length
    ? achievement.partnerIds
    : achievement.partnerId
    ? [achievement.partnerId]
    : []
  ).map((pid) => partners.find((p) => p.id === pid)).filter(Boolean)

  const relatedProject = achievement.projectId
    ? projects.find((p) => p.id === achievement.projectId)
    : null

  const updateRelated = (
    key: 'relatedScenes' | 'relatedCourses' | 'relatedPositions',
    items: RelatedReference[]
  ) => {
    setAchievement((prev) => (prev ? { ...prev, [key]: items, updatedAt: new Date() } : prev))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/achievements">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>
        <Link href={`/admin/achievements/${id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            编辑成果
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-5 md:items-start">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{achievement.name}</h1>
            <p className="text-sm text-slate-500">ID: {achievement.id}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-white border border-slate-100 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="info"
            className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
          >
            基本信息
          </TabsTrigger>
          <TabsTrigger
            value="attachments"
            className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
          >
            成果佐证材料 ({(achievement.attachments || []).length})
          </TabsTrigger>
          <TabsTrigger
            value="positions"
            className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
          >
            关联职业岗位 ({(achievement.relatedPositions || []).length})
          </TabsTrigger>
          <TabsTrigger
            value="scenes"
            className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
          >
            关联实践场景 ({(achievement.relatedScenes || []).length})
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
          >
            关联数字课程 ({(achievement.relatedCourses || []).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900">成果简介</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-700 leading-7 text-[15px]">{achievement.description}</p>
                </CardContent>
              </Card>

              {achievement.citationReason && (
                <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                    <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Handshake className="h-4 w-4 text-emerald-600" />
                      引用原因 / 核心亮点
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div
                      className="text-slate-700 leading-7 prose prose-sm max-w-none prose-ul:my-3 prose-li:my-1"
                      dangerouslySetInnerHTML={{ __html: achievement.citationReason }}
                    />
                  </CardContent>
                </Card>
              )}

              {achievement.coverImage && (
                <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                    <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-emerald-600" />
                      成果封面
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-100 max-w-md">
                      <img
                        src={achievement.coverImage}
                        alt="成果封面"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {(achievement.ownerPersons?.length || 0) > 0 || (achievement.coBuilders?.length || 0) > 0 ? (
                <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                    <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                      人员信息
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    {(achievement.ownerPersons?.length || 0) > 0 && (
                      <div>
                        <p className="text-sm text-slate-500 mb-2.5">成果归属人</p>
                        <div className="flex flex-wrap gap-2">
                          {achievement.ownerPersons?.map((person) => (
                            <Badge
                              key={person}
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-normal px-2.5 py-1"
                            >
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {(achievement.coBuilders?.length || 0) > 0 && (
                      <div>
                        <p className="text-sm text-slate-500 mb-2.5">成果共建人</p>
                        <div className="flex flex-wrap gap-2">
                          {achievement.coBuilders?.map((person) => (
                            <Badge
                              key={person}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-normal px-2.5 py-1"
                            >
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900">关联信息</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  {achievementPartners.length > 0 && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">合作企业</p>
                        <div className="flex flex-col gap-0.5">
                          {achievementPartners.map((p) => (
                            <Link
                              key={p!.id}
                              href={`/admin/partners/${p!.id}`}
                              className="font-medium text-slate-900 hover:text-emerald-600 transition-colors text-sm"
                            >
                              {p!.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {relatedProject && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <FolderKanban className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">归属项目</p>
                        <Link
                          href={`/admin/projects/${relatedProject.id}`}
                          className="font-medium text-slate-900 hover:text-emerald-600 transition-colors text-sm"
                        >
                          {relatedProject.name}
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    成果信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-500">成果类型</span>
                    <span className="text-sm font-medium text-slate-900">
                      {ACHIEVEMENT_TYPE_LABELS[achievement.type]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-500">关联二级学院</span>
                    <span className="text-sm font-medium text-slate-900 text-right">
                      {achievement.secondaryColleges?.join('、') || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-500">发布日期</span>
                    <span className="text-sm font-medium text-slate-900">
                      {achievement.publishDate.toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-500">创建时间</span>
                    <span className="text-sm font-medium text-slate-900">
                      {achievement.createdAt.toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-500">更新时间</span>
                    <span className="text-sm font-medium text-slate-900">
                      {achievement.updatedAt.toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attachments">
          <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
              <CardTitle className="text-base font-semibold text-slate-900">成果佐证材料</CardTitle>
              <CardDescription>成果相关附件与佐证材料</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {achievement.attachments && achievement.attachments.length > 0 ? (
                <div className="grid gap-3">
                  {achievement.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">暂无佐证材料</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <RelatedResourceTab
            title="关联岗位"
            description="管理成果关联的岗位资源"
            icon={<Briefcase className="h-4 w-4 text-emerald-600" />}
            options={positionLibrary}
            items={achievement.relatedPositions || []}
            onChange={(items) => updateRelated('relatedPositions', items)}
          />
        </TabsContent>

        <TabsContent value="scenes">
          <RelatedResourceTab
            title="关联场景"
            description="管理成果关联的场景资源"
            icon={<Layers className="h-4 w-4 text-amber-600" />}
            options={sceneLibrary}
            items={achievement.relatedScenes || []}
            onChange={(items) => updateRelated('relatedScenes', items)}
          />
        </TabsContent>

        <TabsContent value="courses">
          <RelatedResourceTab
            title="关联课程"
            description="管理成果关联的课程资源"
            icon={<BookOpen className="h-4 w-4 text-sky-600" />}
            options={courseLibrary}
            items={achievement.relatedCourses || []}
            onChange={(items) => updateRelated('relatedCourses', items)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
