import { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
import Sidebar from "./Sidebar";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "../hooks/useDebounce";

export default function App() {
  const {
    notes,
    activeNote,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotes();

  const [editorContent, setEditorContent] = useState<string>(
    activeNote?.content ?? "",
  );
  const editorContentRef = useRef(editorContent);
  editorContentRef.current = editorContent;

  // Sync editor when active note changes
  useEffect(() => {
    if (activeNote) {
      // New empty note: carry over whatever is in the editor
      // Existing note with content: show that note's content
      setEditorContent(activeNote.content || editorContentRef.current);
    } else {
      setEditorContent("");
    }
  }, [activeNote?.id]);

  const debouncedContent = useDebounce(editorContent, 300);

  // Auto-save debounced content
  useEffect(() => {
    if (activeNote) {
      updateNote(activeNote.id, debouncedContent);
    }
  }, [debouncedContent]);

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-zinc-100 overflow-hidden">
      <Sidebar
        notes={notes}
        activeNoteId={activeNote?.id ?? null}
        onSelectNote={setActiveNote}
        onNewNote={createNote}
        onDeleteNote={() => activeNote && deleteNote(activeNote.id)}
      />

      {/* Editor panel */}
      <div className="flex flex-col flex-1 border-r border-zinc-700 min-w-0">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-700 bg-zinc-900">
          Editor
        </div>
        <Editor content={editorContent} onChange={setEditorContent} />
      </div>

      {/* Preview panel */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-700 bg-zinc-900">
          Preview
        </div>
        <Preview content={editorContent} />
      </div>
    </div>
  );
}
