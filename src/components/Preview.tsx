interface PreviewProps {
  content: string
}

export default function Preview({ content }: PreviewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
      {content || (
        <span className="text-zinc-600 italic">Preview will appear here...</span>
      )}
    </div>
  )
}
