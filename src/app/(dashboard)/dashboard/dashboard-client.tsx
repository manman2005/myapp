'use client'

import { useState } from 'react'
import { User, WorkOrder } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'

interface DashboardClientProps {
  user: User
  monthlyIncome: number
  yearlyIncome: number
  recentWorkOrders: WorkOrder[]
}

export default function DashboardClient({
  user,
  monthlyIncome,
  yearlyIncome,
  recentWorkOrders,
}: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // ข้อมูลสำหรับกราฟแท่ง
  const dailyTasksData = [
    { day: 'จันทร์', tasks: 4 },
    { day: 'อังคาร', tasks: 3 },
    { day: 'พุธ', tasks: 2 },
    { day: 'พฤหัส', tasks: 5 },
    { day: 'ศุกร์', tasks: 4 },
    { day: 'เสาร์', tasks: 3 },
    { day: 'อาทิตย์', tasks: 2 },
  ]

  // ข้อมูลสำหรับกราฟเส้น
  const dailyIncomeData = [
    { day: 'จันทร์', income: 2000 },
    { day: 'อังคาร', income: 1500 },
    { day: 'พุธ', income: 9500 },
    { day: 'พฤหัส', income: 4000 },
    { day: 'ศุกร์', income: 5000 },
    { day: 'เสาร์', income: 3500 },
    { day: 'อาทิตย์', income: 4000 },
  ]

  // กรองรายการงานตามคำค้นหา
  const filteredWorkOrders = recentWorkOrders.filter(order =>
    order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 bg-[#0f172a]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1e293b] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-200">รายได้ประจำเดือน</h3>
          <p className="text-2xl font-bold text-green-500">
            {monthlyIncome.toLocaleString()} ฿
          </p>
          <p className="text-sm text-gray-400">เพิ่มขึ้น 25% จากเดือนที่แล้ว</p>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-200">รายได้ประจำปี</h3>
          <p className="text-2xl font-bold text-blue-500">
            {yearlyIncome.toLocaleString()} ฿
          </p>
          <p className="text-sm text-gray-400">เพิ่มขึ้น 15% จากปีที่แล้ว</p>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-200">งานทั้งหมด</h3>
          <p className="text-2xl font-bold text-purple-500">5</p>
          <p className="text-sm text-gray-400">งานใหม่ 5 รายการ</p>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2 text-gray-200">งานที่เสร็จสิ้น</h3>
          <p className="text-2xl font-bold text-orange-500">0</p>
          <p className="text-sm text-gray-400">อัตราความสำเร็จ 95%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#1e293b] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-200">งานของรายสัปดาห์</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyTasksData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#e5e7eb'
                }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="tasks" fill="#3b82f6" name="จำนวนงาน" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-200">รายได้รายสัปดาห์</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyIncomeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#e5e7eb'
                }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                name="รายได้"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-200">รายการงานล่าสุด</h3>
          <Input
            type="search"
            placeholder="ค้นหารายการงาน..."
            className="max-w-xs bg-[#0f172a] border-gray-700 text-gray-200 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2 text-gray-200">หัวข้อ</th>
                <th className="text-left p-2 text-gray-200">รายละเอียด</th>
                <th className="text-left p-2 text-gray-200">สถานะ</th>
                <th className="text-left p-2 text-gray-200">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700">
                  <td className="p-2 text-gray-300">{order.title}</td>
                  <td className="p-2 text-gray-300">{order.description}</td>
                  <td className="p-2 text-gray-300">{order.status}</td>
                  <td className="p-2 text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 