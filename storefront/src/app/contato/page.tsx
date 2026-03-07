export default function ContatoPage() {
    const wa = "https://wa.me/5584987940211";
  const phone = "(84) 98794-0211";
  const address = "Rua Rosa Fernandes da Silva, 778 — Parnamirim/RN";
  const area = "Natal e Região Metropolitana";
  const lead = "7 a 15 dias úteis";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 overflow-x-hidden">
      <main className="container">
        <div className="steel-card overflow-hidden p-8 md:p-12 relative">
          <div className="absolute inset-0 bg-gold-glow pointer-events-none opacity-70" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-extrabold text-primary">
              Atendimento rápido no WhatsApp
            </div>

            <h1 className="mt-5 font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Vamos tirar seu projeto do papel?
            </h1>

            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              Peça um orçamento sem compromisso. Você manda medidas e referências, e a gente responde com prazo e valores
              de forma clara.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center rounded-full bg-primary px-8 py-4 text-base font-extrabold text-primary-foreground hover:brightness-110 hover:shadow-[0_12px_34px_rgba(245,158,11,0.18)]"
              >
                Chamar no WhatsApp
              </a>

              <a
                href="/"
                className="inline-flex justify-center items-center rounded-full border border-border bg-secondary px-8 py-4 text-base font-extrabold text-secondary-foreground hover:bg-secondary/80"
              >
                Voltar para o início
              </a>
            </div>

                        <div className="mt-5 text-sm text-muted-foreground space-y-1">
              <div>
                WhatsApp: <span className="font-bold text-foreground/90">{phone}</span> • Seg–Sex: 08:00–12:00 e 13:30–17:30 • Sáb: 08:00–12:00
              </div>
              <div>
                Atendemos: <span className="font-bold text-foreground/90">{area}</span> • Prazo: <span className="font-bold text-foreground/90">{lead}</span>
              </div>
              <div>
                Endereço: <span className="font-bold text-foreground/90">{address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">⚡ Resposta rápida</div>
            <p className="text-sm text-muted-foreground">
              Normalmente respondemos em poucos minutos e já alinhamos as medidas e o prazo.
            </p>
          </div>

          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">🚚 Atendemos a região</div>
            <p className="text-sm text-muted-foreground">Natal e Região Metropolitana.</p>
          </div>

          <div className="steel-card p-6">
            <div className="text-lg font-extrabold mb-2">⏱️ Produção Rápida</div>
            <p className="text-sm text-muted-foreground">Seu pedido pronto em até 15 dias úteis. Cumprimos o prazo combinado!</p>
          </div>
        </div>

        <div className="mt-8 steel-card p-6 md:p-8">
          <div className="font-extrabold text-lg mb-2">Para agilizar, mande no WhatsApp:</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Tipo do produto (portão, grade, corrimão, cobertura…)</li>
            <li>Largura e altura (se já tiver)</li>
            <li>Melhor horário para atendimento</li>
            <li>Foto ou referência do modelo (se tiver)</li>
            <li>Seu bairro/cidade para calcular</li> 
            <li>Observações (motor, portinhola, reforço, etc.)</li>
          </ul>

          <div className="mt-6">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center rounded-full bg-primary px-8 py-4 text-base font-extrabold text-primary-foreground hover:brightness-110"
            >
              Chamar agora no WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}



