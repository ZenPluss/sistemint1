import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalBookings = await prisma.booking.count();
    const totalLeads = await prisma.lead.count();
    const activePromotions = await prisma.promotion.count({ where: { isActive: true } });
    const convertedLeads = await prisma.lead.count({ where: { status: "CONVERTED" }});
    
    // Simple conversion rate
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0.0";

    return NextResponse.json({ 
      totalBookings, 
      totalLeads, 
      activePromotions,
      conversionRate
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KPI" }, { status: 500 });
  }
}
