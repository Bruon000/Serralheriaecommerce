"use client";

import { getTheme } from "../lib/theme";

export default function ThemeBanner() {
  const t = getTheme();
  if (!t) return null;

  // chip discreto no topo (não ocupa barra)
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 80,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.3,
          background: "rgba(20, 20, 20, 0.78)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <span aria-hidden="true">🎉</span>
        <span>{t.title}</span>
      </div>
    </div>
  );
}

