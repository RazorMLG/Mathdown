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
    <>
      <button
        onClick={onNewNote}
        title="New note"
        style={{ color: "var(--muted)", borderRadius: "4px", padding: "4px" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--surface-2)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={handleDelete}
        disabled={!canDelete}
        title="Delete note"
        style={{
          color: "var(--muted)",
          borderRadius: "4px",
          padding: "4px",
          opacity: canDelete ? 1 : 0.35,
          cursor: canDelete ? "pointer" : "not-allowed",
        }}
        onMouseEnter={(e) => {
          if (!canDelete) return;
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--surface-2)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </>
  );
}
