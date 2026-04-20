const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SCM dummy data...');

  // 1. Create Suppliers
  const suppliersData = [
    { name: 'Yoshimura R&D', email: 'sales@yoshimura.jp', phone: '+81-12-34', rating: 4.9, leadTime: 14 },
    { name: 'Brembo S.p.A.', email: 'orders@brembo.it', phone: '+39-44-55', rating: 4.8, leadTime: 21 },
    { name: 'Showa Corporation', email: 'supply@showa1.com', phone: '+81-99-88', rating: 4.7, leadTime: 30 },
    { name: 'Bridgestone Tires', email: 'motoales@bridgestone.com', phone: '+81-77-66', rating: 4.6, leadTime: 10 },
    { name: 'NGK Spark Plugs', email: 'parts@ngk.co.jp', phone: '+81-55-44', rating: 4.9, leadTime: 7 },
  ];

  const suppliers = [];
  for (const s of suppliersData) {
    const created = await prisma.supplier.create({ data: s });
    suppliers.push(created);
  }
  console.log(`Created ${suppliers.length} Suppliers.`);

  // 2. Create Inventory Items
  const inventoryData = [
    { name: 'Alpha T Titanium Exhaust', sku: 'YOSH-EX-001', quantity: 24, reorderPoint: 10, supplierId: suppliers[0].id },
    { name: 'R-77 Carbon Slip-On', sku: 'YOSH-EX-002', quantity: 15, reorderPoint: 5, supplierId: suppliers[0].id },
    { name: 'Stylema Front Brake Calipers', sku: 'BRB-CAL-04', quantity: 8, reorderPoint: 12, supplierId: suppliers[1].id },
    { name: 'Z04 Sintered Racing Pads', sku: 'BRB-PAD-Z4', quantity: 45, reorderPoint: 20, supplierId: suppliers[1].id },
    { name: 'BFF Front Forks', sku: 'SHW-FRK-01', quantity: 5, reorderPoint: 5, supplierId: suppliers[2].id },
    { name: 'BFRC-lite Rear Shock', sku: 'SHW-SHK-02', quantity: 12, reorderPoint: 8, supplierId: suppliers[2].id },
    { name: 'Battlax S22 Front 120/70', sku: 'BRG-S22-FR', quantity: 60, reorderPoint: 30, supplierId: suppliers[3].id },
    { name: 'Battlax S22 Rear 190/55', sku: 'BRG-S22-RR', quantity: 40, reorderPoint: 25, supplierId: suppliers[3].id },
    { name: 'CR9EIX Iridium Spark Plug', sku: 'NGK-CR9-IX', quantity: 150, reorderPoint: 50, supplierId: suppliers[4].id },
    { name: 'LMAR8A-9 Standard Plug', sku: 'NGK-LMA-89', quantity: 200, reorderPoint: 100, supplierId: suppliers[4].id },
  ];

  const inventory = [];
  for (const item of inventoryData) {
    const created = await prisma.inventory.create({ data: item });
    inventory.push(created);
  }
  console.log(`Created ${inventory.length} Inventory Items.`);

  // 3. Create Orders (ScmOrder)
  const ordersData = [
    { inventoryId: inventory[2].id, quantity: 20, status: 'SHIPPED', orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days ago
    { inventoryId: inventory[4].id, quantity: 10, status: 'DELIVERED', orderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }, // 14 days ago
    { inventoryId: inventory[0].id, quantity: 15, status: 'PENDING', orderDate: new Date() },
    { inventoryId: inventory[6].id, quantity: 50, status: 'SHIPPED', orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { inventoryId: inventory[8].id, quantity: 300, status: 'PENDING', orderDate: new Date() },
  ];

  const orders = [];
  for (const order of ordersData) {
    const created = await prisma.scmOrder.create({ data: order });
    orders.push(created);
  }
  console.log(`Created ${orders.length} SCM Orders.`);

  // 4. Create Shipments linked to shipped/delivered orders
  const shipmentsData = [
    { orderId: orders[0].id, status: 'IN_TRANSIT', estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }, // ETA 3 days
    { orderId: orders[1].id, status: 'DELIVERED', estimatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }, // Delivered yesterday
    { orderId: orders[3].id, status: 'IN_TRANSIT', estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }, // ETA 5 days
  ];

  for (const shipment of shipmentsData) {
    await prisma.shipment.create({ data: shipment });
  }
  console.log(`Created ${shipmentsData.length} Shipments.`);

  console.log('Seeding process is fully complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
