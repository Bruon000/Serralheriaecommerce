import React from "react";
import type {
  CmsBlock,
  CmsPageContent,
  LayoutProps,
  SectionBlock,
  CTABlock,
  DetailsCardBlock,
  SpacerBlock,
  GridBlock,
  ColumnsBlock,
  ProductGalleryBlock,
  BuyBoxCardBlock,
  ProductHeroCardBlock,
  HeroBlock,
} from "@/lib/cms/types";
import { richTextToHtml } from "@/lib/cms/richtext";
import BuilderSection from "@/components/BuilderSection";
import BuilderCTA from "@/components/BuilderCTA";
import DetailsCard from "@/components/DetailsCard";
import BuyBoxCard from "@/components/BuyBoxCard";
import ProductHeroCard from "@/components/ProductHeroCard";
import ProductGallery from "@/components/ProductGallery";
import CmsHeroSection from "@/components/CmsHeroSection";

function layoutClasses(layout?: LayoutProps | null): string {
  if (!layout) return "";
  const c: string[] = [];
  if (layout.padding) c.push(layout.padding);
  if (layout.margin) c.push(layout.margin);
  if (layout.maxWidth) c.push(layout.maxWidth);
  if (layout.background) c.push(layout.background);
  if (layout.border) c.push(layout.border);
  if (layout.borderRadius) c.push(layout.borderRadius);
  if (layout.gap) c.push(layout.gap);
  if (layout.alignment) {
    if (layout.alignment === "center") c.push("text-center mx-auto");
    if (layout.alignment === "right") c.push("text-right ml-auto");
  }
  return c.join(" ");
}

function EditorSelectable({
  id,
  selectedId,
  interactive,
  onSelect,
  children,
}: {
  id: string;
  selectedId?: string | null;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
}) {
  if (!interactive) return <>{children}</>;

  const selected = selectedId === id;

  return (
    <div
      data-cms-block-id={id}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(id);
      }}
      className={[
        "relative min-w-0 max-w-full",
        "cursor-pointer",
        "transition",
        selected ? "ring-2 ring-[rgba(245,158,11,0.55)]" : "ring-1 ring-transparent hover:ring-[rgba(255,255,255,0.12)]",
        "rounded-2xl",
      ].join(" ")}
    >
      {/* etiqueta pequena */}
      <div className="pointer-events-none absolute -top-2 left-3 z-10">
        <span className="rounded-full border border-border/50 bg-black/70 px-2 py-0.5 text-[10px] font-extrabold text-foreground/80">
          {id.slice(0, 10)}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden">{children}</div>
    </div>
  );
}

