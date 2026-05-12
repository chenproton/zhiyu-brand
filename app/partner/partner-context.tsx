'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

const LOGIN_KEY = 'partner_logged_in'
const ENTERPRISE_KEY = 'partner_enterprise_id'

interface PartnerContextType {
  isLoggedIn: boolean
  selectedEnterpriseId: string
  login: () => void
  logout: () => void
  selectEnterprise: (id: string) => void
}

const PartnerContext = createContext<PartnerContextType | null>(null)

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState('')

  useEffect(() => {
    const loggedIn = localStorage.getItem(LOGIN_KEY) === 'true'
    const enterpriseId = localStorage.getItem(ENTERPRISE_KEY) || ''
    setIsLoggedIn(loggedIn)
    setSelectedEnterpriseId(enterpriseId)

    const onStorage = (e: StorageEvent) => {
      if (e.key === LOGIN_KEY) {
        setIsLoggedIn(e.newValue === 'true')
      }
      if (e.key === ENTERPRISE_KEY) {
        setSelectedEnterpriseId(e.newValue || '')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = useCallback(() => {
    localStorage.setItem(LOGIN_KEY, 'true')
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LOGIN_KEY)
    localStorage.removeItem(ENTERPRISE_KEY)
    setIsLoggedIn(false)
    setSelectedEnterpriseId('')
  }, [])

  const selectEnterprise = useCallback((id: string) => {
    localStorage.setItem(ENTERPRISE_KEY, id)
    setSelectedEnterpriseId(id)
  }, [])

  return (
    <PartnerContext.Provider
      value={{ isLoggedIn, selectedEnterpriseId, login, logout, selectEnterprise }}
    >
      {children}
    </PartnerContext.Provider>
  )
}

export function usePartner() {
  const ctx = useContext(PartnerContext)
  if (!ctx) {
    throw new Error('usePartner must be used within PartnerProvider')
  }
  return ctx
}
