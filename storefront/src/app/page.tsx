import Link from "next/link";
import { getPromocaoSemana, getOfertasConstrutor, listProducts } from "../lib/medusa";
import { getDisplayPriceBRL } from "../lib/pricing";
import HeroSection from "../components/HeroSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import SiteFooter from "../components/SiteFooter";

export const dynamic = "force-dynamic";

function ImageOrPlaceholder({ src, alt }: { src?: string; alt: string }) {
  const s = String(src || "").trim();
  if (s) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={s}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.06),transparent_45%)]">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true">🖼️</span> imagem em breve
      </span>
    </div>
  );
}
function ProductCard({ p, badge }: { p: any; badge?: string }) {
  const price = getDisplayPriceBRL(p as any, false).text;
  const thumb = p?.thumbnail || (p?.images?.[0] as any)?.url || "";

  return (
    <Link
      href={`/produto/${p.handle}`}
      className="steel-card steel-card-hover group overflow-hidden block"
    >
      <div className="aspect-square overflow-hidden rounded-t-lg -m-[1px] mb-0">
        {<ImageOrPlaceholder src={thumb} alt={p.title} />}
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
          <span className="text-sm font-bold text-primary">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const WA_NUMBER = "5585999999999";
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

      <main className="container py-12 space-y-16">
        {/* Banners Promo + B2B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="steel-card p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-stretch">
            <div className="flex-1 min-h-[168px] flex flex-col justify-between">
              <h3 className="font-display text-xl font-bold mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="rgba(245,158,11,0.95)" strokeWidth="2"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.4-2.3.9a7 7 0 0 0-1.7-1L14.6 3h-5.2L9.1 6.3a7 7 0 0 0-1.7 1L5.1 6.4l-2 3.4 2 1.2a7 7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.9a7 7 0 0 0 1.7 1L9.4 21h5.2l.3-3.3a7 7 0 0 0 1.7-1l2.3.9 2-3.4-2-1.2c.07-.33.1-.66.1-1z" stroke="rgba(245,158,11,0.45)" strokeWidth="1.6" strokeLinejoin="round"/></svg><span style={{ marginLeft: 8 }}>Ofertas da semana</span> <span className="ml-2 align-middle text-[10px] font-extrabold px-2 py-1 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">OFERTA</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {promo.length
                  ? "Condições especiais nos destaques. Confira e aproveite."
                  : "Em breve novas ofertas. Acompanhe o catálogo."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/catalogo?promo=1" className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110"
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
                className="w-full md:w-40 h-24 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full md:w-40 h-24 rounded-lg border border-dashed border-border overflow-hidden"><ImageOrPlaceholder src={""} alt="Imagem" /></div>
            )}
          </div>

          <div className="steel-card p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-stretch">
            <div className="flex-1 min-h-[168px] flex flex-col justify-between">
              <h3 className="font-display text-xl font-bold mb-2">
                Área Construtor
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
                className="w-full md:w-40 h-24 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full md:w-40 h-24 rounded-lg border border-dashed border-border overflow-hidden"><ImageOrPlaceholder src={""} alt="Imagem" /></div>
            )}
          </div>
        </div>

        {/* Catálogo (destaques) */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Nosso <span className="text-gradient-gold">Catálogo</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Produtos fabricados sob medida com materiais de primeira qualidade.
            </p>
          </div>

          {destaques.length === 0 ? (
            <div
  style={{
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 18,
    display: "grid",
    gap: 10,
    textAlign: "center",
  }}
>
  <div style={{ fontWeight: 800, fontSize: 16 }}>
    Catálogo em atualização
  </div>

  <div style={{ opacity: 0.9, fontSize: 13, lineHeight: 1.5 }}>
    Ainda não há produtos cadastrados. Enquanto isso, veja promoções ou peça orçamento no WhatsApp.
  </div>

  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
    <Link
      href="/promocoes"
      style={{
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: 12,
        fontWeight: 800,
        fontSize: 13,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff",
      }}
    >
      Ver promoções
    </Link>

    <a
      href={`https://wa.me/${WA_NUMBER}` }
      style={{
        textDecoration: "none",
        padding: "10px 14px",
        borderRadius: 12,
        fontWeight: 800,
        fontSize: 13,
        background: "rgb(245, 158, 11)",
        color: "#111",
      }}
    >
      Falar no WhatsApp
    </a>
  </div>
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










