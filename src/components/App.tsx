import { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
import Sidebar from "./Sidebar";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "../hooks/useDebounce";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const {
    notes,
    activeNote,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotes();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [editorContent, setEditorContent] = useState<string>(
    activeNote?.content ?? "",
  );
  const editorContentRef = useRef(editorContent);
  editorContentRef.current = editorContent;

  // Sync editor when active note changes
  useEffect(() => {
    if (activeNote) {
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

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <div
      className={theme === "dark" ? "dark" : ""}
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "var(--bg)",
        color: "var(--text)",
        overflow: "hidden",
      }}
    >
      <Sidebar
        notes={notes}
        activeNoteId={activeNote?.id ?? null}
        onSelectNote={setActiveNote}
        onNewNote={createNote}
        onDeleteNote={() => activeNote && deleteNote(activeNote.id)}
      />

      {/* Editor panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderRight: "1px solid var(--border)",
          minWidth: 0,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            fontSize: "10px",
            color: "var(--muted)",
            letterSpacing: "0.05em",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          editor
        </span>
        <Editor content={editorContent} onChange={setEditorContent} />
      </div>

      {/* Preview panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "44px",
            fontSize: "10px",
            color: "var(--muted)",
            letterSpacing: "0.05em",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          preview
        </span>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          style={{
            position: "absolute",
            top: "6px",
            right: "10px",
            zIndex: 2,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            padding: "4px",
            borderRadius: "4px",
            fontSize: "14px",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--surface-2)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
          }}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <Preview content={editorContent} />
      </div>
    </div>
  );
}
