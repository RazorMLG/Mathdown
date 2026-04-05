import { Note } from "../types/types";

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NoteItem({ note, isActive, onClick }: NoteItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-zinc-800 transition-colors ${
        isActive
          ? "bg-zinc-800 border-l-2 border-l-emerald-500"
          : "hover:bg-zinc-900"
      }`}
    >
      <div className="text-sm font-medium text-zinc-100 truncate">
        {note.title || "Untitled"}
      </div>
      <div className="text-xs text-zinc-500 mt-0.5">
        {timeAgo(note.updatedAt)}
      </div>
    </button>
  );
}
