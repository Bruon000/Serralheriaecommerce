param(
  [string]$BaseUrl = "",
  [string]$Email = "admin@serralheria.com",
  [string]$Password = "SenhaForte123!",
  [Parameter(Mandatory=$true)]
  [string[]]$Handles,
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
      Invoke-RestMethod -Method Get -Uri "$c/store/regions?limit=1" -TimeoutSec 3 -ErrorAction Stop | Out-Null
      return $c
    } catch {
      try {
        Invoke-WebRequest -Method Get -Uri "$c/admin/products?limit=1" -TimeoutSec 3 -ErrorAction Stop | Out-Null
        return $c
      } catch { }
    }
  }

  throw "Não consegui acessar o Medusa (Admin/Store). Suba o backend e confirme a URL/porta (ex: http://localhost:9000)."
}

$BaseUrlResolved = Resolve-BaseUrl $BaseUrl
Write-Host "Login admin... (BaseUrl=$BaseUrlResolved)"

$body = @{ email=$Email; password=$Password } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri "$BaseUrlResolved/auth/user/emailpass" -ContentType "application/json" -Body $body -ErrorAction Stop

if (-not $resp.token) { throw "Falha no login admin: token vazio." }
$headers = @{ Authorization = "Bearer $($resp.token)" }

foreach ($h in $Handles) {
  $handle = $h.Trim()
  if ([string]::IsNullOrWhiteSpace($handle)) { continue }

  $found = (Invoke-RestMethod -Method Get -Uri "$BaseUrlResolved/admin/products?handle=$handle&limit=1" -Headers $headers -ErrorAction Stop).products
  if (-not $found -or $found.Count -eq 0) {
    Write-Warning "Não encontrei produto com handle: $handle"
    continue
  }

  $p = $found[0]
  $productId = $p.id

  $newMeta = @{}
  if ($p.metadata) { $p.metadata.psobject.Properties | ForEach-Object { $newMeta[$_.Name] = $_.Value } }

  if ($Clear) {
    if ($newMeta.ContainsKey("oferta")) { $newMeta.Remove("oferta") }
    Write-Host "Removendo oferta='construtor' de $handle -> $productId"
  } else {
    $newMeta["oferta"] = "construtor"
    Write-Host "Marcando oferta='construtor' em $handle -> $productId"
  }

  $patch = @{ metadata = $newMeta } | ConvertTo-Json -Depth 20
  Invoke-RestMethod -Method Post -Uri "$BaseUrlResolved/admin/products/$productId" -Headers $headers -ContentType "application/json" -Body $patch -ErrorAction Stop | Out-Null
}

Write-Host "OK: ofertas para construtor atualizadas."
