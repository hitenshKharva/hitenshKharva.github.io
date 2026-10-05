// Inlines the server-rendered page into dist/index.html and preloads the fonts the
// hero needs, so first paint doesn't wait for JavaScript or late font discovery.
// Runs after `vite build` and `vite build --ssr` (see the build script).
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const { render } = await import(pathToFileURL("dist-ssr/entry-server.js").href);
const html = render();

const assets = readdirSync("dist/assets");
const preload = ["inter-tight-latin-800-normal", "inter-tight-latin-400-normal"]
  .map((name) => assets.find((f) => f.startsWith(name) && f.endsWith(".woff2")))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

let page = readFileSync("dist/index.html", "utf8");
if (!page.includes('<div id="root"></div>')) throw new Error("root placeholder not found");
page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
page = page.replace("</title>", `</title>\n    ${preload}`);
writeFileSync("dist/index.html", page);
rmSync("dist-ssr", { recursive: true, force: true });
console.log(`Prerendered ${Math.round(html.length / 1024)} KB of HTML; preloaded ${preload ? preload.split("\n").length : 0} fonts`);
