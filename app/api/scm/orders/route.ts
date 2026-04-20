import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.scmOrder.findMany({
      include: {
        inventory: {
          include: { supplier: true }
        }
      },
      orderBy: { orderDate: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { inventoryId, quantity, status } = await req.json();
    const order = await prisma.scmOrder.create({
      data: {
        inventoryId,
        quantity: parseInt(quantity || "1"),
        status: status || "PENDING"
      },
      include: { inventory: { include: { supplier: true } } }
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, inventoryId, quantity, status } = await req.json();
    const order = await prisma.scmOrder.update({
      where: { id },
      data: {
        inventoryId,
        quantity: parseInt(quantity || "1"),
        status: status || "PENDING"
      },
      include: { inventory: { include: { supplier: true } } }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.scmOrder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
