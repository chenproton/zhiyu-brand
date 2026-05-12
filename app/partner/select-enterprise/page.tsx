'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2 } from 'lucide-react'
import { enterprises } from '@/lib/mock-data'
import { usePartner } from '../partner-context'

export default function SelectEnterprisePage() {
  const router = useRouter()
  const { isLoggedIn, selectedEnterpriseId, selectEnterprise } = usePartner()
  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/partner/login')
    } else if (selectedEnterpriseId) {
      router.replace('/partner/jobs')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConfirm = () => {
    if (!selectedId) return
    selectEnterprise(selectedId)
    router.push('/partner/jobs')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">选择所属企业</CardTitle>
          <CardDescription>请选择您所属的企业以进入企业门户</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger>
              <SelectValue placeholder="请选择企业" />
            </SelectTrigger>
            <SelectContent>
              {enterprises.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            进入门户
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
