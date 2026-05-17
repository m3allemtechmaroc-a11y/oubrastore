import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.navbarItem.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      include: { categories: { where: { isActive: true }, orderBy: { orderIndex: "asc" } } },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Navbar GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.navbarItem.create({ data: body });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Navbar create error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}
