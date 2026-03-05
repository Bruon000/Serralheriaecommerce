import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import { Content } from "@builder.io/sdk-react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { BUILDER_API_KEY, getSiteSettings } from "@/lib/builder";
import HomePage from "@/components/HomePage";

import { getCmsPageByUrlPath } from "@/lib/cms/pages";
import CmsRenderer from "@/components/cms/Renderer";
import CmsPreviewReceiver from "@/components/cms/CmsPreviewReceiver";
import { getSessionCookieName, verifySession } from "@/lib/cms/auth";
import type { CmsPageContent } from "@/lib/cms/types";

type Props = {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseContentJson(json: string | null | undefined): CmsPageContent | null {
  if (!json) return null;
  try {
    const c = JSON.parse(json) as CmsPageContent;
    if (c && typeof c === "object" && Array.isArray((c as any).blocks)) return c;
    return null;
  } catch {
    return null;
  }
}

async function canPreviewInProd(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookieName())?.value;
    if (!token) return false;
    await verifySession(token);
    return true;
  } catch {
    return false;
  }
}

export default async function BuilderPageRoute({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const urlPath = "/" + (resolvedParams.page?.join("/") ?? "");

  // =========================
  // CMS MODE (sem Builder)
  // =========================
  if (!BUILDER_API_KEY) {
    const cmsPage = await getCmsPageByUrlPath(urlPath);

    // Home sem registro -> HomePage normal
    if (urlPath === "/" && !cmsPage) return <HomePage />;

    if (!cmsPage) return notFound();

    const cmsPreview = (() => {
      const v = resolvedSearchParams["cmsPreview"];
      const s = Array.isArray(v) ? v[0] : v;
      return s === "1" || s === "true";
    })();

    const allowPreview =
      cmsPreview &&
      (process.env.NODE_ENV !== "production" ? true : await canPreviewInProd());

    const draftContent = parseContentJson(cmsPage.contentJson);
    const publishedContent = parseContentJson(cmsPage.publishedContentJson);

    // Preview (rascunho ao vivo via postMessage)
    if (allowPreview) {
      return (
        <div className="min-h-screen bg-background pt-24 pb-16">
          <main className="container">
            <CmsPreviewReceiver
              urlPath={urlPath}
              initialContent={draftContent ?? publishedContent}
            />
          </main>
        </div>
      );
    }

    // Produção: só publicado
    if (process.env.NODE_ENV === "production") {
      if (!cmsPage.published) return notFound();
      if (!publishedContent?.blocks?.length) return notFound();

      return (
        <div className="min-h-screen bg-background pt-24 pb-16">
          <main className="container">
            <CmsRenderer content={publishedContent} />
          </main>
        </div>
      );
    }

    // Dev: mostra draft se tiver, senão publicado
    const content = draftContent ?? publishedContent;

    if (!content?.blocks?.length) {
      return (
        <div className="min-h-screen bg-background pt-24 pb-16">
          <main className="container max-w-4xl">
            <div className="steel-card p-8 text-center text-muted-foreground">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {cmsPage.title ?? urlPath}
              </h1>
              <p className="mt-2">Página sem blocos. Edite em /admin para adicionar conteúdo.</p>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <main className="container">
          <CmsRenderer content={content} />
        </main>
      </div>
    );
  }

  // =========================
  // BUILDER MODE
  // =========================
  const builderOptions = getBuilderSearchParams(
    resolvedSearchParams as Record<string, string | string[]>
  );

  const previewQuery =
    resolvedSearchParams["builder.preview"] === "1" ||
    resolvedSearchParams["builder.preview"] === "page";

  const cookieStore = await cookies();
  const previewCookie = cookieStore.get("builder.preview")?.value;
  const isPreview = Boolean(previewQuery || previewCookie);

  const content = await fetchOneEntry({
    model: "page",
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath },
    options: builderOptions,
    includeUnpublished: isPreview,
  });

  if (!content) {
    if (urlPath === "/") return <HomePage />;
    return notFound();
  }

  const siteSettings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <main className="container">
        <Content
          content={content}
          model="page"
          apiKey={BUILDER_API_KEY}
          data={{ urlPath, ...siteSettings }}
        />
      </main>
    </div>
  );
}
