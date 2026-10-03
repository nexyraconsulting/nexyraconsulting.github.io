#!/usr/bin/env bash
# Crawls every page of https://adda-slough.org (including nested past-event pages not in the menu),
# collects every image/video on media.adda-slough.org, and saves them under assets/ using the same paths.
# Run from the website folder:  bash scripts/fetch-all-assets.sh
# Needs: bash, curl, grep, sed (standard on macOS/Linux; on Windows use the .ps1 version).
set -u
cd "$(dirname "$0")/.."
SITE="https://adda-slough.org"
MEDIA="https://media.adda-slough.org/public/"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
: > "$WORK/seen"; : > "$WORK/media"
printf '%s\n' / /about-us /events /charities /media /media/print /media/digital /contact-us /sign-in /dp-2026-reg \
  /terms-and-conditions /privacy-policy /events/festivals /events/cultural-and-other /events/sports-and-leisure > "$WORK/queue"

decode() { sed -e 's/%2[Ff]/\//g' -e 's/%3[Aa]/:/g' -e 's/%20/ /g' -e 's/%28/(/g' -e 's/%29/)/g' -e 's/\\u0026/\&/g' -e 's/\\\//\//g'; }

while [ -s "$WORK/queue" ]; do
  path="$(head -n1 "$WORK/queue")"; sed -i.bak '1d' "$WORK/queue"
  grep -qxF "$path" "$WORK/seen" && continue
  echo "$path" >> "$WORK/seen"
  echo "Page  $path"
  html="$(curl -fsSL -A 'Mozilla/5.0' "$SITE$path" 2>/dev/null | decode)" || continue
  # media files referenced anywhere in the page (img tags, Next.js image proxy, JSON data, galleries)
  printf '%s' "$html" | grep -oE 'media\.adda-slough\.org/public/[^"'"'"'<>?&\\ )]+' | sed 's#^media\.adda-slough\.org/public/##' >> "$WORK/media"
  # internal links to crawl
  printf '%s' "$html" | grep -oE 'href="(/[^"#?]*|https://adda-slough\.org/[^"#?]*)"' | sed -E 's#^href="(https://adda-slough\.org)?##; s#"$##; s#/$##' \
    | grep -vE '^/(_next|api|images)/|\.(png|jpe?g|svg|ico|css|js|xml|txt|pdf)$' | grep -E '^/' | while read -r l; do
      grep -qxF "$l" "$WORK/seen" || echo "$l" >> "$WORK/queue"; done
done

sort -u "$WORK/media" > "$WORK/media.u"
n=0; fail=0
while read -r f; do
  [ -z "$f" ] && continue
  dest="assets/${f}"
  if [ -s "$dest" ]; then continue; fi
  if curl -fsSL -A 'Mozilla/5.0' --create-dirs -o "$dest" "$MEDIA$f"; then n=$((n+1)); echo "Saved $dest"; else fail=$((fail+1)); echo "FAILED $MEDIA$f"; rm -f "$dest"; fi
done < "$WORK/media.u"
cp "$WORK/media.u" assets/MANIFEST.txt
echo "Pages crawled: $(wc -l < "$WORK/seen")  Media found: $(wc -l < "$WORK/media.u")  New files saved: $n  Failed: $fail"
echo "Full list written to assets/MANIFEST.txt"
