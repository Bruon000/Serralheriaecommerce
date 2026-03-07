import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = "public/uploads/chat";

function getExtension(mime: string): string {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") ?? formData.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const blob = file as Blob;
    const mime = blob.type;
    if (!ALLOWED_TYPES.includes(mime)) {
      return NextResponse.json(
        { error: "Tipo não permitido. Use JPEG, PNG ou WebP." },
        { status: 400 }
      );
    }

    if (blob.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const ext = getExtension(mime);
    const filename = `portao_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/chat/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[chat-upload]", err);
    return NextResponse.json(
      { error: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}
