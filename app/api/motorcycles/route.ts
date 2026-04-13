import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma"; // Assuming we have defined an alias for lib/prisma or relative

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const whereClause: any = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const motorcycles = await prisma.motorcycle.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(motorcycles);
  } catch (error) {
    console.error("Failed to fetch motorcycles:", error);
    return NextResponse.json({ error: "Failed to fetch motorcycles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newMotorcycle = await prisma.motorcycle.create({
      data: {
        name: body.name,
        type: body.type,
        engineSize: body.engineSize,
        price: body.price,
        image: body.image,
        description: body.description,
        specs: body.specs || {},
      }
    });

    return NextResponse.json(newMotorcycle, { status: 201 });
  } catch (error) {
    console.error("Failed to create motorcycle:", error);
    return NextResponse.json({ error: "Failed to create motorcycle" }, { status: 500 });
  }
}
