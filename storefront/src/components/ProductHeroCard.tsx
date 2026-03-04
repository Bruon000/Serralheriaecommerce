"use client";

import PriceBlock from "@/components/PriceBlock";

type Props = {
  product: any;

  title?: string;
  showTitle?: boolean;

  showQuoteButton?: boolean;
  quoteButtonText?: string;
  quoteHref?: string;

  showPrice?: boolean;

  hint?: string;
  className?: string;
};

export default function ProductHeroCard({
  product,
  title,
  showTitle = true,
  showQuoteButton = true,
  quoteButtonText = "Orçar este modelo",
  quoteHref,
  showPrice = true,
  hint,
  className = "",
}: Props) {
  const handle = String(product?.handle ?? "");
  const finalQuoteHref =
    quoteHref ||
    `/orcamento?produto=${encodeURIComponent(handle)}&nome=${encodeURIComponent(String(product?.title ?? ""))}`;

  return (
    <div className={("steel-card p-6 min-w-0 max-w-full " + className).trim()}>
      <div className="flex items-start justify-between gap-4 min-w-0">
        {showTitle && (
          <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight min-w-0 break-words">
            {title || String(product?.title ?? "")}
          </h1>
        )}

        {showQuoteButton && (
          <a
            href={finalQuoteHref}
            className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground hover:brightness-110 hover:shadow-[0_10px_30px_rgba(245,158,11,0.18)]"
          >
            {quoteButtonText}
          </a>
        )}
      </div>

      {showPrice && (
        <div className="mt-4">
          <PriceBlock product={product} />
        </div>
      )}

      {hint && (
        <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
          {hint}
        </div>
      )}
    </div>
  );
}
