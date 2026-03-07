import { notFound } from "next/navigation";
import { fetchOneEntry, getBuilderSearchParams } from "@builder.io/sdk-react";
import { Content } from "@builder.io/sdk-react";
import { cookies } from "next/headers";
import Link from "next/link";
import ProductGallery from "../../../components/ProductGallery";
import { getProductByHandle } from "../../../lib/medusa";
import AddToCartForm from "../../../components/AddToCartForm";
import PriceBlock from "../../../components/PriceBlock";
import DetailsCard from "../../../components/DetailsCard";
import { getProductType, getProductTypeLabel } from "@/lib/productType";
import { BUILDER_API_KEY, getSiteSettings } from "@/lib/builder";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProdutoPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  const quoteHref = `/orcamento?produto=${encodeURIComponent(handle)}&nome=${encodeURIComponent(product.title)}`;
  const whatsappHref = `https://wa.me/5584987940211?text=${encodeURIComponent(
    `Olá! Tenho interesse neste modelo:\n\n${product.title}\n\nLink: /produto/${handle}\n\nQuero saber valor, medidas e prazo.`
  )}`;
  const productTypeLabel = getProductTypeLabel(getProductType(product as any));

  if (BUILDER_API_KEY) {
    const resolvedSearchParams = await searchParams;
    const builderOptions = getBuilderSearchParams(
      resolvedSearchParams as Record<string, string | string[]>
    );
    const previewQuery =
      resolvedSearchParams["builder.preview"] === "1" ||
      resolvedSearchParams["builder.preview"] === "page";
    const cookieStore = await cookies();
    const previewCookie = cookieStore.get("builder.preview")?.value;
    const isPreview = Boolean(previewQuery || previewCookie);

    const builderContent = await fetchOneEntry({
      model: "product-page",
      apiKey: BUILDER_API_KEY,
      userAttributes: {
        urlPath: `/produto/${handle}`,
        handle,
        productId: product.id,
      },
      options: builderOptions,
      includeUnpublished: isPreview,
    });

    if (builderContent) {
      const siteSettings = await getSiteSettings();
      return (
        <div className="tune-product min-h-screen bg-background pt-24 pb-16 overflow-x-hidden">
          <main className="tune-product tune-product-main container">
            <div className="tune-product flex items-center gap-3 text-sm text-muted-foreground">
              <a href="/" className="tune-product hover:text-foreground transition-colors">
                Início
              </a>
              <span>/</span>
              <a href="/catalogo" className="tune-product hover:text-foreground transition-colors">
                Catálogo
              </a>
              <span>/</span>
              <span className="tune-product text-foreground/90 font-semibold truncate">
                {product.title}
              </span>
            </div>
            <div className="tune-product mt-8">
              <Content
                content={builderContent}
                model="product-page"
                apiKey={BUILDER_API_KEY}
                data={{ product, urlPath: `/produto/${handle}`, ...siteSettings }}
              />
            </div>
          </main>
        </div>
      );
    }
  }

  return (
    <div className="tune-product min-h-screen bg-background pt-24 pb-16 overflow-x-hidden">
      <main className="tune-product tune-product-main container">
        <div className="tune-product flex items-center gap-3 text-sm text-muted-foreground">
          <a href="/" className="tune-product hover:text-foreground transition-colors">
            Início
          </a>
          <span>/</span>
          <a href="/catalogo" className="tune-product hover:text-foreground transition-colors">
            Catálogo
          </a>
          <span>/</span>
          <span className="tune-product text-foreground/90 font-semibold truncate">
            {product.title}
          </span>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(460px,1fr)]">
          {/* Coluna esquerda: galeria + detalhes */}
          <div className="min-w-0 flex flex-col gap-6">
            <div className="steel-card overflow-hidden min-w-0">
              <div className="p-4">
                <ProductGallery
                  title={product.title}
                  thumbnail={(product as any).thumbnail}
                  images={(product as any).images}
                />
              </div>
            </div>
            <DetailsCard
              title="Detalhes do produto"
              description={
                (product as any).description ||
                "Produto sob medida, feito com material reforçado e acabamento profissional. Informe medidas e observações para receber uma estimativa mais rápida."
              }
              showMetaIpoTipo
              ipo={String((product as any).metadata?.ipo ?? "-")}
              tipo={productTypeLabel}
            />
          </div>

          {/* Coluna direita: título + preço + buybox (lg: coluna tem min 380px via grid) */}
          <div className="min-w-0 flex flex-col gap-6">
            <div className="steel-card overflow-hidden min-w-0 p-6 min-w-0">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-primary">
                {productTypeLabel} • SOB MEDIDA
              </div>

              <div className="mt-4 min-w-0">
                <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight min-w-0 break-words">
                  {product.title}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Solicite seu orçamento com medidas, acabamento e observações do projeto.
                  A Delima atende no WhatsApp e informa valor estimado, prazo e próximos passos.
                </p>
              </div>

              <div className="mt-4">
                <PriceBlock product={product} />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={quoteHref}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110 hover:shadow-[0_10px_30px_rgba(245,158,11,0.18)]"
                >
                  Orçar este modelo
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold text-secondary-foreground hover:bg-secondary/80"
                >
                  Falar no WhatsApp
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-black/20 p-4">
                  <div className="text-sm font-extrabold text-foreground">Sob medida</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Informe largura, altura e acabamento para orçamento mais preciso.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-black/20 p-4">
                  <div className="text-sm font-extrabold text-foreground">Atendimento rápido</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Fale direto com a Delima no WhatsApp para tirar dúvidas e confirmar detalhes.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-black/20 p-4">
                  <div className="text-sm font-extrabold text-foreground">Prazo e qualidade</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Produção com acabamento profissional e prazo alinhado no orçamento.
                  </p>
                </div>
              </div>
            </div>

            <div className="steel-card overflow-hidden min-w-0 p-6 min-w-0">
              <div className="text-sm font-extrabold text-foreground/90 mb-3">
                Comprar / adicionar ao carrinho
              </div>
              <AddToCartForm product={product} />

              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="text-sm font-extrabold text-foreground">
                  Quer um orçamento com medidas?
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Para portões, grades e estruturas sob medida, o ideal é clicar em{" "}
                  <span className="font-semibold text-foreground/90">
                    &quot;Orçar este modelo&quot;
                  </span>{" "}
                  ou falar direto no WhatsApp.
                </p>
              </div>

              <div className="mt-5 text-xs text-muted-foreground">
                Mais de <span className="font-semibold text-foreground/90">3.000 projetos entregues</span> com atendimento direto da Delima.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}












