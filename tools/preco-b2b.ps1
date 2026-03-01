param(
  [string]$BaseUrl = "",
  [string]$Email = "admin@serralheria.com",
  [string]$Password = "SenhaForte123!",
  [Parameter(Mandatory=$true)]
  [string]$Handle,
  [Parameter(Mandatory=$true)]
  [decimal]$PrecoB2B,
  [switch]$Clear
)

function Resolve-BaseUrl([string]$u) {
  $candidates = @()
  if ($u -and $u.Trim()) { $candidates += $u.Trim().TrimEnd("/") }
  $candidates += "http://localhost:9000"
  $candidates += "http://127.0.0.1:9000"
  $candidates = $candidates | Select-Object -Unique

  foreach ($c in $candidates) {
    try {
      Invoke-WebRequest -Method Get -Uri "$c/app" -TimeoutSec 2 -ErrorAction Stop | Out-Null
      return $c
    } catch { }
  }

  throw "Não consegui acessar o Medusa Admin. Confirme se o backend está rodando (backend: npm run dev)."
}

$BaseUrlResolved = Resolve-BaseUrl $BaseUrl
Write-Host "Login admin... (BaseUrl=$BaseUrlResolved)"

$body = @{ email=$Email; password=$Password } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri "$BaseUrlResolved/auth/user/emailpass" -ContentType "application/json" -Body $body -ErrorAction Stop
if (-not $resp.token) { throw "Login falhou (token vazio)" }

$headers = @{ Authorization = "Bearer $($resp.token)" }

$found = (Invoke-RestMethod -Method Get -Uri "$BaseUrlResolved/admin/products?handle=$Handle&limit=1" -Headers $headers -ErrorAction Stop).products
if (-not $found -or $found.Count -eq 0) { throw "Não encontrei produto com handle: $Handle" }

$p = $found[0]
$newMeta = @{}
if ($p.metadata) { $p.metadata.psobject.Properties | ForEach-Object { $newMeta[$_.Name] = $_.Value } }

if ($Clear) {
  if ($newMeta.ContainsKey("preco_b2b")) { $newMeta.Remove("preco_b2b") }
  Write-Host "Removendo preco_b2b de $Handle"
} else {
  $newMeta["preco_b2b"] = [double]$PrecoB2B
  Write-Host "Setando preco_b2b=$PrecoB2B em $Handle"
}

$patch = @{ metadata = $newMeta } | ConvertTo-Json -Depth 20
Invoke-RestMethod -Method Post -Uri "$BaseUrlResolved/admin/products/$($p.id)" -Headers $headers -ContentType "application/json" -Body $patch -ErrorAction Stop | Out-Null

Write-Host "OK: atualizado."
