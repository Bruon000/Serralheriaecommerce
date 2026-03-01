import { listProducts } from "../../../lib/medusa";

type AnyProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  metadata?: Record<string, any> | null;
};

export const dynamic = "force-dynamic";

export default async function OfertasConstrutorPage() {
  const products = (await listProducts()) as AnyProduct[];

  const ofertas = (products || []).filter((p) => p?.metadata?.oferta === "construtor");

  return (
    <main style={{ padding: 16 }}>
      <a href="/">← Home</a>
      <h1>Ofertas para construtores (B2B)</h1>

      <p style={{ marginTop: 8 }}>
        Aqui aparecem apenas produtos com <code>metadata.oferta = "construtor"</code>.
      </p>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginTop: 12 }}>
        <b>Como ativar no Admin:</b>
        <ol style={{ marginTop: 8 }}>
          <li>Abrir o produto no Medusa Admin</li>
          <li>Ir em <b>Metadata</b></li>
          <li>Adicionar <code>oferta</code> = <code>construtor</code></li>
        </ol>
        <div style={{ marginTop: 8 }}>
          Alternativa (em lote): <code>tools\ofertas-construtor.ps1</code>
        </div>
      </div>

      {ofertas.length === 0 ? (
        <p style={{ marginTop: 16 }}>
          Nenhuma oferta marcada ainda. Marque no Admin (metadata) ou use o script.
        </p>
      ) : (
        <ul style={{ marginTop: 16 }}>
          {ofertas.map((p) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <a href={`/produto/${p.handle}`}>{p.title}</a>{" "}
              <span style={{ fontSize: 12, padding: "2px 6px", border: "1px solid #ddd", borderRadius: 999 }}>
                B2B
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
