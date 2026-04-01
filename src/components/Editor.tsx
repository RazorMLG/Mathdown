interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  return (
    <textarea
      className="flex-1 w-full h-full resize-none bg-zinc-900 text-zinc-100 font-mono text-sm leading-relaxed p-4 outline-none placeholder-zinc-600 caret-emerald-400"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start writing Markdown..."
      spellCheck={false}
    />
  );
}
