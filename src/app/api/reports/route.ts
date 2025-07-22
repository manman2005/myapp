import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const handleApiError = (error: unknown) => {
  console.error('API Error:', error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json({ error: 'A unique constraint violation occurred.' }, { status: 409 })
      case 'P2025':
        return NextResponse.json({ error: 'Record not found.' }, { status: 404 })
      default:
        return NextResponse.json({ error: 'Database error occurred.' }, { status: 500 })
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 })
  }
  return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'monthly' // default to monthly

    let startDate: Date
    let endDate: Date

    const now = new Date()
    now.setHours(0, 0, 0, 0) // Normalize to start of day

    switch (period) {
      case 'daily':
        // Last 7 days
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 6) // Go back 6 days to include today
        endDate = new Date(now)
        endDate.setDate(now.getDate() + 1) // Up to end of today
        break
      case 'yearly':
        // Last 5 years
        startDate = new Date(now.getFullYear() - 4, 0, 1) // Start of 5 years ago
        endDate = new Date(now.getFullYear() + 1, 0, 1) // Start of next year
        break
      case 'monthly':
      default:
        // Last 12 months
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1) // Start of 12 months ago
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1) // Start of next month
        break
    }

    const workOrders = await prisma.workOrder.findMany({
      where: {
        createdById: user.id,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const aggregatedData: { [key: string]: { workOrders: number; income: number } } = {}

    workOrders.forEach((order) => {
      let key: string
      const date = new Date(order.createdAt)

      if (period === 'daily') {
        key = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }) // e.g., "Mon 22"
      } else if (period === 'yearly') {
        key = date.getFullYear().toString()
      } else { // monthly
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) // e.g., "Jul 2024"
      }

      if (!aggregatedData[key]) {
        aggregatedData[key] = { workOrders: 0, income: 0 }
      }
      aggregatedData[key].workOrders += 1
      aggregatedData[key].income += order.amount || 0
    })

    // Ensure all periods are represented, even if no data
    const result: { name: string; workOrders: number; income: number }[] = []
    let current = new Date(startDate)

    while (current < endDate) {
      let key: string
      let displayKey: string

      if (period === 'daily') {
        key = current.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
        displayKey = current.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' }) // For Thai display
        current.setDate(current.getDate() + 1)
      } else if (period === 'yearly') {
        key = current.getFullYear().toString()
        displayKey = current.getFullYear().toString()
        current.setFullYear(current.getFullYear() + 1)
      } else { // monthly
        key = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        displayKey = current.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' }) // For Thai display
        current.setMonth(current.getMonth() + 1)
      }

      result.push({
        name: displayKey,
        workOrders: aggregatedData[key]?.workOrders || 0,
        income: aggregatedData[key]?.income || 0,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}