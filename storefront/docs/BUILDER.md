# Builder.io — Editor visual

O storefront usa [Builder.io](https://www.builder.io) para páginas editáveis visualmente, blocos opcionais em catálogo/carrinho/orçamento, páginas de produto e configurações globais do site.

## Configuração

### 1. Chave de API

No `.env.local` do **storefront**:

```env
NEXT_PUBLIC_BUILDER_API_KEY=sua_chave_publica_aqui
```

A chave está em [builder.io](https://builder.io) → **Account** → **Organization** → **Public API Key**. Sem essa variável, o site usa apenas as páginas estáticas e, em rotas que não existem, retorna 404 (não intercepta outras rotas).

### 2. Modelos no Builder

Crie estes **Custom Models** no Builder (Content → Models):

| Modelo | Uso |
|--------|-----|
| **page** | Páginas genéricas (home, landing). Targeting por **urlPath** (ex.: `/`, `/sobre`). |
| **product-page** | Página de produto. Targeting: **urlPath** = `/produto/[handle]`, **handle**, **productId**. |
| **page-section** | Blocos opcionais acima/abaixo de uma página. Targeting: **urlPath** (ex.: `/catalogo`, `/carrinho`, `/orcamento`) e **slot** = `top` ou `bottom`. |
| **site-settings** | Configurações globais (uma entrada). Campos sugeridos: whatsappNumber, phoneLabel, instagramUrl, garantia, prazo, showConstructorNudge, showFloatingCartButton. |

**page**

- Ative **URL targeting** e use o campo `urlPath` (ex.: `/`, `/promo`).
- A rota catch-all `[[...page]]` busca conteúdo com `urlPath` igual à URL. Se existir, a página do Builder é exibida; se não, em `/` mostra a home estática e em outras URLs retorna 404.

**product-page**

- Crie **Custom targeting attributes**: `urlPath` (text), `handle` (text), `productId` (text).
- Em `/produto/[handle]` o app busca conteúdo com esses atributos. Se existir, renderiza o Builder com `data={{ product, urlPath, ...siteSettings }}`; senão, usa o layout padrão da página de produto.

**page-section**

- **Custom targeting attributes**: `urlPath` (text), `slot` (text: `top` ou `bottom`).
- Usado em `/catalogo`, `/carrinho` e `/orcamento`: bloco com `urlPath=/catalogo` e `slot=top` aparece acima do conteúdo; `slot=bottom` aparece abaixo.

**site-settings**

- Uma entrada (ex.: primeira publicada). Campos de dados sugeridos:
  - `whatsappNumber`, `phoneLabel`, `instagramUrl` (text)
  - `garantia`, `prazo` (text)
  - `showConstructorNudge`, `showFloatingCartButton` (boolean; `false` esconde o componente no layout)

## Mapear urlPath para página

| URL | Comportamento |
|-----|----------------|
| `/` | Conteúdo do model **page** com `urlPath: "/"` ou, se não houver, home estática. |
| `/catalogo` | Página do catálogo + blocos **page-section** com `urlPath: "/catalogo"` e `slot: top` / `bottom` se existirem. |
| `/carrinho` | Página do carrinho + blocos **page-section** com `urlPath: "/carrinho"` e `slot: top` / `bottom`. |
| `/orcamento` | Página de orçamento + blocos **page-section** com `urlPath: "/orcamento"` e `slot: top` / `bottom`. |
| `/produto/[handle]` | Conteúdo **product-page** com `urlPath: "/produto/[handle]"` (e handle/productId) ou layout padrão. |
| Qualquer outra | Conteúdo **page** com `urlPath` igual à URL ou 404. |

## Preview (conteúdo não publicado)

Para ver rascunhos **antes de publicar**:

- **Query string:** `?builder.preview=1` ou `?builder.preview=page`  
  Ex.: `https://seusite.com/produto/portao-basculante?builder.preview=1`
- **Cookie:** cookie `builder.preview` (qualquer valor) no domínio do site.

Vale para **page**, **product-page** e, se aplicável, **page-section**.

## Editar e publicar

1. No Builder, abra **Content** e escolha o modelo (**page**, **product-page**, **page-section** ou **site-settings**).
2. Crie ou edite a entrada e defina o **urlPath** (e, no product-page, **handle** e **productId**; no page-section, **slot**).
3. Monte o layout com blocos nativos e os **Custom Components** (Section, CTA, ProductGallery, PriceBlock, AddToCartForm, DetailsCard).
4. Na página de produto, use **State** e faça binding de `product` nos componentes que precisam (ex.: ProductGallery → product = State → product).
5. Clique em **Publish**. Só o conteúdo publicado é exibido em produção (a menos que o preview esteja ativo).

## Componentes customizados

Registrados em `src/builder-registry.tsx`:

| Componente | Descrição | Principais inputs |
|------------|-----------|--------------------|
| **Section** | Seção genérica (título + subtítulo + conteúdo) | title, subtitle, content |
| **CTA** | Call to action (texto + botão + link) | text, buttonText, link |
| **ProductGallery** | Galeria de imagens do produto | title, thumbnail, images, product (bind), imageHeight, showThumbnails, thumbsSize (sm/md/lg) |
| **PriceBlock** | Preço (B2B/consumidor) | product (bind), showBadge, sobConsultaText |
| **AddToCartForm** | Formulário adicionar ao carrinho | product, showColor, showDims, showObs, labels e textos dos botões |
| **DetailsCard** | Card de detalhes (bullets, IPO, tipo) | title, description, bullets[], showMetaIpoTipo, ipo, tipo |

Estilo visual segue as classes do projeto (ex.: steel-card, Tailwind).

## Dados disponíveis no Builder

- **page:** `data` inclui `urlPath` e campos de **site-settings** (whatsappNumber, etc.).
- **product-page:** `data` inclui `product`, `urlPath` e **site-settings**.
- **page-section:** `data` inclui `urlPath` e **site-settings**.

Os toggles **showConstructorNudge** e **showFloatingCartButton** do **site-settings** são lidos no layout do Next.js e controlam a exibição desses componentes globalmente.
