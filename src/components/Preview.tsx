import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "../styles/preview.css";
import { tokenize } from "../parser/tokenizer";
import { render } from "../parser/renderer";

interface PreviewProps {
  content: string;
}

export default function Preview({ content }: PreviewProps) {
  const html = content ? render(tokenize(content)) : "";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current
      .querySelectorAll<HTMLElement>(".math-inline")
      .forEach((el) => {
        katex.render(el.textContent ?? "", el, {
          throwOnError: false,
          displayMode: false,
        });
      });

    containerRef.current
      .querySelectorAll<HTMLElement>(".math-block")
      .forEach((el) => {
        katex.render(el.textContent ?? "", el, {
          throwOnError: false,
          displayMode: true,
        });
      });
  }, [content]);

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {html ? (
        <div
          ref={containerRef}
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
