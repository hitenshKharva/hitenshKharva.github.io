#!/usr/bin/env bash
# Builds a PDF from a résumé Word file into resume/out/ (git-ignored, so it is never published).
# Defaults to the master copy; pass another .docx for a tailored version:
#   npm run resume
#   npm run resume -- resume/out/Kharva_Hitensh_Resume_Acme.docx
# Needs LibreOffice Writer and the Carlito font (metric-compatible with Calibri), e.g. on Ubuntu:
#   apt-get install libreoffice-writer-nogui fonts-crosextra-carlito fonts-crosextra-caladea
set -euo pipefail
cd "$(dirname "$0")/.."

src="${1:-resume/Kharva_Hitensh_Resume.docx}"
out="resume/out"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

mkdir -p "$out"
soffice -env:UserInstallation="file://$tmp/profile" --headless --convert-to pdf --outdir "$tmp" "$src" >/dev/null
pdf="$(basename "${src%.docx}").pdf"
mv "$tmp/$pdf" "$out/$pdf"
echo "Wrote $out/$pdf from $src"
