'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import { WorkOrder, User } from '@prisma/client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WorkOrderForm } from '@/components/work-orders/WorkOrderForm'

interface ReportsClientProps {
  totalWorkOrders: number
  inProgressWorkOrders: number
  totalIncome: number
  totalCustomers: number
  recentWorkOrders: (WorkOrder & {
    assignedTo: User | null
    createdBy: User
  })[]
}

export default function ReportsClient({
  totalWorkOrders,
  inProgressWorkOrders,
  totalIncome,
  totalCustomers,
  recentWorkOrders
}: ReportsClientProps) {

  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly')
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateWorkOrder = async (data: any) => {
    try {
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create work order')
      }

      // Refresh the page to show the new work order
      window.location.reload()
    } catch (error) {
      console.error('Error creating work order:', error)
    }
  }

  // ข้อมูลตัวอย่างสำหรับกราฟ
  const dailyData = [
    { name: "จันทร์", workOrders: 4, income: 2000 },
    { name: "อังคาร", workOrders: 3, income: 1500 },
    { name: "พุธ", workOrders: 2, income: 9500 },
    { name: "พฤหัส", workOrders: 5, income: 4000 },
    { name: "ศุกร์", workOrders: 4, income: 5000 },
    { name: "เสาร์", workOrders: 3, income: 3500 },
    { name: "อาทิตย์", workOrders: 2, income: 4200 },
  ]

  const monthlyData = [
    { name: "ม.ค.", workOrders: 20, income: 24000 },
    { name: "ก.พ.", workOrders: 15, income: 13980 },
    { name: "มี.ค.", workOrders: 25, income: 98000 },
    { name: "เม.ย.", workOrders: 18, income: 39080 },
    { name: "พ.ค.", workOrders: 22, income: 48000 },
    { name: "มิ.ย.", workOrders: 30, income: 38000 },
  ]

  const yearlyData = [
    { name: "2021", workOrders: 240, income: 240000 },
    { name: "2022", workOrders: 300, income: 398000 },
    { name: "2023", workOrders: 280, income: 280000 },
    { name: "2024", workOrders: 100, income: 108000 },
  ]

  // ฟังก์ชันสำหรับแปลงสถานะเป็นภาษาไทย
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'รอดำเนินการ'
      case 'IN_PROGRESS':
        return 'กำลังดำเนินการ'
      case 'COMPLETED':
        return 'เสร็จสิ้น'
      case 'CANCELLED':
        return 'ยกเลิก'
      default:
        return status
    }
  }

  // ฟังก์ชันสำหรับกำหนดสีของสถานะ
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // ฟังก์ชันสำหรับข้อมูลกราฟ
  const getChartData = () => {
    switch (period) {
      case 'monthly':
        return monthlyData
      case 'yearly':
        return yearlyData
      default:
        return dailyData
    }
  }

  // กรองรายการตามคำค้นหา
  const filteredWorkOrders = recentWorkOrders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.createdBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.assignedTo?.fullName.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">รายงานสรุป</h2>
            <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">สร้างงานใหม่</Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-[#1e293b] p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-white">งานทั้งหมด</h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-500">{totalWorkOrders}</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">งานซ่อมทั้งหมดในระบบ</p>
            </div>
            <div className="bg-[#1e293b] p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-white">งานที่กำลังดำเนินการ</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-500">{inProgressWorkOrders}</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">งานที่อยู่ระหว่างดำเนินการ</p>
            </div>
            <div className="bg-[#1e293b] p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-white">รายได้รวม</h3>
              <p className="text-2xl sm:text-3xl font-bold text-green-500">{totalIncome.toLocaleString()} ฿</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">รายได้ทั้งหมดจากงานซ่อม</p>
            </div>
            <div className="bg-[#1e293b] p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-white">ลูกค้าทั้งหมด</h3>
              <p className="text-2xl sm:text-3xl font-bold text-orange-500">{totalCustomers}</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">จำนวนลูกค้าในระบบ</p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                period === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1e293b] text-gray-300'
              }`}
            >
              รายวัน
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                period === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1e293b] text-gray-300'
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                period === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1e293b] text-gray-300'
              }`}
            >
              รายปี
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Work Orders Chart */}
            <div className="bg-[#1e293b] p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-4 text-white">สถิติงานซ่อม</h3>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="workOrders" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income Chart */}
            <div className="bg-[#1e293b] p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-4 text-white">สถิติรายได้</h3>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="income" stroke="#10B981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Work Orders */}
          <div className="bg-[#1e293b] rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
              <h3 className="text-base sm:text-lg font-medium text-white">รายการงานล่าสุด</h3>
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-gray-300 placeholder-gray-500 text-sm"
              />
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[1200px] sm:w-full p-4 sm:p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2 text-xs sm:text-sm text-gray-300">รหัสงาน</th>
                      <th className="text-left p-2 text-xs sm:text-sm text-gray-300">ผู้สร้าง</th>
                      <th className="text-left p-2 text-xs sm:text-sm text-gray-300">ผู้รับผิดชอบ</th>
                      <th className="text-left p-2 text-xs sm:text-sm text-gray-300">สถานะ</th>
                      <th className="text-left p-2 text-xs sm:text-sm text-gray-300">วันที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700">
                        <td className="p-2 text-xs sm:text-sm text-gray-300">
                          <Link href={`/work-orders/${order.id}`} className="text-blue-500 hover:text-blue-400">
                            {order.id}
                          </Link>
                        </td>
                        <td className="p-2 text-xs sm:text-sm text-gray-300">{order.createdBy.fullName}</td>
                        <td className="p-2 text-xs sm:text-sm text-gray-300">{order.assignedTo?.fullName || '-'}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="p-2 text-xs sm:text-sm text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString('th-TH')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>สร้างงานซ่อมใหม่</DialogTitle>
          </DialogHeader>
          <WorkOrderForm onSubmit={handleCreateWorkOrder} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 