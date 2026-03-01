import type { MedusaProduct } from "./medusa";

export function isB2BApproved(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("construtor_cadastrado_v1"));
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getDisplayPriceBRL(product: MedusaProduct, isB2B: boolean): { text: string; isB2BPrice: boolean } {
  const meta: any = product?.metadata || {};
  const b2bMeta = Number(meta.preco_b2b);

  if (isB2B && Number.isFinite(b2bMeta) && b2bMeta > 0) {
    return { text: formatBRL(b2bMeta), isB2BPrice: true };
  }

  const firstVariant: any = (product as any)?.variants?.[0];
  const firstPrice: any = firstVariant?.prices?.find((p: any) => (p?.currency_code || "").toLowerCase() === "brl") ?? firstVariant?.prices?.[0];
  const amount = Number(firstPrice?.amount);

  if (Number.isFinite(amount)) {
    // Medusa geralmente guarda amount em centavos (BRL). Se estiver em centavos, divide por 100.
    // Heurística: se for grande demais, assume centavos.
    const v = amount > 100000 ? amount / 100 : amount / 100;
    return { text: formatBRL(v), isB2BPrice: false };
  }

  return { text: "Preço sob consulta", isB2BPrice: false };
}
