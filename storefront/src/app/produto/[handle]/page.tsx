import { MEDUSA_BACKEND_URL } from "../../../lib/medusa";

type Props = { params: { handle: string } };

export default async function ProdutoPage({ params }: Props) {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/store/products?handle=${params.handle}`, { cache: "no-store" });
  const json = await res.json();
  const product = (json.products || [])[0];

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Produto não encontrado</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <a href="/">← Voltar</a>
      <h1 style={{ fontSize: 28, marginTop: 12 }}>{product.title}</h1>

      <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8, overflow: "auto" }}>
        {JSON.stringify(product.metadata || {}, null, 2)}
      </pre>

      <p style={{ opacity: 0.8 }}>
        (Próximo passo: reimplementar formulário largura/altura/cor/observações + AddToCart.)
      </p>
    </main>
  );
}
