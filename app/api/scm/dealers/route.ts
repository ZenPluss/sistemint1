import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

async function checkAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function GET() {
  try {
    await checkAuth(); // Both roles can GET
    const dealers = await prisma.dealer.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(dealers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await checkAuth();
    if (session.role !== 'ADMIN') throw new Error("Forbidden");
    const json = await req.json();
    const dealer = await prisma.dealer.create({ data: {
      name: json.name || "Unknown Dealer",
      location: json.location || "Unknown Location",
      contact: json.contact || "No Contact"
    } });
    return NextResponse.json(dealer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await checkAuth();
    if (session.role !== 'ADMIN') throw new Error("Forbidden");
    const json = await req.json();
    const dealer = await prisma.dealer.update({
      where: { id: json.id },
      data: {
        name: json.name || "Unknown Dealer",
        location: json.location || "Unknown Location",
        contact: json.contact || "No Contact"
      }
    });
    return NextResponse.json(dealer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await checkAuth();
    if (session.role !== 'ADMIN') throw new Error("Forbidden");
    const { id } = await req.json();
    await prisma.dealer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
