import Link from "next/link";

export type CmsHeroSectionProps = {
  logoSrc?: string;
  logoAlt?: string;
  logoHeight?: number;
  logoMaxWidth?: number;
  logoTranslateX?: number;
  logoTranslateY?: number;
  logoRotate?: number;
  topPadding?: number;
  spacerHeight?: number;
  showBadges?: boolean;
  showStats?: boolean;
  primaryCtaHref?: string;
  primaryCtaText?: string;
  secondaryCtaWhatsapp?: boolean;
};

const DEFAULT_LOGO = "/brand/hero-logo.png";
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5585999999999";

export default function CmsHeroSection({
  logoSrc = DEFAULT_LOGO,
  logoAlt = "Serralheria Delima",
  logoHeight = 320,
  logoMaxWidth = 1200,
  logoTranslateX = 0,
  logoTranslateY = -10,
  logoRotate = -12,
  topPadding = 220,
  spacerHeight = 40,
  showBadges = true,
  showStats = true,
  primaryCtaHref = "/catalogo",
  primaryCtaText = "Ver catálogo",
  secondaryCtaWhatsapp = true,
}: CmsHeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url(/hero-forge.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/70" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 420px at 30% 20%, rgba(245,158,11,0.16), transparent 60%)",
        }}
      />
      <div
        className="container relative pb-12"
        style={{ paddingTop: topPadding }}
      >
        <div className="max-w-2xl">
          <div style={{ height: spacerHeight }} aria-hidden="true" />
          <div className="mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc || DEFAULT_LOGO}
              alt={logoAlt || ""}
              className="select-none"
              style={{
                height: logoHeight,
                width: "auto",
                maxWidth: `min(98vw, ${logoMaxWidth}px)`,
                objectFit: "contain",
                transform: `translateX(${logoTranslateX}px) translateY(${logoTranslateY}px) rotate(${logoRotate}deg)`,
                filter: "drop-shadow(0 18px 38px rgba(245,158,11,0.26))",
              }}
            />
          </div>

          {showBadges && (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-black/35 px-3 py-1.5 text-xs font-semibold text-foreground/90">
                <span aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                      stroke="rgba(245,158,11,0.95)"
                      strokeWidth="2"
                    />
                    <path
                      d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.4-2.3.9a7 7 0 0 0-1.7-1L14.6 3h-5.2L9.1 6.3a7 7 0 0 0-1.7 1L5.1 6.4l-2 3.4 2 1.2a7 7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.9a7 7 0 0 0 1.7 1L9.4 21h5.2l.3-3.3a7 7 0 0 0 1.7-1l2.3.9 2-3.4-2-1.2c.07-.33.1-.66.1-1z"
                      stroke="rgba(245,158,11,0.45)"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>Portões, grades e estruturas sob medida</span>
              </div>
              <div className="mt-4 w-full sm:w-fit">
                <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(245,158,11,0.28)] bg-black/40 px-4 py-2 text-sm backdrop-blur">
                  <span className="inline-flex items-center rounded-full bg-[rgba(245,158,11,0.14)] border border-[rgba(245,158,11,0.35)] px-3 py-1 text-[11px] font-extrabold tracking-widest text-[rgba(245,158,11,0.92)]">
                    EXTRA • NOVIDADES
                  </span>
                  <span className="text-foreground/80 font-semibold">
                    Em breve mais novidades e ofertas especiais.
                  </span>
                </div>
              </div>
            </>
          )}

          <h1 className="mt-6 font-display text-5xl md:text-6xl font-extrabold leading-[1.05]">
            Seu projeto em <span className="text-gradient-gold">metal</span>,<br />
            do jeito certo.
          </h1>

          <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
            <span className="text-foreground font-extrabold">
              Preço justo e resposta rápida.
            </span>{" "}
            Faça seu orçamento em minutos no WhatsApp. Produção sob medida com
            materiais de primeira e entrega no prazo. Transparência do início ao
            fim, sem surpresa no valor.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={primaryCtaHref || "/catalogo"}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110"
            >
              {primaryCtaText || "Ver catálogo"}
            </Link>
            {secondaryCtaWhatsapp && (
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold text-secondary-foreground hover:bg-secondary/80"
              >
                Falar no WhatsApp
              </a>
            )}
          </div>

          {showStats && (
            <div className="mt-10 flex flex-wrap gap-10 text-sm">
              <div>
                <div className="text-primary font-extrabold text-lg">10.000+</div>
                <div className="text-muted-foreground text-xs">
                  Projetos entregues
                </div>
              </div>
              <div>
                <div className="text-primary font-extrabold text-lg">Prazo</div>
                <div className="text-muted-foreground text-xs">
                  Entrega garantida
                </div>
              </div>
              <div>
                <div className="text-primary font-extrabold text-lg">100%</div>
                <div className="text-muted-foreground text-xs">Sob medida</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
