import { useEffect, useState } from "react";
import { Note } from "../types/types";
import { getFromLocalStorage, setToLocalStorage } from "../utils/storage";
const NOTES_KEY = "mathdown_notes";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteID] = useState<string | null>();
  const activeNote = notes.find((n) => n.id === activeNoteId);

  useEffect(() => {
    const notesFromStorage = getFromLocalStorage(NOTES_KEY);
    if (Object.prototype.toString.call(notesFromStorage) === `[object Array]`) {
      setNotes(notesFromStorage as Note[]);
    }
  }, []);

  function createNote() {
    const currTime = Date.now();
    const id = crypto.randomUUID();
    const newNote: Note = {
      id: id,
      title: "Untitled",
      content: "",
      createdAt: currTime,
      updatedAt: currTime,
    };
    setNotes([...notes, newNote]);
    setToLocalStorage(NOTES_KEY, [...notes, newNote]);
    setActiveNote(id);
  }
  function updateNote(id: string, content: string) {
    console.log("updateNote called", id, content);
    const match = content.match(/^#{1,3} (?<title>(.+))/m);
    const title = match?.groups ? match.groups.title : "Untitled";
    const newNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          id: id,
          title: title,
          content: content,
          createdAt: note.createdAt,
          updatedAt: Date.now(),
        };
      }
      return note;
    });

    setNotes(newNotes);
    setToLocalStorage(NOTES_KEY, newNotes);
  }
  function deleteNote(id: string) {
    const newNotes = notes.filter((note) => !(note.id === id));
    if (id === activeNoteId) setActiveNoteID(null);
    setNotes(newNotes);
    setToLocalStorage(NOTES_KEY, newNotes);
  }
  function setActiveNote(id: string) {
    setActiveNoteID(id);
  }
  return {
    notes,
    activeNote,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  };
}
