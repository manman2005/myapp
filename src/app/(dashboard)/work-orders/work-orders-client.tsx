'use client'

import { useCallback, useState, useEffect } from 'react'
import { useWorkOrder } from '@/contexts/WorkOrderContext'
import { useCustomer } from '@/contexts/CustomerContext'
import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm'
import { WorkOrderList } from '@/components/work-orders/WorkOrderList'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function WorkOrdersClient() {
  const { state: { workOrders, loading: workOrdersLoading, error: workOrdersError }, createWorkOrder, fetchWorkOrders } = useWorkOrder()
  const { state: { customers, loading: customersLoading }, fetchCustomers } = useCustomer()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchCustomers()
    fetchWorkOrders()
  }, [fetchCustomers, fetchWorkOrders])

  const handleCreateWorkOrder = useCallback(async (data: any) => {
    const success = await createWorkOrder(data)
    if (success) {
      setIsDialogOpen(false)
      await fetchWorkOrders()
    }
  }, [createWorkOrder, fetchWorkOrders])

  const loading = workOrdersLoading || customersLoading
  const error = workOrdersError

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">รายการงานซ่อม</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">รายการงานซ่อม</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
        </div>
      </div>
    )
  }

  if (!workOrders || workOrders.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">รายการงานซ่อม</h1>
          <Button onClick={() => setIsDialogOpen(true)} disabled={!customers || customers.length === 0} className="bg-green-500 hover:bg-green-600 text-white">
            สร้างงานใหม่
          </Button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {!customers || customers.length === 0 
              ? 'กรุณาเพิ่มลูกค้าก่อนสร้างงานซ่อม'
              : 'ยังไม่มีรายการงาน'}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>สร้างงานซ่อมใหม่</DialogTitle>
            </DialogHeader>
            <WorkOrderForm onSubmit={handleCreateWorkOrder} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">รายการงานซ่อม</h1>
        <Button onClick={() => setIsDialogOpen(true)} disabled={!customers || customers.length === 0} className="bg-green-500 hover:bg-green-600 text-white">
          สร้างงานใหม่
        </Button>
      </div>
      <WorkOrderList workOrders={workOrders} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างงานซ่อมใหม่</DialogTitle>
          </DialogHeader>
          <WorkOrderForm onSubmit={handleCreateWorkOrder} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 