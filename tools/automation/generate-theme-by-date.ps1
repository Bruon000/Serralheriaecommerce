param(
  [string]$OutPath = "storefront\src\theme\theme.generated.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ThemeForDate([datetime]$d) {
  if ($d.Month -eq 12) { return @{ key="natal"; title="Natal"; badge="🎄"; } }
  if ($d.Month -eq 11 -and $d.Day -ge 22) { return @{ key="black_friday"; title="Black Friday"; badge="🛒"; } }
  if ($d.Month -eq 2 -or $d.Month -eq 3) { return @{ key="carnaval"; title="Carnaval"; badge="🎭"; } }
  return @{ key="padrao"; title="Serralheria"; badge="🛠️"; }
}

$today = Get-Date
$theme = Get-ThemeForDate $today

$obj = @{
  generated_at = $today.ToString("o")
  theme = $theme
}

New-Item -ItemType Directory -Force -Path (Split-Path $OutPath -Parent) | Out-Null
($obj | ConvertTo-Json -Depth 10) | Set-Content -Encoding UTF8 -Path $OutPath

Write-Host "Tema gerado: $($theme.key) -> $OutPath"
