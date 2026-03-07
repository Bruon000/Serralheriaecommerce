import { NextResponse } from "next/server";
import { getProductsByType } from "@/lib/medusa";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") ?? "";

  if (!tipo.trim()) {
    return NextResponse.json({ products: [] });
  }

  const products = await getProductsByType(tipo.trim());
  return NextResponse.json({ products });
}
