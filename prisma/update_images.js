const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const updates = [
  { name: "Suzuki Hayabusa", file: "/Suzuki Hayabusa (SPORT - 1340cc).jpg" },
  { name: "Suzuki GSX-R750", file: "/Suzuki GSX-R750 (SPORT - 750cc).jpg" },
  { name: "Suzuki Katana", file: "/Suzuki Katana (SPORT - 999cc).jpg" },
  { name: "Suzuki SV650", file: "/Suzuki SV650 (BIG_BIKE - 645cc).jpg" },
  { name: "Suzuki Burgman 400", file: "/Suzuki Burgman 400 (MATIC - 400cc).jpg" },
  { name: "Suzuki RM-Z450", file: "/Suzuki RM-Z450 (SPORT - 449cc).jpg" },
  { name: "Suzuki V-STROM 650", file: "/uzuki V-STROM 650 (BIG_BIKE - 645cc).jpg" },
  { name: "Suzuki Satria F150", file: "/Suzuki Satria F150 (UNDERBONE - 147cc).avif" },
  { name: "Suzuki Avenis 125", file: "/Suzuki Avenis 125 (MATIC - 124cc).jpeg" },
  { name: "Suzuki Nex II", file: "/Suzuki Nex II (MATIC - 113cc).webp" }
];

async function main() {
  console.log("Updating images...");
  for (const item of updates) {
    const motos = await prisma.motorcycle.findMany({ where: { name: item.name } });
    for (const m of motos) {
       await prisma.motorcycle.update({
         where: { id: m.id },
         data: { image: item.file }
       });
       console.log(`Updated ${m.name} to use local image ${item.file}`);
    }
  }
  console.log("Done updating images!");
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
