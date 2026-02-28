param(
  [string]$CsvPath = ".\produtos.csv",
  [string]$BaseUrl = "http://localhost:9000",
  [string]$Email = "admin@serralheria.com",
  [string]$Password = "SenhaForte123!"
)

function To-Handle([string]$s) {
  $h = $s.ToLower()
  $h = $h -replace '[áàãâä]', 'a'
  $h = $h -replace '[éèêë]', 'e'
  $h = $h -replace '[íìîï]', 'i'
  $h = $h -replace '[óòõôö]', 'o'
  $h = $h -replace '[úùûü]', 'u'
  $h = $h -replace 'ç', 'c'
  $h = $h -replace '[^a-z0-9]+', '-'
  $h = $h.Trim('-')
  return $h
}

Write-Host "Lendo CSV:" $CsvPath
$rows = Import-Csv $CsvPath

# login admin
$body = @{ email=$Email; password=$Password } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/user/emailpass" -ContentType "application/json" -Body $body
$headers = @{ Authorization = "Bearer $($resp.token)" }

# sales channel default
$scId = (Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/sales-channels?limit=50" -Headers $headers).sales_channels[0].id
Write-Host "Sales Channel:" $scId

foreach ($r in $rows) {
  $title = $r.title.Trim()
  if ([string]::IsNullOrWhiteSpace($title)) { continue }

  $handle = $r.handle
  if ([string]::IsNullOrWhiteSpace($handle)) { $handle = To-Handle $title }
  $tipo = ($r.tipo ?? "").Trim().ToLower()
  if ([string]::IsNullOrWhiteSpace($tipo)) { $tipo = "outros" }

  $priceBrl = [decimal]$r.price_brl
  $amount = [int]([math]::Round($priceBrl * 100))

  $desc = $r.description

  # find by handle
  $found = (Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/products?handle=$handle&limit=1" -Headers $headers).products
  if ($found -and $found.Count -gt 0) {
    $productId = $found[0].id
    Write-Host "Atualizando:" $handle "->" $productId

    # atualiza metadata.tipo (e descrição/título se quiser)
    $patch = @{
      title = $title
      description = $desc
      metadata = @{ tipo = $tipo }
    } | ConvertTo-Json -Depth 10

    Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/products/$productId" -Headers $headers -ContentType "application/json" -Body $patch | Out-Null
  }
  else {
    Write-Host "Criando:" $handle

    $productBody = @{
      title = $title
      status = "published"
      description = $desc
      handle = $handle
      metadata = @{ tipo = $tipo }
      options = @(@{ title = "Acabamento"; values = @("Pintado") })
      variants = @(
        @{
          title = "Padrão"
          options = @{ "Acabamento" = "Pintado" }
          prices = @(@{ currency_code = "brl"; amount = $amount })
        }
      )
    } | ConvertTo-Json -Depth 10

    $created = Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/products" -Headers $headers -ContentType "application/json" -Body $productBody
    $productId = $created.product.id
  }

  # link to sales channel (string!)
  $linkBody = @{ add = @("$productId"); remove = @() } | ConvertTo-Json -Depth 5
  Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/sales-channels/$scId/products" -Headers $headers -ContentType "application/json" -Body $linkBody | Out-Null

  Write-Host "OK:" $title "(tipo=$tipo, R$ $priceBrl)"
}

Write-Host "Import finalizado."
