'use client'

import { useState, use, useMemo, useCallback } from 'react'
import { useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
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
  Plus,
  Trash2,
  Target,
  ChevronRight,
  Search,
  Lock,
  BookOpen,
  Check,
  Sparkles,
} from 'lucide-react'
import { jobs, abilityLibrary } from '@/lib/mock-data'
import { JOB_CATEGORY_LABELS } from '@/lib/types'
import type { JobAbilityGroup, JobAbilityItem } from '@/lib/types'
import type { AbilityLibraryItem } from '@/lib/types'

const LEVELS = ['了解', '理解', '掌握', '熟练', '精通']
const LEVEL_COLORS = [
  'bg-gray-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function getDefaultAbilityConfig(jobBrandId?: string): JobAbilityGroup[] {
  // 根据品牌ID分配不同的能力领域组合（模拟数据）
  const idNum = parseInt(jobBrandId?.replace('jb', '') || '0')
  const configs: JobAbilityGroup[][] = [
    [
      {
        duty: '行业与岗位认知',
        items: [
          { id: generateId(), name: '互联网产品思维', targetLevel: 3, desc: '理解互联网产品的设计逻辑和用户体验原则，能够从用户角度思考产品功能。' },
          { id: generateId(), name: '前端技术生态与演进', targetLevel: 2, desc: '了解前端技术栈的发展趋势和主流框架的演进路径。' },
        ],
      },
      {
        duty: '专业知识',
        items: [
          { id: generateId(), name: 'HTML5/CSS3基础知识', targetLevel: 4, desc: '掌握语义化标签、CSS布局、响应式设计等前端基础技术。' },
          { id: generateId(), name: 'JavaScript核心原理', targetLevel: 4, desc: '深入理解闭包、原型链、事件循环、异步编程等JS核心机制。' },
          { id: generateId(), name: '计算机网络与HTTP协议', targetLevel: 3, desc: '理解TCP/IP协议栈、HTTP/HTTPS协议原理及常见网络问题排查。' },
        ],
      },
      {
        duty: '专业技能',
        items: [
          { id: generateId(), name: '响应式页面开发', targetLevel: 4, desc: '能够使用Flex/Grid布局实现适配多端的响应式页面。' },
          { id: generateId(), name: 'Vue3/React组件化开发', targetLevel: 5, desc: '熟练使用Vue3或React进行组件化开发，掌握Hooks/Composition API。' },
          { id: generateId(), name: '状态管理与路由配置', targetLevel: 4, desc: '熟练使用Pinia/Vuex或Redux进行状态管理，掌握前端路由配置。' },
        ],
      },
      {
        duty: '通用能力',
        items: [
          { id: generateId(), name: '团队协作与沟通', targetLevel: 4, desc: '具备良好的团队协作意识，能够高效进行跨部门沟通。' },
        ],
      },
      {
        duty: '职业素养',
        items: [
          { id: generateId(), name: '持续学习与技术视野', targetLevel: 4, desc: '保持对新技术的好奇心和学习热情，持续关注行业动态。' },
        ],
      },
    ],
    [
      {
        duty: '专业知识',
        items: [
          { id: generateId(), name: 'Python数据分析基础', targetLevel: 4, desc: '熟练使用Python进行数据清洗、统计分析和可视化展示。' },
          { id: generateId(), name: '机器学习基础理论', targetLevel: 3, desc: '理解常见机器学习算法的原理、适用场景和调优方法。' },
        ],
      },
      {
        duty: '专业技能',
        items: [
          { id: generateId(), name: '深度学习模型训练', targetLevel: 4, desc: '能够使用PyTorch/TensorFlow搭建和训练深度学习模型。' },
        ],
      },
      {
        duty: '通用能力',
        items: [
          { id: generateId(), name: '复杂线上问题排查', targetLevel: 3, desc: '能够系统性地定位和解决线上复杂技术问题。' },
        ],
      },
    ],
  ]
  return configs[idNum % configs.length] || configs[0]
}

