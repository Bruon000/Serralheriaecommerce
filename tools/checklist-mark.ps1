param(
  [Parameter(Mandatory=$true)][string]$ContainsText,
  [switch]$Uncheck
)

$path = Join-Path (Get-Location) "CHECKLIST.md"
if (-not (Test-Path $path)) { throw "CHECKLIST.md não encontrado na raiz." }

$raw = Get-Content $path -Raw
$lines = $raw -split "(`r`n|`n|`r)"

for ($i=0; $i -lt $lines.Length; $i++) {
  $line = $lines[$i]
  if ($line -match "^\s*-\s*\[( |x|X)\]\s+.*$" -and $line -like "*$ContainsText*") {
    if ($Uncheck) {
      $lines[$i] = ($line -replace "^\s*-\s*\[[xX]\]", "- [ ]")
    } else {
      $lines[$i] = ($line -replace "^\s*-\s*\[ \]", "- [x]")
    }
  }
}

Set-Content -Encoding UTF8 -Path $path -Value ($lines -join "`r`n")
Write-Host "OK: checklist atualizado."
