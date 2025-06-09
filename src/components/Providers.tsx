'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { CustomerProvider } from '@/contexts/CustomerContext'
import { WorkOrderProvider } from '@/contexts/WorkOrderContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CustomerProvider>
          <WorkOrderProvider>
            {children}
          </WorkOrderProvider>
        </CustomerProvider>
      </ThemeProvider>
    </SessionProvider>
  )
} 