import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Ficou perfeito e rápido. Portão sob medida, atendimento excelente. Recomendo a todos!",
    author: "Carlos M.",
    role: "Cliente residencial",
    stars: 5,
    avatar: "", // Coloque a URL da foto em /public/depoimentos/carlos.jpg
  },
  {
    text: "Condição de construtor ajudou muito nas compras recorrentes. Parceria imbatível.",
    author: "Roberto S.",
    role: "Construtor parceiro",
    stars: 5,
    avatar: "",
  },
  {
    text: "Qualidade top. Material forte e acabamento bonito. Já fiz 3 projetos com eles.",
    author: "Ana L.",
    role: "Arquiteta",
    stars: 5,
    avatar: "",
  },
];

function getAvatarUrl(t: { author: string; avatar?: string }): string {
  if (t.avatar?.trim()) return t.avatar;
  const name = t.author.replace(/\s+/g, "+").trim();
  return `https://ui-avatars.com/api?name=${encodeURIComponent(name)}&size=96&background=e8a54a22&color=e8a54a&bold=true`;
}

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold tracking-tight">
            O que dizem nossos{" "}
            <span className="text-gradient-gold">clientes</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Mais de 500 projetos entregues com satisfação garantida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="steel-card p-6 relative">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getAvatarUrl(t)}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover border-2 border-primary/30"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="font-display font-bold">{t.author}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">&quot;{t.text}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
