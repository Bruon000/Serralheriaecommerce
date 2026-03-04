import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, verifySession } from "@/lib/cms/auth";

export type SiteRoute = {
  path: string;
  label: string;
  dynamic?: boolean;
  paramExample?: string; // ex: "handle" para /produto/[handle]
};

const FIXED_ROUTES: SiteRoute[] = [
  { path: "/", label: "Home" },
  { path: "/catalogo", label: "Catálogo" },
  { path: "/carrinho", label: "Carrinho" },
  { path: "/orcamento", label: "Orçamento" },
  { path: "/depoimentos", label: "Depoimentos" },
  { path: "/promocoes", label: "Promoções" },
  { path: "/cadastro", label: "Cadastro" },
  { path: "/contato", label: "Contato" },
  { path: "/produto/[handle]", label: "Página de produto (template)", dynamic: true, paramExample: "handle" },
];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    if (!token) throw new Error("unauthorized");
    await verifySession(token);

    return NextResponse.json({
      ok: true,
      routes: FIXED_ROUTES,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
}
