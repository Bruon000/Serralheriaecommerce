"use client";

import { useEffect, useMemo, useState } from "react";
import { buildWhatsappLink } from "../../lib/whatsapp";
import { formatBRL } from "../../lib/pricing";
import { CartItem, loadCart, saveCart, countPortoes } from "../../lib/cart";

export default function CarrinhoBody() {
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
    <div className="tune-cart min-h-screen bg-background pt-24 pb-12">
      <main className="tune-cart container max-w-3xl">
        <h1 className="tune-cart font-display text-4xl font-bold tracking-tight mb-4 text-center">
          Seu <span className="tune-cart text-gradient-gold">Carrinho</span>
        </h1>

        <p className="tune-cart text-muted-foreground text-center mb-8">
          B2B cadastrado: <b>{b2bOk ? "SIM" : "NÃO"}</b> · Portões no carrinho: <b>{portoes}</b> (mín. 3 para B2B)
        </p>

        {items.length === 0 ? (
          <div className="tune-cart steel-card p-12 text-center">
            <p className="tune-cart text-muted-foreground mb-6">Seu carrinho está vazio.</p>
            <a
              href="/catalogo"
              className="tune-cart inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:brightness-110"
            >
              Ver catálogo
            </a>
          </div>
        ) : (
          <>
            <div className="tune-cart space-y-4">
              {items.map((it: any, idx: number) => (
                <div key={idx} className="tune-cart steel-card flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4">
                  <div className="tune-cart flex-1 min-w-0">
                    <h3 className="tune-cart font-display font-bold truncate">{it.title}</h3>
                    <div className="tune-cart mt-2 text-sm text-muted-foreground">
                      {((it as any).largura || (it as any).altura) && (
                        <div>Medidas: {(it as any).largura || "?"} × {(it as any).altura || "?"}</div>
                      )}
                      {(it as any).obs && <div>Obs.: {(it as any).obs}</div>}
                    </div>
                    <p className="tune-cart text-sm font-bold text-gradient-gold mt-1">
                      {formatBRL(getUnitPrice(it, isB2B))} × {it.qty ?? 1} = {formatBRL(getUnitPrice(it, isB2B) * Number(it.qty ?? 1))}
                    </p>
                  </div>
                  <div className="tune-cart flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => dec(idx)}
                      className="tune-cart flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      −
                    </button>
                    <span className="tune-cart w-8 text-center font-bold">{it.qty ?? 1}</span>
                    <button
                      type="button"
                      onClick={() => inc(idx)}
                      className="tune-cart flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="tune-cart flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                      aria-label="Remover"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="tune-cart steel-card mt-6 p-6">
              <div className="tune-cart flex items-center justify-between mb-6">
                <span className="tune-cart text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </span>
                <div className="tune-cart-summary tune-cart text-right">
                  <p className="tune-cart text-sm text-muted-foreground">Total estimado</p>
                  <p className="tune-cart-total tune-cart font-display text-3xl font-bold text-gradient-gold">
                    {formatBRL(total)}
                  </p>
                </div>
              </div>
              <div className="tune-cart flex flex-col sm:flex-row gap-3">
                <a
                  href={canWhatsapp ? waLink : "#"}
                  onClick={(e) => !canWhatsapp && e.preventDefault()}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all ${
                    canWhatsapp
                      ? "bg-primary text-primary-foreground hover:brightness-110 glow-gold"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  }`}
                >
                  Finalizar no WhatsApp
                </a>
                <a
                  href="/catalogo"
                  className="tune-cart inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-6 py-4 text-sm font-bold text-muted-foreground hover:text-foreground"
                >
                  Voltar ao catálogo
                </a>
              </div>
              {!canWhatsapp && (
                <p className="tune-cart mt-4 text-sm text-muted-foreground">
                  B2B: é preciso estar cadastrado e ter pelo menos 3 portões no carrinho. No varejo, o WhatsApp fica liberado.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}


