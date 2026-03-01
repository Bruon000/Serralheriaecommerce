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

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams?: Promise<{ ipo?: string; q?: string; tipo?: string }>;
}) {
  const sp = (await searchParams) || {};
  const ipo = (sp.ipo || "").trim();
  const q = (sp.q || "").trim().toLowerCase();
  const tipo = (sp.tipo || "").trim().toLowerCase();

  const products = (await listProducts()) as AnyProduct[];

  let list = products || [];

  if (ipo) list = list.filter((p) => String(p?.metadata?.ipo || "").toLowerCase() === ipo.toLowerCase());
  if (tipo) list = list.filter((p) => String(p?.metadata?.tipo || "").toLowerCase() === tipo);
  if (q) list = list.filter((p) => String(p?.title || "").toLowerCase().includes(q) || String(p?.handle || "").toLowerCase().includes(q));

  // opções simples para filtro
  const tipos = Array.from(new Set((products || []).map((p) => String(p?.metadata?.tipo || "")).filter(Boolean))).sort();
  const ipos = Array.from(new Set((products || []).map((p) => String(p?.metadata?.ipo || "")).filter(Boolean))).sort();

  return (
    <main style={{ padding: 24, maxWidth: 1060, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <a href="/">← Home</a>
        <a href="/carrinho">Carrinho</a>
        <a href="/construtor/status" style={{ marginLeft: "auto" }}>Status B2B</a>
      </div>

      <h1 style={{ fontSize: 26, marginTop: 14, marginBottom: 6 }}>Catálogo</h1>
      <div style={{ opacity: 0.75, marginBottom: 12 }}>Filtro por IPO/Tipo e busca por nome/handle.</div>

      <form style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <input name="q" defaultValue={q} placeholder="Buscar..." style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10, minWidth: 240 }} />

        <select name="ipo" defaultValue={ipo} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
          <option value="">IPO (todos)</option>
          {ipos.map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>

        <select name="tipo" defaultValue={tipo} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}>
          <option value="">Tipo (todos)</option>
          {tipos.map((x) => (
            <option key={x} value={x.toLowerCase()}>{x}</option>
          ))}
        </select>

        <button type="submit" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 10, fontWeight: 900 }}>
          Filtrar
        </button>

        <a href="/catalogo" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Limpar
        </a>
      </form>

      {list.length === 0 ? (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>Nenhum produto encontrado.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {list.map((p) => {
            const promo = String(p?.metadata?.promocao || "") === "semana";
            const b2b = String(p?.metadata?.oferta || "") === "construtor";

            return (
              <a
                key={p.id}
                href={`/produto/${p.handle}`}
                style={{
                  display: "block",
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontWeight: 900, flex: 1 }}>{p.title}</div>
                  {promo && <span style={{ fontSize: 11, padding: "2px 8px", border: "1px solid #ddd", borderRadius: 999 }}>PROMO</span>}
                  {b2b && <span style={{ fontSize: 11, padding: "2px 8px", border: "1px solid #ddd", borderRadius: 999 }}>B2B</span>}
                </div>

                <CatalogPrice product={p as any} />

                <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                  ipo: {String(p.metadata?.ipo ?? "-")} | tipo: {String(p.metadata?.tipo ?? "-")}
                </div>

                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800 }}>Ver detalhes →</div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
