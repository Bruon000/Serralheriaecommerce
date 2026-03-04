"use client";

import { register } from "@builder.io/sdk-react";
import ProductGallery from "@/components/ProductGallery";
import PriceBlock from "@/components/PriceBlock";
import AddToCartForm from "@/components/AddToCartForm";
import DetailsCard from "@/components/DetailsCard";
import BuilderSection from "@/components/BuilderSection";
import BuilderCTA from "@/components/BuilderCTA";
import ProductHeroCard from "@/components/ProductHeroCard";
import ColumnsLayout from "@/components/ColumnsLayout";
import ProductHeaderCard from "@/components/ProductHeaderCard";
import BuyBoxCard from "@/components/BuyBoxCard";

/**
 * Builder.io custom components registry.
 * Import this once in the root layout so the editor can use these components.
 */
export function registerBuilderComponents() {
  register("ProductGallery", {
    component: ProductGallery,
    name: "ProductGallery",
    description: "Galeria de imagens do produto",
    inputs: [
      { name: "title", type: "text", friendlyName: "Título", defaultValue: "" },
      { name: "thumbnail", type: "url", friendlyName: "Thumbnail" },
      {
        name: "images",
        type: "list",
        friendlyName: "Imagens",
        subFields: [{ name: "url", type: "url" }],
      },
      {
        name: "product",
        type: "object",
        friendlyName: "Produto (bind state.product na página de produto)",
      },
      {
        name: "imageHeight",
        type: "number",
        friendlyName: "Altura da imagem (px)",
        defaultValue: 420,
      },
      {
        name: "showThumbnails",
        type: "boolean",
        friendlyName: "Mostrar miniaturas",
        defaultValue: true,
      },
      {
        name: "thumbsSize",
        type: "text",
        friendlyName: "Tamanho das miniaturas",
        enum: ["sm", "md", "lg"],
        defaultValue: "md",
      },
    ],
    models: ["page", "product-page"],
  });

  register("PriceBlock", {
    component: PriceBlock,
    name: "PriceBlock",
    description: "Bloco de preço do produto (B2B/consumidor)",
    inputs: [
      {
        name: "product",
        type: "object",
        friendlyName: "Produto",
        description: "Bind ao state.product na página de produto",
      },
      {
        name: "showBadge",
        type: "boolean",
        friendlyName: "Mostrar badge B2B",
        defaultValue: true,
      },
      {
        name: "sobConsultaText",
        type: "text",
        friendlyName: "Texto “Preço sob consulta”",
        description: "Se preenchido, substitui o preço por este texto",
      },
    ],
    models: ["product-page"],
  });

  register("AddToCartForm", {
    component: AddToCartForm,
    name: "AddToCartForm",
    description: "Formulário adicionar ao carrinho",
    inputs: [
      {
        name: "product",
        type: "object",
        friendlyName: "Produto",
        required: true,
      },
      {
        name: "showColor",
        type: "boolean",
        friendlyName: "Mostrar campo Cor",
        defaultValue: true,
      },
      {
        name: "showDims",
        type: "boolean",
        friendlyName: "Mostrar campos Largura/Altura",
        defaultValue: true,
      },
      {
        name: "showObs",
        type: "boolean",
        friendlyName: "Mostrar campo Observações",
        defaultValue: true,
      },
      {
        name: "labelQty",
        type: "text",
        friendlyName: "Label Quantidade",
        defaultValue: "Quantidade",
      },
      {
        name: "labelColor",
        type: "text",
        friendlyName: "Label Cor",
        defaultValue: "Cor (opcional)",
      },
      {
        name: "labelLargura",
        type: "text",
        friendlyName: "Label Largura",
        defaultValue: "Largura (cm)",
      },
      {
        name: "labelAltura",
        type: "text",
        friendlyName: "Label Altura",
        defaultValue: "Altura (cm)",
      },
      {
        name: "labelObs",
        type: "text",
        friendlyName: "Label Observações",
        defaultValue: "Observações (opcional)",
      },
      {
        name: "btnAddText",
        type: "text",
        friendlyName: "Texto botão Adicionar",
        defaultValue: "Adicionar ao carrinho",
      },
      {
        name: "btnOrcamentoText",
        type: "text",
        friendlyName: "Texto botão Orçamento",
        defaultValue: "Pedir orçamento deste modelo",
      },
      {
        name: "btnCarrinhoText",
        type: "text",
        friendlyName: "Texto botão Carrinho",
        defaultValue: "Ir para o carrinho",
      },
    ],
    models: ["product-page"],
  });

  register("DetailsCard", {
    component: DetailsCard,
    name: "DetailsCard",
    description: "Card de detalhes (bullets, IPO, tipo) estilo steel-card",
    inputs: [
      {
        name: "title",
        type: "text",
        friendlyName: "Título",
        defaultValue: "Detalhes do produto",
      },
      {
        name: "description",
        type: "longText",
        friendlyName: "Descrição",
      },
      {
        name: "bullets",
        type: "list",
        friendlyName: "Lista de itens",
        subFields: [{ name: "value", type: "text" }],
      },
      {
        name: "showMetaIpoTipo",
        type: "boolean",
        friendlyName: "Mostrar IPO e Tipo",
        defaultValue: true,
      },
      {
        name: "ipo",
        type: "text",
        friendlyName: "IPO",
        defaultValue: "-",
      },
      {
        name: "tipo",
        type: "text",
        friendlyName: "Tipo",
        defaultValue: "-",
      },
    ],
    models: ["page", "product-page"],
  });

  register("BuilderSection", {
    component: BuilderSection,
    name: "Section",
    description: "Seção genérica: título + subtítulo + conteúdo",
    inputs: [
      { name: "title", type: "text", friendlyName: "Título" },
      { name: "subtitle", type: "text", friendlyName: "Subtítulo" },
      { name: "content", type: "longText", friendlyName: "Conteúdo" },
    ],
    canHaveChildren: true,
    models: ["page", "product-page", "page-section"],
  });

  register("BuilderCTA", {
    component: BuilderCTA,
    name: "CTA",
    description: "Call to action: texto + botão + link",
    inputs: [
      { name: "text", type: "text", friendlyName: "Texto" },
      { name: "buttonText", type: "text", friendlyName: "Texto do botão", defaultValue: "Saiba mais" },
      { name: "link", type: "url", friendlyName: "Link" },
    ],
    models: ["page", "product-page", "page-section"],
  });  
  register("ColumnsLayout", {
    component: ColumnsLayout,
    name: "ColumnsLayout",
    description: "Layout de colunas (grid) com breakpoints editáveis",
    inputs: [
      { name: "gap", type: "text", friendlyName: "Gap (ex: gap-6)", defaultValue: "gap-6" },
      { name: "columnsLg", type: "text", friendlyName: "Cols LG (ex: lg:grid-cols-2)", defaultValue: "lg:grid-cols-2" },
      { name: "columnsXl", type: "text", friendlyName: "Cols XL (ex: xl:grid-cols-3)", defaultValue: "xl:grid-cols-3" },
      { name: "className", type: "text", friendlyName: "Classes extras" }
    ],
    canHaveChildren: true,
    models: ["page", "product-page", "page-section"],
  });

  register("ProductHeaderCard", {
    component: ProductHeaderCard,
    name: "ProductHeaderCard",
    description: "Card do topo do produto: título + botão + meta (opcional). Permite children (ex: PriceBlock).",
    inputs: [
      { name: "title", type: "text", friendlyName: "Título", defaultValue: "Título do produto" },
      { name: "quoteHref", type: "text", friendlyName: "Link do orçamento", defaultValue: "/orcamento" },
      { name: "buttonText", type: "text", friendlyName: "Texto do botão", defaultValue: "Orçar este modelo" },
      { name: "showMeta", type: "boolean", friendlyName: "Mostrar IPO/Tipo", defaultValue: false },
      { name: "ipo", type: "text", friendlyName: "IPO", defaultValue: "-" },
      { name: "tipo", type: "text", friendlyName: "Tipo", defaultValue: "-" },
      { name: "className", type: "text", friendlyName: "Classes extras" }
    ],
    canHaveChildren: true,
    models: ["product-page"],
  });

  register("BuyBoxCard", {
    component: BuyBoxCard,
    name: "BuyBoxCard",
    description: "Card do box de compra (envolve AddToCartForm).",
    inputs: [
      { name: "title", type: "text", friendlyName: "Título", defaultValue: "Comprar / Adicionar ao carrinho" },
      { name: "hint", type: "text", friendlyName: "Texto abaixo", defaultValue: "Quer orçamento com medidas? Use “Orçar este modelo”." },
      { name: "className", type: "text", friendlyName: "Classes extras" }
    ],
    canHaveChildren: true,
    models: ["product-page"],
  });
  register("ProductHeroCard", {
    component: ProductHeroCard,
    name: "ProductHeroCard",
    description: "Card do topo da coluna direita (título + preço + botão orçar).",
    inputs: [
      { name: "title", type: "text", friendlyName: "Título (opcional)" },
      { name: "showTitle", type: "boolean", friendlyName: "Mostrar título", defaultValue: true },

      { name: "showQuoteButton", type: "boolean", friendlyName: "Mostrar botão Orçar", defaultValue: true },
      { name: "quoteButtonText", type: "text", friendlyName: "Texto do botão Orçar", defaultValue: "Orçar este modelo" },
      { name: "quoteHref", type: "text", friendlyName: "Link do botão (opcional)" },

      { name: "showPrice", type: "boolean", friendlyName: "Mostrar preço", defaultValue: true },
      { name: "hint", type: "text", friendlyName: "Texto extra abaixo (opcional)" },

      { name: "className", type: "text", friendlyName: "Classes extras" }
    ],
    models: ["product-page"],
  });

}

