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
1) Cadastro/Login B2B real implementado (pendente/aprovado/rejeitado) via rotas custom do Medusa: /store/custom/b2b (com x-publishable-api-key) e aprovação via /admin/custom/b2b.
2) Storefront: /construtor/cadastro, /construtor/login, /construtor/status consumindo a API e setando construtor_cadastrado_v1 apenas quando aprovado.
3) Próximo: implementar preço B2B diferente quando aprovado.

## Fonte da verdade
CHECKLIST.md = lista de tarefas. AGENTS.md = como a IA deve trabalhar e onde atualizar.

---
Última atualização automática: 2026-03-01 13:11:01 | commit: 4955024









































