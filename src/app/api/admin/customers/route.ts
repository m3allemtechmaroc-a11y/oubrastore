import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, _count: { select: { orders: true } } },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Customers error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}
