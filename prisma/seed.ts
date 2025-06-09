import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // สร้างผู้ใช้
  const password = await hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      fullName: 'Admin User',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'tech@example.com' },
    update: {},
    create: {
      email: 'tech@example.com',
      password,
      fullName: 'Tech Support',
    },
  })

  // สร้างงานซ่อม
  await prisma.workOrder.create({
    data: {
      title: 'ซ่อมคอมพิวเตอร์',
      description: 'เครื่องเปิดไม่ติด ต้องการตรวจสอบและซ่อมแซม',
      status: 'pending',
      createdById: user1.id,
      assignedToId: user2.id,
      startDate: new Date(),
      amount: 1500,
    },
  })

  await prisma.workOrder.create({
    data: {
      title: 'ติดตั้ง Windows',
      description: 'ติดตั้ง Windows 11 และโปรแกรมพื้นฐาน',
      status: 'in_progress',
      createdById: user1.id,
      assignedToId: user2.id,
      startDate: new Date(),
      amount: 800,
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 