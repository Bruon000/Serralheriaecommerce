import { notFound } from "next/navigation";
import { getProductByHandle } from "../../../lib/medusa";
import AddToCartForm from "../../../components/AddToCartForm";

type Props = { params: Promise<{ handle: string }> };

export default async function ProdutoPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <a href="/">← Home</a>
      <a href="/catalogo" style={{ marginLeft: 12 }}>Catálogo</a>

      <h1 style={{ fontSize: 28, marginTop: 16 }}>{product.title}</h1>
      <div style={{ opacity: 0.8, fontSize: 14, marginTop: 8 }}>
        IPO: {String(product.metadata?.ipo ?? "-")} | Tipo: {String(product.metadata?.tipo ?? "-")}
      </div>

      {product.thumbnail && (
        <div style={{ marginTop: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #ddd" }}
          />
        </div>
      )}

      <AddToCartForm product={product} />
    </main>
  );
}
