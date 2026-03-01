param(
  [string]$BaseUrl = "http://localhost:9000",
  [string]$Email = "admin@serralheria.com",
  [string]$Password = "SenhaForte123!",
  [Parameter(Mandatory=$true)]
  [string[]]$Handles,
  [switch]$Clear
)

Write-Host "Login admin..."
$body = @{ email=$Email; password=$Password } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/user/emailpass" -ContentType "application/json" -Body $body
$headers = @{ Authorization = "Bearer $($resp.token)" }

foreach ($h in $Handles) {
  $handle = $h.Trim()
  if ([string]::IsNullOrWhiteSpace($handle)) { continue }

  $found = (Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/products?handle=$handle&limit=1" -Headers $headers).products
  if (-not $found -or $found.Count -eq 0) {
    Write-Warning "Não encontrei produto com handle: $handle"
    continue
  }

  $p = $found[0]
  $productId = $p.id

  $newMeta = @{}
  if ($p.metadata) {
    $p.metadata.psobject.Properties | ForEach-Object { $newMeta[$_.Name] = $_.Value }
  }

  if ($Clear) {
    if ($newMeta.ContainsKey("promocao")) { $newMeta.Remove("promocao") }
    Write-Host "Limpando promocao='semana' de $handle -> $productId"
  } else {
    $newMeta["promocao"] = "semana"
    Write-Host "Marcando promocao='semana' em $handle -> $productId"
  }

  $patch = @{ metadata = $newMeta } | ConvertTo-Json -Depth 20
  Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/products/$productId" -Headers $headers -ContentType "application/json" -Body $patch | Out-Null
}

Write-Host "OK: promoção da semana atualizada."
