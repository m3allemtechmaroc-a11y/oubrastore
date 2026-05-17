import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email requis" }, { status: 400 });
    }
    await prisma.newsletter.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });
    return NextResponse.json({ success: true, message: "Inscrit avec succès!" });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ success: false, error: "Erreur" }, { status: 500 });
  }
}
