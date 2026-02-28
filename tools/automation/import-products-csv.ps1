param(
  [Parameter(Mandatory=$true)][string]$CsvPath,
  [string]$BackendUrl = "http://localhost:9000",
  [string]$ApiToken = "",
  [string]$Email = "",
  [string]$Password = "",
  [string]$RegionId = "",
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-Headers {
  param([string]$Token)
  $h = @{ "Content-Type"="application/json"; "Accept"="application/json" }
  if ($Token -and $Token.Trim()) { $h["x-medusa-access-token"] = $Token.Trim() }
  return $h
}

function Login-Jwt {
  param([string]$BaseUrl,[string]$Email,[string]$Password)
  if (!$Email -or !$Password) { return $null }
  $body = @{ email=$Email; password=$Password } | ConvertTo-Json
  $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/auth/token" -Body $body -ContentType "application/json"
  return $res.access_token
}

function Ensure-RegionId {
  param([string]$BaseUrl,[hashtable]$Headers,[string]$Preferred)
  if ($Preferred -and $Preferred.Trim()) { return $Preferred.Trim() }
  $r = Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/regions?limit=1" -Headers $Headers
  if ($r.regions -and $r.regions.Count -gt 0) { return $r.regions[0].id }
  throw "Nenhuma region encontrada. Informe -RegionId."
}

if (!(Test-Path $CsvPath)) { throw "CSV não encontrado: $CsvPath" }

$headers = New-Headers -Token $ApiToken

if ((!$ApiToken -or !$ApiToken.Trim()) -and $Email -and $Password) {
  $jwt = Login-Jwt -BaseUrl $BackendUrl -Email $Email -Password $Password
  if ($jwt) {
    $headers.Remove("x-medusa-access-token") | Out-Null
    $headers["Authorization"] = "Bearer $jwt"
  }
}

$regionId = Ensure-RegionId -BaseUrl $BackendUrl -Headers $headers -Preferred $RegionId

$rows = Import-Csv -Path $CsvPath
if (!$rows -or $rows.Count -eq 0) { throw "CSV vazio." }

function Slugify([string]$s) {
  return ($s.ToLower() -replace "[^a-z0-9]+","-" -replace "^-|-$","")
}

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
      Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products" -Headers $headers -Body ($payloadObj | ConvertTo-Json -Depth 20) | Out-Null
    }
    $created++
  }
  else {
    $payloadObj = @{
      title = $title
      description = ($row.description ?? "").Trim()
      thumbnail = $(if($thumb){$thumb}else{$null})
      metadata = $metadata
    }
    if ($DryRun) {
      Write-Host "[DRYRUN] update $handle ($productId)"
    } else {
      Invoke-RestMethod -Method Post -Uri "$BackendUrl/admin/products/$productId" -Headers $headers -Body ($payloadObj | ConvertTo-Json -Depth 20) | Out-Null
    }
    $updated++
  }
}

Write-Host "Import finalizado. created=$created updated=$updated skipped=$skipped regionId=$regionId"
