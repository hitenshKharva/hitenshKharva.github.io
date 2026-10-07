#!/usr/bin/env bash
# Rebuilds public/resume.pdf (the site's "Resume" download) from the Word source in resume/.
# Needs LibreOffice Writer and the Carlito font (metric-compatible with Calibri), e.g. on Ubuntu:
#   apt-get install libreoffice-writer-nogui fonts-crosextra-carlito fonts-crosextra-caladea
# Run: npm run resume
set -euo pipefail
cd "$(dirname "$0")/.."

src="resume/Kharva_Hitensh_Resume.docx"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

soffice -env:UserInstallation="file://$tmp/profile" --headless --convert-to pdf --outdir "$tmp" "$src" >/dev/null
mv "$tmp/$(basename "${src%.docx}").pdf" public/resume.pdf
echo "Wrote public/resume.pdf from $src"
