import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync } from "node:fs";

// User site (hitenshkharva.github.io) is served from the domain root.
export default defineConfig({
  base: "/",
  // Show résumé links only once public/resume.pdf has been added.
  define: { __HAS_RESUME__: JSON.stringify(existsSync("public/resume.pdf")) },
  plugins: [react(), tailwindcss()],
});
