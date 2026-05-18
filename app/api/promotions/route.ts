import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(promotions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { title, description, discountAmount, discountPerc, startDate, endDate, isActive } = await req.json();

    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        title,
        description,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null,
        discountPerc: discountPerc ? parseFloat(discountPerc) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, isActive } = await req.json();
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updated = await prisma.promotion.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await req.json();
    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
