param(
  [string]$RepoRoot,
  [string]$Branch
)

# Defaults forçados
if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  if ($PSScriptRoot) { $RepoRoot = Split-Path -Parent $PSScriptRoot }
  else { $RepoRoot = (Get-Location).Path }
}
Set-Location $RepoRoot

# Branch auto
if ([string]::IsNullOrWhiteSpace($Branch)) {
  try { $Branch = (git rev-parse --abbrev-ref HEAD 2>$null) } catch { }
  if ([string]::IsNullOrWhiteSpace($Branch)) { $Branch = "master" }
}

# CHECKLIST.md (regrava sempre)
$checklistLines = @(
  '# CHECKLIST - Serralheria Ecommerce (Medusa + Next)',
  '',
  '> **Regra:** sempre que for parar, rodar: `pwsh -NoProfile -ExecutionPolicy Bypass -File .\tools\stop.ps1`',
  '',
  '## Resumo do Projeto',
  'Ecommerce de serralheria (portões, grades, corrimãos, estruturas metálicas).',
  '',
  'Stack:',
  '- **Backend:** Medusa (Admin: http://localhost:9000/app)',
  '- **DB:** Postgres + Redis via Docker Compose',
  '- **Frontend:** Next.js (http://localhost:3000)',
  '',
  '## Como rodar (Windows / PowerShell)',
  '1) Subir containers:',
  '- `docker compose up -d`',
  '',
  '2) Subir back+front:',
  '- `npm run dev`',
  '',
  '## Estado atual (atualizado automaticamente)',
  '- Última atualização: (rodar tools/update-project.ps1)',
  '- Git commit: (auto)',
  '- Ports:',
  '  - Frontend: http://localhost:3000',
  '  - Admin Medusa: http://localhost:9000/app',
  '  - Medusa API: http://localhost:9000',
  '',
  '### Docker status',
  '```text',
  '(rodar tools/update-project.ps1)',
  '```',
  '',
  '## Checklist do projeto (ordem ideal)',
  '',
  '### Fase 0 — Preparação',
  '- [ ] Instalar Node.js LTS (inclui npm)',
  '- [ ] Instalar Git',
  '- [ ] (Opcional) Instalar Docker Desktop (se quiser rodar Postgres/Redis local sem dor)',
  '',
  '### Fase 1 — Base rodando local (MVP)',
  '- [ ] Subir Medusa backend (API + Admin)',
  '- [ ] Subir PostgreSQL + Redis (local)',
  '- [ ] Subir Next.js Storefront conectado no Medusa',
  '- [ ] Configurar categorias iniciais: Portões / Grades / Corrimãos / Estruturas / Sob medida',
  '- [ ] Criar 5 produtos "mock" pra validar fluxo (foto, preço, variações)',
  '',
  '### Fase 2 — Catálogo + Carrinho + Checkout (WhatsApp)',
  '- [ ] Listagem com filtros (categoria, acabamento, faixa preço)',
  '- [ ] Página produto com variações (cor/material/medidas como opções)',
  '- [ ] Carrinho funcionando',
  '- [ ] Botão Finalizar no WhatsApp:',
  '  - [ ] gerar mensagem com itens, quantidades, variações e total estimado',
  '  - [ ] número do vendedor configurável (varejo e B2B)',
  '',
  '### Fase 3 — Promoções e Ofertas',
  '- [ ] "Promoção da semana" (coleção/tag + banner automático)',
  '- [ ] "Ofertas para construtores" (área B2B)',
  '- [ ] Regras de desconto progressivo (opcional)',
  '',
  '### Fase 4 — B2B (Construtor)',
  '- [ ] Cadastro/Login',
  '- [ ] Status "pendente" → "aprovado"',
  '- [ ] Preço B2B diferente',
  '- [ ] Regra: mínimo 3 portões (bloqueia finalizar se não cumprir)',
  '- [ ] Pedido vai pro WhatsApp do vendedor B2B',
  '',
  '### Fase 5 — Temas sazonais automáticos',
  '- [ ] themes.json com calendário (Natal/Junino/Carnaval/Ano Novo...)',
  '- [ ] Aplicação automática por data (CSS variables + banner + detalhes leves)',
  '- [ ] Fallback tema padrão',
  '',
  '### Fase 6 — Deploy no VPS',
  '- [ ] Docker Compose no VPS',
  '- [ ] Nginx + SSL',
  '- [ ] Subdomínios e DNS (quando você decidir)'
)

$checkPath = Join-Path $RepoRoot "CHECKLIST.md"
Set-Content -Encoding UTF8 -Path $checkPath -Value ($checklistLines -join "`r`n")
git add $checkPath 2>$null
git add (Join-Path $RepoRoot "tools\stop.ps1") 2>$null

$up = Join-Path $RepoRoot "tools\update-project.ps1"
if (-not (Test-Path $up)) { throw "tools\update-project.ps1 não encontrado." }
& $up -RepoRoot $RepoRoot -Branch $Branch

Write-Host "OK: stop concluído (checklist garantido + update/push)."
