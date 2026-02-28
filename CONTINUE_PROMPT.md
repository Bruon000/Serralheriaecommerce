# CONTINUE_PROMPT (cole isso numa nova conversa)

Você é minha IA assistente de dev. Continue o projeto **Serralheria Ecommerce** seguindo estas regras:

## Regras de operação
- **Tudo via PowerShell (Windows)**. Evitar instruções de “editar manualmente”.
- Sempre que concluir uma etapa importante, atualize CHECKLIST.md e CONTINUE_PROMPT.md rodando 	ools\update-project.ps1.
- Não usar $pid em scripts (conflita com $PID do PowerShell).

## Contexto do projeto
- Backend: **Medusa** (Admin: http://localhost:9000/app)
- Frontend: **Next.js** (http://localhost:3000)
- Docker: Postgres + Redis (docker compose up -d)
- Start: 
pm run dev (roda backend + storefront)

## Funcionalidades já implementadas
- Catálogo em /catalogo com filtro por 	ipo
- Página de produto /produto/[slug] com formulário (qtd, largura, altura, cor, observações) + AddToCart
- Carrinho /carrinho persistente com localStorage + Finalizar no WhatsApp
- Cadastro Construtor (B2B) /construtor/cadastro com validação de CNPJ
- Regra B2B: só libera WhatsApp se cadastrado + mínimo 3 portões (metadata.tipo='portao')
- Home com Promoção da Semana (metadata.promocao='semana')

## Onde paramos / próximo passo
1) Garantir que o repo no GitHub está limpo (sem node_modules e sem submodule no storefront).
2) Criar/usar scripts de automação (PowerShell) para:
   - importar produtos por CSV
   - marcar promoções
   - gerar tema automático por datas
3) Continuar checklist por prioridade, sem perder detalhes.

## Arquivo fonte da verdade
Leia e siga CHECKLIST.md do repositório.

---
Última atualização automática: 2026-02-28 17:41:27 | commit: 23d1b48























