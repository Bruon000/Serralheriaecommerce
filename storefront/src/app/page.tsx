import Link from "next/link";
import { getPromocaoSemana, getOfertasConstrutor, listProducts } from "../lib/medusa";
import { getDisplayPriceBRL } from "../lib/pricing";
import HeroSection from "../components/HeroSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import SiteFooter from "../components/SiteFooter";

export const dynamic = "force-dynamic";

function ProductCard({ p, badge }: { p: any; badge?: string }) {
  const price = getDisplayPriceBRL(p as any, false).text;
  const thumb = p?.thumbnail || (p?.images?.[0] as any)?.url || "";

  return (
    <Link
      href={`/produto/${p.handle}`}
      className="steel-card steel-card-hover group overflow-hidden block"
    >
      <div className="aspect-square overflow-hidden rounded-t-lg -m-[1px] mb-0">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            sem imagem
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {String(p?.metadata?.tipo ?? "Produto")}
          </span>
          {badge && (
            <span className="text-xs rounded-full border border-border px-3 py-1 text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold">{p.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {p.description || "Produto sob medida — solicite orçamento."}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-gradient-gold">
            {price}
          </span>
          <span className="text-sm font-bold text-primary">Ver detalhes →</span>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const promo = await getPromocaoSemana();
  const ofertasB2B = await getOfertasConstrutor();
  const all = await listProducts();

  function getImg(p: any): string {
    return String(p?.thumbnail || p?.images?.[0]?.url || "");
  }
  const promoImg = promo?.length ? getImg(promo[0] as any) : "";
  const b2bImg = ofertasB2B?.length ? getImg(ofertasB2B[0] as any) : "";

  const destaques =
    (all || []).filter(
      (p: any) => String(p?.metadata?.tipo || "").toLowerCase() === "portao"
    ).slice(0, 8) || (all || []).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="container">
        {/* Banners Promo + B2B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
          <div className="steel-card p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold mb-2">
                🔥 Ofertas da semana
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {promo.length
                  ? "Condições especiais nos destaques. Confira e aproveite."
                  : "Em breve novas ofertas. Acompanhe o catálogo."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/catalogo?promo=1"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110"
                >
                  Ver ofertas
                </Link>
              </div>
            </div>
            {promoImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={promoImg}
                alt="Promoção"
                className="w-full md:w-40 h-28 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full md:w-40 h-28 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                sem imagem
              </div>
            )}
          </div>

          <div className="steel-card p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold mb-2">
                🏗️ Área Construtor
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {ofertasB2B.length
                  ? "Condições especiais e ofertas para profissionais. Cadastre-se e consulte seu status."
                  : "Condições especiais para construtores. Cadastre-se para acessar ofertas."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/construtor/status"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110"
                >
                  Meu status
                </Link>
                <Link
                  href="/construtor/ofertas"
                  className="inline-flex items-center rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-bold text-secondary-foreground hover:bg-secondary/80"
                >
                  Ver ofertas
                </Link>
              </div>
            </div>
            {b2bImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b2bImg}
                alt="Construtor"
                className="w-full md:w-40 h-28 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full md:w-40 h-28 rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                sem imagem
              </div>
            )}
          </div>
        </div>

        {/* Catálogo (destaques) */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Nosso <span className="text-gradient-gold">Catálogo</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Produtos fabricados sob medida com materiais de primeira qualidade.
            </p>
          </div>

          {destaques.length === 0 ? (
            <div className="steel-card p-12 text-center text-muted-foreground">
              Sem produtos para exibir. Cadastre no painel Medusa.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destaques.slice(0, 8).map((p: any) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110"
            >
              Ver todo o catálogo
            </Link>
          </div>
        </section>
      </main>

      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <SiteFooter />
    </div>
  );
}
