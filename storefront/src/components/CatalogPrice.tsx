"use client";

import { useEffect, useState } from "react";
import type { MedusaProduct } from "../lib/medusa";
import { getDisplayPriceBRL, isB2BApproved } from "../lib/pricing";

export default function CatalogPrice({ product }: { product: MedusaProduct }) {
  const [isB2B, setIsB2B] = useState(false);

  useEffect(() => {
    setIsB2B(isB2BApproved());
  }, []);

  const p = getDisplayPriceBRL(product, isB2B);

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="text-base font-extrabold text-foreground">
        {p.text}
      </div>

      {p.isB2BPrice && (
        <span className="inline-flex items-center rounded-full border border-border/60 bg-black/25 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-foreground/90">
          B2B
        </span>
      )}
    </div>
  );
}
