# CONTINUE_PROMPT (cole isso numa nova conversa)

Você é minha IA assistente de dev. Continue o projeto **Serralheria Ecommerce** seguindo estas regras.

## Antes de começar (obrigatório)
1. Leia **AGENTS.md** na raiz do repositório (diz como a IA deve trabalhar e onde atualizar o estado).
2. Leia **CHECKLIST.md** (o que está feito `[x]` e o que falta `[ ]`).
3. Use a seção **"Onde paramos / próximo passo"** abaixo para continuar de onde parou.

## Regras de operação
- **Tudo via PowerShell (Windows)**. Evitar instruções de “editar manualmente”.
- **OBRIGATÓRIO — Atualizar o checklist:** você (a IA) **deve** editar o **CHECKLIST.md** ao concluir itens: troque `- [ ]` por `- [x]`. O usuário não marca; quem atualiza é sempre a IA.
- **Ao parar ou concluir uma etapa:** atualize a seção **"Onde paramos / próximo passo"** abaixo. Opcional: rodar `.\tools\update-project.ps1` para atualizar data/commit e fazer commit.
- Não usar $pid em scripts (conflita com $PID do PowerShell).

## Contexto do projeto
- Backend: **Medusa** (Admin: http://localhost:9000/app)
- Frontend: **Next.js** (http://localhost:3000)
- Docker: Postgres + Redis (docker compose up -d)
- Start: `npm run dev` (roda backend + storefront)

## Funcionalidades já implementadas
- Catálogo em /catalogo com filtro por 	ipo
- Página de produto /produto/[slug] com formulário (qtd, largura, altura, cor, observações) + AddToCart
- Carrinho /carrinho persistente com localStorage + Finalizar no WhatsApp
- Cadastro Construtor (B2B) /construtor/cadastro com validação de CNPJ
- Regra B2B: só libera WhatsApp se cadastrado + mínimo 3 portões (metadata.tipo='portao')
- Home com Promoção da Semana (metadata.promocao='semana')

## Onde paramos / próximo passo
1) CHECKLIST foi reconstruído e está leve no GitHub (sem estourar limite).
2) B2B real funcionando: /construtor/cadastro/login/status com aprovação via tools\b2b-approve.ps1 e consumo via proxy Next /api/b2b (sem CORS).
3) Preço B2B diferente: metadata.preco_b2b + tools\preco-b2b.ps1; Home mostra preço normal e produto mostra preço B2B quando construtor_cadastrado_v1=1 (PriceBlock).
4) Próximo: Exibir preços no carrinho (normal vs B2B) e melhorar mensagem do WhatsApp com total.

## Fonte da verdade
CHECKLIST.md = lista de tarefas. AGENTS.md = como a IA deve trabalhar e onde atualizar.

---
Última atualização automática: 2026-03-01 | commit: 813601e












































