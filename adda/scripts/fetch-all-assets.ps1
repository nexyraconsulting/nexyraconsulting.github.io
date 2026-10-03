# Crawls every page of https://adda-slough.org (including nested past-event pages not in the menu),
# collects every image/video on media.adda-slough.org, and saves them under assets\ using the same paths.
# Run from the website folder:  powershell -ExecutionPolicy Bypass -File scripts\fetch-all-assets.ps1
$ErrorActionPreference = 'Continue'
Set-Location (Join-Path $PSScriptRoot '..')
$Site = 'https://adda-slough.org'
$Media = 'https://media.adda-slough.org/public/'
$queue = New-Object System.Collections.Generic.Queue[string]
@('/', '/about-us', '/events', '/charities', '/media', '/media/print', '/media/digital', '/contact-us', '/sign-in', '/dp-2026-reg',
  '/terms-and-conditions', '/privacy-policy', '/events/festivals', '/events/cultural-and-other', '/events/sports-and-leisure') | ForEach-Object { $queue.Enqueue($_) }
$seen = New-Object System.Collections.Generic.HashSet[string]
$files = New-Object System.Collections.Generic.HashSet[string]
while ($queue.Count -gt 0) {
  $p = $queue.Dequeue()
  if (-not $seen.Add($p)) { continue }
  Write-Host "Page  $p"
  try { $html = (Invoke-WebRequest -UseBasicParsing -UserAgent 'Mozilla/5.0' -Uri ($Site + $p)).Content } catch { continue }
  $html = [System.Uri]::UnescapeDataString(($html -replace '\\u0026', '&' -replace '\\/', '/'))
  foreach ($m in [regex]::Matches($html, 'media\.adda-slough\.org/public/([^"''<>?&\\ )]+)')) { [void]$files.Add($m.Groups[1].Value) }
  foreach ($m in [regex]::Matches($html, 'href="(?:https://adda-slough\.org)?(/[^"#?]*)"')) {
    $l = $m.Groups[1].Value.TrimEnd('/'); if ($l -eq '') { $l = '/' }
    if ($l -match '^/(_next|api|images)/' -or $l -match '\.(png|jpe?g|svg|ico|css|js|xml|txt|pdf)$') { continue }
    if (-not $seen.Contains($l)) { $queue.Enqueue($l) }
  }
}
$saved = 0; $failed = 0
foreach ($f in ($files | Sort-Object)) {
  $dest = Join-Path 'assets' $f
  if ((Test-Path $dest) -and ((Get-Item $dest).Length -gt 0)) { continue }
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  try { Invoke-WebRequest -UseBasicParsing -UserAgent 'Mozilla/5.0' -Uri ($Media + $f) -OutFile $dest; $saved++; Write-Host "Saved $dest" }
  catch { $failed++; Write-Host "FAILED $Media$f"; Remove-Item $dest -ErrorAction SilentlyContinue }
}
$files | Sort-Object | Set-Content 'assets\MANIFEST.txt'
Write-Host "Pages crawled: $($seen.Count)  Media found: $($files.Count)  New files saved: $saved  Failed: $failed"
