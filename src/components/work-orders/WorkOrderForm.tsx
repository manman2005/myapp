'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { useCustomer } from '@/contexts/CustomerContext'

const workOrderSchema = z.object({
  customerId: z.string().min(1, 'กรุณาระบุรหัสลูกค้า'),
  title: z.string().min(1, 'กรุณากรอกหัวข้องาน'),
  description: z.string().optional(),
  deviceType: z.string().min(1, 'กรุณาระบุประเภทอุปกรณ์'),
  brand: z.string().min(1, 'กรุณาระบุยี่ห้อ'),
  model: z.string().min(1, 'กรุณาระบุรุ่น'),
  serialNumber: z.string().min(1, 'กรุณาระบุหมายเลขเครื่อง'),
  problem: z.string().min(1, 'กรุณาระบุปัญหา'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  amount: z.number().min(0).optional(),
})

type WorkOrderFormData = z.infer<typeof workOrderSchema>

interface WorkOrderFormProps {
  onSubmit: (data: WorkOrderFormData) => Promise<boolean>
  initialData?: WorkOrderFormData
}

export function WorkOrderForm({ onSubmit, initialData }: WorkOrderFormProps) {
  const { state: { customers } } = useCustomer()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: initialData || {
      priority: 'MEDIUM',
      status: 'PENDING',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      })
    }
  }, [initialData, reset])

  const debouncedSubmit = useDebouncedCallback(async (data: WorkOrderFormData) => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      const success = await onSubmit(data)
      if (success) {
        reset()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, 1000, { leading: true, trailing: false })

  const onSubmitHandler = useCallback(async (data: WorkOrderFormData) => {
    if (!isValid) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    await debouncedSubmit(data)
  }, [isValid, debouncedSubmit])

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ลูกค้า
          </label>
          <select
            id="customerId"
            disabled={isSubmitting}
            {...register('customerId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          >
            <option value="">เลือกลูกค้า</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.phone || 'ไม่ระบุเบอร์โทร'}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            หัวข้องาน
          </label>
          <input
            type="text"
            id="title"
            disabled={isSubmitting}
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ประเภทอุปกรณ์
          </label>
          <input
            type="text"
            id="deviceType"
            disabled={isSubmitting}
            {...register('deviceType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
          {errors.deviceType && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deviceType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ยี่ห้อ
          </label>
          <input
            type="text"
            id="brand"
            disabled={isSubmitting}
            {...register('brand')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            รุ่น
          </label>
          <input
            type="text"
            id="model"
            disabled={isSubmitting}
            {...register('model')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            หมายเลขเครื่อง
          </label>
          <input
            type="text"
            id="serialNumber"
            disabled={isSubmitting}
            {...register('serialNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
          {errors.serialNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serialNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          ปัญหาที่พบ
        </label>
        <textarea
          id="problem"
          rows={3}
          disabled={isSubmitting}
          {...register('problem')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
        />
        {errors.problem && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.problem.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          รายละเอียดเพิ่มเติม
        </label>
        <textarea
          id="description"
          rows={3}
          disabled={isSubmitting}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ความสำคัญ
          </label>
          <select
            id="priority"
            disabled={isSubmitting}
            {...register('priority')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          >
            <option value="LOW">ต่ำ</option>
            <option value="MEDIUM">ปานกลาง</option>
            <option value="HIGH">สูง</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            สถานะ
          </label>
          <select
            id="status"
            disabled={isSubmitting}
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          >
            <option value="PENDING">รอดำเนินการ</option>
            <option value="IN_PROGRESS">กำลังดำเนินการ</option>
            <option value="COMPLETED">เสร็จสิ้น</option>
            <option value="CANCELLED">ยกเลิก</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            วันที่เริ่ม
          </label>
          <input
            type="date"
            id="startDate"
            disabled={isSubmitting}
            {...register('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            วันที่เสร็จ
          </label>
          <input
            type="date"
            id="endDate"
            disabled={isSubmitting}
            {...register('endDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ค่าซ่อม
          </label>
          <input
            type="number"
            id="amount"
            disabled={isSubmitting}
            {...register('amount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
    </form>
  )
} 