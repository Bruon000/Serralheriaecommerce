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
    <main className="container">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <a className="pill" href="/">← Home</a>
        <a className="pill" href="/carrinho">Carrinho</a>
        <a className="pill pillPrimary" href="/construtor/status" style={{ marginLeft: "auto" }}>Status B2B</a>
      </div>

      <h1 style={{ fontSize: 26, marginTop: 14, marginBottom: 6, fontWeight: 950 }}>Catálogo</h1>
      <div style={{ opacity: 0.75, marginBottom: 10 }}>Use os chips para filtrar rápido (PROMO/B2B/Tipo/IPO).</div>

      <div className="chips">
        <a
          className={"chip " + (promoOn ? "chipOn" : "")}
          href={"/catalogo" + buildQuery({ ...baseQuery, promo: promoOn ? undefined : "1" })}
        >
          <span className="chipDot"></span> PROMO
        </a>

        <a
          className={"chip " + (b2bOn ? "chipOn" : "")}
          href={"/catalogo" + buildQuery({ ...baseQuery, b2b: b2bOn ? undefined : "1" })}
        >
          <span className="chipDot"></span> B2B
        </a>

        <a className="chip" href="/catalogo">Limpar</a>
      </div>

      <form style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar..."
          style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 10, minWidth: 240 }}
        />

        <select name="ipo" defaultValue={ipo} style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 10 }}>
          <option value="">IPO (todos)</option>
          {ipos.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>

        <select name="tipo" defaultValue={tipo} style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 10 }}>
          <option value="">Tipo (todos)</option>
          {tipos.map((x) => (
            <option key={x} value={x.toLowerCase()}>{x}</option>
          ))}
        </select>

        {/* manter promo/b2b quando usar submit */}
        {promoOn && <input type="hidden" name="promo" value="1" />}
        {b2bOn && <input type="hidden" name="b2b" value="1" />}

        <button type="submit" style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 10, fontWeight: 950 }}>
          Filtrar
        </button>
      </form>

      {list.length === 0 ? (
        <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "#fff" }}>
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid">
          {list.map((p) => {
            const promo = String(p?.metadata?.promocao || "") === "semana";
            const b2b = String(p?.metadata?.oferta || "") === "construtor";

            return (
              <a key={p.id} className="card" href={`/produto/${p.handle}`}>
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="thumb" src={p.thumbnail} alt={p.title} />
                ) : (
                  <div className="thumb" style={{ display: "grid", placeItems: "center", opacity: 0.6 }}>
                    sem imagem
                  </div>
                )}

                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="cardTitle" style={{ flex: 1 }}>{p.title}</div>
                  {promo && <span className="badge">PROMO</span>}
                  {b2b && <span className="badge">B2B</span>}
                </div>

                <CatalogPrice product={p as any} />

                <div className="meta">
                  ipo: {String(p.metadata?.ipo ?? "-")} | tipo: {String(p.metadata?.tipo ?? "-")}
                </div>

                <div style={{ marginTop: 10, fontWeight: 900, fontSize: 13 }}>Ver detalhes →</div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
