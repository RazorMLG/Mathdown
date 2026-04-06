import { forwardRef } from "react";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(function Editor(
  { content, onChange },
  ref,
) {
  return (
    <textarea
      ref={ref}
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start writing Markdown..."
      spellCheck={false}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        resize: "none",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: "13px",
        lineHeight: "1.7",
        padding: "1.5rem",
        outline: "none",
        caretColor: "var(--accent)",
        border: "none",
      }}
    />
  );
});

export default Editor;
