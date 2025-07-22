'use client'

import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useWorkOrder } from '@/contexts/WorkOrderContext'
import WorkOrdersClient from './work-orders-client'

export default function WorkOrdersPage() {
  const { data: session, status } = useSession()
  const { fetchWorkOrders } = useWorkOrder()

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login')
    }
  }, [status])

  

  if (status === 'unauthenticated') {
    return null
  }

  if (session) {
    return <WorkOrdersClient />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">รายการงานซ่อม</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  )
} 