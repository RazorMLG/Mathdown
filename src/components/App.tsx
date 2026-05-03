import { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
import Sidebar from "./Sidebar";
import { useNotes } from "../hooks/useNotes";
import { useDebounce } from "../hooks/useDebounce";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

type Theme = "light" | "dark";
type SaveState = "idle" | "unsaved" | "saving" | "saved";
type MobileView = "editor" | "preview";

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
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileView, setMobileView] = useState<MobileView>("editor");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [editorContent, setEditorContent] = useState<string>(
    activeNote?.content ?? "",
  );
  const editorContentRef = useRef(editorContent);
  editorContentRef.current = editorContent;

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useKeyboardShortcuts({
    editorRef,
    onNewNote: createNote,
    onSave: () => updateNote(activeNote!.id, editorContentRef.current),
    onChange: setEditorContent,
  });

  // Detect mobile breakpoint
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync editor when active note changes
  useEffect(() => {
    if (activeNote) {
      setEditorContent(activeNote.content);
    } else {
      setEditorContent("");
    }
    setSaveState("idle");
  }, [activeNote?.id]);

  // Mark unsaved on every edit
  useEffect(() => {
    if (activeNote) {
      setSaveState("unsaved");
    }
  }, [editorContent]);

  const debouncedContent = useDebounce(editorContent, 300);

  // Auto-save debounced content
  useEffect(() => {
    if (activeNote) {
      setSaveState("saving");
      updateNote(activeNote.id, debouncedContent);

      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        setSaveState("saved");
        savedTimerRef.current = setTimeout(() => {
          setSaveState("idle");
        }, 2000);
      }, 600);
    }
  }, [debouncedContent]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function handleMobileNoteSelect(id: string) {
    setActiveNote(id);
    setSidebarOpen(false);
  }

  const savedLabel =
    saveState === "saving"
      ? "saving…"
      : saveState === "saved"
        ? "✓ saved"
        : null;

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
        flexDirection: isMobile ? "column" : "row",
        position: "relative",
      }}
    >
      {/* Sidebar — always rendered on desktop, overlay on mobile */}
      {!isMobile && (
        <Sidebar
          notes={notes}
          activeNoteId={activeNote?.id ?? null}
          onSelectNote={setActiveNote}
          onNewNote={createNote}
          onDeleteNote={() => activeNote && deleteNote(activeNote.id)}
        />
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 10,
            }}
          />
          {/* Sidebar drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "80vw",
              maxWidth: "280px",
              zIndex: 11,
              background: "var(--surface)",
              borderRight: "1px solid var(--border)",
              overflowY: "auto",
            }}
          >
            <Sidebar
              notes={notes}
              activeNoteId={activeNote?.id ?? null}
              onSelectNote={handleMobileNoteSelect}
              onNewNote={() => {
                createNote();
                setSidebarOpen(false);
              }}
              onDeleteNote={() => {
                if (activeNote) deleteNote(activeNote.id);
                setSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}

      {/* Editor panel */}
      <div
        style={{
          display: isMobile && mobileView !== "editor" ? "none" : "flex",
          flexDirection: "column",
          flex: 1,
          borderRight: isMobile ? "none" : "1px solid var(--border)",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 10px",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              title="Open notes"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: "18px",
                lineHeight: 1,
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            >
              ☰
            </button>
            <span
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: "12px",
                color: "var(--muted)",
                letterSpacing: "0.05em",
              }}
            >
              {activeNote?.title ?? "No note selected"}
            </span>
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: "14px",
                lineHeight: 1,
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </div>
        )}

        {/* Desktop: floating labels */}
        {!isMobile && (
          <>
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
            {savedLabel && (
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "52px",
                  fontSize: "10px",
                  color:
                    saveState === "saved" ? "var(--accent)" : "var(--muted)",
                  letterSpacing: "0.05em",
                  userSelect: "none",
                  pointerEvents: "none",
                  zIndex: 1,
                  transition: "opacity 400ms ease",
                  opacity: saveState === "saved" ? 0.85 : 0.6,
                }}
              >
                {savedLabel}
              </span>
            )}
          </>
        )}

        <Editor
          ref={editorRef}
          content={editorContent}
          onChange={setEditorContent}
          disabled={!activeNote}
        />
      </div>

      {/* Preview panel */}
      <div
        style={{
          display: isMobile && mobileView !== "preview" ? "none" : "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          position: "relative",
        }}
      >
        {!isMobile && (
          <>
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
            {/* Theme toggle — desktop only */}
            <button
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
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
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--muted)";
              }}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </>
        )}
        <Preview
          content={editorContent}
          activeNoteId={activeNote?.id ?? null}
        />
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setMobileView("editor")}
            style={{
              flex: 1,
              padding: "10px",
              background:
                mobileView === "editor" ? "var(--surface-2)" : "transparent",
              border: "none",
              borderRight: "1px solid var(--border)",
              color: mobileView === "editor" ? "var(--text)" : "var(--muted)",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Editor
          </button>
          <button
            onClick={() => setMobileView("preview")}
            style={{
              flex: 1,
              padding: "10px",
              background:
                mobileView === "preview" ? "var(--surface-2)" : "transparent",
              border: "none",
              color: mobileView === "preview" ? "var(--text)" : "var(--muted)",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Preview
          </button>
        </div>
      )}
    </div>
  );
}
