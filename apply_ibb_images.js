const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageUpdates = [
  { name: "Suzuki Hayabusa", image: "https://i.ibb.co.com/BVrnBmjV/Suzuki-Hayabusa-SPORT-1340cc.jpg" },
  { name: "Suzuki Nex II", image: "https://i.ibb.co.com/ds4R7gmC/Suzuki-Nex-II-MATIC-113cc.webp" },
  { name: "Suzuki Avenis 125", image: "https://i.ibb.co.com/Q3x1x5j1/Suzuki-Avenis-125-MATIC-124cc.jpg" },
  { name: "Suzuki Satria F150", image: "https://i.ibb.co.com/fz62CSKh/Suzuki-Satria-F150-UNDERBONE-147cc.avif" },
  { name: "Suzuki V-STROM 650", image: "https://i.ibb.co.com/TBBtCcJt/uzuki-V-STROM-650-BIG-BIKE-645cc.jpg" },
  { name: "Suzuki RM-Z450", image: "https://i.ibb.co.com/9mcHzhDG/Suzuki-RM-Z450-SPORT-449cc.jpg" },
  { name: "Suzuki Burgman 400", image: "https://i.ibb.co.com/whh59fzC/Suzuki-Burgman-400-MATIC-400cc.jpg" },
  { name: "Suzuki SV650", image: "https://i.ibb.co.com/FL70ktXW/Suzuki-SV650-BIG-BIKE-645cc.jpg" },
  { name: "Suzuki Katana", image: "https://i.ibb.co.com/9m7GXyYT/Suzuki-Katana-SPORT-999cc.jpg" },
  { name: "Suzuki GSX-R750", image: "https://i.ibb.co.com/1Gm13cZd/Suzuki-GSX-R750-SPORT-750cc.jpg" }
];

async function main() {
  console.log("Updating motorcycle images to user-provided ImgBB links...");
  let updated = 0;
  for (const item of imageUpdates) {
    const result = await prisma.motorcycle.updateMany({
      where: { name: item.name },
      data: { image: item.image }
    });
    if (result.count > 0) {
      console.log(`✅ Updated: ${item.name}`);
      updated++;
    } else {
      console.log(`⚠️  Not found: ${item.name}`);
    }
  }
  console.log(`\nDone! ${updated}/${imageUpdates.length} motorcycles updated.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
