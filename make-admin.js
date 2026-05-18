const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("Tidak ada user di database.");
    return;
  }
  
  // Karena saat ini biasanya anda baru register satu akun, kita update saja semua user jadi ADMIN untuk keperluan demo
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    console.log(`Berhasil mengubah role akun ${user.email} menjadi ADMIN.`);
  }
}

makeAdmin()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
