import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

// Load every grammar once, including js-extras, which adds tokens like
// maybe-class-name and property-access to JavaScript
loadLanguages.silent = true;
loadLanguages();

const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

// Escape text the way remark-html does, so the output matches the rest of the post
const escapeText = (value) => value.replace(/&/g, "&#x26;").replace(/</g, "&#x3C;");

function highlight(code, lang) {
  const grammar = Prism.languages[lang];
  if (!grammar) return escapeText(code);

  return Prism.highlight(code, grammar, lang)
    // Prism escapes with named references; switch to remark-html's style
    .replace(/&amp;/g, "&#x26;")
    .replace(/&lt;/g, "&#x3C;")
    .replace(/&nbsp;/g, " ")
    // Close and reopen tokens that span lines so every line is self-contained
    .replace(MULTILINE_TOKEN_SPAN, (match, token) =>
      match.replace(/\n/g, `</span>\n<span class="token ${token}">`)
    )
    .split("\n")
    .map((line) => `${line}\n`)
    .join("");
}

function transform(node) {
  if (node.type === "code") {
    const lang = (node.lang || "").match(/^[a-zA-Z\d-]*/)[0] || "unknown";
    const className = `language-${lang}`;
    return {
      type: "html",
      value: `<div class="remark-highlight"><pre class="${className}"><code class="${className}">${highlight(node.value, lang)}</code></pre></div>`,
    };
  }
  if (node.children) node.children = node.children.map(transform);
  return node;
}

// Remark plugin: syntax-highlights fenced code blocks at build time with Prism
export default function highlightCode() {
  return (tree) => transform(tree);
}
