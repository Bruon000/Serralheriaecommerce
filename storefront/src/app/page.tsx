import { getPromocaoSemana, getOfertasConstrutor, listProducts } from "../lib/medusa";
import { getDisplayPriceBRL } from "../lib/pricing";

export const dynamic = "force-dynamic";

function Card({ p, badge }: { p: any; badge?: string }) {
  const price = getDisplayPriceBRL(p as any, false).text;

  return (
    <a
      href={`/produto/${p.handle}`}
      style={{
        display: "block",
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 12,
        textDecoration: "none",
        color: "inherit",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontWeight: 800, flex: 1 }}>{p.title}</div>
        {badge && (
          <span style={{ fontSize: 12, padding: "2px 8px", border: "1px solid #ddd", borderRadius: 999 }}>
            {badge}
          </span>
        )}
      </div>

      <div style={{ marginTop: 6, fontWeight: 800, fontSize: 18 }}>{price}</div>

      <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
        ipo: {String(p.metadata?.ipo ?? "-")} | tipo: {String(p.metadata?.tipo ?? "-")}
      </div>

      <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700 }}>
        Ver detalhes →
      </div>
    </a>
  );
}

export default async function Home() {
  const promo = await getPromocaoSemana();
  const ofertasB2B = await getOfertasConstrutor();
  const all = await listProducts();

  // Destaques: pega os primeiros "portao" (ou fallback)
  const destaques =
    (all || []).filter((p: any) => (String(p?.metadata?.tipo || "").toLowerCase() === "portao")).slice(0, 8) ||
    (all || []).slice(0, 8);

  return (
    <main style={{ padding: 24, maxWidth: 1060, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Serralheria Ecommerce</h1>
      <div style={{ opacity: 0.75, marginBottom: 18 }}>
        Portões, grades, corrimãos e estruturas metálicas — orçamento rápido pelo WhatsApp.
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <a href="/catalogo" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Ver catálogo
        </a>
        <a href="/carrinho" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Ir para o carrinho
        </a>
        <a href="/construtor/login" style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}>
          Área Construtor (B2B)
        </a>
      </div>

      {/* Promoção */}
      <section style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Promoção da Semana</h2>
          <span style={{ opacity: 0.65, fontSize: 13 }}>metadata.promocao = "semana"</span>
        </div>

        {promo.length === 0 ? (
          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10, marginTop: 12 }}>
            Nenhum produto em promoção nesta semana.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginTop: 12 }}>
            {promo.slice(0, 8).map((p) => (
              <Card key={p.id} p={p} badge="PROMO" />
            ))}
          </div>
        )}
      </section>

      {/* B2B */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Ofertas para Construtores (B2B)</h2>
          <span style={{ opacity: 0.65, fontSize: 13 }}>metadata.oferta = "construtor"</span>
        </div>

        <div style={{ marginTop: 10, opacity: 0.8 }}>
          Acesse a área B2B para ver status e condições.{" "}
          <a href="/construtor/status">Ver meu status</a> · <a href="/construtor/ofertas">Ver ofertas B2B</a>
        </div>

        {ofertasB2B.length === 0 ? (
          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10, marginTop: 12 }}>
            Nenhuma oferta B2B marcada ainda. Marque no Admin (metadata.oferta="construtor") ou use tools\ofertas-construtor.ps1
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginTop: 12 }}>
            {ofertasB2B.slice(0, 8).map((p) => (
              <Card key={p.id} p={p} badge="B2B" />
            ))}
          </div>
        )}
      </section>

      {/* Destaques */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Destaques</h2>
          <span style={{ opacity: 0.65, fontSize: 13 }}>seleção automática (tipo=portao)</span>
        </div>

        {destaques.length === 0 ? (
          <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10, marginTop: 12 }}>
            Sem produtos para exibir.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginTop: 12 }}>
            {destaques.map((p: any) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      <footer style={{ marginTop: 30, paddingTop: 18, borderTop: "1px solid #eee", opacity: 0.75, fontSize: 13 }}>
        Dica: no Admin, use metadata.promocao="semana" e metadata.oferta="construtor" para destacar produtos.
      </footer>
    </main>
  );
}
