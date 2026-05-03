# MathDown

MathDown is a markdown note-taking app built with React and TypeScript. It gives you a live preview while you write, renders LaTeX math with KaTeX, stores notes in localStorage, and uses a custom markdown tokenizer and renderer instead of a markdown library.

## Features

- Live split view with editor on the left and preview on the right
- Desktop drag handle to resize the editor and preview panes
- Responsive mobile layout with editor/preview tab switching
- Multiple notes with create, select, delete, search, and sort
- Auto-save with a small saved status indicator
- Light and dark theme toggle
- Keyboard shortcuts for common markdown actions
- Custom markdown parsing pipeline with math rendering

## Supported Markdown

The current parser and renderer support:

- Headings: `#`, `##`, `###`
- Paragraphs
- Bold: `**text**`
- Italic: `*text*`
- Bold italic: `***text***`
- Inline code: `` `code` ``
- Fenced code blocks: triple backticks
- Links: `[text](url)`
- Images: `![alt](url)`
- Unordered lists
- Ordered lists
- Blockquotes
- Horizontal rules: `---` and `***`
- Inline math: `$...$`
- Block math: `$$...$$`

## Keyboard Shortcuts

- `Ctrl+Alt+N` creates a new note
- `Ctrl+S` saves the current note
- `Ctrl+B` wraps the current selection in `**bold**`
- `Ctrl+I` wraps the current selection in `*italic*`
- `Ctrl+K` wraps the current selection in a markdown link template
- `Ctrl+Shift+M` wraps the current selection in a math block

## Getting Started

### Requirements

- Node.js
- npm

### Install

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Then open the local Vite URL, usually `http://localhost:5173`.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run lint
```

## Project Structure

```text
src/
  components/
    App.tsx
    Editor.tsx
    NoteItem.tsx
    Preview.tsx
    Sidebar.tsx
    Toolbar.tsx
  hooks/
    useDebounce.ts
    useKeyboardShortcuts.ts
    useNotes.ts
  parser/
    pipeline.test.ts
    renderer.ts
    tokenizer.ts
  styles/
    index.css
    preview.css
  types/
    types.ts
  utils/
    ExtractMatchData.ts
    storage.ts
```

## Rendering Pipeline

The current preview flow is:

1. Raw markdown input from the editor
2. `tokenize()` converts the text into tokens
3. `render()` turns those tokens into HTML
4. KaTeX transforms inline and block math into rendered equations

## Notes Storage

- Notes are stored in the browser using localStorage
- The current storage key is `mathdown_notes`
- Notes keep `id`, `title`, `content`, `createdAt`, and `updatedAt`

## Development Notes

- This project is intentionally using a handwritten markdown pipeline instead of `marked`, `remark`, or similar libraries
- Parser behavior is covered by tests in `src/parser/pipeline.test.ts`
- The README describes the current implementation, not the original milestone plan
