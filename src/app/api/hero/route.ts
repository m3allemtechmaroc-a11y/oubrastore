import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.error("Hero GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slide = await prisma.heroSlide.create({ data: body });
    return NextResponse.json({ success: true, data: slide }, { status: 201 });
  } catch (error) {
    console.error("Hero create error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création" }, { status: 500 });
  }
}
