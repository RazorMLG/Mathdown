import '../styles/preview.css'
import { tokenize } from '../parser/tokenizer'
import { render } from '../parser/renderer'

interface PreviewProps {
  content: string
}

export default function Preview({ content }: PreviewProps) {
  const html = content ? render(tokenize(content)) : ''

  return (
    <div className="flex-1 overflow-y-auto">
      {html ? (
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="p-8 text-zinc-600 italic text-sm">
          Preview will appear here...
        </div>
      )}
    </div>
  )
}
