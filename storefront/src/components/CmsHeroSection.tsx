import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

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
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold hover:bg-secondary/80"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>Falar no WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
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

