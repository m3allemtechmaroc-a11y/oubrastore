import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const activity = await prisma.activity.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("Activity update error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.activity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activity delete error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}
