import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    console.error("Coupons GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coupon = await prisma.coupon.create({
      data: {
        ...body,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    console.error("Coupon create error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}
