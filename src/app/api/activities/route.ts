import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error("Activities GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activity = await prisma.activity.create({ data: body });
    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    console.error("Activity create error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}
