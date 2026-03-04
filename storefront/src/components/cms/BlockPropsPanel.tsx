"use client";

import React from "react";
import type { CmsBlock, HeroBlock, LayoutProps } from "@/lib/cms/types";
import RichTextEditor from "./RichTextEditor";
import NumberStepper from "./NumberStepper";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="text-xs font-extrabold tracking-wider text-foreground/80">{label}</div>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={("h-10 w-full rounded-xl border border-border/50 bg-black/35 px-3 text-sm " + (props.className ?? "")).trim()}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={("h-10 w-full rounded-xl border border-border/50 bg-black/35 px-3 text-sm " + (props.className ?? "")).trim()}
    />
  );
}

const QUICK_LAYOUTS: { label: string; apply: (l: LayoutProps) => LayoutProps }[] = [
  { label: "Centralizar", apply: (l) => ({ ...l, alignment: "center", maxWidth: l.maxWidth || "max-w-4xl" }) },
  { label: "Full width", apply: (l) => ({ ...l, maxWidth: "", alignment: undefined }) },
  { label: "2 colunas", apply: (l) => ({ ...l, columns: 2 }) },
  { label: "3 colunas", apply: (l) => ({ ...l, columns: 3 }) },
  { label: "Espaço acima +", apply: (l) => ({ ...l, margin: (l.margin ? l.margin + " " : "") + "mt-8" }) },
  { label: "Espaço abaixo +", apply: (l) => ({ ...l, margin: (l.margin ? l.margin + " " : "") + "mb-8" }) },
];

const BLOCK_HELP: Record<string, string> = {
  section: "Bloco de seção com título, subtítulo e texto rico (WYSIWYG). Use para introduções ou blocos de texto.",
  cta: "Chamada para ação: texto + botão com link. Ideal para destacar um link importante.",
  detailsCard: "Card com título, descrição e lista de itens. Pode exibir metadados (IPO/Tipo).",
  spacer: "Espaço vazio vertical para separar blocos (altura configurável).",
  grid: "Container em 1 a 4 colunas. Adicione blocos e arraste para reordenar; os filhos aparecem nas colunas.",
  columns: "Layout em 2 a 4 colunas com blocos por coluna. Use para layouts lado a lado.",
  productGallery: "Galeria de imagens do produto. Use em páginas de produto.",
  buyBoxCard: "Card de compra (formulário qtd, opções). Use em páginas de produto.",
  productHeroCard: "Cabeçalho do produto: título, botão orçar, preço opcional.",
  hero: "Hero da Home: logo, posição, rotação, CTAs e badges configuráveis.",
};

function RangeWithStepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="w-full h-2 rounded-lg appearance-none bg-black/35 accent-primary"
        />
        <NumberStepper value={value} min={min} max={max} step={step} onChange={(n) => onChange(clamp(n))} />
      </div>
    </Field>
  );
}

function HeroBlockPanel({
  block,
  update,
}: {
  block: HeroBlock;
  update: (patch: Partial<HeroBlock>) => void;
}) {
  const b = block;
  return (
    <>
      <Field label="Logo (URL)">
        <TextInput value={b.logoSrc ?? ""} onChange={(e) => update({ logoSrc: e.target.value || undefined })} placeholder="/brand/hero-logo.png" />
      </Field>
      <Field label="Logo (alt)">
        <TextInput value={b.logoAlt ?? ""} onChange={(e) => update({ logoAlt: e.target.value || undefined })} placeholder="Serralheria Delima" />
      </Field>
      <RangeWithStepper label="Altura do logo (px)" value={b.logoHeight ?? 320} min={120} max={520} step={10} onChange={(n) => update({ logoHeight: n })} />
      <RangeWithStepper label="Max width logo (px)" value={b.logoMaxWidth ?? 1200} min={400} max={1600} step={50} onChange={(n) => update({ logoMaxWidth: n })} />
      <RangeWithStepper label="Translate X (px)" value={b.logoTranslateX ?? 0} min={-200} max={200} step={5} onChange={(n) => update({ logoTranslateX: n })} />
      <RangeWithStepper label="Translate Y (px)" value={b.logoTranslateY ?? -10} min={-200} max={200} step={5} onChange={(n) => update({ logoTranslateY: n })} />
      <RangeWithStepper label="Rotação (deg)" value={b.logoRotate ?? -12} min={-45} max={45} step={1} onChange={(n) => update({ logoRotate: n })} />
      <RangeWithStepper label="Top padding (px)" value={b.topPadding ?? 220} min={0} max={420} step={10} onChange={(n) => update({ topPadding: n })} />
      <RangeWithStepper label="Spacer altura (px)" value={b.spacerHeight ?? 40} min={0} max={180} step={10} onChange={(n) => update({ spacerHeight: n })} />
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={b.showBadges !== false} onChange={(e) => update({ showBadges: e.target.checked })} />
        Mostrar badges
      </label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={b.showStats !== false} onChange={(e) => update({ showStats: e.target.checked })} />
        Mostrar estatísticas
      </label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={b.secondaryCtaWhatsapp !== false} onChange={(e) => update({ secondaryCtaWhatsapp: e.target.checked })} />
        Botão WhatsApp
      </label>
      <Field label="CTA principal (link)">
        <TextInput value={b.primaryCtaHref ?? ""} onChange={(e) => update({ primaryCtaHref: e.target.value || undefined })} placeholder="/catalogo" />
      </Field>
      <Field label="CTA principal (texto)">
        <TextInput value={b.primaryCtaText ?? ""} onChange={(e) => update({ primaryCtaText: e.target.value || undefined })} placeholder="Ver catálogo" />
      </Field>
    </>
  );
}

