import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple notification logger (simulates WhatsApp/Email)
function sendNotification(booking: {
  date: Date;
  timeSlot: string;
  user?: { name?: string; email?: string } | null;
  motorcycle?: { name?: string } | null;
  dealer?: { name?: string; location?: string } | null;
}) {
  console.log("---🔔 BOOKING NOTIFICATION SENT---");
  console.log(`To: ${booking.user?.name ?? "Customer"} <${booking.user?.email ?? "N/A"}>`);
  console.log(`Motorcycle: ${booking.motorcycle?.name ?? "N/A"}`);
  console.log(`Dealer: ${booking.dealer?.name ?? "N/A"} - ${booking.dealer?.location ?? "N/A"}`);
  console.log(`Date: ${booking.date?.toLocaleDateString()} at ${booking.timeSlot}`);
  console.log("----------------------------------");
}

export async function GET(request: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        motorcycle: { select: { name: true, type: true } },
        dealer: true,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.motorcycleId || !body.dealerId || !body.date || !body.timeSlot) {
      return NextResponse.json({ error: "Missing required fields: motorcycleId, dealerId, date, timeSlot" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: body.userId || "anonymous",
        motorcycleId: body.motorcycleId,
        dealerId: body.dealerId,
        date: new Date(body.date),
        timeSlot: body.timeSlot,
        notes: body.notes ?? null,
        status: "PENDING",
        notified: false,
      },
      include: {
        user: { select: { name: true, email: true } },
        motorcycle: { select: { name: true } },
        dealer: true,
      },
    });

    // Simulate sending notification
    sendNotification(booking);

    // Mark as notified
    await prisma.booking.update({
      where: { id: booking.id },
      data: { notified: true },
    });

    return NextResponse.json({ ...booking, notified: true }, { status: 201 });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) return NextResponse.json({ error: "Booking ID required" }, { status: 400 });

    const updated = await prisma.booking.update({
      where: { id },
      data: { ...(status && { status }) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
