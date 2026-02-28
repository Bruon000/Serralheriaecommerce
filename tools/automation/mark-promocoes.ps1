param(
  [string]$BackendUrl = "http://localhost:9000",
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

function Get-AllProducts {
  param([string]$BaseUrl,$Session)
  $all = @(); $offset = 0
  do {
    $r = Admin-Get -BaseUrl $BaseUrl -Session $Session -Path "/admin/products?limit=50&offset=$offset"
    $batch = ($r.products ?? @())
    $all += $batch
    $offset += 50
  } while ($batch.Count -eq 50)
  return $all
}

function Get-MetadataValue {
  param($meta,[string]$key)
  if ($null -eq $meta) { return $null }
  $prop = $meta.PSObject.Properties | Where-Object { $_.Name -eq $key } | Select-Object -First 1
  if ($prop) { return $prop.Value }
  return $null
}

$jwt = Get-Jwt -BaseUrl $BackendUrl -Jwt $Jwt -Email $Email -Password $Password -AuthRoute $AuthRoute
$sess = New-Session -BaseUrl $BackendUrl -Jwt $jwt

$targets = @()

if ($Handles.Count -gt 0) {
  foreach ($h in $Handles) {
    $r = Admin-Get -BaseUrl $BackendUrl -Session $sess -Path "/admin/products?handle=$h&limit=1"
    if ($r.products -and $r.products.Count -gt 0) { $targets += $r.products[0] }
  }
} elseif ($Ipo) {
  $all = Get-AllProducts -BaseUrl $BackendUrl -Session $sess
  $targets = $all | Where-Object { (Get-MetadataValue $_.metadata "ipo") -eq $Ipo }
} else {
  throw "Informe -Ipo ou -Handles."
}

if ($ClearOthers) {
  $all = Get-AllProducts -BaseUrl $BackendUrl -Session $sess
  $others = $all | Where-Object { (Get-MetadataValue $_.metadata "promocao") -eq $Promocao }
  foreach ($p in $others) {
    $md = @{}
    if ($p.metadata) {
      foreach ($pr in $p.metadata.PSObject.Properties) {
        if ($pr.Name -ne "promocao") { $md[$pr.Name] = $pr.Value }
      }
    }
    if ($DryRun) {
      Write-Host "[DRYRUN] clear promocao $($p.handle)"
    } else {
      Admin-Post -BaseUrl $BackendUrl -Session $sess -Path "/admin/products/$($p.id)" -BodyObj @{ metadata=$md } | Out-Null
    }
  }
}

foreach ($p in $targets) {
  $md = @{}
  if ($p.metadata) {
    foreach ($pr in $p.metadata.PSObject.Properties) { $md[$pr.Name] = $pr.Value }
  }
  $md["promocao"] = $Promocao

  if ($DryRun) {
    Write-Host "[DRYRUN] set promocao=$Promocao -> $($p.handle)"
  } else {
    Admin-Post -BaseUrl $BackendUrl -Session $sess -Path "/admin/products/$($p.id)" -BodyObj @{ metadata=$md } | Out-Null
    Write-Host "OK -> $($p.handle)"
  }
}

Write-Host ("Promoção aplicada em " + (@($targets).Count) + " produto(s).")

