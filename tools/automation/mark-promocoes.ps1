param(
  [string]$BackendUrl = "http://localhost:9000",
  [string]$ApiToken = "",
  [string]$Email = "",
  [string]$Password = "",
  [string]$Ipo = "",
  [string[]]$Handles = @(),
  [ValidateSet("semana")][string]$Promocao = "semana",
  [switch]$ClearOthers,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Headers {
  param([string]$Token,[string]$BaseUrl,[string]$Email,[string]$Password)
  $h = @{ "Content-Type"="application/json"; "Accept"="application/json" }
  if ($Token -and $Token.Trim()) { $h["x-medusa-access-token"] = $Token.Trim(); return $h }
  if ($Email -and $Password) {
    $body = @{ email=$Email; password=$Password } | ConvertTo-Json
    $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/auth/token" -Body $body -ContentType "application/json"
    $h["Authorization"] = "Bearer $($res.access_token)"
  }
  return $h
}

$headers = Get-Headers -Token $ApiToken -BaseUrl $BackendUrl -Email $Email -Password $Password

function Get-AllProducts {
  param([string]$BaseUrl,[hashtable]$Headers)
  $all = @()
  $offset = 0
  do {
    $r = Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/products?limit=50&offset=$offset" -Headers $Headers
    $batch = ($r.products ?? @())
    $all += $batch
    $offset += 50
  } while ($batch.Count -eq 50)
  return $all
}

$targets = @()

if ($Handles.Count -gt 0) {
  foreach ($h in $Handles) {
    $r = Invoke-RestMethod -Method Get -Uri "$BackendUrl/admin/products?handle=$h&limit=1" -Headers $headers
    if ($r.products -and $r.products.Count -gt 0) { $targets += $r.products[0] }
  }
}
elseif ($Ipo) {
  $all = Get-AllProducts -BaseUrl $BackendUrl -Headers $headers
  $targets = $all | Where-Object { $_.metadata -and $_.metadata.ipo -eq $Ipo }
}
else {
  throw "Informe -Ipo ou -Handles."
}

if ($ClearOthers) {
  $all = Get-AllProducts -BaseUrl $BackendUrl -Headers $headers
  $others = $all | Where-Object { $_.metadata -and $_.metadata.promocao -eq $Promocao }
  foreach ($p in $others) {
    $md = @{}
    foreach ($k in ($p.metadata.PSObject.Properties.Name)) {
      if ($k -ne "promocao") { $md[$k] = $p.metadata.$k }
    }
    if ($DryRun) {
      Write-Host "[DRYRUN] clear promocao $($p.handle)"
    } else {
      Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products/$($p.id)" -Headers $headers -Body (@{ metadata=$md } | ConvertTo-Json -Depth 20) | Out-Null
    }
  }
}

foreach ($p in $targets) {
  $md = @{}
  if ($p.metadata) {
    foreach ($k in ($p.metadata.PSObject.Properties.Name)) { $md[$k] = $p.metadata.$k }
  }
  $md["promocao"] = $Promocao

  if ($DryRun) {
    Write-Host "[DRYRUN] set promocao=$Promocao -> $($p.handle)"
  } else {
    Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products/$($p.id)" -Headers $headers -Body (@{ metadata=$md } | ConvertTo-Json -Depth 20) | Out-Null
    Write-Host "OK -> $($p.handle)"
  }
}

Write-Host "Promoção aplicada em $($targets.Count) produto(s)."
