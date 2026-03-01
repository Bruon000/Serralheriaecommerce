import type { MedusaProduct } from "./medusa";

export function isB2BApproved(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("construtor_cadastrado_v1"));
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// retorna preço numérico em BRL (reais)
export function getPriceValueBRL(product: MedusaProduct, opts?: { b2b?: boolean }): { value: number | null; isB2BPrice: boolean } {
  const meta: any = product?.metadata || {};
  const b2bMeta = Number(meta.preco_b2b);

  if (opts?.b2b && Number.isFinite(b2bMeta) && b2bMeta > 0) {
    return { value: b2bMeta, isB2BPrice: true };
  }

  const firstVariant: any = (product as any)?.variants?.[0];
  const firstPrice: any =
    firstVariant?.prices?.find((p: any) => (p?.currency_code || "").toLowerCase() === "brl") ??
    firstVariant?.prices?.[0];

  const amount = Number(firstPrice?.amount);

  if (Number.isFinite(amount)) {
    // Medusa normalmente usa centavos: 150000 => R$ 1.500,00
    const v = amount / 100;
    return { value: v, isB2BPrice: false };
  }

  return { value: null, isB2BPrice: false };
}

// mantém API antiga (texto)
export function getDisplayPriceBRL(product: MedusaProduct, isB2B: boolean): { text: string; isB2BPrice: boolean } {
  const p = getPriceValueBRL(product, { b2b: isB2B });
  if (p.value == null) return { text: "Preço sob consulta", isB2BPrice: false };
  return { text: formatBRL(p.value), isB2BPrice: p.isB2BPrice };
}
