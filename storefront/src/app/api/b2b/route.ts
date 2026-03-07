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
  const email = searchParams.get("email") || "";

  if (!doc.trim() && !email.trim()) {
    return NextResponse.json(
      { ok: false, message: "doc ou email obrigatório" },
      { status: 400 }
    );
  }

  const qs = new URLSearchParams();
  if (doc.trim()) qs.set("doc", doc.trim());
  if (email.trim()) qs.set("email", email.trim());

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/custom/b2b?${qs.toString()}`,
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
