"use client"

type EmployerLayoutProps = {
  children: React.ReactNode
}

export default function EmployerLayout({ children }: EmployerLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {children}
    </div>
  )
}