function LayoutPanel({
  layout,
  onChange,
}: {
  layout?: LayoutProps | null;
  onChange: (next: LayoutProps) => void;
}) {
  const l = layout ?? {};
  const set = (k: keyof LayoutProps, v: unknown) => onChange({ ...l, [k]: v || undefined });

  return (
    <div className="mt-4 rounded-2xl border border-border/40 bg-black/20 p-4">
      <div className="text-sm font-extrabold text-foreground/90 mb-3">Layout</div>

      <div className="mb-3">
        <div className="text-[11px] text-muted-foreground mb-1.5">Quick layout</div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_LAYOUTS.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => onChange(q.apply(l))}
              className="rounded-lg border border-border/50 bg-black/30 px-2.5 py-1.5 text-xs font-medium hover:bg-black/50"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <Field label="Padding (classes Tailwind)">
          <TextInput value={l.padding ?? ""} onChange={(e) => set("padding", e.target.value)} placeholder="ex: p-6 md:p-8" />
        </Field>

        <Field label="Margin (classes Tailwind)">
          <TextInput value={l.margin ?? ""} onChange={(e) => set("margin", e.target.value)} placeholder="ex: mt-6" />
        </Field>

        <Field label="Max width (classes Tailwind)">
          <TextInput value={l.maxWidth ?? ""} onChange={(e) => set("maxWidth", e.target.value)} placeholder="ex: max-w-4xl" />
        </Field>

        <Field label="Gap (classes Tailwind)">
          <TextInput value={l.gap ?? ""} onChange={(e) => set("gap", e.target.value)} placeholder="ex: gap-6" />
        </Field>

        <Field label="Alinhamento">
          <Select value={l.alignment ?? ""} onChange={(e) => set("alignment", e.target.value || undefined)}>
            <option value="">(padrão)</option>
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </Select>
        </Field>

        <Field label="Background (classes Tailwind)">
          <TextInput value={l.background ?? ""} onChange={(e) => set("background", e.target.value)} placeholder="ex: bg-black/25" />
        </Field>

        <Field label="Border (classes Tailwind)">
          <TextInput value={l.border ?? ""} onChange={(e) => set("border", e.target.value)} placeholder="ex: border border-border/40" />
        </Field>

        <Field label="Radius (classes Tailwind)">
          <TextInput value={l.borderRadius ?? ""} onChange={(e) => set("borderRadius", e.target.value)} placeholder="ex: rounded-3xl" />
        </Field>
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground">
        Dica: use classes Tailwind. Ex: <b>mx-auto</b>, <b>max-w-5xl</b>, <b>mt-6</b>, <b>p-6</b>, <b>bg-black/25</b>.
      </div>
    </div>
  );
}

type Props = {
  block: CmsBlock | null;
  onChange: (b: CmsBlock) => void;
};

