import { listProducts, listCategories, listCollections } from "../../lib/medusa";
import CatalogPrice from "../../components/CatalogPrice";
import { getProductType } from "../../lib/productType";
import {
  ClassifiableProduct,
  getCategoryLabel,
  getCollectionLabel,
  getCategorySlug,
  getCollectionSlug,
} from "../../lib/productClassifier";

export const dynamic = "force-dynamic";

type AnyProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  images?: { url: string }[];
  metadata?: Record<string, any> | null;
} & ClassifiableProduct;

function buildQuery(base: Record<string, any>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) {
    if (v && String(v).trim().length) sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams?: Promise<{ ipo?: string; q?: string; tipo?: string; category?: string; collection?: string; promo?: string; b2b?: string }>;
}) {
  const sp = (await searchParams) || {};
  const ipo = (sp.ipo || "").trim();
  const q = (sp.q || "").trim().toLowerCase();
  const tipo = (sp.tipo || "").trim().toLowerCase();
  const category = (sp.category || "").trim().toLowerCase();
  const collection = (sp.collection || "").trim().toLowerCase();
  const promoOn = String(sp.promo || "") === "1";
  const b2bOn = String(sp.b2b || "") === "1";

  const [products, categories, collections] = await Promise.all([
    listProducts() as Promise<AnyProduct[]>,
    listCategories(),
    listCollections(),
  ]);

  let list = products || [];
  list = list.filter((p) => Boolean(p?.thumbnail || p?.images?.[0]?.url));

  if (ipo) list = list.filter((p) => String(p?.metadata?.ipo || "").toLowerCase() === ipo.toLowerCase());
  if (tipo) list = list.filter((p) => getProductType(p) === tipo);
  if (category) {
    list = list.filter((p) => (getCategorySlug(p) || "").toLowerCase() === category);
  }
  if (collection) {
    list = list.filter((p) => (getCollectionSlug(p) || "").toLowerCase() === collection);
  }

  if (promoOn) list = list.filter((p) => String(p?.metadata?.promocao || "") === "semana");
  if (b2bOn) list = list.filter((p) => String(p?.metadata?.oferta || "") === "construtor");

  if (q) {
    list = list.filter(
      (p) =>
        String(p?.title || "").toLowerCase().includes(q) ||
        String(p?.handle || "").toLowerCase().includes(q)
    );
  }

  const ipos = Array.from(new Set((products || []).map((p) => String(p?.metadata?.ipo || "")).filter(Boolean))).sort();
  const categoryOptions = categories.map((c) => ({
    value: (c.handle && c.handle.trim()) ? c.handle.trim().toLowerCase() : c.name.trim().toLowerCase(),
    label: c.name,
  }));
  const collectionOptions = collections.map((c) => ({
    value: (c.handle && c.handle.trim()) ? c.handle.trim().toLowerCase() : c.title.trim().toLowerCase(),
    label: c.title,
  }));

  const baseQuery = {
    q: q || undefined,
    ipo: ipo || undefined,
    tipo: tipo || undefined,
    category: category || undefined,
    collection: collection || undefined,
    promo: promoOn ? "1" : undefined,
    b2b: b2bOn ? "1" : undefined,
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 overflow-x-hidden">
      <main className="container">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
          Nosso Catálogo
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Veja os modelos disponíveis e peça seu orçamento pelo WhatsApp.
        </p>

        <div className="mt-6 steel-card p-6">
          <div className="flex flex-wrap gap-3 items-center">
            <a className="rounded-full border border-border bg-black/20 px-5 py-2 text-sm font-extrabold hover:bg-black/30" href={`/catalogo${buildQuery({ ...baseQuery, promo: promoOn ? undefined : "1" })}`}>
              PROMO
            </a>
            <a className="rounded-full border border-border bg-black/20 px-5 py-2 text-sm font-extrabold hover:bg-black/30" href={`/catalogo${buildQuery({ ...baseQuery, b2b: b2bOn ? undefined : "1" })}`}>
              B2B
            </a>
            <a className="rounded-full border border-border bg-secondary px-5 py-2 text-sm font-extrabold hover:bg-secondary/80" href="/catalogo">
              Limpar
            </a>

            <div className="ml-auto flex flex-wrap gap-3 items-center">
              <form className="flex flex-wrap gap-3 items-center" action="/catalogo">
                <input type="hidden" name="promo" value={promoOn ? "1" : ""} />
                <input type="hidden" name="b2b" value={b2bOn ? "1" : ""} />

                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Buscar..."
                  className="h-11 rounded-xl border border-border/50 bg-black/35 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />

                <select name="ipo" defaultValue={ipo} className="h-11 rounded-xl border border-border/50 bg-black/35 px-4 text-sm">
                  <option value="">IPO (todos)</option>
                  {ipos.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>

                <select name="category" defaultValue={category} className="h-11 rounded-xl border border-border/50 bg-black/35 px-4 text-sm">
                  <option value="">Categoria (todas)</option>
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select name="collection" defaultValue={collection} className="h-11 rounded-xl border border-border/50 bg-black/35 px-4 text-sm">
                  <option value="">Coleção (todas)</option>
                  {collectionOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <button className="h-11 rounded-full bg-primary px-6 text-sm font-extrabold text-primary-foreground hover:brightness-110" type="submit">
                  Filtrar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {list.length === 0 ? (
            <div className="steel-card p-8">
              <h3 className="font-display text-2xl font-extrabold">Não encontramos modelos com esse filtro.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Você pode limpar os filtros ou falar com a Delima no WhatsApp para receber opções sob medida.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/5584987940211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110"
                >
                  Pedir opções no WhatsApp
                </a>
                <a
                  href="/catalogo"
                  className="rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold hover:bg-secondary/80"
                >
                  Limpar filtros
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => {
                const promo = String(p?.metadata?.promocao || "") === "semana";
                const b2b = String(p?.metadata?.oferta || "") === "construtor";
                const img = p.thumbnail || p.images?.[0]?.url || "";

                return (
                  <a key={p.id} href={`/produto/${p.handle}`} className="steel-card p-6 hover:brightness-110 transition">
                    <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-primary/90">
                      <span>{getCategoryLabel(p)}</span>
                      {getCollectionLabel(p) && (
                        <span className="rounded-full border border-border/60 bg-black/20 px-3 py-1 text-[9px] font-extrabold tracking-widest">
                          {getCollectionLabel(p)}
                        </span>
                      )}
                      {promo && <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] font-extrabold text-primary">PROMO</span>}
                      {b2b && <span className="rounded-full border border-border/60 bg-black/20 px-3 py-1 text-[9px] font-extrabold">B2B</span>}
                    </div>

                    <div className="mt-3">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.title} className="h-56 w-full rounded-2xl object-cover" />
                      ) : (
                        <div className="h-56 w-full rounded-2xl bg-black/20 border border-border/60 flex items-center justify-center text-sm text-muted-foreground">
                          sem imagem
                        </div>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight">{p.title}</h3>
                    <div className="mt-2">
                      <CatalogPrice product={p as any} />
                    </div>

                    <div className="mt-4 text-sm font-extrabold">📱 Ver modelo e pedir orçamento</div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

