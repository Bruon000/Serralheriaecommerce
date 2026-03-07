import Link from "next/link";
import { listCategories } from "@/lib/medusa";
import { toSlug } from "@/lib/productClassifier";

function Card({
  slug,
  title,
  subtitle,
  emoji,
  comingSoon,
  href,
}: {
  slug: string;
  title: string;
  subtitle?: string;
  emoji?: string;
  comingSoon?: boolean;
  href?: string;
}) {
  const content = (
    <div className="steel-card p-6 hover:brightness-110 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-extrabold tracking-widest text-primary/90">
            {emoji ? `${emoji} ` : ""}CATEGORIA
          </div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">
            {title}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {subtitle}
          </div>
        </div>

        {comingSoon ? (
          <div className="shrink-0 rounded-full border border-border/60 bg-black/20 px-4 py-2 text-[11px] font-extrabold tracking-widest text-muted-foreground">
            EM BREVE
          </div>
        ) : (
          <div className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-extrabold tracking-widest text-primary">
            VER
          </div>
        )}
      </div>

      <div className="mt-5 text-sm font-extrabold">
        {comingSoon ? "Disponível em breve" : "Ver no catálogo →"}
      </div>
    </div>
  );

  if (!href || comingSoon) return <div className="opacity-90">{content}</div>;

  return (
    <Link href={href} aria-label={`Ver ${title} no catálogo`}>
      {content}
    </Link>
  );
}

export default async function CategoryStrip() {
  const medusaCategories = await listCategories();

  const categories =
    medusaCategories.length > 0
      ? medusaCategories.map((c) => ({
          slug: c.handle ? toSlug(c.handle) : toSlug(c.name),
          title: c.name,
          subtitle: "",
          comingSoon: false,
        }))
      : [
          { slug: "portao", title: "Portões", subtitle: "Basculante, correr, social…", comingSoon: false },
          { slug: "grade", title: "Grades", subtitle: "Janelas, portas e proteção", comingSoon: false },
          { slug: "estrutura", title: "Estrutura metálica", subtitle: "Coberturas e estruturas", comingSoon: false },
        ];

  return (
    <section className="container section-pad">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Categorias
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Escolha uma categoria para abrir o catálogo filtrado.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="rounded-full border border-border bg-black/20 px-6 py-3 text-sm font-extrabold hover:bg-black/30"
        >
          Ver tudo
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Card
            key={c.slug}
            slug={c.slug}
            title={c.title}
            subtitle={c.subtitle}
            emoji={undefined}
            comingSoon={c.comingSoon}
            href={c.comingSoon ? undefined : `/catalogo?category=${encodeURIComponent(c.slug)}`}
          />
        ))}
      </div>
    </section>
  );
}
