import katex from "katex";
import "katex/dist/katex.min.css";
import "../styles/preview.css";
import { tokenize } from "../parser/tokenizer";
import { render } from "../parser/renderer";

interface PreviewProps {
  content: string;
}

function applyKatex(html: string): string {
  return html
    .replace(
      /<div class="math-block">([\s\S]*?)<\/div>/g,
      (_, tex) =>
        `<div class="math-block">${katex.renderToString(tex.trim(), {
          throwOnError: false,
          displayMode: true,
        })}</div>`,
    )
    .replace(
      /<span class="math-inline">([\s\S]*?)<\/span>/g,
      (_, tex) =>
        `<span class="math-inline">${katex.renderToString(tex.trim(), {
          throwOnError: false,
          displayMode: false,
        })}</span>`,
    );
}

export default function Preview({ content }: PreviewProps) {
  const rawHtml = content ? render(tokenize(content)) : "";
  const html = rawHtml ? applyKatex(rawHtml) : "";

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {html ? (
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div
          style={{
            padding: "2rem",
            color: "var(--muted)",
            fontSize: "13px",
          }}
        >
          Preview will appear here
        </div>
      )}
    </div>
  );
}
