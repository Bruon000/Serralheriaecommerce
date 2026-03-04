"use client";

import { useEffect, useState } from "react";
import type { MedusaProduct } from "../lib/medusa";
import { getDisplayPriceBRL, isB2BApproved } from "../lib/pricing";

type PriceBlockProps = {
  product: MedusaProduct;
  showBadge?: boolean;
  sobConsultaText?: string;
};

export default function PriceBlock({
  product,
  showBadge = true,
  sobConsultaText,
}: PriceBlockProps) {
  const [isB2B, setIsB2B] = useState(false);

  useEffect(() => {
    setIsB2B(isB2BApproved());
  }, []);

  const p = getDisplayPriceBRL(product, isB2B);
  const showSobConsulta = Boolean(sobConsultaText?.trim());

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="text-2xl font-extrabold tracking-tight text-foreground">
        {showSobConsulta ? sobConsultaText : p.text}
      </div>

      {showBadge && p.isB2BPrice && !showSobConsulta && (
        <span className="inline-flex items-center rounded-full border border-border/60 bg-black/25 px-2.5 py-1 text-[11px] font-extrabold tracking-widest text-foreground/90">
          B2B
        </span>
      )}
    </div>
  );
}
