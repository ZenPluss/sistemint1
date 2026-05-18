const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageUpdates = [
  { name: "Suzuki Hayabusa", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80" },
  { name: "Suzuki GSX-R750", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80" },
  { name: "Suzuki Katana", image: "https://images.unsplash.com/photo-1591637333184-19aa84bcee14?w=800&q=80" },
  { name: "Suzuki SV650", image: "https://images.unsplash.com/photo-1620882813818-4b72807fcdbd?w=800&q=80" },
  { name: "Suzuki Burgman 400", image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80" },
  { name: "Suzuki RM-Z450", image: "https://images.unsplash.com/photo-1599819811279-d5064ce9b5c9?w=800&q=80" },
  { name: "Suzuki V-STROM 650", image: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80" },
  { name: "Suzuki Satria F150", image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80" },
  { name: "Suzuki Avenis 125", image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80" },
  { name: "Suzuki Nex II", image: "https://images.unsplash.com/photo-1505705694340-019e1e335916?w=800&q=80" }
];

async function main() {
  for (const item of imageUpdates) {
    await prisma.motorcycle.updateMany({
      where: { name: item.name },
      data: { image: item.image }
    });
  }
  console.log("Images fixed!");
}

main().finally(() => prisma.$disconnect());
