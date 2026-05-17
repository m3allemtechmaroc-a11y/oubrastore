import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalOrders, totalRevenue, totalProducts, totalCustomers, recentOrders, lowStockProducts] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true } }),
        prisma.product.count({ where: { isActive: true } }),
        prisma.user.count({ where: { role: "CLIENT" } }),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        }),
        prisma.product.findMany({
          where: { stock: { lte: 5 }, isActive: true },
          orderBy: { stock: "asc" },
          take: 10,
        }),
      ]);

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalProducts,
        totalCustomers,
        recentOrders,
        lowStockProducts,
        ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count.status })),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
