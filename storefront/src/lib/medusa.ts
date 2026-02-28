export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export type MedusaProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  metadata?: Record<string, any> | null;
};

export async function listProducts(): Promise<MedusaProduct[]> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/products?limit=100&fields=id,title,handle,thumbnail,metadata,metadata\.promocao,metadata\.ipo,metadata\.tipo`, {
    cache: "no-store",
    headers: MEDUSA_PUBLISHABLE_KEY
      ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
      : undefined,
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const json = await res.json();
  return (json.products || []) as MedusaProduct[];
}

export async function getPromocaoSemana(): Promise<MedusaProduct[]> {
  const products = await listProducts();
  return products.filter(
    (p) => p?.metadata?.promocao === "semana" && p?.metadata?.tipo === "portao"
  );
}



