import { useState } from 'react'
import Editor from './Editor'
import Preview from './Preview'
import Sidebar from './Sidebar'

export default function App() {
  const [content, setContent] = useState<string>('')

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Editor panel */}
      <div className="flex flex-col flex-1 border-r border-zinc-700 min-w-0">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-700 bg-zinc-900">
          Editor
        </div>
        <Editor content={content} onChange={setContent} />
      </div>

      {/* Preview panel */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-700 bg-zinc-900">
          Preview
        </div>
        <Preview content={content} />
      </div>
    </div>
  )
}
