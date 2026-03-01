"use client";

import themes from "../../themes.json";

type ThemeVars = Record<string, string>;

function mmddToNumber(mmdd: string) {
  const [mm, dd] = mmdd.split("-").map((x) => parseInt(x, 10));
  return mm * 100 + dd;
}

function getActiveThemeKey(d: Date) {
  const today = (d.getMonth() + 1) * 100 + d.getDate();

  // @ts-ignore - themes.json structure
  const list = themes.themes as Array<{ key: string; start: string; end: string }>;

  for (const t of list) {
    const start = mmddToNumber(t.start);
    const end = mmddToNumber(t.end);

    // range normal (ex: 06-01..06-30)
    if (start <= end) {
      if (today >= start && today <= end) return t.key;
    } else {
      // range que cruza o ano (ex: 12-26..01-07)
      if (today >= start || today <= end) return t.key;
    }
  }
  return "default";
}

function getTheme(d: Date) {
  const forced = process.env.NEXT_PUBLIC_THEME_FORCE;
  const key = forced && forced.trim().length ? forced.trim() : getActiveThemeKey(d);

  // @ts-ignore
  const def = themes.default as { name: string; bannerText: string; vars: ThemeVars };

  // @ts-ignore
  const list = themes.themes as Array<{ key: string; name: string; bannerText: string; vars: ThemeVars }>;
  const found = list.find((t) => t.key === key);

  return {
    key: found?.key ?? "default",
    name: found?.name ?? def.name,
    bannerText: found?.bannerText ?? def.bannerText,
    vars: { ...def.vars, ...(found?.vars ?? {}) }
  };
}

export default function ThemeAutoStyle() {
  const d = new Date();
  const t = getTheme(d);

  // aplica vars no :root
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(t.vars)) root.style.setProperty(k, v);
    root.style.setProperty("--theme-banner-text", t.bannerText || "");
    root.style.setProperty("--theme-key", t.key);
  }

  return null;
}
