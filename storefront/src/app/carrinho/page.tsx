"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItem, loadCart, saveCart, countPortoes } from "../../lib/cart";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5585999999999";

export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [b2bOk, setB2bOk] = useState<boolean>(false); // TODO: plugar no cadastro real

  useEffect(() => {
    setItems(loadCart());
    // placeholder: você pode ligar isso com um localStorage do cadastro depois
    setB2bOk(Boolean(localStorage.getItem("construtor_cadastrado_v1")));
  }, []);

  const portoes = useMemo(() => countPortoes(items), [items]);

  function update(itemsNext: CartItem[]) {
    setItems(itemsNext);
    saveCart(itemsNext);
  }

  function inc(idx: number) {
    const next = [...items];
    next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + 1 };
    update(next);
  }

  function dec(idx: number) {
    const next = [...items];
    next[idx] = { ...next[idx], qty: Math.max(1, (next[idx].qty || 1) - 1) };
    update(next);
  }

  function remove(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    update(next);
  }

  const canWhatsapp = b2bOk && portoes >= 3;

  const waText = encodeURIComponent(
    [
      "Olá! Quero finalizar meu orçamento:",
      "",
      ...items.map((i) => `- ${i.title} (qtd: ${i.qty}) | ${i.largura ?? "-"} x ${i.altura ?? "-"} | cor: ${i.cor ?? "-"} | obs: ${i.obs ?? "-"}`),
      "",
      `Total de portões no carrinho: ${portoes}`,
    ].join("\n")
  );

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <a href="/">← Home</a>
      <h1 style={{ fontSize: 28, marginTop: 12 }}>Carrinho</h1>

      <div style={{ marginTop: 10, opacity: 0.8 }}>
        B2B cadastrado: <b>{b2bOk ? "SIM" : "NÃO"}</b> | Portões no carrinho: <b>{portoes}</b> (mínimo 3)
      </div>

      {items.length === 0 ? (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          Carrinho vazio.
        </div>
      ) : (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {items.map((it, idx) => (
            <div key={`${it.id}-${idx}`} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{it.title}</div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>ipo: {it.ipo ?? "-"} | tipo: {it.tipo ?? "-"}</div>

              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
                <button onClick={() => dec(idx)}>-</button>
                <b>{it.qty}</b>
                <button onClick={() => inc(idx)}>+</button>
                <button onClick={() => remove(idx)} style={{ marginLeft: "auto" }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <a
          href={canWhatsapp ? waLink : "#"}
          onClick={(e) => { if (!canWhatsapp) e.preventDefault(); }}
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #333",
            opacity: canWhatsapp ? 1 : 0.4,
            pointerEvents: canWhatsapp ? "auto" : "none",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Finalizar no WhatsApp
        </a>

        {!canWhatsapp && (
          <div style={{ marginTop: 8, color: "#a00" }}>
            Para liberar WhatsApp: precisa estar cadastrado (B2B) e ter pelo menos 3 portões no carrinho.
          </div>
        )}
      </div>
    </main>
  );
}

