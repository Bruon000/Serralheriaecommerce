"use client";

import { useEffect, useMemo, useState } from "react";
import { buildWhatsappLink } from "../../lib/whatsapp";
import { formatBRL } from "../../lib/pricing";
import { CartItem, loadCart, saveCart, countPortoes } from "../../lib/cart";

export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [b2bOk, setB2bOk] = useState<boolean>(false);

  useEffect(() => {
    setItems(loadCart());
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

  function getUnitPrice(it: any, isB2B: boolean): number {
    const b2b = Number(it?.unit_price_b2b);
    const normal = Number(it?.unit_price);
    if (isB2B && Number.isFinite(b2b) && b2b > 0) return b2b;
    if (Number.isFinite(normal) && normal > 0) return normal;
    return 0;
  }

  const isB2B = b2bOk;
  const canWhatsapp = isB2B ? portoes >= 3 : true;

  const total = useMemo(() => {
    return (items || []).reduce((acc: number, it: any) => {
      const unit = getUnitPrice(it, isB2B);
      const qty = Number(it?.qty || 1);
      return acc + unit * qty;
    }, 0);
  }, [items, isB2B]);

  const waMessage = [
    "Olá! Quero finalizar meu orçamento:",
    "",
    ...(items || []).map((it: any) => {
      const unit = getUnitPrice(it, isB2B);
      const qty = Number(it?.qty || 1);
      const name = String(it?.title || it?.product?.title || it?.handle || "Item");
      return `- ${name} | qtd: ${qty} | unit: ${formatBRL(unit)} | subtotal: ${formatBRL(unit * qty)}`;
    }),
    "",
    `TOTAL: ${formatBRL(total)}`,
  ].join("\n");

  const waLink = buildWhatsappLink(waMessage, { b2b: isB2B });

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <a href="/">← Home</a>

      <h1 style={{ fontSize: 26, marginTop: 14 }}>Carrinho</h1>

      <div style={{ opacity: 0.85, marginTop: 8 }}>
        B2B cadastrado: <b>{b2bOk ? "SIM" : "NÃO"}</b> | Portões no carrinho: <b>{portoes}</b>{" "}
        (mínimo 3)
      </div>

      {items.length === 0 ? (
        <div style={{ marginTop: 16, padding: 16, border: "1px solid rgba(255,140,40,.18)", borderRadius: 16, background: "rgba(0,0,0,.35)" }}>
          Carrinho vazio.
        </div>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {items.map((it: any, idx: number) => (
            <div
              key={idx}
              className="steelCard"
              style={{ padding: 14, display: "grid", gap: 8 }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 950 }}>{it.title}</div>
                <button onClick={() => remove(idx)} style={{ marginLeft: "auto" }}>
                  Remover
                </button>
              </div>

              <div style={{ opacity: 0.8, fontSize: 13 }}>
                ipo: {String((it as any).metadata?.ipo ?? "-")} | tipo: {String((it as any).metadata?.tipo ?? "-")}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => dec(idx)}>-</button>
                <b>{it.qty ?? 1}</b>
                <button onClick={() => inc(idx)}>+</button>

                <div style={{ marginLeft: "auto", fontWeight: 900 }}>
                  {formatBRL(getUnitPrice(it, isB2B))} x {it.qty ?? 1} ={" "}
                  {formatBRL(getUnitPrice(it, isB2B) * Number(it.qty ?? 1))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14, padding: 14, borderRadius: 16, border: "1px solid rgba(255,140,40,.18)", background: "rgba(0,0,0,.35)" }}>
        <b>Total:</b> {formatBRL(total)}
      </div>

      <div style={{ marginTop: 14 }}>
        <a
          href={canWhatsapp ? waLink : "#"}
          data-spark="1"
          onClick={(e) => {
            if (!canWhatsapp) e.preventDefault();
          }}
          className="steelBtn"
          style={{
            display: "inline-block",
            opacity: canWhatsapp ? 1 : 0.4,
            pointerEvents: canWhatsapp ? "auto" : "none",
            textDecoration: "none",
          }}
        >
          Finalizar no WhatsApp
        </a>

        {!canWhatsapp && (
          <div style={{ marginTop: 10, opacity: 0.8 }}>
            Para B2B: precisa estar cadastrado e ter pelo menos 3 portões no carrinho. No varejo, o WhatsApp fica liberado.
          </div>
        )}
      </div>
    </main>
  );
}
