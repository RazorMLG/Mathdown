import { useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "../styles/preview.css";
import { tokenize } from "../parser/tokenizer";
import { render } from "../parser/renderer";

interface PreviewProps {
  content: string;
  activeNoteId: string | null;
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

export default function Preview({ content, activeNoteId }: PreviewProps) {
  const rawHtml = content ? render(tokenize(content)) : "";
  const html = rawHtml ? applyKatex(rawHtml) : "";

  const [fading, setFading] = useState(false);
  const prevNoteId = useRef(activeNoteId);

  useEffect(() => {
    if (activeNoteId !== prevNoteId.current) {
      prevNoteId.current = activeNoteId;
      setFading(true);
      const timer = setTimeout(() => setFading(false), 150);
      return () => clearTimeout(timer);
    }
  }, [activeNoteId]);

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {html ? (
        <div
          className="preview-content"
          style={{
            opacity: fading ? 0 : 1,
            transition: "opacity 150ms ease",
          }}
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
