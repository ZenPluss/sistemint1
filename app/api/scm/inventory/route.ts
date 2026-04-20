import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { supplier: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, sku, quantity, reorderPoint, supplierId } = await req.json();
    const item = await prisma.inventory.create({
      data: { 
        name: name || "Unknown Item", 
        sku: sku || `SKU-${Date.now()}`, 
        quantity: parseInt(quantity || "0"), 
        reorderPoint: parseInt(reorderPoint || "10"), 
        supplierId 
      },
      include: { supplier: true }
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, sku, quantity, reorderPoint, supplierId } = await req.json();
    const item = await prisma.inventory.update({
      where: { id },
      data: { 
        name: name || "Unknown Item", 
        sku: sku || `SKU-${Date.now()}`, 
        quantity: parseInt(quantity || "0"), 
        reorderPoint: parseInt(reorderPoint || "10"), 
        supplierId 
      },
      include: { supplier: true }
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.inventory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 });
  }
}
