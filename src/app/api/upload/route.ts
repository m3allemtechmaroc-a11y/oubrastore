import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ success: false, error: "Aucun fichier" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      uploadedFiles.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ success: true, data: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Erreur lors du téléchargement" }, { status: 500 });
  }
}
