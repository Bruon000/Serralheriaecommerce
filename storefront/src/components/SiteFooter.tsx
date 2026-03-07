import Link from "next/link";
import { Flame, Phone, MessageCircle, MapPin, Instagram } from "lucide-react";

const WHATSAPP = "5584987940211";
const PHONE = "(84) 98794-0211";
const INSTAGRAM_URL = "https://instagram.com/serralheriadelima";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      {/* Tarja / faixa principal */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold">
                <span className="text-gradient-gold">Serralheria</span> Delima
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Qualidade artesanal em portões, grades, corrimãos e estruturas metálicas sob medida.
            </p>
          </div>

          {/* Sobre nós */}
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">Sobre nós</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Há anos no mercado, a Serralheria Delima entrega projetos sob medida com materiais de primeira e acabamento impecável. Atendemos residências, obras e construtores em toda a região.
            </p>
          </div>

          {/* Selos de confiança */}
          <div className="rounded-2xl border border-border/60 bg-black/20 p-5">
            <div className="text-sm font-extrabold">Selos de confiança</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>✓ Orçamento em até 2 horas</li>
              <li>✓ Garantia de 90 dias</li>
              <li>✓ 3.000+ clientes atendidos</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  WhatsApp: {PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+5584987940211`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Natal/RN e região</span>
              </li>
            </ul>
          </div>

          {/* Redes e links */}
          <div>
            <h3 className="font-display font-bold text-foreground mb-4">Redes e links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4 shrink-0" />
                  Instagram
                </a>
              </li>
              <li>
                <Link href="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/#depoimentos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link href="/#contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-border py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Serralheria Delima. Todos os direitos reservados.</p>
          <p>Portões, grades e estruturas metálicas sob medida.</p>
        </div>
      </div>
    </footer>
  );
}
