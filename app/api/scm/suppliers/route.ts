import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, contactPerson, email, phone, leadTime } = await req.json();
    const supplier = await prisma.supplier.create({
      data: { name: name || "Unknown", contactPerson: contactPerson || "", email: email || "", phone: phone || "", leadTime: parseInt(leadTime || "0") },
    });
    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, contactPerson, email, phone, leadTime } = await req.json();
    const supplier = await prisma.supplier.update({
      where: { id },
      data: { name: name || "Unknown", contactPerson: contactPerson || "", email: email || "", phone: phone || "", leadTime: parseInt(leadTime || "0") },
    });
    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
  }
}
