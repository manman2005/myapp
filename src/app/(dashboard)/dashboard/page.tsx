import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect('/sign-in')
  }

  try {
    // ดึงข้อมูลผู้ใช้
    const user = await prisma.user.findUnique({
      where: { 
        email: session.user.email 
      }
    })

    if (!user) {
      console.error('User not found in database')
      return redirect('/sign-in')
    }

    // ดึงข้อมูลรายได้ประจำเดือน
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const monthlyIncome = await prisma.workOrder.aggregate({
      where: {
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ],
        status: 'COMPLETED',
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    // ดึงข้อมูลรายได้ประจำปี
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1)
    const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31)

    const yearlyIncome = await prisma.workOrder.aggregate({
      where: {
        OR: [
          { assignedToId: user.id },
          { createdById: user.id }
        ],
        status: 'COMPLETED',
        createdAt: {
          gte: firstDayOfYear,
          lte: lastDayOfYear
        }
      },
      _sum: {
        amount: true
      }
    })

    // ดึงข้อมูล work orders ล่าสุด
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
      take: 5,
      include: {
        assignedTo: true,
        createdBy: true
      }
    })

    const completedWorkOrdersCount = recentWorkOrders.filter(order => order.status === 'COMPLETED').length

    return (
      <DashboardClient 
        user={user}
        monthlyIncome={monthlyIncome._sum.amount || 0}
        yearlyIncome={yearlyIncome._sum.amount || 0}
        recentWorkOrders={recentWorkOrders}
        completedWorkOrdersCount={completedWorkOrdersCount}
      />
    )
  } catch (error) {
    console.error('Error in dashboard:', error)
    return redirect('/sign-in')
  }
} 