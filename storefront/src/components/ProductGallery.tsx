"use client";

import { useMemo, useState } from "react";

type Img = { url?: string | null };

export default function ProductGallery({
  title,
  thumbnail,
  images,
}: {
  title: string;
  thumbnail?: string | null;
  images?: Img[] | null;
}) {
  const list = useMemo(() => {
    const urls: string[] = [];
    if (thumbnail) urls.push(thumbnail);
    for (const im of images || []) {
      const u = String(im?.url || "");
      if (u && !urls.includes(u)) urls.push(u);
    }
    return urls;
  }, [thumbnail, images]);

  const [active, setActive] = useState<string>(list[0] || thumbnail || "");

  if (!list.length) {
    return (
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 18, opacity: 0.7, background: "#fff" }}>
        Sem imagens cadastradas.
      </div>
    );
  }

  return (
    <div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active}
          alt={title}
          style={{ width: "100%", display: "block", height: 420, objectFit: "cover" }}
        />
      </div>

      {list.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
          {list.map((u) => (
            <button
              key={u}
              onClick={() => setActive(u)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 0,
                background: "#fff",
                cursor: "pointer",
                outline: active === u ? "2px solid var(--theme-accent)" : "none",
                flex: "0 0 auto",
              }}
              title="Ver imagem"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={title} style={{ width: 92, height: 68, objectFit: "cover", display: "block", borderRadius: 10 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
