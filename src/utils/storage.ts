export function getFromLocalStorage(key: string): unknown | null {
  try {
    const rawNote = localStorage.getItem(key);
    if (rawNote === null) return null;
    return JSON.parse(rawNote);
  } catch (error) {
    return null;
  }
}
export function setToLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}
