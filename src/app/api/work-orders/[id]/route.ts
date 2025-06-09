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
          { error: 'Work order not found.' },
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource.' },
        { status: 401 }
      )
    }

    const workOrder = await prisma.workOrder.findUnique({
      where: { id: params.id },
      include: {
        assignedTo: true,
        createdBy: true
      }
    })

    if (!workOrder) {
      return NextResponse.json(
        { error: 'Work order not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json(workOrder)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to update a work order.' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const workOrder = await prisma.workOrder.update({
      where: { id: params.id },
      data,
      include: {
        assignedTo: true,
        createdBy: true
      }
    })

    return NextResponse.json(workOrder)
  } catch (error) {
    return handleApiError(error)
  }
} 