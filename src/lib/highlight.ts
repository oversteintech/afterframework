import "server-only";
import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";
import type { CodeLang } from "@/content/code";

// Token colors resolve from CSS variables, so one render serves both themes.
const theme = createCssVariablesTheme({
  name: "after-vars",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: [theme],
    langs: ["dart", "yaml", "powershell", "json"],
  });
  return highlighter;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function highlight(code: string, lang: CodeLang): Promise<string> {
  if (lang === "text") {
    return `<pre class="shiki" tabindex="0"><code>${escapeHtml(code)}</code></pre>`;
  }
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: "after-vars",
    transformers: [
      {
        pre(node) {
          node.properties.tabindex = "0";
          delete node.properties.style;
        },
      },
    ],
  });
}
