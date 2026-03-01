import { NextResponse } from "next/server";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

function medusaHeaders(extra?: Record<string, string>) {
  return {
    ...(extra || {}),
    ...(MEDUSA_PUBLISHABLE_KEY
      ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
      : {}),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doc = searchParams.get("doc") || "";

  if (!doc.trim()) {
    return NextResponse.json({ ok: false, message: "doc obrigatório" }, { status: 400 });
  }

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/custom/b2b?doc=${encodeURIComponent(doc)}`,
    {
      headers: medusaHeaders(),
      cache: "no-store",
    }
  );

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/custom/b2b`, {
    method: "POST",
    headers: medusaHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
