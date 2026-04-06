import { RefObject, useEffect } from "react";

interface useKeyboardShortcutsProps {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  onNewNote: () => void;
  onSave: () => void;
  onChange: (value: string) => void;
}

export function useKeyboardShortcuts({
  editorRef,
  onNewNote,
  onSave,
  onChange,
}: useKeyboardShortcutsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.altKey && e.key === "n") {
        e.preventDefault();
        onNewNote();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        onSave();
      } else if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        if (!editorRef.current) return;
        const currentObj = editorRef.current;
        const currentText = currentObj.value;
        const boldedText =
          currentText.substring(0, currentObj.selectionStart) +
          "**" +
          currentText.substring(
            currentObj.selectionStart,
            currentObj.selectionEnd,
          ) +
          "**" +
          currentText.substring(currentObj.selectionEnd);
        onChange(boldedText);
      } else if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        if (!editorRef.current) return;
        const currentObj = editorRef.current;
        const currentText = currentObj.value;
        const italicText =
          currentText.substring(0, currentObj.selectionStart) +
          "*" +
          currentText.substring(
            currentObj.selectionStart,
            currentObj.selectionEnd,
          ) +
          "*" +
          currentText.substring(currentObj.selectionEnd);
        onChange(italicText);
      } else if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        if (!editorRef.current) return;
        const currentObj = editorRef.current;
        const currentText = currentObj.value;
        const linkedText =
          currentText.substring(0, currentObj.selectionStart) +
          "[" +
          currentText.substring(
            currentObj.selectionStart,
            currentObj.selectionEnd,
          ) +
          "](url)" +
          currentText.substring(currentObj.selectionEnd);
        onChange(linkedText);
      } else if (e.ctrlKey && e.shiftKey && e.key === "M") {
        e.preventDefault();
        if (!editorRef.current) return;
        const currentObj = editorRef.current;
        const currentText = currentObj.value;
        const mathedText =
          currentText.substring(0, currentObj.selectionStart) +
          "$$\n" +
          currentText.substring(
            currentObj.selectionStart,
            currentObj.selectionEnd,
          ) +
          "\n$$" +
          currentText.substring(currentObj.selectionEnd);
        onChange(mathedText);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editorRef, onNewNote, onSave, onChange]);
}
