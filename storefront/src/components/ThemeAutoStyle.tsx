"use client";

import { getTheme } from "../lib/theme";

export default function ThemeAutoStyle() {
  const t = getTheme(new Date());

  if (typeof document !== "undefined") {
    const root = document.documentElement;

    for (const [k, v] of Object.entries(t.vars || {})) root.style.setProperty(k, String(v));
    root.style.setProperty("--theme-banner-text", t.bannerText || "");
    root.style.setProperty("--theme-key", t.key);

    // textos do hero como CSS vars (opcional, mas útil)
    root.style.setProperty("--theme-hero-title", t.heroTitle || "");
    root.style.setProperty("--theme-hero-subtitle", t.heroSubtitle || "");
    root.style.setProperty("--theme-cta-primary", t.ctaPrimary || "");
    root.style.setProperty("--theme-cta-secondary", t.ctaSecondary || "");
    root.style.setProperty("--theme-cta-tertiary", t.ctaTertiary || "");
  }

  return null;
}
