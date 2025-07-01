import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ReportsClient from "./reports-client"

async function getWorkOrdersData() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    // Handle unauthenticated state, maybe return empty arrays or throw an error
    return {
      totalWorkOrders: 0,
      inProgressWorkOrders: 0,
      totalIncome: 0,
      totalCustomers: 0,
      recentWorkOrders: [],
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    // Handle user not found
    return {
      totalWorkOrders: 0,
      inProgressWorkOrders: 0,
      totalIncome: 0,
      totalCustomers: 0,
      recentWorkOrders: [],
    }
  }

  const workOrders = await prisma.workOrder.findMany({
    where: {
      OR: [{ createdById: user.id }, { assignedToId: user.id }],
    },
    include: {
      assignedTo: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalWorkOrders = workOrders.length
  const inProgressWorkOrders = workOrders.filter(
    (order) => order.status === "IN_PROGRESS"
  ).length
  const totalIncome = workOrders
    .filter((order) => order.status === "COMPLETED")
    .reduce((sum, order) => sum + (order.amount || 0), 0)

  const customerIds = new Set(workOrders.map((order) => order.customerId))
  const totalCustomers = customerIds.size

  return {
    totalWorkOrders,
    inProgressWorkOrders,
    totalIncome,
    totalCustomers,
    recentWorkOrders: workOrders.slice(0, 10), // Return last 10 work orders
  }
}

export default async function ReportsPage() {
  const data = await getWorkOrdersData()

  return <ReportsClient {...data} />
}
 