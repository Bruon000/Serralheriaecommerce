import { fetchOneEntry } from "@builder.io/sdk-react";

/**
 * Builder.io configuration and API key.
 * Set NEXT_PUBLIC_BUILDER_API_KEY in .env.local
 */
export const BUILDER_API_KEY =
  process.env.NEXT_PUBLIC_BUILDER_API_KEY ?? "";

export const BUILDER_ENABLED = Boolean(BUILDER_API_KEY);

export type SiteSettings = {
  whatsappNumber?: string;
  phoneLabel?: string;
  instagramUrl?: string;
  garantia?: string;
  prazo?: string;
  showConstructorNudge?: boolean;
  showFloatingCartButton?: boolean;
  [key: string]: unknown;
};

/** Fetches global site settings from Builder model "site-settings" (first entry). */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!BUILDER_API_KEY) return null;
  try {
    const entry = await fetchOneEntry({
      model: "site-settings",
      apiKey: BUILDER_API_KEY,
      limit: 1,
    });
    if (!entry?.data) return null;
    const d = entry.data as Record<string, unknown>;
    return {
      whatsappNumber: typeof d.whatsappNumber === "string" ? d.whatsappNumber : undefined,
      phoneLabel: typeof d.phoneLabel === "string" ? d.phoneLabel : undefined,
      instagramUrl: typeof d.instagramUrl === "string" ? d.instagramUrl : undefined,
      garantia: typeof d.garantia === "string" ? d.garantia : undefined,
      prazo: typeof d.prazo === "string" ? d.prazo : undefined,
      showConstructorNudge: d.showConstructorNudge !== false,
      showFloatingCartButton: d.showFloatingCartButton !== false,
      ...d,
    };
  } catch {
    return null;
  }
}

/** Builder content type for page-section */
export type BuilderContent = Awaited<
  ReturnType<typeof fetchOneEntry>
>;

/** Fetches optional Builder content for a page section (top/bottom slot). Model: "page-section" */
export async function getPageSectionContent(
  urlPath: string,
  slot: "top" | "bottom"
): Promise<BuilderContent | null> {
  if (!BUILDER_API_KEY) return null;
  try {
    const entry = await fetchOneEntry({
      model: "page-section",
      apiKey: BUILDER_API_KEY,
      userAttributes: { urlPath, slot },
    });
    return entry ?? null;
  } catch {
    return null;
  }
}
