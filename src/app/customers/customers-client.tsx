'use client'

import { useCallback, useState } from 'react'
import { useCustomer } from '@/contexts/CustomerContext'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { CustomerList } from '@/components/customers/CustomerList'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function CustomersClient() {
  const { state: { customers, loading, error }, createCustomer } = useCustomer()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateCustomer = useCallback(async (data: any) => {
    const success = await createCustomer(data)
    if (success) {
      setIsDialogOpen(false)
    }
  }, [createCustomer])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">รายชื่อลูกค้า</h1>
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
          <h1 className="text-2xl font-bold">รายชื่อลูกค้า</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
        </div>
      </div>
    )
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">รายชื่อลูกค้า</h1>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            เพิ่มลูกค้าใหม่
          </Button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">ยังไม่มีรายชื่อลูกค้า</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
            </DialogHeader>
            <CustomerForm onSubmit={handleCreateCustomer} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">รายชื่อลูกค้า</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          เพิ่มลูกค้าใหม่
        </Button>
      </div>
      <CustomerList customers={customers} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
          </DialogHeader>
          <CustomerForm onSubmit={handleCreateCustomer} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 