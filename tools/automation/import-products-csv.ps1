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

function New-BaseHeaders {
  $h = @{ "Accept"="application/json" }
  return $h
}

function New-JsonHeaders {
  $h = New-BaseHeaders
  $h["Content-Type"]="application/json"
  return $h
}

function New-AuthContext {
  param([string]$BaseUrl,[string]$ApiToken,[string]$Email,[string]$Password)

  $ctx = [ordered]@{
    BaseUrl = $BaseUrl
    Headers = (New-JsonHeaders)
    WebSession = $null
  }

  if ($ApiToken -and $ApiToken.Trim()) {
    $ctx.Headers["x-medusa-access-token"] = $ApiToken.Trim()
    return $ctx
  }

  if ($Email -and $Password) {
    # 1) Tenta auth por sessão/cookie (mais compatível)
    try {
      $sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession
      $body = @{ email=$Email; password=$Password } | ConvertTo-Json
      Invoke-WebRequest -Method Post -Uri "$BaseUrl/admin/auth" -Body $body -Headers (New-JsonHeaders) -WebSession $sess | Out-Null
      $ctx.WebSession = $sess
      $ctx.Headers = (New-BaseHeaders) # sem Content-Type pra GETs
      return $ctx
    } catch {
      # 2) fallback: token endpoint
      try {
        $body = @{ email=$Email; password=$Password } | ConvertTo-Json
        $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/auth/user/emailpass" -Body $body -Headers (New-JsonHeaders)
        $jwt = $res.access_token
        if ($jwt) {
          $ctx.Headers["Authorization"] = "Bearer $jwt"
          return $ctx
        }
      } catch {}
      throw "Unauthorized (401). Verifique usuário/senha do admin ou gere um Admin API token."
    }
  }

  throw "Informe -ApiToken OU -Email/-Password."
}

function Invoke-Admin {
  param(
    [Parameter(Mandatory=$true)]$Ctx,
    [Parameter(Mandatory=$true)][ValidateSet("GET","POST")][string]$Method,
    [Parameter(Mandatory=$true)][string]$Path,
    $BodyObj = $null
  )

  $uri = "$($Ctx.BaseUrl)$Path"

  if ($Ctx.WebSession -ne $null) {
    if ($BodyObj -ne $null) {
      $json = $BodyObj | ConvertTo-Json -Depth 20
      return Invoke-RestMethod -Method $Method -Uri $uri -WebSession $Ctx.WebSession -Headers (New-JsonHeaders) -Body $json
    }
    return Invoke-RestMethod -Method $Method -Uri $uri -WebSession $Ctx.WebSession -Headers $Ctx.Headers
  } else {
    if ($BodyObj -ne $null) {
      $json = $BodyObj | ConvertTo-Json -Depth 20
      return Invoke-RestMethod -Method $Method -Uri $uri -Headers (New-JsonHeaders + $Ctx.Headers) -Body $json
    }
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Ctx.Headers
  }
}

function Ensure-RegionId {
  param($Ctx,[string]$Preferred)
  if ($Preferred -and $Preferred.Trim()) { return $Preferred.Trim() }
  $r = Invoke-Admin -Ctx $Ctx -Method GET -Path "/admin/regions?limit=1"
  if ($r.regions -and $r.regions.Count -gt 0) { return $r.regions[0].id }
  throw "Nenhuma region encontrada. Informe -RegionId."
}

function Slugify([string]$s) {
  return ($s.ToLower() -replace "[^a-z0-9]+","-" -replace "^-|-$","")
}

if (!(Test-Path $CsvPath)) { throw "CSV não encontrado: $CsvPath" }

$ctx = New-AuthContext -BaseUrl $BackendUrl -ApiToken $ApiToken -Email $Email -Password $Password
$regionId = Ensure-RegionId -Ctx $ctx -Preferred $RegionId

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

  $existing = Invoke-Admin -Ctx $ctx -Method GET -Path "/admin/products?handle=$handle&limit=1"
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
      Invoke-Admin -Ctx $ctx -Method POST -Path "/admin/products" -BodyObj $payloadObj | Out-Null
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
      Invoke-Admin -Ctx $ctx -Method POST -Path "/admin/products/$productId" -BodyObj $payloadObj | Out-Null
    }
    $updated++
  }
}

Write-Host "Import finalizado. created=$created updated=$updated skipped=$skipped regionId=$regionId"

