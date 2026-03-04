import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, verifySession } from "@/lib/cms/auth";
import { deleteCmsPage, getCmsPageByUrlPath, listCmsPages, upsertCmsPage } from "@/lib/cms/pages";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) throw new Error("unauthorized");
  await verifySession(token);
}

export async function GET() {
  try {
    await requireAuth();
    const pages = await listCmsPages();
    return NextResponse.json({ ok: true, pages });
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json().catch(() => null);
    const urlPath = String(body?.urlPath ?? "").trim();
    const title = body?.title != null ? String(body.title) : undefined;
    const content = body?.content != null ? String(body.content) : undefined;
    const contentJson = body?.contentJson != null ? String(body.contentJson) : undefined;
    const published = body?.published === true || body?.published === "true";
    const routeParamsExample = body?.routeParamsExample != null ? String(body.routeParamsExample) : undefined;

    if (!urlPath.startsWith("/")) {
      return NextResponse.json({ ok: false, error: "urlPath deve começar com /" }, { status: 400 });
    }
    const hasPayload =
      title !== undefined ||
      content !== undefined ||
      contentJson !== undefined ||
      body?.published !== undefined ||
      routeParamsExample !== undefined;
    if (!hasPayload) {
      return NextResponse.json({ ok: false, error: "Envie title, content, contentJson, published ou routeParamsExample" }, { status: 400 });
    }

    const updatePayload: Parameters<typeof upsertCmsPage>[0] = {
      urlPath,
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(contentJson !== undefined && { contentJson }),
      ...(routeParamsExample !== undefined && { routeParamsExample }),
    };

    if (body?.published === true) {
      const existing = await getCmsPageByUrlPath(urlPath);
      const draftJson = contentJson ?? existing?.contentJson ?? null;
      updatePayload.published = true;
      if (draftJson != null) updatePayload.publishedContentJson = draftJson;
    } else if (body?.published === false) {
      updatePayload.published = false;
    }

    const saved = await upsertCmsPage(updatePayload);
    return NextResponse.json({ ok: true, page: saved });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("unauthorized")) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    return NextResponse.json({ ok: false, error: "erro ao salvar" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth();
    const u = new URL(req.url);
    const urlPath = String(u.searchParams.get("urlPath") ?? "");
    if (!urlPath) return NextResponse.json({ ok: false, error: "urlPath obrigatório" }, { status: 400 });

    await deleteCmsPage(urlPath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
}
