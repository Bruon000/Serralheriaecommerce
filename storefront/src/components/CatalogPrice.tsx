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
    <div style={{ marginTop: 6, fontWeight: 900, fontSize: 16 }}>
      {p.text}
      {p.isB2BPrice && (
        <span style={{ fontSize: 11, marginLeft: 8, padding: "2px 8px", border: "1px solid #ddd", borderRadius: 999 }}>
          B2B
        </span>
      )}
    </div>
  );
}
