import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10)

    // สร้างผู้ใช้ใหม่
    const user = await prisma.user.create({
      data: {
        fullName: name,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', user: { id: user.id, fullName: user.fullName, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
} 