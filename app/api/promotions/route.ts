import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: activeOnly
        ? { isActive: true, startDate: { lte: now }, endDate: { gte: now } }
        : {},
      include: { motorcycle: true },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const promotion = await prisma.promotion.create({
      data: {
        title: body.title,
        description: body.description,
        discountAmount: body.discountAmount ?? null,
        discountPerc: body.discountPerc ?? null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        isActive: body.isActive ?? true,
        motorcycleId: body.motorcycleId ?? null,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: "Promotion ID required" }, { status: 400 });

    const updated = await prisma.promotion.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Promotion ID required" }, { status: 400 });

    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete promotion" }, { status: 500 });
  }
}
