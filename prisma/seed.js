const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('password123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      fullName: 'Admin User',
    },
  })

  // Create tech user
  const techPassword = await hash('password123', 10)
  const tech = await prisma.user.upsert({
    where: { email: 'tech@example.com' },
    update: {},
    create: {
      email: 'tech@example.com',
      password: techPassword,
      fullName: 'Tech Support',
    },
  })

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'บริษัท เอบีซี จำกัด',
      phone: '02-123-4567',
      email: 'contact@abc.co.th',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'คุณสมชาย ใจดี',
      phone: '081-234-5678',
      email: 'somchai@email.com',
      address: '456 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
    },
  })

  // Create sample work orders
  await prisma.workOrder.createMany({
    skipDuplicates: true,
    data: [
      {
        customerId: customer1.id,
        title: 'ซ่อมคอมพิวเตอร์ไม่เปิด',
        description: 'เครื่องคอมพิวเตอร์ไม่เปิด หน้าจอไม่แสดงผล',
        deviceType: 'Computer',
        brand: 'Dell',
        model: 'Optiplex 7090',
        serialNumber: 'DELL123456',
        problem: 'เครื่องไม่เปิด ไฟไม่ติด',
        status: 'PENDING',
        createdById: admin.id,
      },
      {
        customerId: customer1.id,
        title: 'ติดตั้ง Windows',
        description: 'ติดตั้ง Windows 11 และโปรแกรมพื้นฐาน',
        deviceType: 'Computer',
        brand: 'HP',
        model: 'ProDesk 600 G6',
        serialNumber: 'HP789012',
        problem: 'ต้องการติดตั้ง Windows ใหม่',
        status: 'IN_PROGRESS',
        createdById: admin.id,
        assignedToId: tech.id,
        startDate: new Date(),
      },
      {
        customerId: customer2.id,
        title: 'เปลี่ยน RAM',
        description: 'อัพเกรด RAM จาก 8GB เป็น 16GB',
        deviceType: 'Computer',
        brand: 'Lenovo',
        model: 'ThinkCentre M720',
        serialNumber: 'LEN345678',
        problem: 'ต้องการเพิ่ม RAM',
        status: 'COMPLETED',
        createdById: admin.id,
        assignedToId: tech.id,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        amount: 2500,
      },
    ],
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