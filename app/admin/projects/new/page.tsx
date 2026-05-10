'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { partners, agreements } from '@/lib/mock-data'
import { PROJECT_PHASE_LABELS } from '@/lib/types'
import type { ProjectPhase } from '@/lib/types'

const PROJECT_TYPES = [
  '人才培养项目',
  '技术研发项目',
  '基地建设项目',
  '技能竞赛项目',
  '创新创业项目',
  '师资培训项目',
  '课程开发项目',
]

export default function NewProjectPage() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    partnerId: '',
    type: '',
    agreementId: '',
    phase: 'initiation' as ProjectPhase,
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    outputs: [] as string[],
  })
  const [newOutput, setNewOutput] = useState('')

  // Filter agreements by selected partner
  const filteredAgreements = formData.partnerId
    ? agreements.filter((a) => a.partnerId === formData.partnerId)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save to database here
    alert('项目信息已保存（演示）')
    router.push('/admin/projects')
  }

  const addOutput = () => {
    if (newOutput.trim()) {
      setFormData((prev) => ({
        ...prev,
        outputs: [...prev.outputs, newOutput.trim()],
      }))
      setNewOutput('')
    }
  }

  const removeOutput = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== index),
    }))
  }

  return (
    <div>
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">项目信息</CardTitle>
                <CardDescription>填写项目的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">项目名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="请输入项目名称"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partnerId">合作主体 *</Label>
                    <Select
                      value={formData.partnerId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, partnerId: value, agreementId: '' }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择合作主体" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">项目类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择项目类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agreementId">关联协议</Label>
                    <Select
                      value={formData.agreementId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, agreementId: value }))
                      }
                      disabled={!formData.partnerId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.partnerId ? '请选择关联协议' : '请先选择合作主体'} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAgreements.map((agreement) => (
                          <SelectItem key={agreement.id} value={agreement.id}>
                            {agreement.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phase">项目阶段</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, phase: value as ProjectPhase }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_PHASE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">项目简介</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="请输入项目简介"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time & Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">时间与预算</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">开始日期 *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">结束日期 *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">项目预算（元）</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, budget: e.target.value }))
                      }
                      placeholder="如：500000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outputs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">预期成果</CardTitle>
                <CardDescription>添加项目计划产出的成果</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newOutput}
                    onChange={(e) => setNewOutput(e.target.value)}
                    placeholder="输入预期成果"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOutput()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addOutput}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.outputs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.outputs.map((output, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg"
                      >
                        <span className="text-sm">{output}</span>
                        <button
                          type="button"
                          onClick={() => removeOutput(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/admin/projects">
                <Button type="button" variant="outline">
                  取消
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </form>
    </div>
  )
}
