import { useState } from "react";
import { Note } from "../types/types";
import NoteItem from "./NoteItem";
import Toolbar from "./Toolbar";

type SortField = "title" | "createdAt" | "updatedAt";
type SortDir = "asc" | "desc";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: () => void;
}

function sortNotes(notes: Note[], field: SortField, dir: SortDir): Note[] {
  return [...notes].sort((a, b) => {
    let cmp: number;
    if (field === "title") {
      cmp = a.title.localeCompare(b.title);
    } else {
      cmp = a[field] - b[field];
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

function filterNotes(notes: Note[], query: string): Note[] {
  const lowercasedQuery = query.toLowerCase();

  const filteredNotes: Note[] = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(lowercasedQuery) ||
      note.title.toLowerCase().includes(lowercasedQuery),
  );

  return filteredNotes;
}

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
}: SidebarProps) {
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sorted = sortNotes(filterNotes(notes, searchQuery), sortField, sortDir);
  const displayed = sorted;

  function toggleDir() {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  return (
    <aside
      style={{
        width: "240px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 12px 12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.01em",
          }}
        >
          Notes
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <Toolbar
            onNewNote={onNewNote}
            onDeleteNote={onDeleteNote}
            canDelete={activeNoteId !== null}
          />
        </div>
      </div>

      {/* Search input */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontSize: "12px",
            padding: "5px 8px",
            borderRadius: "5px",
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--text)",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Sort controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          style={{
            flex: 1,
            fontSize: "11px",
            background: "transparent",
            color: "var(--muted)",
            border: "none",
            outline: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <option value="updatedAt">Modified</option>
          <option value="createdAt">Created</option>
          <option value="title">Title</option>
        </select>
        <button
          onClick={toggleDir}
          title={sortDir === "asc" ? "Ascending" : "Descending"}
          style={{
            fontSize: "11px",
            color: "var(--muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "2px 4px",
            borderRadius: "3px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--surface-2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* Note list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {displayed.length === 0 ? (
          <div
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "13px",
            }}
          >
            {searchQuery.trim() ? "No matching notes" : "No notes yet"}
          </div>
        ) : (
          displayed.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
