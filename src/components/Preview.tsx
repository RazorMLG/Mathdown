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
    <div className="flex-1 overflow-y-auto">
      {html ? (
        <div
          ref={containerRef}
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="p-8 text-zinc-600 italic text-sm">
          Preview will appear here...
        </div>
      )}
    </div>
  );
}
