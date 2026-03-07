type T = {
  name: string;
  place: string;
  role: "Cliente Final" | "Construtor" | "Empresa";
  text: string;
};

const items: T[] = [
  { name: "João Silva", place: "Natal/RN", role: "Cliente Final", text: "Precisava de um portão urgente para minha obra. Entregaram no prazo combinado e o acabamento ficou impecável. Recomendo!" },
  { name: "Maria Oliveira", place: "Parnamirim/RN", role: "Cliente Final", text: "Orçamento rápido, preço justo e atendimento atencioso. Minha grade de segurança ficou exatamente como eu queria." },
  { name: "Carlos Mendes", place: "Construtor", role: "Construtor", text: "Trabalho com várias serralherias, mas a Delima é a que mais cumpre prazo. Parceria de anos!" },
  { name: "Ana Paula", place: "Natal/RN", role: "Cliente Final", text: "Fiz três orçamentos e escolhi a Delima pelo custo-benefício. Produto de qualidade e entrega sem atrasos." },
  { name: "Roberto Souza", place: "Empresa", role: "Empresa", text: "Solicitamos estruturas metálicas para nossa loja. Profissionalismo do início ao fim. Voltaremos a contratar." },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => (p[0] ? p[0].toUpperCase() : "")).join("");
}

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: "#FFD700" }} className="text-sm">★</span>
      ))}
    </div>
  );
}

function Badge({ role }: { role: T["role"] }) {
  return (
    <span className="rounded-full border border-border/60 bg-black/20 px-3 py-1 text-[10px] font-extrabold tracking-widest text-muted-foreground">
      {role}
    </span>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="container section-pad">
      <div className="text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          O que dizem nossos clientes
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mais de 3.000 projetos entregues com qualidade, prazo e atendimento direto.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="steel-card p-6 hover-lift relative overflow-hidden">
            <div className="pointer-events-none absolute -top-6 -right-4 text-[110px] font-black text-white/5">“</div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Avatar: apenas iniciais dentro do círculo */}
                <div
                  className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-primary/15 border border-primary/20 grid place-items-center text-sm font-extrabold text-primary"
                  aria-hidden="true"
                >
                  <span className="select-none">{initials(t.name)}</span>
                </div>

                {/* Nome e local: só texto, sem iniciais */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold leading-tight text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.place}</div>
                </div>
              </div>

              <Badge role={t.role} />
            </div>

            <div className="mt-4"><Stars /></div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
