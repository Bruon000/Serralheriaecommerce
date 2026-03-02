"use client";

import { useEffect, useState } from "react";
import { loadCart } from "../lib/cart";

function countQty(items: any[]): number {
  return (items || []).reduce((acc, it) => acc + Number(it?.qty || 0), 0);
}

export default function FloatingCartButton() {
  const [qty, setQty] = useState<number>(0);

  useEffect(() => {
    const refresh = () => {
      try {
        const items = loadCart();
        setQty(countQty(items));
      } catch {
        setQty(0);
      }
    };

    refresh();

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      // atualiza sempre que algo mudar no localStorage
      refresh();
    };

    window.addEventListener("storage", onStorage);
    const t = window.setInterval(refresh, 1500); // fallback simples

    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(t);
    };
  }, []);

  return (
    <a className="floatCart" data-spark="1" href="/carrinho" title="Ir para o carrinho">
      <span style={{ fontWeight: 950 }}>Carrinho</span>
      <span className="floatCartBadge">{qty}</span>
    </a>
  );
}

