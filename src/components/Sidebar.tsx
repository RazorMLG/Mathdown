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

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
}: SidebarProps) {
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = sortNotes(notes, sortField, sortDir);

  function toggleDir() {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }

  return (
    <aside className="w-[250px] flex-shrink-0 flex flex-col bg-zinc-950 border-r border-zinc-700">
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-700">
        Notes
      </div>
      <Toolbar
        onNewNote={onNewNote}
        onDeleteNote={onDeleteNote}
        canDelete={activeNoteId !== null}
      />
      {/* Sort controls */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-800">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className="flex-1 text-xs bg-zinc-800 text-zinc-300 rounded px-1.5 py-1 border border-zinc-700 outline-none"
        >
          <option value="updatedAt">Modified</option>
          <option value="createdAt">Created</option>
          <option value="title">Title</option>
        </select>
        <button
          onClick={toggleDir}
          className="text-xs px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
          title={sortDir === "asc" ? "Ascending" : "Descending"}
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="px-4 py-8 text-center text-zinc-600 text-sm italic">
            No notes yet
          </div>
        ) : (
          sorted.map((note) => (
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