function BlockWrapper({
  id,
  layout,
  children,
  as = "div",
  interactive,
  selectedId,
  onSelect,
}: {
  id: string;
  layout?: LayoutProps | null;
  children: React.ReactNode;
  as?: "div" | "section";
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const cls = layoutClasses(layout);
  const inner =
    as === "section" ? (
      <section className={cls || undefined}>{children}</section>
    ) : (
      <div className={cls || undefined}>{children}</div>
    );

  return (
    <EditorSelectable id={id} interactive={interactive} selectedId={selectedId} onSelect={onSelect}>
      {inner}
    </EditorSelectable>
  );
}

function renderBlock(
  block: CmsBlock,
  ctx: { interactive?: boolean; selectedId?: string | null; onSelect?: (id: string) => void }
): React.ReactNode {
  switch (block.type) {
    case "section": {
      const b = block as SectionBlock;
      const html = b.richText ? richTextToHtml(b.richText) : "";
      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} as="section" {...ctx}>
          <BuilderSection title={b.title} subtitle={b.subtitle}>
            {html ? (
              <div
                className="mt-4 text-foreground/90 prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}
          </BuilderSection>
        </BlockWrapper>
      );
    }
    case "cta": {
      const b = block as CTABlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <BuilderCTA text={b.text} buttonText={b.buttonText ?? "Saiba mais"} link={b.href ?? "#"} />
        </BlockWrapper>
      );
    }
    case "detailsCard": {
      const b = block as DetailsCardBlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <DetailsCard
            title={b.title}
            description={b.description}
            bullets={b.bullets ?? []}
            showMetaIpoTipo={b.showMeta ?? false}
            ipo="-"
            tipo="-"
          />
        </BlockWrapper>
      );
    }
    case "spacer": {
      const b = block as SpacerBlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={null} {...ctx}>
          <div className={b.height ?? "h-8"} aria-hidden />
        </BlockWrapper>
      );
    }
    case "grid": {
      const b = block as GridBlock;
      const cols = b.columns ?? 2;
      const gap = b.gap ?? "gap-6";
      const gridClass =
        cols === 1
          ? "grid grid-cols-1"
          : cols === 2
          ? "grid grid-cols-1 md:grid-cols-2"
          : cols === 3
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <div className={`${gridClass} ${gap}`}>
            {(b.children ?? []).map((child) => renderBlock(child, ctx))}
          </div>
        </BlockWrapper>
      );
    }
    case "columns": {
      const b = block as ColumnsBlock;
      const count = b.columnCount ?? 2;
      const gap = b.gap ?? "gap-6";
      const contents = b.columnContents ?? [];
      const gridClass =
        count === 2
          ? "grid grid-cols-1 md:grid-cols-2"
          : count === 3
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <div className={`${gridClass} ${gap}`}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="min-w-0 space-y-6">
                {(contents[i] ?? []).map((child) => renderBlock(child, ctx))}
              </div>
            ))}
          </div>
        </BlockWrapper>
      );
    }
    case "productGallery": {
      const b = block as ProductGalleryBlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <ProductGallery imageHeight={b.imageHeight ?? 420} showThumbnails={b.showThumbs ?? true} />
        </BlockWrapper>
      );
    }
    case "buyBoxCard": {
      const b = block as BuyBoxCardBlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <BuyBoxCard title={b.title} hint={b.hint}>
            <p className="text-sm text-muted-foreground">
              Use este bloco em páginas de produto para envolver o formulário de compra.
            </p>
          </BuyBoxCard>
        </BlockWrapper>
      );
    }
    case "productHeroCard": {
      const b = block as ProductHeroCardBlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={b.layout} {...ctx}>
          <ProductHeroCard
            product={{}}
            title={b.title}
            showTitle={b.showTitle ?? true}
            showQuoteButton={b.showQuoteButton ?? true}
            quoteButtonText={b.quoteButtonText}
            quoteHref={b.quoteHref}
            showPrice={b.showPrice ?? false}
            hint={b.hint}
          />
        </BlockWrapper>
      );
    }
    case "hero": {
      const b = block as HeroBlock;
      return (
        <BlockWrapper key={block.id} id={block.id} layout={null} {...ctx}>
          <CmsHeroSection
            logoSrc={b.logoSrc}
            logoAlt={b.logoAlt}
            logoHeight={b.logoHeight}
            logoMaxWidth={b.logoMaxWidth}
            logoTranslateX={b.logoTranslateX}
            logoTranslateY={b.logoTranslateY}
            logoRotate={b.logoRotate}
            topPadding={b.topPadding}
            spacerHeight={b.spacerHeight}
            showBadges={b.showBadges}
            showStats={b.showStats}
            primaryCtaHref={b.primaryCtaHref}
            primaryCtaText={b.primaryCtaText}
            secondaryCtaWhatsapp={b.secondaryCtaWhatsapp}
          />
        </BlockWrapper>
      );
    }
    default:
      return null;
  }
}

type Props = {
  content: CmsPageContent | null;
  interactive?: boolean;
  selectedId?: string | null;
  onSelectBlock?: (id: string) => void;
};

export default function CmsRenderer({ content, interactive, selectedId, onSelectBlock }: Props) {
  if (!content?.blocks?.length) return null;

  const ctx = { interactive, selectedId, onSelect: onSelectBlock };

  return <div className="space-y-6">{content.blocks.map((b) => renderBlock(b, ctx))}</div>;
}
