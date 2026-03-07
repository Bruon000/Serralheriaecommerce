"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { loadCart } from "../lib/cart";

function countQty(items: { qty?: number }[]): number {
  return (items || []).reduce((acc, it) => acc + Number(it?.qty || 0), 0);
}

export default function FloatingCartButton() {
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const refresh = () => setQty(countQty(loadCart()));
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, []);

  if (qty === 0) return null;

  return (
    <Link
      href="/carrinho"
      className="fixed right-6 bottom-20 z-[80] inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 hover:scale-105 glow-gold"
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-bold">
        {qty}
      </span>
    </Link>
  );
}


