const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'admin1@example.com';
  const password = 'admin123';
  const fullName = 'Admin User';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });
    console.log(`User ${user.email} created successfully.`);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      console.error(`Error: User with email ${email} already exists.`);
    } else {
      console.error('Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
