import { listProducts } from "../../lib/medusa";
import CatalogPrice from "../../components/CatalogPrice";

export const dynamic = "force-dynamic";

type AnyProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  metadata?: Record<string, any> | null;
};

function buildQuery(base: Record<string, string | undefined>) {
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
  searchParams?: Promise<{ ipo?: string; q?: string; tipo?: string; promo?: string; b2b?: string }>;
}) {
  const sp = (await searchParams) || {};
  const ipo = (sp.ipo || "").trim();
  const q = (sp.q || "").trim().toLowerCase();
  const tipo = (sp.tipo || "").trim().toLowerCase();
  const promoOn = String(sp.promo || "") === "1";
  const b2bOn = String(sp.b2b || "") === "1";

  const products = (await listProducts()) as AnyProduct[];
  let list = products || [];

  if (ipo) list = list.filter((p) => String(p?.metadata?.ipo || "").toLowerCase() === ipo.toLowerCase());
  if (tipo) list = list.filter((p) => String(p?.metadata?.tipo || "").toLowerCase() === tipo);
  if (promoOn) list = list.filter((p) => String(p?.metadata?.promocao || "") === "semana");
  if (b2bOn) list = list.filter((p) => String(p?.metadata?.oferta || "") === "construtor");
  if (q) list = list.filter((p) =>
    String(p?.title || "").toLowerCase().includes(q) ||
    String(p?.handle || "").toLowerCase().includes(q)
  );

  const tipos = Array.from(new Set((products || []).map((p) => String(p?.metadata?.tipo || "")).filter(Boolean))).sort();
  const ipos = Array.from(new Set((products || []).map((p) => String(p?.metadata?.ipo || "")).filter(Boolean))).sort();

  const baseQuery = { q: q || undefined, ipo: ipo || undefined, tipo: tipo || undefined, promo: promoOn ? "1" : undefined, b2b: b2bOn ? "1" : undefined };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <main className="container">
        <h1 className="font-display text-4xl font-bold tracking-tight mb-2">
          Nosso <span className="text-gradient-gold">Catálogo</span>
        </h1>
        <p className="text-muted-foreground mb-6">Use os chips para filtrar (PROMO / B2B / Tipo / IPO).</p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <a
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              promoOn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
            }`}
            href={"/catalogo" + buildQuery({ ...baseQuery, promo: promoOn ? undefined : "1" })}
          >
            PROMO
          </a>
          <a
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              b2bOn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
            }`}
            href={"/catalogo" + buildQuery({ ...baseQuery, b2b: b2bOn ? undefined : "1" })}
          >
            B2B
          </a>
          <a
            className="rounded-full px-5 py-2.5 text-sm font-semibold border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
            href="/catalogo"
          >
            Limpar
          </a>
        </div>

        <form className="flex flex-wrap gap-3 mb-10" action="/catalogo" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar..."
            className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-foreground min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            name="ipo"
            defaultValue={ipo}
            className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">IPO (todos)</option>
            {ipos.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
          <select
            name="tipo"
            defaultValue={tipo}
            className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tipo (todos)</option>
            {tipos.map((x) => (
              <option key={x} value={x.toLowerCase()}>{x}</option>
            ))}
          </select>
          {promoOn && <input type="hidden" name="promo" value="1" />}
          {b2bOn && <input type="hidden" name="b2b" value="1" />}
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110"
          >
            Filtrar
          </button>
        </form>

        {list.length === 0 ? (
          <div className="steel-card p-12 text-center text-muted-foreground">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => {
              const promo = String(p?.metadata?.promocao || "") === "semana";
              const b2b = String(p?.metadata?.oferta || "") === "construtor";
              return (
                <a
                  key={p.id}
                  href={`/produto/${p.handle}`}
                  className="steel-card steel-card-hover group overflow-hidden block"
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg -m-[1px] mb-0">
                    {p.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                        sem imagem
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {String(p?.metadata?.tipo ?? "Produto")}
                      </span>
                      <div className="flex gap-1">
                        {promo && <span className="text-xs rounded-full border border-border px-2 py-0.5">PROMO</span>}
                        {b2b && <span className="text-xs rounded-full border border-border px-2 py-0.5">B2B</span>}
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                    <div className="mt-2">
                      <CatalogPrice product={p as any} />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      ipo: {String(p.metadata?.ipo ?? "-")} | tipo: {String(p.metadata?.tipo ?? "-")}
                    </div>
                    <div className="mt-3 text-sm font-bold text-primary">Ver detalhes</div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

