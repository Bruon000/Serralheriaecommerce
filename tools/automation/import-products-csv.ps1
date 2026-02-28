param(
  [Parameter(Mandatory=$true)][string]$CsvPath,
  [string]$BackendUrl = "http://localhost:9000",
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
function Headers-Accept { @{ "Accept"="application/json" } }

function Get-Jwt {
  param([string]$BaseUrl,[string]$Jwt,[string]$Email,[string]$Password,[string]$AuthRoute)
  if ($Jwt -and $Jwt.Trim()) { return $Jwt.Trim() }
  if ($Email -and $Password) {
    $body = @{ email=$Email; password=$Password } | ConvertTo-Json
    $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl$AuthRoute" -Body $body -ContentType "application/json"
    if ($res.token) { return $res.token }
    throw "Login respondeu sem token em $AuthRoute"
  }
  throw "Informe -Jwt OU -Email/-Password"
}

function New-Session {
  param([string]$BaseUrl,[string]$Jwt)
  $sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  # troca Bearer por cookie de sessão
  Invoke-WebRequest -Method Post -Uri "$BaseUrl/auth/session" -Headers @{
    "Accept"="application/json"
    "Authorization"="Bearer $Jwt"
  } -WebSession $sess | Out-Null

  return $sess
}

function Admin-Get {
  param([string]$BaseUrl,$Session,[string]$Path)
  return Invoke-RestMethod -Method Get -Uri "$BaseUrl$Path" -WebSession $Session -Headers (Headers-Accept)
}

function Admin-Post {
  param([string]$BaseUrl,$Session,[string]$Path,$BodyObj)
  $json = $BodyObj | ConvertTo-Json -Depth 20
  return Invoke-RestMethod -Method Post -Uri "$BaseUrl$Path" -WebSession $Session -Headers (Headers-Json) -Body $json
}

function Ensure-RegionId {
  param([string]$BaseUrl,$Session,[string]$Preferred)
  if ($Preferred -and $Preferred.Trim()) { return $Preferred.Trim() }
  $r = Admin-Get -BaseUrl $BaseUrl -Session $Session -Path "/admin/regions?limit=1"
  if ($r.regions -and $r.regions.Count -gt 0) { return $r.regions[0].id }
  throw "Nenhuma region encontrada. Informe -RegionId."
}

function Slugify([string]$s) { return ($s.ToLower() -replace "[^a-z0-9]+","-" -replace "^-|-$","") }

if (!(Test-Path $CsvPath)) { throw "CSV não encontrado: $CsvPath" }

$jwt = Get-Jwt -BaseUrl $BackendUrl -Jwt $Jwt -Email $Email -Password $Password -AuthRoute $AuthRoute
$sess = New-Session -BaseUrl $BackendUrl -Jwt $jwt

$regionId = Ensure-RegionId -BaseUrl $BackendUrl -Session $sess -Preferred $RegionId

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

  $existing = Admin-Get -BaseUrl $BackendUrl -Session $sess -Path "/admin/products?handle=$handle&limit=1"
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
      Admin-Post -BaseUrl $BackendUrl -Session $sess -Path "/admin/products" -BodyObj $payloadObj | Out-Null
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
      Admin-Post -BaseUrl $BackendUrl -Session $sess -Path "/admin/products/$productId" -BodyObj $payloadObj | Out-Null
    }
    $updated++
  }
}

Write-Host "Import finalizado. created=$created updated=$updated skipped=$skipped regionId=$regionId"
