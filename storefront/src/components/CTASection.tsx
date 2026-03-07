import { MessageCircle, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function CTASection() {
  return (
    <section id="contato" className="py-24">
      <div className="container">
        <div className="steel-card glow-gold-strong p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-glow pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-extrabold text-black hover:brightness-110">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>Pronto para iniciar seu projeto?</span>
            </div>

            <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
              Fale conosco pelo WhatsApp e receba um orçamento personalizado em minutos.
            </p>

            <a
              href="https://wa.me/5584987940211"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-6 py-3 text-sm font-extrabold text-black hover:brightness-110"
            >
              <WhatsAppIcon size={18} symbolColor="white" />
              <span>📱 Orçamento Grátis no WhatsApp</span>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </a>

            <p className="mt-6 text-sm text-muted-foreground">(84) 98794-0211</p>
          </div>
        </div>
      </div>
    </section>
  );
}









