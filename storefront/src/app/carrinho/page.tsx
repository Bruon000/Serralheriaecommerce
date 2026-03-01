"use client";
import { formatBRL } from "../../lib/pricing";
import { useEffect, useMemo, useState } from "react";
import { buildWhatsappLink } from "../../lib/whatsapp";
import { CartItem, loadCart, saveCart, countPortoes } from "../../lib/cart";
export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [b2bOk, setB2bOk] = useState<boolean>(false); // TODO: plugar no cadastro real

  useEffect(() => {
    setItems(loadCart());
    // placeholder: você pode ligar isso com um localStorage do cadastro depois
    setB2bOk(Boolean(localStorage.getItem("construtor_cadastrado_v1")));
  }, []);

  const portoes = useMemo(() => countPortoes(items), [items]);

  
  function getUnitPrice(it: any, isB2B: boolean): number {
    const b2b = Number(it?.unit_price_b2b);
    const normal = Number(it?.unit_price);
    if (isB2B && Number.isFinite(b2b) && b2b > 0) return b2b;
    if (Number.isFinite(normal) && normal > 0) return normal;
    return 0;
  }

  const total = useMemo(() => {
    const isB2B = b2bOk;
    return (items || []).reduce((acc: number, it: any) => acc + getUnitPrice(it, isB2B) * Number(it?.qty || 1), 0);
  }, [items, b2bOk]);function update(itemsNext: CartItem[]) {
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
  const isB2B = b2bOk; const canWhatsapp = isB2B ? portoes >= 3 : true;
  const waMessage = [
            ...(items || []).map((it: any) => {
        const unit = getUnitPrice(it, b2bOk);
        const qty = Number(it?.qty || 1);
        const name = String(it?.title || it?.product?.title || it?.handle || "Item");
        return `- ${name} | qtd: ${qty} | unit: ${formatBRL(unit)} | subtotal: ${formatBRL(unit * qty)}`;
      }),
      "",
      `TOTAL: ${formatBRL(total)}`,].join("\n"); const waLink = buildWhatsappLink(waMessage, { b2b: isB2B });

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
                <div className="unitPriceLabel_v1" style={{ marginTop: 6, fontWeight: 700 }}>{formatBRL(getUnitPrice(it as any, b2bOk))} x {it.qty ?? 1} = {formatBRL(getUnitPrice(it as any, b2bOk) * Number(it.qty ?? 1))}</div>
                <button onClick={() => remove(idx)} style={{ marginLeft: "auto" }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}><b>Total:</b> {formatBRL(total)}</div>

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
            Para B2B: precisa estar cadastrado e ter pelo menos 3 portões no carrinho. No varejo, o WhatsApp fica liberado.
          </div>
        )}
      </div>
    </main>
  );
}










