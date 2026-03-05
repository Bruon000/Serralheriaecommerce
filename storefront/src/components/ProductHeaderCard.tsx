type Props = {
  title: string;
  quoteHref: string;
  buttonText?: string;
  showMeta?: boolean;
  ipo?: string;
  tipo?: string;
  className?: string;
  children?: React.ReactNode; // opcional: permite plugar PriceBlock dentro
};

export default function ProductHeaderCard({
  title,
  quoteHref,
  buttonText = "Orçar este modelo",
  showMeta = false,
  ipo = "-",
  tipo = "-",
  className = "",
  children,
}: Props) {
  return (
    <div className={`steel-card dev-product-header-card p-4 md:p-5 min-w-0 max-w-full ${className}`.trim()}>
      <div className="flex items-start justify-between gap-4 min-w-0">
        <h1 className="dev-product-title font-display text-2xl md:text-3xl font-extrabold leading-tight tracking-tight min-w-0 break-words">
          {title}
        </h1>

        <a
          href={quoteHref}
          className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground hover:brightness-110 hover:shadow-[0_10px_30px_rgba(245,158,11,0.18)]"
        >
          {buttonText}
        </a>
      </div>

      <div className="mt-4">
        {children}
      </div>

      {showMeta && (
        <div className="mt-3 text-sm text-muted-foreground">
          IPO: {ipo} &nbsp;|&nbsp; Tipo: {tipo}
        </div>
      )}
    </div>
  );
}


