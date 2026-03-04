import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, verifySession } from "@/lib/cms/auth";
import { getCmsPageByUrlPath } from "@/lib/cms/pages";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    if (!token) throw new Error("unauthorized");
    await verifySession(token);

    const u = new URL(req.url);
    const urlPath = u.searchParams.get("urlPath");
    if (!urlPath) {
      return NextResponse.json({ ok: false, error: "urlPath obrigatório" }, { status: 400 });
    }

    const page = await getCmsPageByUrlPath(urlPath);
    if (!page) {
      return NextResponse.json({ ok: false, error: "Página não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      page: {
        id: page.id,
        urlPath: page.urlPath,
        title: page.title,
        content: page.content,
        contentJson: page.contentJson,
        publishedContentJson: page.publishedContentJson,
        published: page.published,
        routeParamsExample: page.routeParamsExample,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
}
