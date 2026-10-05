// Build-time prerender: renders the page to static HTML so the hero paints before
// the JavaScript loads. The client then hydrates it (see main.tsx).
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
