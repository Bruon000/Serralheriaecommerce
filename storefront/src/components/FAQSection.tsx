const faqs = [
  {
    q: "Como eu finalizo o pedido?",
    a: "Você adiciona itens ao carrinho e clica em \"Finalizar no WhatsApp\". A mensagem já vai formatada com itens, medidas e total.",
  },
  {
    q: "Vocês entregam?",
    a: "Sim! Fazemos a entrega conforme disponibilidade da equipe. O prazo varia conforme o projeto — geralmente de 7 a 15 dias úteis. A colocação no local é por conta do cliente.",
  },
  {
    q: "Posso personalizar medidas e cores?",
    a: "Todos os nossos produtos são fabricados sob medida. Você pode escolher dimensões, acabamento e cor durante o orçamento.",
  },
  {
    q: "Qual a garantia dos produtos?",
    a: "Oferecemos garantia de 90 dias contra defeitos de fabricação. Nossos materiais passam por controle de qualidade rigoroso.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24">
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold tracking-tight">
            Perguntas{" "}
            <span className="text-gradient-gold">frequentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="steel-card overflow-hidden">
              <div className="p-5">
                <h3 className="font-display font-bold pr-4 mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




