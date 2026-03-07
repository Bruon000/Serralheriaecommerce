import Link from "next/link";

export default function AreaConstrutorPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container max-w-5xl">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar
        </Link>

        <div className="mt-6 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-primary">
            ÁREA CONSTRUTOR • DELIMA
          </div>

          <h1 className="mt-4 font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Condições especiais para construtores e obras
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Cadastre sua empresa para solicitar condições especiais, consultar seu status
            e acessar ofertas B2B da Serralheria Delima.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="steel-card p-6">
            <div className="text-sm font-extrabold tracking-widest text-primary/90">
              01 • CADASTRO
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
              Quero me cadastrar
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Preencha seus dados, informe CNPJ se quiser, e envie seu interesse para
              receber condições especiais para obras e construtores.
            </p>
            <Link
              href="/construtor/cadastro"
              className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground hover:brightness-110"
            >
              Fazer cadastro
            </Link>
          </div>

          <div className="steel-card p-6">
            <div className="text-sm font-extrabold tracking-widest text-primary/90">
              02 • LOGIN
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
              Já tenho acesso
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Entre com e-mail e senha para consultar seu status e continuar seu
              atendimento como construtor.
            </p>
            <Link
              href="/construtor/login"
              className="mt-5 inline-flex rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold hover:bg-secondary/80"
            >
              Entrar
            </Link>
          </div>

          <div className="steel-card p-6">
            <div className="text-sm font-extrabold tracking-widest text-primary/90">
              03 • STATUS
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight">
              Consultar meu status
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Veja se seu cadastro já foi aprovado e acesse as ofertas disponíveis para
              construtores e profissionais.
            </p>
            <Link
              href="/construtor/status"
              className="mt-5 inline-flex rounded-full border border-border bg-secondary px-6 py-3 text-sm font-extrabold hover:bg-secondary/80"
            >
              Ver status
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
