'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tag, Plus, Pencil, Trash2, Settings } from 'lucide-react'

const typeDetails = [
  { name: '人才培养', description: '校企联合开展订单班、现代学徒制等人才培养模式', tags: ['订单班', '学徒制', '双元制'] },
  { name: '实习实训', description: '建立校外实习实训基地，接收学生顶岗实习', tags: ['实习基地', '顶岗实习', '实训基地'] },
  { name: '技术研发', description: '联合开展技术攻关、产品研发等科研合作', tags: ['联合研发', '技术攻关', '成果转化'] },
  { name: '课程共建', description: '共同开发专业课程、教材及教学资源', tags: ['课程开发', '教材编写', '教学资源'] },
  { name: '师资培训', description: '企业工程师进课堂、教师下企业实践', tags: ['双师型', '企业导师', '教师实践'] },
  { name: '就业合作', description: '建立就业推荐渠道，优先录用毕业生', tags: ['就业推荐', '定向招聘', '校园招聘'] },
  { name: '产学研合作', description: '开展产业研究、技术服务和成果转化', tags: ['技术服务', '产业研究', '专利申报'] },
  { name: '创新创业', description: '共建创业孵化基地，支持学生创新创业', tags: ['创业孵化', '创新项目', '创业大赛'] },
  { name: '技能竞赛', description: '联合举办或参加各类职业技能竞赛', tags: ['技能竞赛', '技能大赛', '竞赛培训'] },
  { name: '社会服务', description: '开展职业培训、技术咨询等社会服务', tags: ['职业培训', '技术咨询', '社区服务'] },
]

export default function CooperationTypesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">合作类型管理</h1>
          <p className="text-muted-foreground">维护平台合作类型字典与分类体系</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增类型
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            合作类型字典
          </CardTitle>
          <CardDescription>平台内所有合作类型的基础配置，用于合作协议和项目分类</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类型名称</TableHead>
                <TableHead>类型说明</TableHead>
                <TableHead>关联标签</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typeDetails.map((type) => (
                <TableRow key={type.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      {type.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">{type.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {type.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 项目类型映射 */}
      <Card>
        <CardHeader>
          <CardTitle>合作项目类型映射</CardTitle>
          <CardDescription>合作类型与项目类型的对应关系配置</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>默认项目类型</Label>
            <Input defaultValue="人才培养项目" />
          </div>
          <div className="space-y-2">
            <Label>流程模板</Label>
            <Input defaultValue="标准校企合作流程" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>权限模板说明</Label>
            <Textarea
              rows={3}
              defaultValue="各合作类型对应的默认权限配置，包括学校管理员、合作主体管理员、教师、专家等角色的操作权限范围。"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
