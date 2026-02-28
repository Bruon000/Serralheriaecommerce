"use client";

import { useMemo, useState } from "react";
import { CartItem, loadCart, saveCart } from "../lib/cart";

type Props = {
  product: {
    id: string;
    title: string;
    handle: string;
    metadata?: Record<string, any> | null;
  };
};

export default function AddToCartForm({ product }: Props) {
  const tipo = String(product.metadata?.tipo ?? "");
  const ipo = String(product.metadata?.ipo ?? "");

  const [qty, setQty] = useState<number>(1);
  const [largura, setLargura] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [cor, setCor] = useState<string>("");
  const [obs, setObs] = useState<string>("");

  const canAdd = useMemo(() => qty > 0, [qty]);

  function add() {
    const items = loadCart();

    const item: CartItem = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      ipo: ipo || null,
      tipo: tipo || null,
      qty,
      largura: largura || undefined,
      altura: altura || undefined,
      cor: cor || undefined,
      obs: obs || undefined,
    };

    items.push(item);
    saveCart(items);
    alert("Adicionado ao carrinho!");
  }

  return (
    <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Configurar</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <label>
          Quantidade
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: "100%" }} />
        </label>

        <label>
          Cor
          <input value={cor} onChange={(e) => setCor(e.target.value)} style={{ width: "100%" }} />
        </label>

        <label>
          Largura (cm)
          <input value={largura} onChange={(e) => setLargura(e.target.value)} style={{ width: "100%" }} />
        </label>

        <label>
          Altura (cm)
          <input value={altura} onChange={(e) => setAltura(e.target.value)} style={{ width: "100%" }} />
        </label>
      </div>

      <label style={{ display: "block", marginTop: 10 }}>
        Observações
        <textarea value={obs} onChange={(e) => setObs(e.target.value)} style={{ width: "100%" }} />
      </label>

      <button onClick={add} disabled={!canAdd} style={{ marginTop: 12, padding: "10px 14px" }}>
        Adicionar ao carrinho
      </button>

      <div style={{ marginTop: 8 }}>
        <a href="/carrinho">Ir para o carrinho</a>
      </div>
    </div>
  );
}
