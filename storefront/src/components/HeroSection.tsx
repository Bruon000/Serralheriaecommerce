import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-forge.webp"
          alt="Oficina de serralheria com faíscas"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="container relative z-10 py-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-light animate-glow-pulse">
            <Flame className="h-4 w-4" />
            Sob medida para seu projeto
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Seu projeto em{" "}
            <span className="text-gradient-gold">metal</span>
            ,<br />do jeito certo.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
            Portões de qualidade, entregues no prazo e com garantia. Trabalhamos com confiança e compromisso do orçamento até a instalação. Escolha o modelo, configure as medidas e feche pelo WhatsApp. <span className="text-foreground/90">Em breve: móveis industriais.</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:brightness-110 hover:scale-105 glow-gold"
            >
              Ver catálogo
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/5584987940211"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground transition-all hover:border-gold/40 hover:bg-secondary/80"
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className="mt-14 flex gap-10">
            {[
              { value: "500+", label: "Projetos entregues" },
              { value: "Prazo", label: "Entrega garantida" },
              { value: "100%", label: "Sob medida" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-gradient-gold">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
