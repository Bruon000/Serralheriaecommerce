import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: "url(/hero-forge.webp)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      {/* overlay (vinheta) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/70" />

      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(900px 420px at 30% 20%, rgba(245,158,11,0.16), transparent 60%)" }} />
<div className="container relative pt-[300px] pb-12">
        <div className="max-w-2xl">
                    <div className="h-[96px]" aria-hidden="true" />
{/* Logo acima do texto (grande e inclinada) */}
          <div className="mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hero-logo.png"
              alt="Serralheria Delima"
              className="select-none"
              style={{
                // ===== AJUSTES FÁCEIS =====
                height: 420,          // <-- TAMANHO (px). Ex: 260 menor / 380 maior
                width: "auto",
                maxWidth: "min(98vw, 1200px)",
                objectFit: "contain",

                // mover (px): negativo sobe/esquerda | positivo desce/direita
                transform: "translateX(-220px) translateY(-10px) rotate(-12deg)",

                // sombra premium
                filter: "drop-shadow(0 18px 38px rgba(245,158,11,0.26))",
              }}
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-black/35 px-3 py-1.5 text-xs font-semibold text-foreground/90">
            <span aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="rgba(245,158,11,0.95)" strokeWidth="2"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.4-2.3.9a7 7 0 0 0-1.7-1L14.6 3h-5.2L9.1 6.3a7 7 0 0 0-1.7 1L5.1 6.4l-2 3.4 2 1.2a7 7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.9a7 7 0 0 0 1.7 1L9.4 21h5.2l.3-3.3a7 7 0 0 0 1.7-1l2.3.9 2-3.4-2-1.2c.07-.33.1-.66.1-1z" stroke="rgba(245,158,11,0.45)" strokeWidth="1.6" strokeLinejoin="round"/></svg></span>
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
<h1 className="mt-6 font-display text-5xl md:text-6xl font-extrabold leading-[1.05]">
            Portões, grades e estruturas metálicas sob medida com orçamento rápido no WhatsApp.
          </h1>

          <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
            <span className="text-foreground font-extrabold">Preço justo, produção sob medida e atendimento rápido.</span>{" "}
            Receba sua estimativa, veja modelos e fale direto com a Serralheria Delima pelo WhatsApp.
            Atendemos portões, grades, corrimãos e estruturas metálicas com acabamento profissional.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110"
            >
              Ver modelos
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5585999999999"}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold text-secondary-foreground hover:bg-secondary/80"
            >
              <WhatsAppIcon size={18} />
              <span>📱 Pedir orçamento no WhatsApp</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-10 text-sm">
            <div>
              <div className="text-primary font-extrabold text-lg">3.000+</div>
              <div className="text-muted-foreground text-xs">Projetos entregues</div>
            </div>
            <div>
              <div className="text-primary font-extrabold text-lg">100%</div>
              <div className="text-muted-foreground text-xs">Sob medida</div>
            </div>
            <div>
              <div className="text-primary font-extrabold text-lg">WhatsApp</div>
              <div className="text-muted-foreground text-xs">Resposta rápida para orçamento</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}









