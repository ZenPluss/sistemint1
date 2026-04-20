import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Middleware or explicit check is good, but for safety:
async function checkAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function GET() {
  try {
    await checkAuth();
    const shipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(shipments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await checkAuth();
    // Only Admin can create
    if (session.role !== 'ADMIN') throw new Error("Forbidden");
    const json = await req.json();
    const shipment = await prisma.shipment.create({ data: {
      orderId: json.orderId,
      status: json.status || 'IN_TRANSIT',
      estimatedDate: json.estimatedDate ? new Date(json.estimatedDate) : new Date()
    } });
    return NextResponse.json(shipment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await checkAuth();
    if (session.role !== 'ADMIN') throw new Error("Forbidden");
    const json = await req.json();
    const shipment = await prisma.shipment.update({
      where: { id: json.id },
      data: {
        orderId: json.orderId,
        status: json.status,
        estimatedDate: json.estimatedDate ? new Date(json.estimatedDate) : undefined
      }
    });
    return NextResponse.json(shipment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await checkAuth();
    if (session.role !== 'ADMIN') throw new Error("Forbidden");
    const { id } = await req.json();
    await prisma.shipment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
