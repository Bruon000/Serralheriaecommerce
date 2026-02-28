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

function New-BaseHeaders { @{ "Accept"="application/json" } }
function New-JsonHeaders { @{ "Accept"="application/json"; "Content-Type"="application/json" } }

function New-AuthContext {
  param([string]$BaseUrl,[string]$ApiToken,[string]$Email,[string]$Password)

  $ctx = [ordered]@{ BaseUrl=$BaseUrl; Headers=(New-JsonHeaders); WebSession=$null }

  if ($ApiToken -and $ApiToken.Trim()) {
    $ctx.Headers["x-medusa-access-token"] = $ApiToken.Trim()
    return $ctx
  }

  if ($Email -and $Password) {
    try {
      $sess = New-Object Microsoft.PowerShell.Commands.WebRequestSession
      $body = @{ email=$Email; password=$Password } | ConvertTo-Json
      Invoke-WebRequest -Method Post -Uri "$BaseUrl/admin/auth" -Body $body -Headers (New-JsonHeaders) -WebSession $sess | Out-Null
      $ctx.WebSession = $sess
      $ctx.Headers = (New-BaseHeaders)
      return $ctx
    } catch {
      try {
        $body = @{ email=$Email; password=$Password } | ConvertTo-Json
        $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/auth/token" -Body $body -Headers (New-JsonHeaders)
        $jwt = $res.access_token
        if ($jwt) { $ctx.Headers["Authorization"]="Bearer $jwt"; return $ctx }
      } catch {}
      throw "Unauthorized (401). Verifique usuário/senha do admin ou gere um Admin API token."
    }
  }

  throw "Informe -ApiToken OU -Email/-Password."
}

function Invoke-Admin {
  param($Ctx,[ValidateSet("GET","POST")][string]$Method,[string]$Path,$BodyObj=$null)
  $uri = "$($Ctx.BaseUrl)$Path"
  if ($Ctx.WebSession) {
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

function Get-AllProducts {
  param($Ctx)
  $all = @(); $offset = 0
  do {
    $r = Invoke-Admin -Ctx $Ctx -Method GET -Path "/admin/products?limit=50&offset=$offset"
    $batch = ($r.products ?? @())
    $all += $batch
    $offset += 50
  } while ($batch.Count -eq 50)
  return $all
}

$ctx = New-AuthContext -BaseUrl $BackendUrl -ApiToken $ApiToken -Email $Email -Password $Password

$targets = @()
if ($Handles.Count -gt 0) {
  foreach ($h in $Handles) {
    $r = Invoke-Admin -Ctx $ctx -Method GET -Path "/admin/products?handle=$h&limit=1"
    if ($r.products -and $r.products.Count -gt 0) { $targets += $r.products[0] }
  }
} elseif ($Ipo) {
  $all = Get-AllProducts -Ctx $ctx
  $targets = $all | Where-Object { $_.metadata -and $_.metadata.ipo -eq $Ipo }
} else {
  throw "Informe -Ipo ou -Handles."
}

if ($ClearOthers) {
  $all = Get-AllProducts -Ctx $ctx
  $others = $all | Where-Object { $_.metadata -and $_.metadata.promocao -eq $Promocao }
  foreach ($p in $others) {
    $md = @{}
    foreach ($k in ($p.metadata.PSObject.Properties.Name)) {
      if ($k -ne "promocao") { $md[$k] = $p.metadata.$k }
    }
    if ($DryRun) {
      Write-Host "[DRYRUN] clear promocao $($p.handle)"
    } else {
      Invoke-Admin -Ctx $ctx -Method POST -Path "/admin/products/$($p.id)" -BodyObj @{ metadata=$md } | Out-Null
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
    Invoke-Admin -Ctx $ctx -Method POST -Path "/admin/products/$($p.id)" -BodyObj @{ metadata=$md } | Out-Null
    Write-Host "OK -> $($p.handle)"
  }
}

Write-Host "Promoção aplicada em $($targets.Count) produto(s)."
