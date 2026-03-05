import { MessageCircle, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contato" className="py-24">
      <div className="container">
        <div className="steel-card glow-gold-strong p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-glow pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary mb-6">
              <MessageCircle className="h-4 w-4" />
              Pronto para iniciar seu projeto?
            </div>

            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
              Fale conosco pelo WhatsApp e receba um orçamento personalizado em minutos.
            </p>

            <a
              href="https://wa.me/5584987940211"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground transition-all hover:brightness-110 hover:scale-105 glow-gold"
            >
              Chamar no WhatsApp Agora
              <ArrowRight className="h-5 w-5" />
            </a>

            <p className="mt-6 text-sm text-muted-foreground">(84) 98794-0211</p>
          </div>
        </div>
      </div>
    </section>
  );
}



