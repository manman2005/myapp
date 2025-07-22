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

    const customers = await prisma.customer.findMany({
      include: {
        workOrders: true, // Include related work orders
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(customers)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to create a customer.' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ['name']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    return handleApiError(error)
  }
} 