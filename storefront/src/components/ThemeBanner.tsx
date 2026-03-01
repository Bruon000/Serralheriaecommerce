"use client";

import { useEffect, useState } from "react";

export default function ThemeBanner() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--theme-banner-text").trim();
    setText(v);
  }, []);

  if (!text) return null;

  return (
    <div style={{
      width: "100%",
      padding: "10px 12px",
      background: "var(--theme-accent)",
      color: "var(--theme-bg)",
      textAlign: "center",
      fontWeight: 600
    }}>
      {text}
    </div>
  );
}
