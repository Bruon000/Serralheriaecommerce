"use client";

export type DetailsCardProps = {
  title?: string;
  description?: string;
  /** string[] or Builder list format { value: string }[] */
  bullets?: (string | { value?: string })[];
  showMetaIpoTipo?: boolean;
  ipo?: string;
  tipo?: string;
};

export default function DetailsCard({
  title = "Detalhes do produto",
  description,
  bullets = [],
  showMetaIpoTipo = true,
  ipo = "-",
  tipo = "-",
}: DetailsCardProps) {
  const defaultBullets = [
    "Fabricação sob medida",
    "Acabamento e pintura conforme escolha",
    "Entrega e instalação sob consulta",
    "Ajustes por observações",
  ];
  const list =
    bullets.length > 0
      ? bullets.map((b) => (typeof b === "string" ? b : b?.value ?? ""))
      : defaultBullets;

  return (
    <div className="steel-card p-6 min-w-0 max-w-full">
      <div className="text-sm font-extrabold text-foreground/90">{title}</div>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
      <ul className="mt-4 grid gap-2 text-sm text-foreground/90">
        {list.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border/60 bg-black/25 text-[11px]">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
      {showMetaIpoTipo && (
        <div className="mt-4 text-xs text-muted-foreground">
          IPO: <b className="text-foreground/90">{String(ipo)}</b>
          <span>&nbsp; · &nbsp;</span>
          Tipo: <b className="text-foreground/90">{String(tipo)}</b>
        </div>
      )}
    </div>
  );
}
