/**
 * Tipos do CMS interno (page builder).
 * Blocos são persistidos em CmsPage.contentJson como JSON.
 */

export interface LayoutProps {
  padding?: string;   // ex: "p-6", "p-4 md:p-8"
  margin?: string;   // ex: "mt-4"
  maxWidth?: string; // ex: "max-w-4xl"
  background?: string;
  border?: string;
  borderRadius?: string;
  columns?: 1 | 2 | 3 | 4; // para grid
  alignment?: "left" | "center" | "right";
  gap?: string;      // ex: "gap-4", "gap-6"
}

/** Conteúdo TipTap (JSON do editor) */
export type RichTextContent = Record<string, unknown> | null;

export interface SectionBlock {
  type: "section";
  id: string;
  title?: string;
  subtitle?: string;
  richText?: RichTextContent; // JSON do TipTap
  layout?: LayoutProps;
}

export interface CTABlock {
  type: "cta";
  id: string;
  text?: string;
  buttonText?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  layout?: LayoutProps;
}

export interface DetailsCardBlock {
  type: "detailsCard";
  id: string;
  title?: string;
  description?: string;
  bullets?: string[];
  showMeta?: boolean;
  layout?: LayoutProps;
}

export interface SpacerBlock {
  type: "spacer";
  id: string;
  height?: string; // ex: "h-8", "h-16"
}

export interface GridBlock {
  type: "grid";
  id: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: string;
  layout?: LayoutProps;
  children: CmsBlock[];
}

export interface ColumnsBlock {
  type: "columns";
  id: string;
  columnCount?: 2 | 3 | 4;
  gap?: string;
  layout?: LayoutProps;
  columnContents: CmsBlock[][]; // cada item = blocos daquela coluna
}

export interface ProductGalleryBlock {
  type: "productGallery";
  id: string;
  imageHeight?: number;
  showThumbs?: boolean;
  layout?: LayoutProps;
}

export interface BuyBoxCardBlock {
  type: "buyBoxCard";
  id: string;
  title?: string;
  hint?: string;
  layout?: LayoutProps;
}

export interface ProductHeroCardBlock {
  type: "productHeroCard";
  id: string;
  title?: string;
  showTitle?: boolean;
  showQuoteButton?: boolean;
  quoteButtonText?: string;
  quoteHref?: string;
  showPrice?: boolean;
  hint?: string;
  layout?: LayoutProps;
}

export interface HeroBlock {
  type: "hero";
  id: string;
  logoSrc?: string;
  logoAlt?: string;
  logoHeight?: number;
  logoMaxWidth?: number;
  logoTranslateX?: number;
  logoTranslateY?: number;
  logoRotate?: number;
  topPadding?: number;
  spacerHeight?: number;
  showBadges?: boolean;
  showStats?: boolean;
  primaryCtaHref?: string;
  primaryCtaText?: string;
  secondaryCtaWhatsapp?: boolean;
}

export type CmsBlock =
  | SectionBlock
  | CTABlock
  | DetailsCardBlock
  | SpacerBlock
  | GridBlock
  | ColumnsBlock
  | ProductGalleryBlock
  | BuyBoxCardBlock
  | ProductHeroCardBlock
  | HeroBlock;

export interface CmsPageContent {
  blocks: CmsBlock[];
}

export function createBlockId(): string {
  return `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createBlock(type: CmsBlock["type"]): CmsBlock {
  const id = createBlockId();
  switch (type) {
    case "section":
      return { type: "section", id, title: "", subtitle: "" };
    case "cta":
      return { type: "cta", id, text: "", buttonText: "Saiba mais", href: "#" };
    case "detailsCard":
      return { type: "detailsCard", id, title: "Detalhes", bullets: [] };
    case "spacer":
      return { type: "spacer", id, height: "h-8" };
    case "grid":
      return { type: "grid", id, columns: 2, gap: "gap-6", children: [] };
    case "columns":
      return { type: "columns", id, columnCount: 2, gap: "gap-6", columnContents: [[], []] };
    case "productGallery":
      return { type: "productGallery", id, imageHeight: 420, showThumbs: true };
    case "buyBoxCard":
      return { type: "buyBoxCard", id, title: "Comprar", hint: "" };
    case "productHeroCard":
      return { type: "productHeroCard", id, showTitle: true, showQuoteButton: true, showPrice: false };
    case "hero":
      return {
        type: "hero",
        id,
        logoSrc: "/brand/hero-logo.png",
        logoAlt: "",
        logoHeight: 320,
        logoMaxWidth: 1200,
        logoTranslateX: 0,
        logoTranslateY: -10,
        logoRotate: -12,
        topPadding: 220,
        spacerHeight: 40,
        showBadges: true,
        showStats: true,
        primaryCtaHref: "/catalogo",
        primaryCtaText: "Ver catálogo",
        secondaryCtaWhatsapp: true,
      };
    default:
      return { type: "section", id } as SectionBlock;
  }
}

export function isColumnsBlock(b: CmsBlock): b is ColumnsBlock {
  return b.type === "columns";
}
