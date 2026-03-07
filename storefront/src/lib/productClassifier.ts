/**
 * Utilitário de classificação de produtos usando Categories + Collections do Medusa,
 * com fallback para metadata/handle/title.
 */

export type ClassifiableProduct = {
  id?: string;
  title?: string;
  handle?: string;
  metadata?: Record<string, unknown> | null;
  categories?: { id?: string; name?: string; handle?: string | null }[] | null;
  collection?: { id?: string; title?: string; handle?: string | null } | null;
};

/** Normaliza string para slug: lowercase, sem acento, espaços -> '-' */
export function toSlug(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const FALLBACK_TYPE_LABELS: Record<string, string> = {
  portao: "Portões",
  grade: "Grades",
  corrimao: "Corrimãos",
  estrutura: "Estrutura metálica",
  seminovo: "Portões usados",
};

function inferTypeSlugFromMetaOrText(p: ClassifiableProduct): string {
  const metaTipo = (p.metadata as any)?.tipo;
  if (metaTipo != null && String(metaTipo).trim()) {
    const slug = toSlug(String(metaTipo));
    if (slug) return slug;
  }

  const h = String(p.handle ?? "").toLowerCase();
  const title = String(p.title ?? "").toLowerCase();

  if (h.includes("usado") || title.includes("usado") || title.includes("seminovo")) return "seminovo";
  if (h.startsWith("portao") || title.includes("portão") || title.includes("portao")) return "portao";
  if (h.startsWith("grade") || title.includes("grade")) return "grade";
  if (h.startsWith("corrimao") || title.includes("corrimão") || title.includes("corrimao")) return "corrimao";
  if (h.startsWith("estrutura") || title.includes("estrutura")) return "estrutura";

  return "produto";
}

export function getPrimaryCategory(p: ClassifiableProduct): ClassifiableProduct["categories"][number] | undefined {
  const cats = p.categories;
  if (!Array.isArray(cats) || !cats.length) return undefined;
  return cats[0];
}

export function getCategorySlug(p: ClassifiableProduct): string | undefined {
  const cat = getPrimaryCategory(p);
  if (!cat) return undefined;

  const handle = cat.handle;
  if (handle && String(handle).trim()) return toSlug(String(handle));

  const name = cat.name;
  if (name && String(name).trim()) return toSlug(String(name));

  return undefined;
}

export function getCategoryLabel(p: ClassifiableProduct): string {
  const cat = getPrimaryCategory(p);
  if (cat?.name && String(cat.name).trim()) return String(cat.name).trim();

  const slug = inferTypeSlugFromMetaOrText(p);
  const label = FALLBACK_TYPE_LABELS[slug];
  if (label) return label;
  return slug ? slug : "Produto";
}

export function getCollectionSlug(p: ClassifiableProduct): string | undefined {
  const c = p.collection;
  if (!c) return undefined;

  if (c.handle && String(c.handle).trim()) return toSlug(String(c.handle));
  if (c.title && String(c.title).trim()) return toSlug(String(c.title));

  return undefined;
}

export function getCollectionLabel(p: ClassifiableProduct): string | undefined {
  const c = p.collection;
  if (!c) return undefined;

  if (c.title && String(c.title).trim()) return String(c.title).trim();
  if (c.handle && String(c.handle).trim()) return String(c.handle).trim();

  return undefined;
}

