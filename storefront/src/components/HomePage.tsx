import Link from "next/link";
import { getPromocaoSemana, getOfertasConstrutor, listProducts } from "@/lib/medusa";
import { getDisplayPriceBRL } from "@/lib/pricing";
import { getProductType } from "@/lib/productType";
import { getCategoryLabel, getCollectionLabel, ClassifiableProduct } from "@/lib/productClassifier";
import HeroSection from "./HeroSection";

import CategoryStrip from "./CategoryStrip";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";
import SiteFooter from "./SiteFooter";

export const dynamic = "force-dynamic";

function ImageOrPlaceholder({ src, alt }: { src?: string; alt: string }) {
  const s = String(src || "").trim();
  if (s) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={s} alt={alt} className="h-64 w-full rounded-2xl object-cover" />
    );
  }
  return (
    <div className="h-64 w-full rounded-2xl bg-black/20 border border-border/60 flex items-center justify-center text-sm text-muted-foreground">
      imagem em breve
    </div>
  );
}

function ProductCard({ p, badge }: { p: ClassifiableProduct; badge?: string }) {
  const price = getDisplayPriceBRL(p as any, false).text;
  const thumb = p?.thumbnail || (p?.images?.[0] as any)?.url || "";
  const tipoLabel = getCategoryLabel(p);
  const collectionLabel = getCollectionLabel(p);

  return (
    <div className="steel-card p-5">
      <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-primary/90">
        <span>{tipoLabel}</span>
        {collectionLabel && (
          <span className="rounded-full border border-border/60 bg-black/30 px-3 py-1 text-[9px] font-extrabold tracking-widest text-muted-foreground">
            {collectionLabel}
          </span>
        )}
        {badge && (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] font-extrabold tracking-widest text-primary">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-3">
        <ImageOrPlaceholder src={thumb} alt={p.title} />
      </div>

      <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight line-clamp-2">
        {p.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
        {p.description || "Produto sob medida — solicite orçamento."}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <div className="text-sm font-extrabold">{price}</div>
        <Link
          href={`/produto/${p.handle}`}
          className="w-full sm:w-auto inline-flex items-center justify-center min-w-[132px] rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground hover:brightness-110"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const WA_NUMBER = "5585999999999";

  const promo = await getPromocaoSemana();
  const ofertasB2B = await getOfertasConstrutor();
  const all = await listProducts();

  const getImg = (p: any): string => String(p?.thumbnail || p?.images?.[0]?.url || "");
  const promoImg = promo?.length ? getImg(promo[0] as any) : "";
  const b2bImg = ofertasB2B?.length ? getImg(ofertasB2B[0] as any) : "";
  const hasPromoImg = Boolean(promoImg);
  const hasB2BImg = Boolean(b2bImg);

  // ✅ Portões primeiro por inferência (não depende de metadata)
  const portoes = (all || []).filter((p: any) => getProductType(p) === "portao");
  const destaques =
    (portoes.length ? portoes : (all || []))
      .slice(0, 8);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />

      <section className="container pt-10 pb-4">
        <div className="steel-card p-6 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight mb-2">Monte seu portão</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Escolha modelo, material e medidas. Veja a estimativa e envie o orçamento pelo WhatsApp.
          </p>
          <Link
            href="/monte-seu-portao"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110 hover:scale-[1.02] transition duration-200"
          >
            Calcular orçamento
          </Link>
        </div>
      </section>

      <CategoryStrip products={all} />

      <section className="container pt-10 pb-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Por que escolher nossa serralheria?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">Agilidade real</div>
            <p className="text-sm text-muted-foreground">
              Cumprimos prazos de entrega. Fabricação rápida sem perder a qualidade.
            </p>
          </div>
          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">Preço justo e transparente</div>
            <p className="text-sm text-muted-foreground">
              Orçamento sem surpresas. Você paga o que foi combinado, com o melhor custo-benefício da região.
            </p>
          </div>
          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">Garantia e segurança</div>
            <p className="text-sm text-muted-foreground">
              Materiais de primeira e mão de obra especializada. Produtos feitos para durar anos.
            </p>
          </div>
          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">Atendimento personalizado</div>
            <p className="text-sm text-muted-foreground">
              Do orçamento à entrega: tire suas dúvidas direto pelo WhatsApp e acompanhe seu pedido.
            </p>
          </div>
        </div>
      </section>

      {(hasPromoImg || hasB2BImg) && (
      <section className="container pt-14">
        <div className="grid gap-6 md:grid-cols-2">
          {hasPromoImg && (
            <div className="steel-card p-7">
              <h3 className="font-display text-2xl font-extrabold">Promoção</h3>
              <div className="mt-4">
                <ImageOrPlaceholder src={promoImg} alt="Promoção" />
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/catalogo?promo=1" className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground">
                  Ver promoções
                </Link>
              </div>
            </div>
          )}

          {hasB2BImg && (
            <div className="steel-card p-7">
              <h3 className="font-display text-2xl font-extrabold">Área Construtor</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {ofertasB2B.length
                  ? "Condições especiais e ofertas para profissionais. Cadastre-se e consulte seu status."
                  : "Condições especiais para construtores. Cadastre-se para acessar ofertas."}
              </p>
              <div className="mt-4">
                <ImageOrPlaceholder src={b2bImg} alt="Área construtor" />
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/construtor" className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground">
                  Meu status
                </Link>
                <Link href="/catalogo?b2b=1" className="rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold">
                  Ver ofertas
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      <section className="container pt-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight">Nosso Catálogo</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Portões em destaque + itens sob medida.
            </p>
          </div>
          <Link href="/catalogo" className="rounded-full border border-border bg-black/20 px-6 py-3 text-sm font-extrabold hover:bg-black/30">
            Ver todo o catálogo
          </Link>
        </div>

        <div className="mt-6">
          {destaques.length === 0 ? (
            <div className="steel-card p-8">
              <h3 className="font-display text-2xl font-extrabold">Catálogo em atualização</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ainda não há produtos cadastrados. Enquanto isso, veja promoções ou peça orçamento no WhatsApp.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link href="/catalogo?promo=1" className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground">
                  Ver promoções
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold hover:bg-secondary/80"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {destaques.map((p: any) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <SiteFooter />
    </div>
  );
}

