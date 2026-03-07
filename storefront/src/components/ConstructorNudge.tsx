"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Props = {
  enabled?: boolean;
};

function nowMs() {
  return Date.now();
}

function getShowAgainAtMs() {
  const raw = localStorage.getItem("constructor_nudge_hide_until_ms");
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function setHideForHours(hours: number) {
  const until = nowMs() + hours * 60 * 60 * 1000;
  localStorage.setItem("constructor_nudge_hide_until_ms", String(until));
}

export default function ConstructorNudge({ enabled = true }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  const canShow = useMemo(() => {
    if (!mounted) return false;
    try {
      return nowMs() > getShowAgainAtMs();
    } catch {
      return true;
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mostrar popup após 3s (qualquer visita) para a mensagem ser visível
  useEffect(() => {
    if (!mounted || !enabled) return;
    const t = window.setTimeout(() => setOpen(true), 3000);
    return () => window.clearTimeout(t);
  }, [mounted, enabled]);

  if (!enabled || !mounted || !canShow || !visible) return null;

  return (
        <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 108,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
      aria-live="polite"
    >
      {open && (
        <div
          style={{
            width: "min(320px, calc(100vw - 32px))",
            background: "rgba(20, 20, 20, 0.92)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 14,
            padding: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            backdropFilter: "blur(10px)",
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "rgba(245, 158, 11, 0.18)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                flex: "0 0 auto",
              }}
              aria-hidden="true"
            >
              
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1.2 }}>
                Você é construtor?
              </div>
              <div style={{ opacity: 0.9, fontSize: 13, marginTop: 6, lineHeight: 1.35 }}>
                Temos condições especiais para profissionais. Cadastre-se e veja seu status.
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <Link
                  href="/construtor/cadastro"
                  style={{
                    pointerEvents: "auto",
                    textDecoration: "none",
                    padding: "10px 12px",
                    borderRadius: 10,
                    fontWeight: 900,
                    fontSize: 13,
                    background: "rgb(245, 158, 11)",
                    color: "#111",
                  }}
                >
                  Quero me cadastrar
                </Link>

                <Link
                  href="/construtor/ofertas"
                  style={{
                    pointerEvents: "auto",
                    textDecoration: "none",
                    padding: "10px 12px",
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: 13,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#fff",
                  }}
                >
                  Ver ofertas
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setHideForHours(24);
              }}
              style={{
                pointerEvents: "auto",
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                padding: 6,
                marginTop: -4,
              }}
              aria-label="Fechar"
              title="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* bolha */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          pointerEvents: "auto",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(20, 20, 20, 0.92)",
          color: "#fff",
          borderRadius: 999,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
        }}
        aria-label="Área Construtor"
        title="Área Construtor"
      >
        <span aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18v-2a8 8 0 1 1 16 0v2" stroke="rgba(245,158,11,0.95)" strokeWidth="2" strokeLinejoin="round"/><path d="M12 8v4" stroke="rgba(245,158,11,0.65)" strokeWidth="2" strokeLinecap="round"/><path d="M6 18h12" stroke="rgba(245,158,11,0.65)" strokeWidth="2" strokeLinecap="round"/></svg></span>
        <span style={{ fontWeight: 900, fontSize: 13 }}>Construtor</span>
        <span style={{ opacity: 0.9, fontSize: 12 }}>ofertas</span>
      </button>
    </div>
  );
}















