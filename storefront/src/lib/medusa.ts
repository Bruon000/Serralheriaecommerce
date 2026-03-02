export type MedusaMoneyAmount = {
  amount: number;
  currency_code: string;
};

export type MedusaVariant = {
  prices?: MedusaMoneyAmount[];
};

export type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  images?: { url: string }[];
  metadata?: Record<string, any>;
  variants?: MedusaVariant[];
};

export const MEDUSA_BACKEND_URL =
  (process.env.MEDUSA_BACKEND_URL ??
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
    "http://localhost:9000"
  ).replace(/\/+$/, "");

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ??
  "";

function medusaHeaders() {
  return MEDUSA_PUBLISHABLE_KEY
    ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
    : {};
}

export async function listProducts(): Promise<MedusaProduct[]> {
  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products?limit=100`,
      {
        cache: "no-store",
        headers: medusaHeaders(),
      }
    );

    if (!res.ok) {
      console.warn("[medusa] listProducts failed:", res.status, res.statusText);
      return [];
    }

    const data = (await res.json()) as { products?: MedusaProduct[] };
    return data.products ?? [];
  } catch (err) {
    console.warn("[medusa] listProducts fetch failed:", err);
    return [];
  }
}

export async function getPromocaoSemana(): Promise<MedusaProduct[]> {
  const products = await listProducts();
  return products.filter((p) => p?.metadata?.promocao === "semana");
}


export async function getOfertasConstrutor(): Promise<MedusaProduct[]> {
  const products = await listProducts();

  return products.filter((p) => {
    const md: any = p?.metadata ?? {};

    const oferta =
      md.oferta === true ||
      md.oferta === "true" ||
      md.oferta === "construtor" ||
      md.oferta === "b2b";

    const hasPrecoB2B =
      md.preco_b2b !== undefined &&
      md.preco_b2b !== null &&
      String(md.preco_b2b).trim() !== "";

    return oferta || hasPrecoB2B;
  });
}
export async function getProductByHandle(handle: string): Promise<MedusaProduct | null> {
  const products = await listProducts();
  return products.find((p) => p.handle === handle) ?? null;
}

