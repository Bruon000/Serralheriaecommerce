param(
  [Parameter(Mandatory=$true)][string]$CsvPath,
  [string]$BackendUrl = "http://localhost:9000",
  [string]$ApiToken = "",
  [string]$Jwt = "",
  [string]$Email = "",
  [string]$Password = "",
  [string]$AuthRoute = "/auth/user/emailpass",
  [string]$RegionId = "",
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

function Ensure-RegionId {
  param([string]$BaseUrl,[hashtable]$Headers,[string]$Preferred)
  if ($Preferred -and $Preferred.Trim()) { return $Preferred.Trim() }
  $r = Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/regions?limit=1" -Headers $Headers
  if ($r.regions -and $r.regions.Count -gt 0) { return $r.regions[0].id }
  throw "Nenhuma region encontrada. Informe -RegionId."
}

function Slugify([string]$s) { return ($s.ToLower() -replace "[^a-z0-9]+","-" -replace "^-|-$","") }

if (!(Test-Path $CsvPath)) { throw "CSV não encontrado: $CsvPath" }

$headers = New-AuthHeaders -BaseUrl $BackendUrl -ApiToken $ApiToken -Jwt $Jwt -Email $Email -Password $Password -AuthRoute $AuthRoute
$regionId = Ensure-RegionId -BaseUrl $BackendUrl -Headers $headers -Preferred $RegionId

$rows = Import-Csv -Path $CsvPath
if (!$rows -or $rows.Count -eq 0) { throw "CSV vazio." }

$created = 0; $updated = 0; $skipped = 0

foreach ($row in $rows) {
  $title = ($row.title ?? "").Trim()
  if (!$title) { $skipped++; continue }

  $handle = ($row.handle ?? "").Trim()
  if (!$handle) { $handle = Slugify $title }

  $price = [int]([decimal](($row.price_brl ?? "0").ToString()) * 100)

  $metadata = @{}
  $ipo = ($row.ipo ?? "").Trim()
  $tipo = ($row.tipo ?? "").Trim()
  if ($ipo) { $metadata.ipo = $ipo }
  if ($tipo) { $metadata.tipo = $tipo }
  $promo = ($row.promocao ?? "").Trim()
  if ($promo) { $metadata.promocao = $promo }

  $thumb = ($row.thumbnail ?? "").Trim()

  $existing = Invoke-RestMethod -Method Get -Uri "$BackendUrl/admin/products?handle=$handle&limit=1" -Headers $headers
  $productId = $null
  if ($existing.products -and $existing.products.Count -gt 0) { $productId = $existing.products[0].id }

  if (-not $productId) {
    $payloadObj = @{
      title = $title
      handle = $handle
      description = ($row.description ?? "").Trim()
      status = "published"
      thumbnail = $(if($thumb){$thumb}else{$null})
      metadata = $metadata
      options = @(@{ title = "Padrão" })
      variants = @(
        @{
          title = "Padrão"
          prices = @(@{ amount = $price; currency_code = "brl"; region_id = $regionId })
          manage_inventory = $false
          inventory_quantity = 0
          options = @(@{ value = "Padrão" })
        }
      )
    }

    if ($DryRun) {
      Write-Host "[DRYRUN] create $handle ($title) R$ $($price/100)"
    } else {
      Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products" -Headers (Headers-Json + $headers) -Body ($payloadObj | ConvertTo-Json -Depth 20) | Out-Null
    }
    $created++
  } else {
    $payloadObj = @{
      title = $title
      description = ($row.description ?? "").Trim()
      thumbnail = $(if($thumb){$thumb}else{$null})
      metadata = $metadata
    }

    if ($DryRun) {
      Write-Host "[DRYRUN] update $handle ($productId)"
    } else {
      Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products/$productId" -Headers (Headers-Json + $headers) -Body ($payloadObj | ConvertTo-Json -Depth 20) | Out-Null
    }
    $updated++
  }
}

Write-Host "Import finalizado. created=$created updated=$updated skipped=$skipped regionId=$regionId"
