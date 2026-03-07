/**
 * Fonte única de verdade para tipos/categorias de produtos.
 * Usado em: badges nos cards, filtros do /catalogo, CategoryStrip na Home.
 */

export type TypeRegistryEntry = {
  slug: string;
  label: string;
  subtitle?: string;
  emoji?: string;
  comingSoon?: boolean;
  order: number;
};

/** Registry de tipos: slug, label, opcional emoji/comingSoon, ordem. */
export const TYPE_REGISTRY: TypeRegistryEntry[] = [
  { slug: "portao", label: "Portões", subtitle: "Basculante, correr, social…", emoji: "🚪", order: 1 },
  { slug: "grade", label: "Grades", subtitle: "Janelas, portas e proteção", emoji: "🧱", order: 2 },
  { slug: "corrimao", label: "Corrimãos", subtitle: "Escadas e rampas", order: 3 },
  { slug: "estrutura", label: "Estrutura metálica", subtitle: "Coberturas e estruturas", emoji: "🏠", order: 4 },
  { slug: "seminovo", label: "Portões usados", subtitle: "Oportunidades (seminovos)", emoji: "♻️", order: 5 },
  { slug: "cobertura", label: "Coberturas", subtitle: "Em breve", comingSoon: true, order: 6 },
  { slug: "produto", label: "Produto", order: 99 },
];

const LABEL_MAP = new Map<string, string>(TYPE_REGISTRY.map((e) => [e.slug, e.label]));

/** Normaliza string para slug: lowercase, sem acento. */
function toSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") || "";
}

/** Retorna o tipo (slug) do produto: metadata.tipo primeiro, depois inferência por handle/title. */
export function getProductType(product: { handle?: string; title?: string; metadata?: Record<string, unknown> | null } | null | undefined): string {
  if (!product) return "produto";

  const meta = product.metadata?.tipo;
  if (meta != null && String(meta).trim()) {
    const t = toSlug(String(meta).trim());
    if (t) return t;
  }

  const seminovoMeta = product.metadata?.seminovo;
  if (seminovoMeta != null && ["true", "1"].includes(String(seminovoMeta).toLowerCase())) return "seminovo";

  const h = String(product.handle ?? "").toLowerCase();
  const title = String(product.title ?? "").toLowerCase();

  if (h.includes("usado") || title.includes("usado") || title.includes("seminovo")) return "seminovo";
  if (h.startsWith("portao") || title.includes("portão") || title.includes("portao")) return "portao";
  if (h.startsWith("grade") || title.includes("grade")) return "grade";
  if (h.startsWith("corrimao") || title.includes("corrimão") || title.includes("corrimao")) return "corrimao";
  if (h.startsWith("estrutura") || title.includes("estrutura")) return "estrutura";

  return "produto";
}

/** Retorna o label bonito para exibição a partir do slug. */
export function getProductTypeLabel(type?: string | null): string {
  if (!type) return "Produto";
  const slug = toSlug(type);
  const label = LABEL_MAP.get(slug);
  if (label) return label;
  return slug ? slug : "Produto";
}

/** Retorna entradas do registry ordenadas (para CategoryStrip e filtros). comingSoon opcionalmente incluídas. */
export function getTypeRegistry(includeComingSoon = true): TypeRegistryEntry[] {
  const list = [...TYPE_REGISTRY].sort((a, b) => a.order - b.order);
  if (!includeComingSoon) return list.filter((e) => !e.comingSoon);
  return list;
}

/** Conta produtos por tipo. Retorna Map<slug, count>. */
export function countByType(products: { handle?: string; title?: string; metadata?: Record<string, unknown> | null }[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of products) {
    const slug = getProductType(p);
    map.set(slug, (map.get(slug) ?? 0) + 1);
  }
  return map;
}
