import AddToCartForm from "../../../components/AddToCartForm";
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "../../../lib/medusa";

type Props = { params: { handle?: string[] } };

export default async function ProdutoPage({ params }: Props) {
  const handle = (params?.handle || []).join("/").trim();

  if (!handle) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Produto não encontrado</h1>
        <p>handle vazio (params não chegou)</p>
      </main>
    );
  }

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/store/products?limit=200&fields=id,title,handle,metadata,metadata.ipo,metadata.tipo`,
    {
      cache: "no-store",
      headers: MEDUSA_PUBLISHABLE_KEY
        ? { "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY }
        : undefined,
    }
  );

  const json = await res.json();
  const product = (json.products || []).find((p: any) => p.handle === handle);

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Produto não encontrado</h1>
        <p>handle: {handle}</p>
        <p>Produtos carregados: {(json.products || []).length}</p>
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

      <div style={{ marginTop: 12 }}>
        <a href="/carrinho">Ir para o carrinho</a>
      </div>
    </main>
  );
}
