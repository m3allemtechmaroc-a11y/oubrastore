import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: { include: { user: { select: { name: true, avatar: true } } } } },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Produit introuvable" }, { status: 404 });
    }

    // Increment view count
    await prisma.product.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product GET error:", error);
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        compareAtPrice: body.compareAtPrice ? parseFloat(body.compareAtPrice) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        discountPercent: body.discountPercent ? parseInt(body.discountPercent) : undefined,
        promotionEnd: body.promotionEnd ? new Date(body.promotionEnd) : undefined,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Produit supprimé" });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
