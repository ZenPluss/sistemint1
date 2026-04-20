import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - Admin sees all orders, users see only their own
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orders = session.role === 'ADMIN'
      ? await prisma.saleOrder.findMany({
        include: { motorcycle: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      })
      : await prisma.saleOrder.findMany({
        where: { userId: session.id as string },
        include: { motorcycle: true },
        orderBy: { createdAt: 'desc' }
      });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - User places a purchase order
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized - Please login first' }, { status: 401 });

    const { motorcycleId, quantity = 1, shippingAddress, notes } = await req.json();

    if (!motorcycleId || !shippingAddress) {
      return NextResponse.json({ error: 'motorcycleId and shippingAddress are required' }, { status: 400 });
    }

    // Fetch motorcycle price
    const motorcycle = await prisma.motorcycle.findUnique({ where: { id: motorcycleId } });
    if (!motorcycle) return NextResponse.json({ error: 'Motorcycle not found' }, { status: 404 });

    const totalPrice = motorcycle.price * quantity;

    // Create the sale order
    const order = await prisma.saleOrder.create({
      data: {
        userId: session.id as string,
        motorcycleId,
        quantity,
        totalPrice,
        shippingAddress,
        notes: notes || null,
        status: 'PENDING',
      },
      include: { motorcycle: true }
    });

    // Attempt to reduce matching inventory stock
    const inventoryItem = await prisma.inventory.findFirst({
      where: { name: { contains: motorcycle.name.split(' ')[0], mode: 'insensitive' } }
    });
    if (inventoryItem && inventoryItem.quantity >= quantity) {
      await prisma.inventory.update({
        where: { id: inventoryItem.id },
        data: { quantity: inventoryItem.quantity - quantity }
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Admin updates order status
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, status } = await req.json();
    const order = await prisma.saleOrder.update({
      where: { id },
      data: { status },
      include: { motorcycle: true, user: { select: { name: true, email: true } } }
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Admin cancels/deletes
export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await req.json();
    await prisma.saleOrder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
