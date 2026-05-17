import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "latest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");
    const isPromotion = searchParams.get("isPromotion");
    const isNew = searchParams.get("isNew");
    const isPopular = searchParams.get("isPopular");
    const isFeatured = searchParams.get("isFeatured");

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }
    if (minPrice) where.price = { ...((where.price as object) || {}), gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...((where.price as object) || {}), lte: parseFloat(maxPrice) };
    if (inStock === "true") where.stock = { gt: 0 };
    if (isPromotion === "true") where.isPromotion = true;
    if (isNew === "true") where.isNew = true;
    if (isPopular === "true") where.isPopular = true;
    if (isFeatured === "true") where.isFeatured = true;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (sort) {
      case "price-asc": orderBy = { price: "asc" }; break;
      case "price-desc": orderBy = { price: "desc" }; break;
      case "popular": orderBy = { viewCount: "desc" }; break;
      case "name": orderBy = { name: "asc" }; break;
      default: orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, shortDesc, price, compareAtPrice, stock, sku, images, categoryId,
      isPromotion, discountPercent, promotionEnd, isFeatured, isNew, isPopular, tags } = body;

    const product = await prisma.product.create({
      data: {
        name, slug, description, shortDesc,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock) || 0,
        sku, images: images || [], categoryId,
        isPromotion: isPromotion || false,
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        promotionEnd: promotionEnd ? new Date(promotionEnd) : null,
        isFeatured: isFeatured || false,
        isNew: isNew !== false,
        isPopular: isPopular || false,
        tags: tags || [],
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création" }, { status: 500 });
  }
}
