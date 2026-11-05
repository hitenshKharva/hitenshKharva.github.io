import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

// Build stamp for the footer: when, which commit, which CI run.
function gitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD").toString().trim();
  } catch {
    return "local";
  }
}

// User site (hitenshkharva.github.io) is served from the domain root.
export default defineConfig({
  base: "/",
  // Show résumé links only once public/resume.pdf has been added.
  define: {
    __HAS_RESUME__: JSON.stringify(existsSync("public/resume.pdf")),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_SHA__: JSON.stringify(gitSha()),
    __BUILD_RUN__: JSON.stringify(process.env.GITHUB_RUN_NUMBER ?? ""),
  },
  plugins: [react(), tailwindcss()],
});
