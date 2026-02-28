param(
  [string]$RepoRoot = (Get-Location).Path,
  [string]$Branch = "master"
)

Set-Location $RepoRoot

$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$gitHash = (git rev-parse --short HEAD 2>$null)
if (-not $gitHash) { $gitHash = "(sem commit ainda)" }

$dockerStatus = ""
try { $dockerStatus = (docker ps --format "{{.Names}} {{.Status}}" 2>$null) -join "`n" } catch { $dockerStatus = "(docker não disponível)" }

$stateBlock = @"
## Estado atual (atualizado automaticamente)
- Última atualização: $now
- Git commit: $gitHash
- Ports:
  - Frontend: http://localhost:3000
  - Admin Medusa: http://localhost:9000/app
  - Medusa API: http://localhost:9000

### Docker status
```text
$dockerStatus
```

"@

$checkPath = Join-Path $RepoRoot "CHECKLIST.md"
if (-not (Test-Path $checkPath)) { throw "CHECKLIST.md não encontrado." }

$check = Get-Content $checkPath -Raw
$pattern = "(?ms)^## Estado atual \(atualizado automaticamente\).*?(?=^## |\z)"
if ($check -match $pattern) {
  $check2 = [regex]::Replace($check, $pattern, $stateBlock)
} else {
  $check2 = $check.TrimEnd() + "`n`n" + $stateBlock
}
Set-Content -Encoding UTF8 $checkPath $check2

# Atualiza carimbo no CONTINUE_PROMPT.md (se existir)
$promptPath = Join-Path $RepoRoot "CONTINUE_PROMPT.md"
if (Test-Path $promptPath) {
  $prompt = Get-Content $promptPath -Raw
  $stampLine = "Última atualização automática: $now | commit: $gitHash"
  if ($prompt -notmatch "Última atualização automática:") {
    $prompt = $prompt.TrimEnd() + "`n`n---`n$stampLine`n"
  } else {
    $prompt = [regex]::Replace($prompt, "(?m)^Última atualização automática:.*$", $stampLine)
  }
  Set-Content -Encoding UTF8 $promptPath $prompt
}

git add CHECKLIST.md CONTINUE_PROMPT.md .\tools\update-project.ps1 2>$null
$changed = git status --porcelain
if ($changed) {
  git commit -m "chore: update project state ($now)"
  git push origin $Branch
  Write-Host "OK: checklist/prompt atualizados e enviados."
} else {
  Write-Host "Nada para commitar."
}

