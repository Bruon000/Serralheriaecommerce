import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

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
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold hover:bg-secondary/80"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span>Pedir orçamento agora</span>
              <ArrowRight className="h-4 w-4" />
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










