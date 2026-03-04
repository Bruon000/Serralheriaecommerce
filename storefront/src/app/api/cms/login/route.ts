import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, signSession, verifyAdminCredentials } from "@/lib/cms/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "");
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Email e senha obrigatórios" }, { status: 400 });
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = await signSession({ email });
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
