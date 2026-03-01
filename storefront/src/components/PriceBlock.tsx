"use client";

import { useEffect, useState } from "react";
import type { MedusaProduct } from "../lib/medusa";
import { getDisplayPriceBRL, isB2BApproved } from "../lib/pricing";

export default function PriceBlock({ product }: { product: MedusaProduct }) {
  const [isB2B, setIsB2B] = useState(false);

  useEffect(() => {
    setIsB2B(isB2BApproved());
  }, []);

  const p = getDisplayPriceBRL(product, isB2B);

  return (
    <div style={{ marginTop: 10, fontSize: 22, fontWeight: 800 }}>
      {p.text}
      {p.isB2BPrice && (
        <span
          style={{
            fontSize: 12,
            marginLeft: 10,
            padding: "2px 8px",
            border: "1px solid #ddd",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          B2B
        </span>
      )}
    </div>
  );
}
