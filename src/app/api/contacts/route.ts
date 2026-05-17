import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Contacts GET error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Tous les champs sont requis" }, { status: 400 });
    }
    const contact = await prisma.contact.create({ data: { name, email, phone, subject, message } });
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error("Contact create error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
