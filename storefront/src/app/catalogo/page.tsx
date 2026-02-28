import { listProducts } from "../../lib/medusa";

type Props = { searchParams?: { ipo?: string } };

export default async function CatalogoPage({ searchParams }: Props) {
  const ipo = searchParams?.ipo?.trim();
  const products = await listProducts();

  const filtered = ipo ? products.filter((p) => String(p.metadata?.ipo ?? "") === ipo) : products;
  const ipos = Array.from(new Set(products.map((p) => String(p.metadata?.ipo ?? "")).filter(Boolean))).sort();

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <a href="/">← Home</a>
      <h1 style={{ fontSize: 28, marginTop: 12 }}>Catálogo</h1>

      <div style={{ margin: "12px 0 18px" }}>
        <span style={{ opacity: 0.8, marginRight: 8 }}>Filtro IPO:</span>
        <a href="/catalogo" style={{ marginRight: 10 }}>Todos</a>
        {ipos.map((i) => (
          <a key={i} href={`/catalogo?ipo=${encodeURIComponent(i)}`} style={{ marginRight: 10 }}>
            {i}
          </a>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {filtered.map((p) => (
          <a
            key={p.id}
            href={`/produto/${p.handle}`}
            style={{
              display: "block",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>ipo: {String(p.metadata?.ipo ?? "-")}</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>tipo: {String(p.metadata?.tipo ?? "-")}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
