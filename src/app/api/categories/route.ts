import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      include: {
        children: { where: { isActive: true }, orderBy: { orderIndex: "asc" } },
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await prisma.category.create({ data: body });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Category create error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création" }, { status: 500 });
  }
}
