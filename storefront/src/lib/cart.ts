import { getPriceValueBRL } from "./pricing";
export type CartItem = {
  unit_price?: number;
  unit_price_b2b?: number;

  id: string;          // product id
  handle: string;
  title: string;
  ipo?: string | null;
  tipo?: string | null;
  qty: number;
  largura?: string;
  altura?: string;
  cor?: string;
  obs?: string;
};

const KEY = "serralheria_cart_v2";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function countPortoes(items: CartItem[]) {
  return items
    .filter((i) => i.tipo === "portao")
    .reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
}


