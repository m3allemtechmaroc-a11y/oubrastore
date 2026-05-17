import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });
    return NextResponse.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updates = Object.entries(body);

    for (const [key, value] of updates) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ success: true, message: "Paramètres mis à jour" });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
