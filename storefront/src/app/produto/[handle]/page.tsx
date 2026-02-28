import AddToCartForm from "../../../components/AddToCartForm";
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "../../../lib/medusa";

type Props = { params: { handle: string } };

export default async function ProdutoPage({ params }: Props) {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/products?handle=${params.handle}&fields=id,title,handle,metadata,metadata.ipo,metadata.tipo`,
    {
      cache: "no-store",
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : undefined,
    }
  );

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

      <div style={{ opacity: 0.8, marginTop: 6 }}>
        handle: {product.handle} | ipo: {String(product.metadata?.ipo ?? "-")} | tipo:{" "}
        {String(product.metadata?.tipo ?? "-")}
      </div>

      <AddToCartForm product={product} />

      <pre style={{ marginTop: 16, background: "#f6f6f6", padding: 12, borderRadius: 8, overflow: "auto" }}>
        {JSON.stringify(product.metadata || {}, null, 2)}
      </pre>
    </main>
  );
}
