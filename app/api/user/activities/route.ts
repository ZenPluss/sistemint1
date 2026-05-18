import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [bookings, orders] = await Promise.all([
      prisma.booking.findMany({
        where: { userId: session.id as string },
        include: { motorcycle: true, dealer: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.saleOrder.findMany({
        where: { userId: session.id as string },
        include: { motorcycle: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return NextResponse.json({ bookings, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
