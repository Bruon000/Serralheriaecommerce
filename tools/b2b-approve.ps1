param(
  [string]$BaseUrl = "http://localhost:9000",
  [string]$Email = "admin@serralheria.com",
  [string]$Password = "SenhaForte123!",
  [Parameter(Mandatory=$true)][string]$Doc,
  [ValidateSet("aprovado","rejeitado","pendente")][string]$Status = "aprovado"
)

$body = @{ email=$Email; password=$Password } | ConvertTo-Json
$resp = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/user/emailpass" -ContentType "application/json" -Body $body -ErrorAction Stop
if (-not $resp.token) { throw "Login falhou (token vazio)" }

$headers = @{ Authorization = "Bearer $($resp.token)" }
Invoke-RestMethod -Method Post -Uri "$BaseUrl/admin/custom/b2b" -Headers $headers -ContentType "application/json" `
  -Body (@{ doc=$Doc; status=$Status } | ConvertTo-Json) -ErrorAction Stop
