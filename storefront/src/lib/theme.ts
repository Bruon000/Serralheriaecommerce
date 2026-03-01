import themes from "../../themes.json";

type ThemeVars = Record<string, string>;

export type ThemeDef = {
  key: string;
  name: string;
  bannerText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaTertiary?: string;
  vars: ThemeVars;
};

function mmddToNumber(mmdd: string) {
  const [mm, dd] = mmdd.split("-").map((x) => parseInt(x, 10));
  return mm * 100 + dd;
}

function getActiveThemeKey(d: Date) {
  const today = (d.getMonth() + 1) * 100 + d.getDate();
  // @ts-ignore
  const list = themes.themes as Array<{ key: string; start: string; end: string }>;
  for (const t of list) {
    const start = mmddToNumber(t.start);
    const end = mmddToNumber(t.end);
    if (start <= end) {
      if (today >= start && today <= end) return t.key;
    } else {
      if (today >= start || today <= end) return t.key;
    }
  }
  return "default";
}

export function getTheme(d = new Date()): ThemeDef {
  const forced = (process.env.NEXT_PUBLIC_THEME_FORCE || "").trim();
  const key = forced.length ? forced : getActiveThemeKey(d);

  // @ts-ignore
  const def = themes.default as ThemeDef;
  // @ts-ignore
  const list = themes.themes as ThemeDef[];

  const found = list.find((t) => t.key === key);

  const merged: ThemeDef = {
    key: found?.key ?? "default",
    name: found?.name ?? def.name,
    bannerText: found?.bannerText ?? def.bannerText ?? "",
    heroTitle: found?.heroTitle ?? def.heroTitle ?? "",
    heroSubtitle: found?.heroSubtitle ?? def.heroSubtitle ?? "",
    ctaPrimary: found?.ctaPrimary ?? def.ctaPrimary ?? "Ver catálogo",
    ctaSecondary: found?.ctaSecondary ?? def.ctaSecondary ?? "Ir para o carrinho",
    ctaTertiary: found?.ctaTertiary ?? def.ctaTertiary ?? "Sou construtor (B2B)",
    vars: { ...(def.vars || {}), ...((found?.vars as any) || {}) },
  };

  return merged;
}
