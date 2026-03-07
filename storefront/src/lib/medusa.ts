export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const MEDUSA_REGION_ID =
  process.env.NEXT_PUBLIC_REGION_ID || "";

import { getProductType } from "./productType";

export type MedusaCategory = {
  id: string;
  name: string;
  handle?: string | null;
};

export type MedusaCollection = {
  id: string;
  title: string;
  handle?: string | null;
};

export type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  images?: { url: string }[];
  metadata?: Record<string, any> | null;
  variants?: any[];
  /**
   * Medusa v2 store products can expose categories and collection
   * when requested via fields/expand.
   */
  categories?: MedusaCategory[];
  collection?: MedusaCollection | null;
};

const ALLOWED_STORE_PARAMS = [
  "limit",
  "offset",
  "region_id",
  "fields",
  "handle",
  "collection_id",
];

function sanitizeStoreParams(params: Record<string, unknown>): Record<string, string | number | undefined> {
  const safe: Record<string, string | number | undefined> = {};
  for (const key of Object.keys(params)) {
    if (ALLOWED_STORE_PARAMS.includes(key)) {
      const v = params[key];
      if (v !== undefined && v !== null) safe[key] = v as string | number;
    }
  }
  return safe;
}

function buildStoreUrl(path: string, query: Record<string, string | number | undefined>) {
  const params = sanitizeStoreParams(query || {});
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && String(v).length) sp.set(k, String(v));
  }
  const s = sp.toString();
  return `${MEDUSA_BACKEND_URL}${path}${s ? `?${s}` : ""}`;
}

export async function listProducts(): Promise<MedusaProduct[]> {
  const url = buildStoreUrl("/store/products", {
    limit: 100,
    region_id: MEDUSA_REGION_ID || undefined,
    fields: [
      "id",
      "title",
      "handle",
      "description",
      "thumbnail",
      "images",
      "metadata",
      "variants",
      "variants.calculated_price",
      "variants.options",
    ].join(","),
  });

  try {
    console.log("[medusa] fetching:", url);
    const res = await fetch(url, {
      cache: "no-store",
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[medusa] listProducts failed:", res.status, text);
      return [];
    }

    const json = await res.json();
    return (json.products || []) as MedusaProduct[];
  } catch (err: unknown) {
    console.error("[medusa] listProducts fetch error:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<MedusaProduct | null> {
  const products = await listProducts();
  return products.find((p) => p.handle === handle) ?? null;
}

export async function getPromocaoSemana(): Promise<MedusaProduct[]> {
  const products = await listProducts();
  return products.filter(
    (p) =>
      String(p?.metadata?.promocao || "") === "semana" &&
      getProductType(p) === "portao" &&
      String(p?.metadata?.ipo || "") === "AL-20"
  );
}

export async function getOfertasConstrutor(): Promise<MedusaProduct[]> {
  const products = await listProducts();
  return products.filter(
    (p) => String(p?.metadata?.oferta || "") === "construtor"
  );
}

export async function listCategories(): Promise<MedusaCategory[]> {
  const url = buildStoreUrl("/store/product-categories", {
    limit: 100,
    fields: ["id", "name", "handle"].join(","),
  });

  try {
    console.log("[medusa] fetching:", url);
    const res = await fetch(url, {
      cache: "no-store",
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[medusa] listCategories failed:", res.status, text);
      return [];
    }

    const json = await res.json();
    const categories =
      (json.product_categories as MedusaCategory[] | undefined) ||
      (json.categories as MedusaCategory[] | undefined) ||
      [];
    return categories;
  } catch (err: any) {
    console.error("[medusa] listCategories fetch error:", err?.message || err);
    return [];
  }
}

export async function listCollections(): Promise<MedusaCollection[]> {
  const url = buildStoreUrl("/store/collections", {
    limit: 100,
    fields: ["id", "title", "handle"].join(","),
  });

  try {
    console.log("[medusa] fetching:", url);
    const res = await fetch(url, {
      cache: "no-store",
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[medusa] listCollections failed:", res.status, text);
      return [];
    }

    const json = await res.json();
    const collections =
      (json.collections as MedusaCollection[] | undefined) ||
      (json.data as MedusaCollection[] | undefined) ||
      [];
    return collections;
  } catch (err: any) {
    console.error("[medusa] listCollections fetch error:", err?.message || err);
    return [];
  }
}

/** Busca produtos por metadata.tipo (ex: "deslizante", "social", "2 folhas"). Usa listProducts e filtra em JS para não enviar parâmetros inválidos à Store API. */
export async function getProductsByType(tipo: string): Promise<MedusaProduct[]> {
  const products = await listProducts();
  const tipoLower = tipo.toLowerCase().trim();
  return products
    .filter((p) => {
      const metaTipo = p.metadata?.tipo;
      if (metaTipo == null) return false;
      return String(metaTipo).toLowerCase().includes(tipoLower);
    })
    .slice(0, 6);
}

