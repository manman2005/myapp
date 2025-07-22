import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
          { error: 'Customer not found.' },
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
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

    try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json({ error: 'ไม่พบลูกค้า' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
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
        { error: 'You must be logged in to update a customer.' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(customer)
  } catch (error) {
    return handleApiError(error)
  }
}