export default function BlockPropsPanel({ block, onChange }: Props) {
  if (!block) {
    return (
      <div className="steel-card p-4">
        <div className="text-sm text-muted-foreground">Selecione um bloco para editar as propriedades.</div>
      </div>
    );
  }

  // helpers
  const update = (patch: any) => onChange({ ...block, ...patch } as CmsBlock);
  const updateLayout = (next: LayoutProps) => update({ layout: next });

  const blockHelp = BLOCK_HELP[block.type] ?? "Bloco configurável.";

  return (
    <div className="steel-card p-4 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold text-foreground/90">Propriedades</div>
        <div className="text-[11px] text-muted-foreground">id: {block.id}</div>
      </div>

      <div className="mt-2 rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-xs text-foreground/90">
        <span className="font-semibold">O que esse bloco faz:</span> {blockHelp}
      </div>

      {/* Campos por tipo */}
      <div className="mt-4 grid gap-3">
        {block.type === "section" && (
          <>
            <Field label="Título">
              <TextInput value={(block as any).title ?? ""} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Subtítulo">
              <TextInput value={(block as any).subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
            </Field>
            <Field label="Conteúdo">
              <RichTextEditor
                value={(block as any).richText ?? null}
                onChange={(v) => update({ richText: v })}
              />
            </Field>
          </>
        )}

        {block.type === "cta" && (
          <>
            <Field label="Texto">
              <TextInput value={(block as any).text ?? ""} onChange={(e) => update({ text: e.target.value })} />
            </Field>
            <Field label="Texto do botão">
              <TextInput value={(block as any).buttonText ?? ""} onChange={(e) => update({ buttonText: e.target.value })} />
            </Field>
            <Field label="Link (href)">
              <TextInput value={(block as any).href ?? ""} onChange={(e) => update({ href: e.target.value })} placeholder="/catalogo" />
            </Field>
            <Field label="Variant">
              <Select value={(block as any).variant ?? "primary"} onChange={(e) => update({ variant: e.target.value })}>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </Select>
            </Field>
          </>
        )}

        {block.type === "detailsCard" && (
          <>
            <Field label="Título">
              <TextInput value={(block as any).title ?? ""} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Descrição">
              <TextInput value={(block as any).description ?? ""} onChange={(e) => update({ description: e.target.value })} />
            </Field>
            <Field label="Bullets (1 por linha)">
              <textarea
                className="w-full rounded-xl border border-border/50 bg-black/35 px-3 py-3 text-sm min-h-[140px]"
                value={((block as any).bullets ?? []).join("\n")}
                onChange={(e) => update({ bullets: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={Boolean((block as any).showMeta ?? false)}
                onChange={(e) => update({ showMeta: e.target.checked })}
              />
              Mostrar IPO/Tipo
            </label>
          </>
        )}

        {block.type === "spacer" && (
          <Field label="Altura (classe Tailwind)">
            <TextInput value={(block as any).height ?? ""} onChange={(e) => update({ height: e.target.value })} placeholder="ex: h-8 / h-16" />
          </Field>
        )}

        {block.type === "grid" && (
          <>
            <Field label="Colunas">
              <Select value={String((block as any).columns ?? 2)} onChange={(e) => update({ columns: Number(e.target.value) })}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </Field>
            <Field label="Gap (classe Tailwind)">
              <TextInput value={(block as any).gap ?? "gap-6"} onChange={(e) => update({ gap: e.target.value })} placeholder="gap-6" />
            </Field>
            <div className="text-xs text-muted-foreground">
              Obs.: filhos do Grid você adiciona pela lista de blocos (arrastar e soltar).
            </div>
          </>
        )}

        {block.type === "columns" && (
          <>
            <Field label="Nº de colunas">
              <Select value={String((block as any).columnCount ?? 2)} onChange={(e) => {
                const n = Number(e.target.value) as 2 | 3 | 4;
                const prev = (block as any).columnContents ?? [[], []];
                const columnContents = Array.from({ length: n }, (_, i) => prev[i] ?? []);
                update({ columnCount: n, columnContents });
              }}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
            </Field>
            <Field label="Gap (classe Tailwind)">
              <TextInput value={(block as any).gap ?? "gap-6"} onChange={(e) => update({ gap: e.target.value })} placeholder="gap-6" />
            </Field>
            <div className="text-xs text-muted-foreground">
              Cada coluna pode ter blocos; a estrutura columnContents é preenchida ao editar o bloco (em breve: arrastar para colunas).
            </div>
          </>
        )}

        {block.type === "productGallery" && (
          <>
            <Field label="Altura da imagem (px)">
              <TextInput
                type="number"
                value={String((block as any).imageHeight ?? 420)}
                onChange={(e) => update({ imageHeight: Number(e.target.value || 420) })}
              />
            </Field>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={Boolean((block as any).showThumbs ?? true)}
                onChange={(e) => update({ showThumbs: e.target.checked })}
              />
              Mostrar miniaturas
            </label>
          </>
        )}

        {block.type === "buyBoxCard" && (
          <>
            <Field label="Título">
              <TextInput value={(block as any).title ?? ""} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Texto abaixo (hint)">
              <TextInput value={(block as any).hint ?? ""} onChange={(e) => update({ hint: e.target.value })} />
            </Field>
          </>
        )}

        {block.type === "productHeroCard" && (
          <>
            <Field label="Título (opcional)">
              <TextInput value={(block as any).title ?? ""} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={Boolean((block as any).showTitle ?? true)} onChange={(e) => update({ showTitle: e.target.checked })} />
              Mostrar título
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={Boolean((block as any).showQuoteButton ?? true)} onChange={(e) => update({ showQuoteButton: e.target.checked })} />
              Mostrar botão orçar
            </label>
            <Field label="Texto botão orçar">
              <TextInput value={(block as any).quoteButtonText ?? ""} onChange={(e) => update({ quoteButtonText: e.target.value })} />
            </Field>
            <Field label="Link botão orçar (opcional)">
              <TextInput value={(block as any).quoteHref ?? ""} onChange={(e) => update({ quoteHref: e.target.value })} placeholder="/orcamento?produto=..." />
            </Field>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={Boolean((block as any).showPrice ?? false)} onChange={(e) => update({ showPrice: e.target.checked })} />
              Mostrar preço
            </label>
            <Field label="Hint (texto extra)">
              <TextInput value={(block as any).hint ?? ""} onChange={(e) => update({ hint: e.target.value })} />
            </Field>
          </>
        )}

        {block.type === "hero" && (
          <HeroBlockPanel block={block as HeroBlock} update={update} />
        )}
      </div>

      {block.type !== "hero" && (
        <LayoutPanel layout={(block as any).layout ?? null} onChange={updateLayout} />
      )}
    </div>
  );
}
