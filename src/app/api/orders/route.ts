import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: { include: { product: true } }, user: { select: { name: true, email: true } } },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, city, address, notes, items, shippingCost, couponCode } = body;

    if (!fullName || !phone || !city || !address || !items?.length) {
      return NextResponse.json({ success: false, error: "Tous les champs sont requis" }, { status: 400 });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          discount = coupon.discountPercent;
          await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
        }
      }
    }

    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const discountedTotal = totalAmount - (totalAmount * discount) / 100;
    const finalTotal = discountedTotal + (shippingCost || 0);

    const order = await prisma.order.create({
      data: {
        fullName, phone, city, address, notes,
        totalAmount: finalTotal,
        shippingCost: shippingCost || 0,
        couponCode, discount,
        items: {
          create: items.map((item: { productId: string; name: string; quantity: number; price: number }) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création de la commande" }, { status: 500 });
  }
}
