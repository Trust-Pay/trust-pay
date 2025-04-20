"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoleAuth } from '@/WEB3/components/RoleAuth'

export default function AuthPage() {
  const router = useRouter()

  const handleRoleConfirmed = (role: 'employer' | 'employee' | null) => {
    if (role === 'employer') {
      router.push('/employer')
    } else if (role === 'employee') {
      router.push('/employee')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex-grow flex items-center justify-center py-8">
        <RoleAuth onRoleConfirmed={handleRoleConfirmed} />
      </main>
    </div>
  )
}