import type { MedusaProduct } from "./medusa";

export function isB2BApproved(): boolean {
  if (typeof window === "undefined") return false;

  // Você pode ajustar esse critério depois (cookie/localStorage/etc).
  // Mantive algo simples: query ?b2b=1 ou flag em localStorage.
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("b2b") === "1") return true;
    return localStorage.getItem("b2b") === "1";
  } catch {
    return false;
  }
}

function formatBRLFromCents(cents: number): string {
  const v = Number(cents || 0) / 100;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function parseToCents(v: any): number | null {
  if (v === null || v === undefined) return null;

  // Se já vier number
  if (typeof v === "number" && Number.isFinite(v)) {
    // Heurística: se for inteiro grande, assume centavos; se for decimal, assume reais
    if (Number.isInteger(v) && v >= 1000) return v; // centavos
    return Math.round(v * 100); // reais -> centavos
  }

  const s = String(v).trim();
  if (!s) return null;

  // remove moeda e espaços
  const cleaned = s.replace(/[^\d,.\-]/g, "");

  // se tem vírgula, assume pt-BR
  if (cleaned.includes(",")) {
    const norm = cleaned.replace(/\./g, "").replace(",", ".");
    const n = Number(norm);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 100);
  }

  // sem vírgula: pode ser "350000" (centavos) ou "3500.00"
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  if (Number.isInteger(n) && n >= 1000) return n;
  return Math.round(n * 100);
}

function getBasePriceCents(product: MedusaProduct): number | null {
  const v = product?.variants?.[0];

  // Medusa v2: calculated_price (vem quando region_id está presente)
  const cp = (v as any)?.calculated_price;
  if (cp && typeof cp.calculated_amount === "number") {
    return cp.calculated_amount;
  }

  // fallback v1: prices[]
  const prices = v?.prices || [];
  const brl = prices.find((p) => String(p.currency_code).toLowerCase() === "brl");
  if (brl?.amount) return brl.amount;

  return null;
}

export function getDisplayPriceBRL(product: MedusaProduct, isB2B: boolean) {
  const md: any = product?.metadata ?? {};

  // Preço B2B (metadata), se existir e aprovado
  if (isB2B) {
    const b2bCents = parseToCents(md.preco_b2b);
    if (b2bCents !== null) {
      return {
        text: formatBRLFromCents(b2bCents),
        isB2BPrice: true,
      };
    }
  }

  const cents = getBasePriceCents(product);
  if (cents === null) {
    return { text: "Preço sob consulta", isB2BPrice: false };
  }

  return { text: formatBRLFromCents(cents), isB2BPrice: false };
}
export function getPriceValueBRL(product: MedusaProduct, opts?: { b2b?: boolean }) {
  const isB2B = !!opts?.b2b;
  const md: any = product?.metadata ?? {};

  // B2B primeiro (metadata)
  if (isB2B) {
    const b2bCents = parseToCents(md.preco_b2b);
    if (b2bCents !== null) return { value: b2bCents, currency: "brl", source: "b2b" };
  }

  // Medusa v2: calculated_price
  const v = product?.variants?.[0] as any;
  const cp = v?.calculated_price;
  if (cp && typeof cp.calculated_amount === "number") {
    return { value: cp.calculated_amount, currency: String(cp.currency_code || "brl").toLowerCase(), source: "calculated" };
  }

  // fallback v1: prices[]
  const prices = (product?.variants?.[0]?.prices ?? []) as any[];
  const brl = prices.find((p) => String(p.currency_code).toLowerCase() === "brl");
  if (brl?.amount) return { value: brl.amount, currency: "brl", source: "prices" };

  return { value: null as any, currency: "brl", source: "none" };
}
export function formatBRL(cents: number): string {
  const v = Number(cents || 0) / 100;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

