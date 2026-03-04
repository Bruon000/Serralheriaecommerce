# CMS interno — Page Builder

CMS visual **100% gratuito e self-hosted** dentro do storefront Next.js. Editor drag-and-drop com blocos configuráveis, **preview ao vivo** (iframe real) e publicação separada de rascunho.

## Acesso

- **Admin (editor):** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Login

1. Acesse `/admin/login`.
2. Use o **e-mail** e **senha** definidos no `.env` (ou `.env.local`):
   - `CMS_ADMIN_EMAIL`
   - `CMS_ADMIN_PASSWORD`
3. A sessão é guardada em cookie `cms_session` (JWT, 7 dias).

### Resetar senha

Altere no `.env` (ou `.env.local`):

```env
CMS_ADMIN_EMAIL=seu@email.com
CMS_ADMIN_PASSWORD=novasenha
CMS_SESSION_SECRET=uma-string-secreta-longa
```

Reinicie o servidor e faça login de novo.

---

## Navegação por páginas

- **Rotas do site:** botões no painel esquerdo (Home, Catálogo, Carrinho, Orçamento, Depoimentos, Promoções, Cadastro, Contato, Página de produto).
- Clique numa rota para carregar/editar o conteúdo daquela URL.
- **Ou** use o dropdown “carregar página existente” para escolher uma página já salva no banco.
- **URL (urlPath):** digite qualquer caminho (ex.: `/`, `/minha-pagina`, `/produto/[handle]`).
- **Rotas dinâmicas** (ex.: `/produto/[handle]`): preencha “Exemplo de parâmetros (JSON)” com `{"handle": "portao-basculante"}` para o preview usar essa URL. O template fica salvo com `routeParamsExample` no banco.
- Botão **“Criar/Editar Home”** leva para `/`.

---

## Preview ao vivo

- O **centro** do admin é um **iframe** que carrega a página real com `?cmsPreview=1`.
- Qualquer alteração nos blocos ou propriedades **atualiza o preview na hora**, sem precisar salvar (o editor envia o rascunho por `postMessage` para o iframe).
- **Abrir em nova aba:** abre a mesma URL em nova aba (útil para testar em tela cheia).
- Em **produção**, o parâmetro `cmsPreview=1` só funciona se o usuário estiver autenticado (cookie `cms_session`). Em **desenvolvimento**, funciona sempre.

---

## Salvar e publicar

- **Salvar:** grava o **rascunho** (`contentJson`). Só quem edita vê o rascunho no preview.
- **Publicar:** copia o rascunho para o conteúdo publicado (`publishedContentJson`) e marca `published = true`.
- Em **produção**, o site exibe apenas `publishedContentJson` para visitantes. Em **dev**, a rota pode exibir o rascunho quando `cmsPreview=1`.
- **Autosave:** opção para salvar automaticamente a cada poucos segundos.

---

## Layout visual (sem HTML)

- Cada bloco tem **Layout** (padding, margin, maxWidth, gap, alinhamento, background, border, radius).
- **Quick layout** (botões no painel de propriedades): Centralizar, Full width, 2 colunas, 3 colunas, Espaço acima +, Espaço abaixo +.
- Campos Tailwind avançados continuam disponíveis para power-users.
- **Grid:** container em 1–4 colunas; os filhos são os blocos que você adiciona e reordena na lista.
- **Columns:** layout em 2–4 colunas com `columnContents` (cada coluna tem sua lista de blocos). No painel é possível alterar o número de colunas e o gap.

---

## Ajuda na UI

- **“?” Ajuda — Page Builder** no topo do painel esquerdo: explica como escolher página, adicionar bloco, arrastar, editar propriedades, salvar vs publicar e ver o preview.
- No **“+ Adicionar bloco”**, cada opção tem uma descrição em uma linha.
- Ao **selecionar um bloco**, à direita aparece **“O que esse bloco faz”** com texto explicativo.

---

## Blocos disponíveis

| Bloco            | Uso |
|------------------|-----|
| **Section**      | Título, subtítulo e texto rico (WYSIWYG). |
| **CTA**          | Texto + botão com link. |
| **Details Card** | Título, descrição, lista de itens, opção de metadados. |
| **Spacer**       | Espaço vertical (altura configurável). |
| **Grid**         | Container em 1–4 colunas; filhos na lista de blocos. |
| **Columns**      | Layout em 2–4 colunas com blocos por coluna. |
| **Product Gallery** | Galeria de imagens (páginas de produto). |
| **Buy Box**      | Card de compra (páginas de produto). |
| **Product Hero** | Cabeçalho do produto (título, orçar, preço). |

---

## Segurança

- `/admin` e APIs do CMS exigem login (cookie `cms_session`).
- Preview com `cmsPreview=1` só mostra rascunho em **dev** ou com sessão válida em produção.
- RichText gera HTML via TipTap; não é permitido inserir scripts (evitar XSS).

---

## Migração do banco

Schema usa **SQLite** (Prisma). Campos principais: `contentJson` (rascunho), `publishedContentJson` (publicado), `published`, `routeParamsExample` (JSON para rotas dinâmicas).

```powershell
cd storefront
npx prisma migrate dev
```

Para apenas aplicar migrações já existentes (ex.: produção):

```powershell
npx prisma migrate deploy
```

---

## APIs (autenticadas)

- `GET /api/cms/site-routes` — lista de rotas do site (fixas + dinâmicas) para o seletor do admin.
- `GET /api/cms/pages` — lista todas as páginas (requer cookie de sessão).
- `GET /api/cms/page?urlPath=/caminho` — retorna uma página pelo `urlPath` (inclui `publishedContentJson`, `routeParamsExample`).
- `POST /api/cms/pages` — criar/atualizar página (body: `urlPath`, `title?`, `contentJson?`, `content?`, `published?`, `routeParamsExample?`). Ao publicar (`published: true`), o corpo pode incluir `contentJson` para copiar para `publishedContentJson`.
- `DELETE /api/cms/pages?urlPath=/caminho` — remove a página.

---

## Variáveis de ambiente

| Variável              | Obrigatória | Descrição                          |
|-----------------------|------------|-------------------------------------|
| `CMS_ADMIN_EMAIL`     | Sim        | E-mail do admin                     |
| `CMS_ADMIN_PASSWORD`  | Sim        | Senha do admin                      |
| `CMS_SESSION_SECRET`  | Sim        | Chave para assinar o JWT da sessão  |
| `DATABASE_URL`        | Sim        | URL do SQLite, ex.: `file:./prisma/dev.db` |

Se `NEXT_PUBLIC_BUILDER_API_KEY` estiver definida, o site usa o Builder.io em vez do CMS interno para as rotas do catch-all.
