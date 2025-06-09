import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Helper function to handle common API errors
const handleApiError = (error: unknown) => {
  console.error('API Error:', error)
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'A unique constraint violation occurred.' },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found.' },
          { status: 404 }
        )
      default:
        return NextResponse.json(
          { error: 'Database error occurred.' },
          { status: 500 }
        )
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: 'Invalid data provided.' },
      { status: 400 }
    )
  }
  
  return NextResponse.json(
    { error: 'An unexpected error occurred.' },
    { status: 500 }
  )
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      )
    }

    const workOrders = await prisma.workOrder.findMany({
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
        assignedTo: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(workOrders)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to create a work order.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      )
    }

    const data = await request.json()
    console.log('Received data:', data)
    console.log('User ID:', user.id)

    // Validate required fields
    const requiredFields = ['customerId', 'title', 'description', 'deviceType', 'brand', 'model', 'serialNumber', 'problem']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    const workOrder = await prisma.workOrder.create({
      data: {
        customerId: data.customerId,
        title: data.title,
        description: data.description || '',
        deviceType: data.deviceType,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        problem: data.problem,
        priority: data.priority || 'MEDIUM',
        status: data.status || 'PENDING',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        amount: data.amount || 0,
        createdById: user.id
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    })

    return NextResponse.json(workOrder)
  } catch (error) {
    console.error('Error creating work order:', error)
    return handleApiError(error)
  }
} 