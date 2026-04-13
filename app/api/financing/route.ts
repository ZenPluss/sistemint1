import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simplistic interest calculation logic for demonstration
    // Principal = price - downPayment
    // Monthly = (Principal * Interest Rate factor) / Tenure
    const ANNUAl_INTEREST_RATE = 0.08; // 8% APR
    const monthlyInterestRate = ANNUAl_INTEREST_RATE / 12;
    
    // We expect the client to have calculated this to display to user, 
    // but the server re-validates the math based on real DB motorcycle price.
    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id: body.motorcycleId }
    });

    if (!motorcycle) {
      return NextResponse.json({ error: "Motorcycle not found" }, { status: 404 });
    }

    const principal = motorcycle.price - body.downPayment;
    if (principal <= 0) {
      return NextResponse.json({ error: "Down payment covers total cost" }, { status: 400 });
    }

    // Standard amortization formula
    const num = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, body.tenureMonths);
    const den = Math.pow(1 + monthlyInterestRate, body.tenureMonths) - 1;
    const monthlyEst = num / den;

    const application = await prisma.financingApplication.create({
      data: {
        userId: body.userId || "anonymous", // Mock user if unauthenticated for now
        motorcycleId: body.motorcycleId,
        downPayment: body.downPayment,
        tenureMonths: body.tenureMonths,
        monthlyEst: monthlyEst,
        status: "PENDING"
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error("Financing application error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
