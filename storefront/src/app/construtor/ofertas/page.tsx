import Link from "next/link";
import { listProducts } from "../../../lib/medusa";

type AnyProduct = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  metadata?: Record<string, any> | null;
};

export const dynamic = "force-dynamic";

export default async function OfertasConstrutorPage(props: {
  searchParams?: Promise<{ liberado?: string }>;
}) {
  const searchParams = (await props.searchParams) || {};
  const liberado = String(searchParams.liberado || "") === "1";

  if (!liberado) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container max-w-5xl">
          <Link href="/construtor" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar
          </Link>

          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
            Ofertas para construtores
          </h1>

          <div className="mt-8 rounded-2xl border border-border bg-secondary p-6">
            <div className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-yellow-400">
              ACESSO EM ANÁLISE
            </div>

            <div className="mt-4 text-2xl font-bold">Seu acesso às ofertas ainda não foi liberado</div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Seu cadastro está em análise. Assim que for aprovado, esta área exibirá automaticamente
              as ofertas exclusivas para construtores e obras.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <Link
                href="/construtor/status"
                className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground"
              >
                Ver meu status
              </Link>
              <Link
                href="/construtor/login"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-extrabold"
              >
                Entrar novamente
              </Link>

              <span className="text-sm text-muted-foreground">
                Status atual: <strong className="text-foreground">pendente</strong>
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const products = (await listProducts()) as AnyProduct[];
  const ofertas = (products || []).filter((p) => p?.metadata?.oferta === "construtor");

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-5xl">
        <Link href="/construtor/status" className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar
        </Link>

        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
          Ofertas para construtores
        </h1>

        <p className="mt-3 text-muted-foreground">
          Aqui aparecem os produtos com condição especial para construtores e obras.
        </p>

        {ofertas.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-secondary p-6">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-primary">
              B2B • OFERTAS
            </div>

            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
              Ainda não há ofertas liberadas para construtores
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              No momento não encontramos produtos com condição especial marcados para esta área.
              Você pode voltar mais tarde ou falar com a Delima para solicitar atendimento comercial.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/construtor/status" className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground">
                Ver meu status
              </Link>
              <Link href="/contato" className="rounded-full border border-border bg-background px-6 py-3 text-sm font-extrabold">
                Falar com a equipe
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4">
            {ofertas.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-secondary p-5">
                <Link href={`/produto/${p.handle}`} className="text-lg font-bold hover:text-primary">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
