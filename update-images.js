const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageUpdates = [
  {
    name: "Suzuki Hayabusa",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/2021_Suzuki_Hayabusa.jpg"
  },
  {
    name: "Suzuki GSX-R750",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Suzuki_GSX-R750_2006.jpg"
  },
  {
    name: "Suzuki Katana",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Suzuki_GSX1000S_Katana_1982.jpg"
  },
  {
    name: "Suzuki SV650",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/2007_Suzuki_SV650S.jpg"
  },
  {
    name: "Suzuki Burgman 400",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Suzuki_Burgman_400_2007.jpg"
  },
  {
    name: "Suzuki RM-Z450",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Suzuki_RMZ450_2010.jpg"
  },
  {
    name: "Suzuki V-STROM 650",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Suzuki_V-Strom_650_2012.jpg"
  },
  {
    name: "Suzuki Satria F150",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Suzuki_Satria_F150.jpg"
  },
  {
    name: "Suzuki Avenis 125",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Suzuki_Address_110_%282014%29.jpg"
  },
  {
    name: "Suzuki Nex II",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Suzuki_Let%27s_scooter.jpg"
  }
];

async function main() {
  console.log("Updating motorcycle images to Wikimedia (accurate images)...");
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
