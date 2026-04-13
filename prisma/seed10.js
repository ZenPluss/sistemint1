const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const newMotorcycles = [
  {
    name: "Suzuki Hayabusa",
    type: "SPORT",
    engineSize: 1340,
    price: 19099,
    image: "https://www.globalsuzuki.com/motorcycle/smgs/products/2021hayabusa/images/2021_Hayabusa_Glass_Sparkle_Black_Candy_Burnt_Gold.jpg",
    description: "The legendary Ultimate Sport Bike. With aerodynamically refined styling and an engine pushing the limits of street performance."
  },
  {
    name: "Suzuki GSX-R750",
    type: "SPORT",
    engineSize: 750,
    price: 12999,
    image: "https://suzukicycles.com/-/media/project/suzuki/suzukicycles/images/motorcycles/supersport/gsx-r750/2023/gallery/gsx-r750_m3_ysf_diagonal.jpg",
    description: "The original 750cc sportbike that continues to redefine performance."
  },
  {
    name: "Suzuki Katana",
    type: "SPORT",
    engineSize: 999,
    price: 13499,
    image: "https://www.globalsuzuki.com/motorcycle/smgs/products/2022katana/images/2022_KATANA_Mystic_Silver_Metallic.jpg",
    description: "Forged to perfection. Designed for street riding with stunning retro-fusion styling."
  },
  {
    name: "Suzuki SV650",
    type: "BIG_BIKE",
    engineSize: 645,
    price: 7849,
    image: "https://suzukicycles.com/-/media/project/suzuki/suzukicycles/images/motorcycles/street/sv650/2023/gallery/sv650_m3_ymd_diagonal.jpg",
    description: "V-twin fun machine. Great middleweight streetbike providing exhilarating performance."
  },
  {
    name: "Suzuki Burgman 400",
    type: "MATIC",
    engineSize: 400,
    price: 8699,
    image: "https://suzukicycles.com/-/media/project/suzuki/suzukicycles/images/motorcycles/scooter/burgman-400/2023/gallery/an400_m3_oem_diagonal.jpg",
    description: "The elegant athlete. A premium scooter with strong performance and maximum comfort."
  },
  {
    name: "Suzuki RM-Z450",
    type: "SPORT",
    engineSize: 449,
    price: 9199,
    image: "https://suzukicycles.com/-/media/project/suzuki/suzukicycles/images/motorcycles/motocross/rm-z450/2024/gallery/rm-z450_m4_ykv_diagonal.jpg",
    description: "Championship winning motocross bike with superior cornering and power."
  },
  {
    name: "Suzuki V-STROM 650",
    type: "BIG_BIKE",
    engineSize: 645,
    price: 8904,
    image: "https://suzukicycles.com/-/media/project/suzuki/suzukicycles/images/motorcycles/adventure/v-strom-650/2023/gallery/dl650_m3_qvw_diagonal.jpg",
    description: "Renowned for versatility, reliability and value. The ultimate everyday adventure bike."
  },
  {
    name: "Suzuki Satria F150",
    type: "UNDERBONE",
    engineSize: 147,
    price: 2100,
    image: "https://suzuki.co.id/uploads/images/satria-f150-black-red1.jpg",
    description: "The king of underbone. High revolution engine for dominating the city streets."
  },
  {
    name: "Suzuki Avenis 125",
    type: "MATIC",
    engineSize: 124,
    price: 1600,
    image: "https://suzuki.co.id/uploads/images/Suzuki_Avenis_125_-_Pearl_Mirage_White_Mettalic_Mat_Fibroin_Grey.jpg",
    description: "Modern and sporty scooter designed perfectly for urban mobility."
  },
  {
    name: "Suzuki Nex II",
    type: "MATIC",
    engineSize: 113,
    price: 1300,
    image: "https://suzuki.co.id/uploads/images/M_-_Suzuki_NEX_II_STANDARD_-_1.jpg",
    description: "Stylish, compact, and highly efficient. The reliable choice for everyday commuting."
  }
];

async function main() {
  console.log("Adding 10 new motorcycles...");
  for (const moto of newMotorcycles) {
    await prisma.motorcycle.create({
      data: moto
    });
  }
  console.log("10 motorcycles successfully added to the database!");
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
