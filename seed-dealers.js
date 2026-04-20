const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dealers = [
    { name: 'Tokyo Distribution Hub', location: 'Tokyo Headquarters, Japan', contact: '+81-3-1234-5678' },
    { name: 'California West Coast Unit', location: 'Los Angeles, USA', contact: '+1-555-0192-334' },
    { name: 'London Central Ops', location: 'London, UK', contact: '+44-20-7946-0958' },
    { name: 'Frankfurt Euro Hub', location: 'Frankfurt, Germany', contact: '+49-69-123456' },
  ];

  for (const d of dealers) {
    const existing = await prisma.dealer.findFirst({ where: { name: d.name } });
    if (!existing) {
      await prisma.dealer.create({ data: d });
      console.log('Inserted:', d.name);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
