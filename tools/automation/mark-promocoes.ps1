param(
  [string]$BackendUrl = "http://localhost:9000",
  [string]$ApiToken = "",
  [string]$Jwt = "",
  [string]$Email = "",
  [string]$Password = "",
  [string]$AuthRoute = "/auth/user/emailpass",
  [string]$Ipo = "",
  [string[]]$Handles = @(),
  [ValidateSet("semana")][string]$Promocao = "semana",
  [switch]$ClearOthers,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Headers-Json { @{ "Accept"="application/json"; "Content-Type"="application/json" } }

function New-AuthHeaders {
  param([string]$BaseUrl,[string]$ApiToken,[string]$Jwt,[string]$Email,[string]$Password,[string]$AuthRoute)

  if ($ApiToken -and $ApiToken.Trim()) {
    return @{ "Accept"="application/json"; "Authorization"="Basic $($ApiToken.Trim())" }
  }

  if ($Jwt -and $Jwt.Trim()) {
    return @{ "Accept"="application/json"; "Authorization"="Bearer $($Jwt.Trim())" }
  }

  if ($Email -and $Password) {
    $body = @{ email=$Email; password=$Password } | ConvertTo-Json
    $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl$AuthRoute" -Body $body -Headers (Headers-Json)
    $t = $res.token
    if (!$t) { throw "Login ok mas token vazio em $AuthRoute" }
    return @{ "Accept"="application/json"; "Authorization"="Bearer $t" }
  }

  throw "Informe -ApiToken OU -Jwt OU -Email/-Password."
}

function Get-AllProducts {
  param([string]$BaseUrl,[hashtable]$Headers)
  $all = @(); $offset = 0
  do {
    $r = Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/products?limit=50&offset=$offset" -Headers $Headers
    $batch = ($r.products ?? @())
    $all += $batch
    $offset += 50
  } while ($batch.Count -eq 50)
  return $all
}

$headers = New-AuthHeaders -BaseUrl $BackendUrl -ApiToken $ApiToken -Jwt $Jwt -Email $Email -Password $Password -AuthRoute $AuthRoute

$targets = @()
if ($Handles.Count -gt 0) {
  foreach ($h in $Handles) {
    $r = Invoke-RestMethod -Method Get -Uri "$BackendUrl/admin/products?handle=$h&limit=1" -Headers $headers
    if ($r.products -and $r.products.Count -gt 0) { $targets += $r.products[0] }
  }
} elseif ($Ipo) {
  $all = Get-AllProducts -BaseUrl $BackendUrl -Headers $headers
  $targets = $all | Where-Object { $_.metadata -and $_.metadata.ipo -eq $Ipo }
} else {
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
      Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products/$($p.id)" -Headers (Headers-Json + $headers) -Body (@{ metadata=$md } | ConvertTo-Json -Depth 20) | Out-Null
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
    Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products/$($p.id)" -Headers (Headers-Json + $headers) -Body (@{ metadata=$md } | ConvertTo-Json -Depth 20) | Out-Null
    Write-Host "OK -> $($p.handle)"
  }
}

Write-Host "Promoção aplicada em $($targets.Count) produto(s)."
