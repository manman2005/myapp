import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ReportsClient from './reports-client'

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect('/sign-in')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      }
    })

    if (!user) {
      console.error('User not found in database')
      return redirect('/sign-in')
    }

    // ดึงข้อมูลงานทั้งหมด
    const totalWorkOrders = await prisma.workOrder.count({
      where: {
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ]
      }
    })

    // ดึงข้อมูลงานที่กำลังดำเนินการ
    const inProgressWorkOrders = await prisma.workOrder.count({
      where: {
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ],
        status: 'IN_PROGRESS'
      }
    })

    // ดึงข้อมูลรายได้ทั้งหมด
    const totalIncome = await prisma.workOrder.aggregate({
      where: {
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ],
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })

    // ดึงข้อมูลจำนวนลูกค้า
    const totalCustomers = await prisma.customer.count()

    // ดึงข้อมูลงานซ่อมทั้งหมดพร้อมรายละเอียด
    const recentWorkOrders = await prisma.workOrder.findMany({
      where: {
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        assignedTo: true,
        createdBy: true
      }
    })

    return (
      <ReportsClient 
        totalWorkOrders={totalWorkOrders}
        inProgressWorkOrders={inProgressWorkOrders}
        totalIncome={totalIncome._sum.amount || 0}
        totalCustomers={totalCustomers}
        recentWorkOrders={recentWorkOrders}
      />
    )
  } catch (error) {
    console.error('Error in dashboard:', error)
    return redirect('/sign-in')
  }
} 