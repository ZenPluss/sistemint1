const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 AS connected`;
    console.log('✅ Neon connected successfully!', result);

    const motorcycleCount = await prisma.motorcycle.count();
    console.log(`✅ Motorcycle table exists. Total rows: ${motorcycleCount}`);

    const userCount = await prisma.user.count();
    console.log(`✅ User table exists. Total rows: ${userCount}`);

    console.log('\n🎉 Database is ready to use!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
