import { prisma } from "@/lib/db/prisma";

export async function getCmsPageByUrlPath(urlPath: string) {
  return prisma.cmsPage.findUnique({ where: { urlPath } });
}

export async function listCmsPages() {
  return prisma.cmsPage.findMany({ orderBy: { updatedAt: "desc" } });
}

export type UpsertCmsPageInput = {
  urlPath: string;
  title?: string | null;
  content?: string | null;
  contentJson?: string | null;
  publishedContentJson?: string | null;
  published?: boolean;
  routeParamsExample?: string | null;
};

export async function upsertCmsPage(input: UpsertCmsPageInput) {
  return prisma.cmsPage.upsert({
    where: { urlPath: input.urlPath },
    update: {
      ...(input.title !== undefined && { title: input.title ?? null }),
      ...(input.content !== undefined && { content: input.content ?? null }),
      ...(input.contentJson !== undefined && { contentJson: input.contentJson ?? null }),
      ...(input.publishedContentJson !== undefined && { publishedContentJson: input.publishedContentJson ?? null }),
      ...(input.published !== undefined && { published: input.published }),
      ...(input.routeParamsExample !== undefined && { routeParamsExample: input.routeParamsExample ?? null }),
    },
    create: {
      urlPath: input.urlPath,
      title: input.title ?? null,
      content: input.content ?? null,
      contentJson: input.contentJson ?? null,
      publishedContentJson: input.publishedContentJson ?? null,
      published: input.published ?? false,
      routeParamsExample: input.routeParamsExample ?? null,
    },
  });
}

export async function deleteCmsPage(urlPath: string) {
  return prisma.cmsPage.delete({ where: { urlPath } });
}
