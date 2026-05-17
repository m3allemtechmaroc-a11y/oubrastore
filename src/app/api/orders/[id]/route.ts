import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: { select: { name: true, email: true, phone: true } } },
    });
    if (!order) {
      return NextResponse.json({ success: false, error: "Commande introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const order = await prisma.order.update({ where: { id }, data: body, include: { items: true } });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
