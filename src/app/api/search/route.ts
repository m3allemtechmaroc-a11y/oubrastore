import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: { products: [], categories: [] } });
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 8,
        select: { id: true, name: true, slug: true, price: true, images: true, isPromotion: true, discountPercent: true },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: "insensitive" },
        },
        take: 4,
        select: { id: true, name: true, slug: true, image: true },
      }),
    ]);

    return NextResponse.json({ success: true, data: { products, categories } });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ success: false, error: "Erreur de recherche" }, { status: 500 });
  }
}
