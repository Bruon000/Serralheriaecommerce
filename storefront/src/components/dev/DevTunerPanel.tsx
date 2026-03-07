"use client";

function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min;
  return Math.max(min, Math.min(max, v));
}
import React, { useEffect, useMemo, useState } from "react";

export default function DevTunerPanel() {
  const enabled = useMemo(() => {
    if (process.env.NODE_ENV === "production") return false;
    try {
      const v = new URLSearchParams(window.location.search).get("tune");
      return v === "1" || v === "true" || v === "on";
    } catch {
      return false;
    }
  }, []);

  const [pageKey, setPageKey] = useState("");
  const [pathname, setPathname] = useState("");
  const [activeLabel, setActiveLabel] = useState("nada");
  const [psPreview, setPsPreview] = useState("");

  const [s, setS] = useState({
    // Geral (todas)
    pageMaxW: 1200,
    pagePadX: 16,
    pagePadTop: 0,
    pagePadBottom: 0,

    // Home (logo grande)
    heroH: 320,
    heroX: 0,
    heroY: -10,
    heroRot: -12,

    // Header
    headerLogoH: 40,

    // ColumnsLayout (quando usado)
    colsGap: 16,
    colsBase: 1,
    colsLg: 2,
    colsXl: 2,

    // Produto HeaderCard
    prodPad: 16,
    prodTitle: 30,

    // Catálogo (cards)
    catalogGridGap: 24,
    catalogCardPad: 20,
    catalogTitleSize: 18,
    catalogImgScale: 110,

    // Produto (layout)
    productMaxW: 1200,
    productPadX: 16,

    // Carrinho (resumo)
    cartTotalSize: 30,
  
    // Produto (grid)
    prodGridGap: 24,
    
    prodMainGap: 24,
    prodSideGap: 24,prodLeft: 1.25,
    prodRight: 0.85,
    prodXlA: 1,
    prodXlB: 1,
    prodXlC: 1,
    prodCardPad: 24,});

  // carrega/salva local (DEV)
  useEffect(() => {
    if (!enabled) return;
    try {
      const raw = localStorage.getItem("tuner_state_v1");
      if (raw) setS(JSON.parse(raw));
    } catch {}
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    try {
      localStorage.setItem("tuner_state_v1", JSON.stringify(s));
    } catch {}
  }, [enabled, s]);

  const setTarget = (id, label) => {
    setActiveLabel(label || id);
    try {
      document.documentElement.setAttribute("data-tune-target", id);
    } catch {}
  };

  const clearTarget = () => {
    setActiveLabel("nada");
    try {
      document.documentElement.removeAttribute("data-tune-target");
    } catch {}
  };

  // marca página atual (via TunePageMarker) e pathname
  useEffect(() => {
    if (!enabled) return;
    const read = () => {
      setPageKey(document.documentElement.getAttribute("data-tune-page") || "");
      setPathname(window.location.pathname || "");
    };
    read();
    const t = setInterval(read, 300);
    return () => clearInterval(t);
  }, [enabled]);

  // ativa data-dev-tune
  useEffect(() => {
    if (!enabled) {
      try {
        document.documentElement.removeAttribute("data-dev-tune");
        document.documentElement.removeAttribute("data-tune-target");
      } catch {}
      return;
    }
    try {
      document.documentElement.setAttribute("data-dev-tune", "1");
    } catch {}
  }, [enabled]);

  // aplica vars (DEV)
  useEffect(() => {
    if (!enabled) return;
    const setVar = (k, v) => document.documentElement.style.setProperty(k, v);

    // geral
    setVar("--pageMaxW", `${s.pageMaxW}px`);
    setVar("--pagePadX", `${s.pagePadX}px`);
    setVar("--pagePadTop", `${s.pagePadTop}px`);
    setVar("--pagePadBottom", `${s.pagePadBottom}px`);

    // home hero
    setVar("--heroLogoH", `${s.heroH}px`);
    setVar("--heroLogoX", `${s.heroX}px`);
    setVar("--heroLogoY", `${s.heroY}px`);
    setVar("--heroLogoRot", `${s.heroRot}deg`);

    // header
    setVar("--headerLogoH", `${s.headerLogoH}px`);

    // columns layout (classe dev-cols-layout existe no app)
    setVar("--devColsGap", `${s.colsGap}px`);
    setVar("--devColsBase", `${s.colsBase}`);
    setVar("--devColsLg", `${s.colsLg}`);
    setVar("--devColsXl", `${s.colsXl}`);

    // product header card (classe existe no app)
    setVar("--devProductHeaderPad", `${s.prodPad}px`);
    setVar("--devProductTitleSize", `${s.prodTitle}px`);

    // catálogo
    setVar("--catalogGridGap", `${s.catalogGridGap}px`);
    setVar("--catalogCardPad", `${s.catalogCardPad}px`);
    setVar("--catalogTitleSize", `${s.catalogTitleSize}px`);
    setVar("--catalogImgScale", `${s.catalogImgScale}`);

    // produto
    setVar("--productMaxW", `${s.productMaxW}px`);
    setVar("--productPadX", `${s.productPadX}px`);

    
    // produto grid
        setVar("--prodMainGap", `${clamp(s.prodMainGap, 8, 48)}px`);
    setVar("--prodSideGap", `${clamp(s.prodSideGap, 8, 48)}px`);setVar("--prodLeft", `${clamp(s.prodLeft, 0.8, 2.2)}fr`);
    setVar("--prodRight", `${clamp(s.prodRight, 0.6, 1.6)}fr`);
    setVar("--prodXlA", `${s.prodXlA}fr`);
    setVar("--prodXlB", `${s.prodXlB}fr`);
    setVar("--prodXlC", `${s.prodXlC}fr`);
    setVar("--prodCardPad", `${clamp(s.prodCardPad, 12, 36)}px`);// carrinho
    setVar("--cartTotalSize", `${s.cartTotalSize}px`);
  }, [enabled, s]);

  if (!enabled) return null;

  const Row = ({ label, hint, children }) => (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="min-w-[150px]">
        <div className="text-xs font-bold text-foreground/85">{label}</div>
        {hint ? <div className="text-[10px] text-foreground/55">{hint}</div> : null}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  const Num = ({ value, min, max, step, onChange }) => (
    <input
      className="w-20 rounded-md border border-border bg-black/40 px-2 py-1 text-xs"
      type="number"
      value={value}
      min={min}
      max={max}
      step={step ?? 1}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );

  const Range = ({ value, min, max, step, onChange }) => (
    <input
      className="w-56"
      type="range"
      value={value}
      min={min}
      max={max}
      step={step ?? 1}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );

  const Section = ({ title, where, targetId, targetLabel, children }) => (
    <div className="rounded-lg border border-border/50 bg-black/30 p-2">
      <div className="mb-1 flex items-center justify-between">
        <button
          className="text-left text-xs font-extrabold hover:underline"
          onClick={() => setTarget(targetId, targetLabel)}
          title="clicar aqui destaca no site"
        >
          {title}
        </button>
        <div className="text-[10px] text-foreground/60">{where}</div>
      </div>
      {children}
    </div>
  );

  const buildPsPatch = () => {
    const scale = (s.catalogImgScale / 100).toFixed(2);

    return `# FIXED_TUNER patch (gerado pelo painel)
# Rode dentro de: C:\\Users\\BruoN\\serralheria-ecommerce\\storefront

$ErrorActionPreference="Stop"
$css="src\\app\\globals.css"
Copy-Item $css "$css.bak_fixedtuner_$(Get-Date -Format 'yyyyMMdd_HHmmss')" -Force
$raw = Get-Content $css -Raw

$block = @"
\\n/* FIXED_TUNER_BEGIN (generated) */
:root{
  --heroLogoH:${s.heroH}px;
  --heroLogoX:${s.heroX}px;
  --heroLogoY:${s.heroY}px;
  --heroLogoRot:${s.heroRot}deg;
  --headerLogoH:${s.headerLogoH}px;
}

/* Geral (todas) */
.tune-root{
  max-width:${s.pageMaxW}px;
  margin-left:auto;
  margin-right:auto;
  padding-left:${s.pagePadX}px;
  padding-right:${s.pagePadX}px;
  padding-top:${s.pagePadTop}px;
  padding-bottom:${s.pagePadBottom}px;
  width:100%;
}

/* ColumnsLayout (classe dev-cols-layout) */
.dev-cols-layout{ gap:${s.colsGap}px !important; grid-template-columns:repeat(${s.colsBase},minmax(0,1fr)) !important; }
@media (min-width:1024px){ .dev-cols-layout{ grid-template-columns:repeat(${s.colsLg},minmax(0,1fr)) !important; } }
@media (min-width:1280px){ .dev-cols-layout{ grid-template-columns:repeat(${s.colsXl},minmax(0,1fr)) !important; } }

/* Produto • HeaderCard */
.dev-product-header-card{ padding:${s.prodPad}px !important; }
.dev-product-title{ font-size:${s.prodTitle}px !important; line-height:1.1 !important; }

/* Catálogo */
.tune-catalog .grid.gap-6{ gap:${s.catalogGridGap}px !important; }
.tune-catalog .steel-card .p-5{ padding:${s.catalogCardPad}px !important; }
.tune-catalog h3.text-lg{ font-size:${s.catalogTitleSize}px !important; }
.tune-catalog img.group-hover\\:scale-110{ transform:scale(${scale}) !important; }

/* Produto (layout) */
.tune-product-main.container{
  max-width:${s.productMaxW}px !important;
  padding-left:${s.productPadX}px !important;
  padding-right:${s.productPadX}px !important;
}

/* Carrinho (TOTAL) */
.tune-cart .text-3xl{ font-size:${s.cartTotalSize}px !important; }

/* FIXED_TUNER_END (generated) */
"@

if ($raw -match "/\\* FIXED_TUNER_BEGIN \\(generated\\) \\*/[\\s\\S]*?/\\* FIXED_TUNER_END \\(generated\\) \\*/") {
  $raw = [regex]::Replace($raw, "/\\* FIXED_TUNER_BEGIN \\(generated\\) \\*/[\\s\\S]*?/\\* FIXED_TUNER_END \\(generated\\) \\*/", $block)
} else {
  $raw = $raw + $block
}

$raw | Out-File -FilePath $css -Encoding utf8 -Force
Write-Host "OK: globals.css atualizado com FIXED_TUNER"
`;
  };

  const copyPs = async () => {
    const txt = buildPsPatch();
    setPsPreview(txt);
    try {
      await navigator.clipboard.writeText(txt);
    } catch {}
  };

  const onReset = () => {
    try { localStorage.removeItem("tuner_state_v1"); } catch {}
    setS((x) => ({
      ...x,
      pageMaxW: 1200,
      pagePadX: 16,
      pagePadTop: 0,
      pagePadBottom: 0,
      heroH: 320,
      heroX: 0,
      heroY: -10,
      heroRot: -12,
      headerLogoH: 40,
      colsGap: 16,
      colsBase: 1,
      colsLg: 2,
      colsXl: 2,
      prodPad: 16,
      prodTitle: 30,
      catalogGridGap: 24,
      catalogCardPad: 20,
      catalogTitleSize: 18,
      catalogImgScale: 110,
      productMaxW: 1200,
      productPadX: 16,
      cartTotalSize: 30,
    
    // Produto (grid)
    prodGridGap: 24,
    
    prodMainGap: 24,
    prodSideGap: 24,prodLeft: 1.25,
    prodRight: 0.85,
    prodXlA: 1,
    prodXlB: 1,
    prodXlC: 1,
    prodCardPad: 24,}));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[520px] max-w-[96vw] rounded-xl border border-border/60 bg-black/80 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold">Ajustes rápidos</div>
          <div className="text-[10px] text-foreground/60">
            Página: <span className="font-bold">{pageKey || "..."}</span>{" "}
            <span className="text-foreground/50">{pathname ? `(${pathname})` : ""}</span>
          </div>
          <div className="text-[10px] text-foreground/70">
            Mexendo agora: <span className="font-bold text-foreground/90">{activeLabel}</span>{" "}
            <button className="ml-2 underline text-foreground/60 hover:text-foreground" onClick={clearTarget}>
              limpar destaque
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-md border border-border bg-black/30 px-2 py-1 text-xs font-bold hover:bg-black/50" onClick={onReset}>
            Reset
          </button>
          <button className="rounded-md border border-border bg-black/30 px-2 py-1 text-xs font-bold hover:bg-black/50" onClick={copyPs}>
            Copiar Patch (PS)
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-[62vh] space-y-3 overflow-auto pr-1">
        <Section title="Geral • Página" where='mexe em: layout (tune-root)' targetId="geral" targetLabel="Geral • Página">
          <Row label="Largura do miolo" hint="max-width">
            <Range value={s.pageMaxW} min={900} max={1800} step={10} onChange={(v: number) => setS((x) => ({ ...x, pageMaxW: v }))} />
            <Num value={s.pageMaxW} min={900} max={1800} step={10} onChange={(v: number) => setS((x) => ({ ...x, pageMaxW: v }))} />
          </Row>
          <Row label="Margem lateral" hint="padding X">
            <Range value={s.pagePadX} min={0} max={80} onChange={(v: number) => setS((x) => ({ ...x, pagePadX: v }))} />
            <Num value={s.pagePadX} min={0} max={80} onChange={(v: number) => setS((x) => ({ ...x, pagePadX: v }))} />
          </Row>
          <Row label="Espaço em cima" hint="padding-top">
            <Range value={s.pagePadTop} min={0} max={160} step={2} onChange={(v: number) => setS((x) => ({ ...x, pagePadTop: v }))} />
            <Num value={s.pagePadTop} min={0} max={160} step={2} onChange={(v: number) => setS((x) => ({ ...x, pagePadTop: v }))} />
          </Row>
          <Row label="Espaço embaixo" hint="padding-bottom">
            <Range value={s.pagePadBottom} min={0} max={200} step={2} onChange={(v: number) => setS((x) => ({ ...x, pagePadBottom: v }))} />
            <Num value={s.pagePadBottom} min={0} max={200} step={2} onChange={(v: number) => setS((x) => ({ ...x, pagePadBottom: v }))} />
          </Row>
        </Section>

        {pageKey === "home" ? (
          <Section title="Home • Logo grande" where="mexe em: HeroSection.tsx" targetId="geral" targetLabel="Home • Logo grande">
            <Row label="Altura" hint="tamanho do logo">
              <Range value={s.heroH} min={160} max={520} step={2} onChange={(v: number) => setS((x) => ({ ...x, heroH: v }))} />
              <Num value={s.heroH} min={160} max={520} step={2} onChange={(v: number) => setS((x) => ({ ...x, heroH: v }))} />
            </Row>
            <Row label="Lado (X)" hint="esquerda / direita">
              <Range value={s.heroX} min={-400} max={400} onChange={(v: number) => setS((x) => ({ ...x, heroX: v }))} />
              <Num value={s.heroX} min={-400} max={400} onChange={(v: number) => setS((x) => ({ ...x, heroX: v }))} />
            </Row>
            <Row label="Cima/baixo (Y)" hint="sobe / desce">
              <Range value={s.heroY} min={-400} max={400} onChange={(v: number) => setS((x) => ({ ...x, heroY: v }))} />
              <Num value={s.heroY} min={-400} max={400} onChange={(v: number) => setS((x) => ({ ...x, heroY: v }))} />
            </Row>
            <Row label="Giro" hint="rotaciona">
              <Range value={s.heroRot} min={-45} max={45} onChange={(v: number) => setS((x) => ({ ...x, heroRot: v }))} />
              <Num value={s.heroRot} min={-45} max={45} onChange={(v: number) => setS((x) => ({ ...x, heroRot: v }))} />
            </Row>
          </Section>
        ) : null}

        {pageKey === "catalogo" ? (
          <>
            <Section title="Catálogo • Grade" where="mexe em: src/app/catalogo/page.tsx" targetId="catalog-grid" targetLabel="Catálogo • Grade">
              <Row label="Espaço entre cards" hint="gap do grid">
                <Range value={s.catalogGridGap} min={8} max={64} onChange={(v: number) => setS((x) => ({ ...x, catalogGridGap: v }))} />
                <Num value={s.catalogGridGap} min={8} max={64} onChange={(v: number) => setS((x) => ({ ...x, catalogGridGap: v }))} />
              </Row>
            </Section>

            <Section title="Catálogo • Card" where="mexe em: src/app/catalogo/page.tsx" targetId="catalog-card" targetLabel="Catálogo • Card">
              <Row label="Padding do card" hint="respiro interno">
                <Range value={s.catalogCardPad} min={10} max={40} onChange={(v: number) => setS((x) => ({ ...x, catalogCardPad: v }))} />
                <Num value={s.catalogCardPad} min={10} max={40} onChange={(v: number) => setS((x) => ({ ...x, catalogCardPad: v }))} />
              </Row>
              <Row label="Título do card" hint="tamanho do nome">
                <Range value={s.catalogTitleSize} min={14} max={28} onChange={(v: number) => setS((x) => ({ ...x, catalogTitleSize: v }))} />
                <Num value={s.catalogTitleSize} min={14} max={28} onChange={(v: number) => setS((x) => ({ ...x, catalogTitleSize: v }))} />
              </Row>
              <Row label="Zoom da imagem" hint="hover scale">
                <Range value={s.catalogImgScale} min={100} max={140} onChange={(v: number) => setS((x) => ({ ...x, catalogImgScale: v }))} />
                <Num value={s.catalogImgScale} min={100} max={140} onChange={(v: number) => setS((x) => ({ ...x, catalogImgScale: v }))} />
              </Row>
            </Section>
          </>
        ) : null}

        {pageKey === "produto" ? (
          <Section title="Produto • Layout" where="mexe em: src/app/produto/[handle]/page.tsx" targetId="product-main" targetLabel="Produto • Layout">
            <Row label="Largura do miolo" hint="max-width">
              <Range value={s.productMaxW} min={900} max={1680} step={10} onChange={(v: number) => setS((x) => ({ ...x, productMaxW: v }))} />
              <Num value={s.productMaxW} min={900} max={1680} step={10} onChange={(v: number) => setS((x) => ({ ...x, productMaxW: v }))} />
            </Row>
            <Row label="Margem lateral" hint="padding X">
              <Range value={s.productPadX} min={0} max={64} onChange={(v: number) => setS((x) => ({ ...x, productPadX: v }))} />
              <Num value={s.productPadX} min={0} max={64} onChange={(v: number) => setS((x) => ({ ...x, productPadX: v }))} />
            </Row>
          </Section>
        ) : null}

        
        {pageKey === "produto" ? (
          <Section title="Produto • Grid" where="mexe em: /produto (grid + cards)" targetId="product-main" targetLabel="Produto • Grid">
            <Row label="Gap principal" hint="espaço entre colunas/linhas">
              <Range value={s.prodMainGap} min={8} max={64} onChange={(v: number) => setS((x) => ({ ...x, prodMainGap: v }))} />
              <Num value={s.prodMainGap} min={8} max={64} onChange={(v: number) => setS((x) => ({ ...x, prodMainGap: v }))} />
            </Row>

            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                className="rounded-md border border-border bg-black/30 px-2 py-1 text-xs font-bold hover:bg-black/50"
                onClick={() => setS((x) => ({ 
                  ...x,
                  prodMainGap: 24,
                  prodSideGap: 24,
                  prodLeft: 1.25,
                  prodRight: 0.85,
                  prodCardPad: 24
                }))}
              >
                Reset Produto (safe)
              </button>
              <div className="text-[10px] text-foreground/60">volta pro layout normal</div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                className="rounded-md border border-border bg-black/30 px-2 py-1 text-xs font-bold hover:bg-black/50"
                onClick={() => setS((x) => ({
                  ...x,
                  // layout
                  productMaxW: 1200,
                  productPadX: 24,

                  // grid
                  prodMainGap: 24,
                  prodSideGap: 16,
                  prodLeft: 1.35,
                  prodRight: 0.95,
                  prodCardPad: 24
                }))}
              >
                Preset Bonito (Produto)
              </button>
              <div className="text-[10px] text-foreground/60">fica “site pronto”</div>
            </div>

            <Row label="Gap coluna direita" hint="cards (stack) do lado direito">
              <Range value={s.prodSideGap} min={8} max={64} onChange={(v: number) => setS((x) => ({ ...x, prodSideGap: v }))} />
              <Num value={s.prodSideGap} min={8} max={64} onChange={(v: number) => setS((x) => ({ ...x, prodSideGap: v }))} />
            </Row>

            <Row label="Esquerda (lg)" hint="foto + detalhes (fr)">
              <Range value={s.prodLeft} min={0.8} max={2.2} step={0.05} onChange={(v: number) => setS((x) => ({ ...x, prodLeft: v }))} />
              <Num value={s.prodLeft} min={0.8} max={2.2} step={0.05} onChange={(v: number) => setS((x) => ({ ...x, prodLeft: v }))} />
            </Row>

            <Row label="Direita (lg)" hint="preço + comprar (fr)">
              <Range value={s.prodRight} min={0.6} max={1.6} step={0.05} onChange={(v: number) => setS((x) => ({ ...x, prodRight: v }))} />
              <Num value={s.prodRight} min={0.6} max={1.6} step={0.05} onChange={(v: number) => setS((x) => ({ ...x, prodRight: v }))} />
            </Row><Row label="Padding dos cards" hint="p-6 (respiro)">
              <Range value={s.prodCardPad} min={12} max={44} step={1} onChange={(v: number) => setS((x) => ({ ...x, prodCardPad: v }))} />
              <Num value={s.prodCardPad} min={12} max={44} step={1} onChange={(v: number) => setS((x) => ({ ...x, prodCardPad: v }))} />
            </Row>
          </Section>
        ) : null}
{pageKey === "carrinho" ? (
          <Section title="Carrinho • Total" where="mexe em: CarrinhoBody.tsx" targetId="cart-summary" targetLabel="Carrinho • Total">
            <Row label="Tamanho do TOTAL" hint="texto do preço">
              <Range value={s.cartTotalSize} min={18} max={46} onChange={(v: number) => setS((x) => ({ ...x, cartTotalSize: v }))} />
              <Num value={s.cartTotalSize} min={18} max={46} onChange={(v: number) => setS((x) => ({ ...x, cartTotalSize: v }))} />
            </Row>
          </Section>
        ) : null}

        {psPreview ? (
          <div className="rounded-lg border border-border/50 bg-black/30 p-2">
            <div className="mb-1 text-xs font-extrabold">Patch (PS) — preview</div>
            <pre className="max-h-48 overflow-auto rounded-md bg-black/40 p-2 text-[10px] leading-snug text-foreground/80">
{psPreview}
            </pre>
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-[10px] text-foreground/60">
        abre com <span className="font-bold">?tune=1</span> • clica em <span className="font-bold">Copiar Patch (PS)</span> pra salvar no código
      </div>
    </div>
  );
}









