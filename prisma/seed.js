const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create an anonymous user explicitly for the test-ride form
  await prisma.user.upsert({
    where: { id: "anonymous" },
    update: {},
    create: {
      id: "anonymous",
      email: "anonymous@suzukiride.local",
      password: "hashed_dummy_password",
      name: "Guest Visitor",
      role: "CUSTOMER"
    }
  })

  // Create Dealers
  const jakartaDealer = await prisma.dealer.create({
    data: {
      name: "Suzuki Sunter Pusat",
      location: "Jakarta Utara",
      contact: "+62 812 3456 7890"
    }
  })

  // Create Motorcycles
  const gsx = await prisma.motorcycle.create({
    data: {
      name: "GSX-R1000R",
      type: "SPORT",
      engineSize: 1000,
      price: 11999,
      image: "https://www.globalsuzuki.com/globalnews/2025/img/0731b.jpg",
      description: "The most powerful, hardest-accelerating, cleanest-running GSX-R ever built. Precision engineered for track domination."
    }
  })

  const vstrom = await prisma.motorcycle.create({
    data: {
      name: "V-STROM 1050DE",
      type: "BIG_BIKE", // Changed from ADVENTURE to BIG_BIKE based on available enum
      engineSize: 1037,
      price: 14849,
      image: "https://motortrade.com.ph/wp-content/uploads/2024/05/2-6.jpg",
      description: "Engineered to tackle the toughest terrain. Master the adventure with the definitive adventure motorcycle."
    }
  })

  const gsx8s = await prisma.motorcycle.create({
    data: {
      name: "GSX-8S",
      type: "SPORT", // Changed from STREET to SPORT based on available enum
      engineSize: 776,
      price: 8999,
      image: "/636ccc8b19ff3.jpg",
      description: "A brand new street fighter with a potent parallel-twin engine and striking design perfect for the modern rider."
    }
  })

  console.log("Database perfectly seeded!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
