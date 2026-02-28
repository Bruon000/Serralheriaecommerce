# CHECKLIST - Serralheria Ecommerce (Medusa + Next)

> **Regra:** sempre atualizar este arquivo com 	ools\update-project.ps1 quando for parar.

## Resumo do Projeto
Ecommerce de serralheria (portões, grades, corrimãos, estruturas metálicas).
Stack:
- **Backend:** Medusa (Admin em http://localhost:9000/app)
- **DB:** Postgres + Redis via Docker Compose
- **Frontend:** Next.js (http://localhost:3000)

## Como rodar (Windows / PowerShell)
1) Subir containers:
- docker compose up -d

2) Subir back+front:
- 
pm run dev

## Estado atual (atualizado automaticamente)
- Última atualização: 2026-02-28 13:52:54
- Git commit: 93869a0
- Ports:
  - Frontend: http://localhost:3000
  - Admin Medusa: http://localhost:9000/app
  - Medusa API: http://localhost:9000

### Docker status
`	ext
serralheria-pgadmin Up 3 hours
serralheria-postgres Up 3 hours (healthy)
medusa-postgres Up 4 hours
medusa-redis Up 4 hours
dolibarr Up 4 hours
mariadb Up 4 hours
frappe_docker-frontend-1 Up 4 hours
frappe_docker-backend-1 Up 4 hours
frappe_docker-websocket-1 Restarting (1) 56 seconds ago
frappe_docker-queue-long-1 Up 7 seconds
frappe_docker-scheduler-1 Up 4 hours
frappe_docker-queue-short-1 Up 7 seconds
`
## Funcionalidades prontas (MVP)
- [x] Backend Medusa rodando
- [x] Frontend Next rodando
- [x] Catálogo (/catalogo) com filtro por tipo ?tipo=portao|grade|corrimao|estrutura
- [x] Produto (/produto/[slug]) com add to cart + medidas/obs
- [x] Carrinho (/carrinho) persistente (localStorage)
- [x] Checkout via WhatsApp (gera mensagem)
- [x] Cadastro construtor B2B com CNPJ (/construtor/cadastro)
- [x] Regra B2B: só finaliza se cadastrado + mínimo 3 portões (por metadata.tipo = 'portao')
- [x] Home com seção Promoção da Semana (metadata.promocao='semana')

## Pontos de atenção / bugs conhecidos
- [ ] Script de criação de produtos via PowerShell: **NÃO usar $pid** (conflita com $PID do PowerShell)
- [ ] Produtos duplicados por handle em execuções antigas (limpar depois se quiser)

## Próximos passos (prioridade)
- [ ] Ajustar estética/UI (shadcn/ui ou MUI) — depois
- [ ] Importação em lote via CSV (tools/import-produtos.ps1)
- [ ] Tema automático por data (natal/junino/carnaval) sem deploy
- [ ] Subir pra produção (docker compose + nginx + SSL) quando fechar MVP