export default function JobAbilityConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const job = jobs.find((j) => j.id === id)

  if (!job) {
    notFound()
  }

  const isTeaching = job.jobCategory === 'teaching'

  const [groups, setGroups] = useState<JobAbilityGroup[]>(
    job.abilityConfig?.groups && job.abilityConfig.groups.length > 0
      ? job.abilityConfig.groups
      : isTeaching
        ? getDefaultAbilityConfig(job.jobBrandId)
        : []
  )
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)
  const [deleteGroupIndex, setDeleteGroupIndex] = useState<number | null>(null)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

  // 非教学岗位：添加能力点时的搜索
  const [abilitySearchOpen, setAbilitySearchOpen] = useState(false)
  const [abilitySearchTerm, setAbilitySearchTerm] = useState('')
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<AbilityLibraryItem | null>(null)

  const activeGroup = groups[activeGroupIndex]

  const filteredLibrary = useMemo(() => {
    if (!abilitySearchTerm) return abilityLibrary
    const term = abilitySearchTerm.toLowerCase()
    return abilityLibrary.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.desc.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    )
  }, [abilitySearchTerm])

  const handleAddGroup = () => {
    const newGroup: JobAbilityGroup = {
      duty: `能力领域 ${groups.length + 1}`,
      items: [],
    }
    setGroups([...groups, newGroup])
    setActiveGroupIndex(groups.length)
  }

  const handleUpdateGroupName = (index: number, name: string) => {
    if (isTeaching) return
    const newGroups = [...groups]
    newGroups[index].duty = name
    setGroups(newGroups)
  }

  const handleDeleteGroup = () => {
    if (deleteGroupIndex !== null) {
      const newGroups = groups.filter((_, i) => i !== deleteGroupIndex)
      setGroups(newGroups)
      if (activeGroupIndex >= deleteGroupIndex && activeGroupIndex > 0) {
        setActiveGroupIndex(activeGroupIndex - 1)
      }
      if (activeGroupIndex >= newGroups.length) {
        setActiveGroupIndex(Math.max(0, newGroups.length - 1))
      }
      setDeleteGroupIndex(null)
    }
  }

  const handleAddItemFromLibrary = () => {
    if (!selectedLibraryItem) return
    const newItem: JobAbilityItem = {
      id: generateId(),
      name: selectedLibraryItem.name,
      targetLevel: 3,
      desc: selectedLibraryItem.desc,
    }
    const newGroups = [...groups]
    newGroups[activeGroupIndex].items.push(newItem)
    setGroups(newGroups)
    setAbilitySearchOpen(false)
    setAbilitySearchTerm('')
    setSelectedLibraryItem(null)
  }

  const handleUpdateItem = useCallback(
    (itemId: string, updates: Partial<JobAbilityItem>) => {
      if (isTeaching) return
      const newGroups = [...groups]
      const item = newGroups[activeGroupIndex].items.find((i) => i.id === itemId)
      if (item) {
        Object.assign(item, updates)
        setGroups(newGroups)
      }
    },
    [groups, activeGroupIndex, isTeaching]
  )

  const handleDeleteItem = () => {
    if (deleteItemId) {
      const newGroups = [...groups]
      newGroups[activeGroupIndex].items = newGroups[activeGroupIndex].items.filter(
        (i) => i.id !== deleteItemId
      )
      setGroups(newGroups)
      setDeleteItemId(null)
    }
  }

  const handleAiMatch = () => {
    if (isTeaching) return
    // 根据岗位行业/标题关键词匹配能力点
    const keywords = [job.industry || '', job.title || ''].join(' ')
    const keywordMap: Record<string, string[]> = {
      '前端': ['前端', 'HTML', 'JavaScript', 'React', 'Vue'],
      '全栈': ['前端', 'React', 'Vue', '后端', '工程化', 'HTTP'],
      '开发': ['前端', 'React', 'Vue', '后端', '工程化', 'HTTP'],
      '软件': ['前端', 'React', 'Vue', '后端', '工程化', 'HTTP'],
      '信息': ['前端', 'React', 'Vue', '后端', '工程化', 'HTTP'],
      '互联网': ['产品思维', '前端', 'React', 'Vue'],
      'AI': ['机器学习', '深度学习', 'Python', '算法'],
      '算法': ['机器学习', '深度学习', 'Python', '算法', '数据结构'],
      '人工智能': ['机器学习', '深度学习', 'Python', '算法'],
      '数据': ['Python', '数据分析', '机器学习', '算法'],
      '机器人': ['工业机器人', '智能制造', '自动化'],
      '智能制造': ['工业机器人', '智能制造', '自动化'],
      '机电': ['工业机器人', '智能制造', '自动化'],
      '机械': ['工业机器人', '智能制造', '自动化'],
      '自动化': ['工业机器人', '智能制造', '自动化'],
      '新能源': ['新能源', '光伏', '产业链'],
      '光伏': ['新能源', '光伏', '产业链'],
      '电商': ['电商', '数据分析', '运营'],
      '运营': ['电商', '数据分析', '运营'],
      'UI': ['产品思维', '前端', '响应式'],
      '设计': ['产品思维', '前端', '响应式'],
      '测试': ['前端', 'JavaScript', 'HTTP', '工程化'],
      '嵌入式': ['工业机器人', '自动化', '硬件'],
    }

    const matchedKeywords = Object.entries(keywordMap)
      .filter(([k]) => keywords.includes(k))
      .flatMap(([, vals]) => vals)

    // 去重并计算每个能力点的匹配度
    const uniqueKeywords = Array.from(new Set(matchedKeywords))
    const scored = abilityLibrary.map((item) => {
      let score = 0
      uniqueKeywords.forEach((kw) => {
        if (item.name.includes(kw) || item.desc.includes(kw)) score += 1
      })
      // 每个 category 保底至少有一个
      return { item, score }
    })

    // 按 category 分组，每个 category 选 top 2-3
    const categoryMap = new Map<string, AbilityLibraryItem[]>()
    scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .forEach(({ item }) => {
        const arr = categoryMap.get(item.category) || []
        if (arr.length < 3) {
          arr.push(item)
          categoryMap.set(item.category, arr)
        }
      })

    // 如果没有匹配到任何内容，给每个 category 默认选前2个
    if (categoryMap.size === 0) {
      abilityLibrary.forEach((item) => {
        const arr = categoryMap.get(item.category) || []
        if (arr.length < 2) {
          arr.push(item)
          categoryMap.set(item.category, arr)
        }
      })
    }

    // 构建能力模型分组
    const newGroups: JobAbilityGroup[] = []
    const categoryOrder = ['行业与岗位认知', '专业知识', '专业技能', '通用能力', '职业素养']
    categoryOrder.forEach((cat) => {
      const items = categoryMap.get(cat)
      if (items && items.length > 0) {
        newGroups.push({
          duty: cat,
          items: items.map((item) => ({
            id: generateId(),
            name: item.name,
            targetLevel: item.type === 'skill' ? 4 : 3,
            desc: item.desc,
          })),
        })
      }
    })

    setGroups(newGroups)
    setActiveGroupIndex(0)
  }

  const handleSave = () => {
    const index = jobs.findIndex((j) => j.id === id)
    if (index !== -1) {
      jobs[index] = {
        ...jobs[index],
        abilityConfig: { groups },
        updatedAt: new Date(),
      }
    }
    router.push('/partner/jobs')
  }

  const totalItems = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/partner/jobs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">能力模型配置</h1>
              {job.jobCategory && (
                <Badge variant="outline">
                  {JOB_CATEGORY_LABELS[job.jobCategory]}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {job.title} · 共 {groups.length} 个能力领域，{totalItems} 个能力点
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isTeaching && (
            <Button variant="outline" onClick={handleAiMatch}>
              <Sparkles className="h-4 w-4 mr-1.5" />
              AI 匹配
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/partner/jobs">返回列表</Link>
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </div>

      {/* 教学岗位只读提示 */}
      {isTeaching && (
        <div className="bg-muted border rounded-lg p-4 flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">教学岗位能力模型</p>
            <p className="text-sm text-muted-foreground">
              该教学岗位配置读取自系统岗位库中的数据，无法修改。如需调整请联系管理员更新岗位库。
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-6" style={{ height: 'calc(100vh - 260px)', minHeight: 500 }}>
        {/* 左侧 Sidebar */}
        <div className="w-64 shrink-0 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">能力领域</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 pt-0 space-y-1">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer text-sm transition-colors ${
                    index === activeGroupIndex
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-accent text-muted-foreground'
                  }`}
                  onClick={() => setActiveGroupIndex(index)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                        index === activeGroupIndex ? 'rotate-90' : ''
                      }`}
                    />
                    <span className="truncate">{group.duty}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ({group.items.length})
                    </span>
                  </div>
                  {!isTeaching && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteGroupIndex(index)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
            {!isTeaching && (
              <div className="p-3 border-t">
                <Button variant="outline" className="w-full" size="sm" onClick={handleAddGroup}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加能力领域
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 overflow-y-auto pr-2">
          {activeGroup ? (
            <div className="space-y-4">
              {/* 能力领域标题 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isTeaching ? (
                    <div className="text-lg font-semibold">{activeGroup.duty}</div>
                  ) : (
                    <Input
                      value={activeGroup.duty}
                      onChange={(e) =>
                        handleUpdateGroupName(activeGroupIndex, e.target.value)
                      }
                      className="text-lg font-semibold h-10 w-auto min-w-[200px]"
                    />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {activeGroup.items.length} 个能力点
                  </span>
                </div>
                {!isTeaching && (
                  <Button size="sm" onClick={() => setAbilitySearchOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加能力点
                  </Button>
                )}
              </div>

              {/* 能力卡片列表 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeGroup.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-5 space-y-4">
                      {/* 能力名称 */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium">{item.name}</div>
                        {!isTeaching && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => setDeleteItemId(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        {isTeaching && (
                          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>

                      {/* 目标等级 */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-1.5 text-sm">
                            <Target className="h-3.5 w-3.5" />
                            目标等级
                          </Label>
                          <Badge
                            className={`${LEVEL_COLORS[item.targetLevel - 1]} text-gray-800`}
                          >
                            {LEVELS[item.targetLevel - 1]}
                          </Badge>
                        </div>
                        <Slider
                          value={[item.targetLevel]}
                          min={1}
                          max={5}
                          step={1}
                          disabled={isTeaching}
                          onValueChange={(value) =>
                            handleUpdateItem(item.id, { targetLevel: value[0] })
                          }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          {LEVELS.map((l) => (
                            <span key={l}>{l}</span>
                          ))}
                        </div>
                      </div>

                      {/* 描述 */}
                      <div className="space-y-1">
                        <Label className="text-sm">能力描述</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {activeGroup.items.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                  <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    该能力领域暂无能力点
                  </p>
                  {!isTeaching && (
                    <Button size="sm" onClick={() => setAbilitySearchOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      添加能力点
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {isTeaching ? '暂无能力领域数据' : '请先添加能力领域'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 删除能力领域确认 */}
      <Dialog
        open={deleteGroupIndex !== null}
        onOpenChange={(open) => !open && setDeleteGroupIndex(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除能力领域</DialogTitle>
            <DialogDescription>
              删除后该领域下的所有能力点也会被删除，是否继续？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteGroupIndex(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除能力点确认 */}
      <Dialog
        open={!!deleteItemId}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除能力点</DialogTitle>
            <DialogDescription>删除后无法恢复，是否继续？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemId(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 搜索能力点 Dialog（非教学岗位） */}
      <Dialog open={abilitySearchOpen} onOpenChange={setAbilitySearchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>从能力点库中选择</DialogTitle>
            <DialogDescription>
              搜索并选择已有能力点进行关联，关联后仅可修改目标等级
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索能力点名称或描述..."
                value={abilitySearchTerm}
                onChange={(e) => setAbilitySearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {filteredLibrary.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  未找到匹配的能力点
                </div>
              ) : (
                filteredLibrary.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between p-3 cursor-pointer hover:bg-accent border-b last:border-b-0 ${
                      selectedLibraryItem?.id === item.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedLibraryItem(item)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{item.name}</p>
                        <Badge variant="secondary" className="text-[10px]">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                    {selectedLibraryItem?.id === item.id && (
                      <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAbilitySearchOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddItemFromLibrary} disabled={!selectedLibraryItem}>
              关联选中能力点
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
