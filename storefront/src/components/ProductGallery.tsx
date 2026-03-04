"use client";

import { useMemo, useState } from "react";

type Img = { url?: string | null };

type ProductGalleryProps = {
  title?: string;
  thumbnail?: string | null;
  images?: Img[] | null;
  /** When provided (e.g. from Builder state), overrides title/thumbnail/images if not set */
  product?: { title?: string; thumbnail?: string | null; images?: Img[] | null };
  imageHeight?: number;
  showThumbnails?: boolean;
  thumbsSize?: "sm" | "md" | "lg";
};

const thumbsSizeMap = { sm: "h-14 w-20", md: "h-[76px] w-[104px]", lg: "h-24 w-32" };

export default function ProductGallery({
  title: titleProp,
  thumbnail: thumbnailProp,
  images: imagesProp,
  product,
  imageHeight = 420,
  showThumbnails = true,
  thumbsSize = "md",
}: ProductGalleryProps) {
  const title = titleProp ?? product?.title ?? "";
  const thumbnail = thumbnailProp ?? product?.thumbnail ?? null;
  const images = imagesProp ?? product?.images ?? null;

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
    <div className="rounded-2xl border border-border/40 bg-black/25 p-6">
      <div className="text-sm font-extrabold text-foreground/90">Sem imagens cadastradas</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Em breve adicionaremos fotos reais do modelo. Enquanto isso, você pode pedir orçamento com medidas.
      </div>
    </div>
  );
}

  return (
    <div className="grid gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active}
          alt={title}
          className="block w-full object-cover"
          style={{ height: imageHeight }}
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-[rgba(245,158,11,0.10)]" />
      </div>

      {showThumbnails && list.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {list.map((u) => {
            const isOn = active === u;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setActive(u)}
                className={
                  "shrink-0 overflow-hidden rounded-xl border bg-black/25 transition-all " +
                  (isOn
                    ? "border-[rgba(245,158,11,0.55)] ring-2 ring-[rgba(245,158,11,0.18)]"
                    : "border-border/60 hover:border-[rgba(245,158,11,0.30)]")
                }
                title="Ver imagem"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u}
                  alt={title}
                  className={`object-cover ${thumbsSizeMap[thumbsSize]}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}



