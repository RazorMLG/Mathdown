interface ToolbarProps {
  onNewNote: () => void;
  onDeleteNote: () => void;
  canDelete: boolean;
}

export default function Toolbar({
  onNewNote,
  onDeleteNote,
  canDelete,
}: ToolbarProps) {
  function handleDelete() {
    if (window.confirm("Delete this note? This cannot be undone.")) {
      onDeleteNote();
    }
  }

  return (
    <div className="flex gap-2 px-3 py-2 border-b border-zinc-700">
      <button
        onClick={onNewNote}
        className="flex-1 text-xs py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
      >
        + New
      </button>
      <button
        onClick={handleDelete}
        disabled={!canDelete}
        className="flex-1 text-xs py-1.5 rounded bg-zinc-700 hover:bg-red-700 text-zinc-300 hover:text-white font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-zinc-700 disabled:hover:text-zinc-300"
      >
        Delete
      </button>
    </div>
  );
}
