import { NextResponse } from "next/server";

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

const EXPECTED_USER = process.env.B2B_ADMIN_USER || "admin";
const EXPECTED_PASS = process.env.B2B_ADMIN_PASS || "123456";
const B2B_ADMIN_TOKEN = process.env.B2B_ADMIN_TOKEN || "";

function isAuthorized(req: Request) {
  const user = req.headers.get("x-admin-user") || "";
  const pass = req.headers.get("x-admin-pass") || "";
  return user === EXPECTED_USER && pass === EXPECTED_PASS;
}

function medusaAdminHeaders(extra?: Record<string, string>) {
  return {
    ...(extra || {}),
    ...(MEDUSA_PUBLISHABLE_KEY
      ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
      : {}),
    ...(B2B_ADMIN_TOKEN
      ? { "x-b2b-admin-token": B2B_ADMIN_TOKEN }
      : {}),
  };
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, message: "não autorizado" }, { status: 401 });
  }

  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/custom/b2b-admin`, {
      headers: medusaAdminHeaders(),
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));
    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: "backend Medusa indisponível" },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, message: "não autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/custom/b2b-admin`, {
      method: "POST",
      headers: medusaAdminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const json = await res.json().catch(() => ({}));
    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: "backend Medusa indisponível" },
      { status: 503 }
    );
  }
}
