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

function getContentPreview(content: string): string {
  return content
    .split("\n")
    .map((line) => line.replace(/^#{1,6}\s+/, "").replace(/\*{1,3}|`/g, ""))
    .filter((line) => line.trim().length > 0)
    .slice(0, 3)
    .join(" ")
    .slice(0, 120);
}

export default function NoteItem({ note, isActive, onClick }: NoteItemProps) {
  const preview = getContentPreview(note.content);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
        borderLeft: isActive
          ? "2px solid var(--accent)"
          : "2px solid transparent",
        backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
        transition: "background-color 0.1s",
        cursor: "pointer",
        display: "block",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--surface-2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "transparent";
        }
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--text)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {note.title || "Untitled"}
      </div>
      {preview && (
        <div
          style={{
            fontSize: "12px",
            color: "var(--muted)",
            marginTop: "2px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.4",
          }}
        >
          {preview}
        </div>
      )}
      <div
        style={{
          fontSize: "11px",
          color: "var(--muted)",
          marginTop: "4px",
        }}
      >
        {timeAgo(note.updatedAt)}
      </div>
    </button>
  );
}
