# MathDown — Markdown Note-Taking App with Live Math Rendering

## Project Brief

**What you're building:** A browser-based note-taking app where you write Markdown on the left and see a live-rendered preview on the right. It supports basic Markdown syntax (parsed by YOUR code, not a library) and LaTeX math blocks (rendered by KaTeX).

**Tech stack:** React + TypeScript + Tailwind CSS + KaTeX (for math only) + localStorage

**What you CANNOT use:** Any Markdown parsing library (marked, remark, markdown-it, etc). You write your own parser. That's the whole point.

---

## Architecture Overview

```

src/
├── components/
│ ├── App.tsx # Layout shell, state orchestration
│ ├── Editor.tsx # Left panel — textarea or contenteditable
│ ├── Preview.tsx # Right panel — rendered HTML output
│ ├── Sidebar.tsx # File/note list
│ ├── NoteItem.tsx # Single note in the sidebar
│ └── Toolbar.tsx # Top bar (new note, delete, search)
├── parser/
│ ├── tokenizer.ts # Raw markdown string → token array
│ ├── parser.ts # Token array → AST (tree of nodes)
│ └── renderer.ts # AST → HTML string
├── hooks/
│ ├── useNotes.ts # CRUD logic + localStorage persistence
│ ├── useDebounce.ts # Debounce the preview re-render
│ └── useKeyboardShortcuts.ts # Ctrl+N, Ctrl+S, Ctrl+B, etc.
├── types/
│ └── index.ts # Note, Token, ASTNode type definitions
├── utils/
│ └── storage.ts # localStorage wrapper (get/set/delete)
└── main.tsx # Entry point
```

---

## Milestones

### Milestone 1 — Skeleton & Split Layout

**Goal:** Get the app shell running. Two panels side by side, a sidebar, basic responsive layout.

**Tasks:**

1. Initialize the project with Vite + React + TypeScript + Tailwind
2. Build `App.tsx` with a CSS Grid or Flexbox layout: sidebar (250px) | editor (1fr) | preview (1fr)
3. `Editor.tsx` — a `<textarea>` that fills its panel, monospace font, dark theme
4. `Preview.tsx` — a `<div>` that displays raw text from the editor (no parsing yet, just mirror the input)
5. Wire up state: editor content lives in `App.tsx`, passed down as props

**You're done when:** You type in the left panel and see the raw text appear in the right panel in real time.

---

### Milestone 2 — Your Markdown Tokenizer

**Goal:** Turn a raw Markdown string into an array of tokens. This is the core learning milestone.

**Tokens to support (in this order of implementation):**

1. `heading` — lines starting with `#`, `##`, `###` (support h1–h3)
2. `paragraph` — any line that isn't something else
3. `bold` — `**text**`
4. `italic` — `*text*`
5. `bold_italic` — `***text***`
6. `inline_code` — `` `code` ``
7. `code_block` — triple backtick fenced blocks (with optional language tag)
8. `link` — `[text](url)`
9. `image` — `![alt](url)`
10. `unordered_list` — lines starting with `-` or `*`
11. `ordered_list` — lines starting with `1.`, `2.`, etc.
12. `blockquote` — lines starting with `>`
13. `horizontal_rule` — `---` or `***` on its own line
14. `math_inline` — `$...$`
15. `math_block` — `$$...$$`

**Architecture decision you must make:** Will you do single-pass line-by-line tokenization, or a two-pass approach (block-level first, then inline)? Research this. The two-pass approach is how most real parsers work and it's cleaner.

**You're done when:** You can call `tokenize("# Hello **world**")` and get back a structured token array that correctly identifies the heading, plain text, and bold segments.

---

### Milestone 3 — Parser (Tokens → AST)

**Goal:** Convert your flat token array into a tree structure (Abstract Syntax Tree).

**Why a tree?** Because Markdown is nested. A list item can contain bold text. A blockquote can contain a heading. You need a tree to represent this.

**Define your AST node type:**

```typescript
type ASTNode = {
  type: string; // 'heading', 'paragraph', 'bold', 'link', etc.
  children?: ASTNode[]; // nested nodes
  content?: string; // leaf text content
  props?: Record<string, string>; // level for headings, href for links, etc.
};
```

**You're done when:** `parse(tokenize("# Hello **world**"))` returns a tree where the heading node has two children: a text node "Hello " and a bold node containing "world".

---

### Milestone 4 — Renderer (AST → HTML)

**Goal:** Walk the AST and produce an HTML string.

**Rules:**

- `heading` → `<h1>`, `<h2>`, `<h3>` based on `props.level`
- `bold` → `<strong>`
- `italic` → `<em>`
- `code_block` → `<pre><code class="language-{lang}">`
- `inline_code` → `<code>`
- `link` → `<a href="..." target="_blank" rel="noopener">`
- `image` → `<img src="..." alt="...">`
- `math_inline` → wrap in a `<span class="math-inline">` (KaTeX renders later)
- `math_block` → wrap in a `<div class="math-block">` (KaTeX renders later)
- Lists → `<ul>/<ol>` with `<li>` children
- `blockquote` → `<blockquote>`
- `horizontal_rule` → `<hr />`

**You're done when:** The preview panel shows properly formatted HTML from your own parser pipeline: `raw string → tokenize() → parse() → render() → HTML`.

---

### Milestone 5 — KaTeX Integration

**Goal:** Make `$E = mc^2$` and `$$\int_0^\infty e^{-x} dx = 1$$` render as real math.

**How:**

1. Install `katex` npm package
2. After your renderer produces HTML, use a React `useEffect` in `Preview.tsx` to find all `.math-inline` and `.math-block` elements
3. Call `katex.render(element.textContent, element, { throwOnError: false })` on each one
4. Handle `displayMode: true` for block math, `false` for inline

**You're done when:** You can write mixed Markdown + LaTeX and see both rendered correctly in the preview.

---

### Milestone 6 — Notes CRUD + Persistence

**Goal:** Multiple notes, saved to localStorage, with a sidebar to navigate between them.

**Data model:**

```typescript
type Note = {
  id: string; // crypto.randomUUID()
  title: string; // auto-extracted from first heading, or "Untitled"
  content: string; // raw markdown
  createdAt: number; // Date.now()
  updatedAt: number;
};
```

**Tasks:**

1. `useNotes.ts` hook — manages an array of notes, exposes `createNote`, `updateNote`, `deleteNote`, `getNoteById`
2. `storage.ts` — wrapper around localStorage with JSON serialize/deserialize and error handling
3. `Sidebar.tsx` — lists all notes, sorted by `updatedAt` descending
4. `NoteItem.tsx` — shows title + relative timestamp ("2 min ago")
5. Auto-save: debounce the editor input (300ms) and persist on every change
6. `Toolbar.tsx` — "New Note" button, "Delete" with confirmation

**You're done when:** You can create multiple notes, switch between them, close the browser, reopen it, and everything is still there.

---

### Milestone 7 — Search & Keyboard Shortcuts

**Goal:** Make it feel like a real app, not a toy.

**Search:**

1. Add a search input in the sidebar
2. Filter notes by title AND content (case-insensitive substring match)
3. Highlight matching text in the sidebar results (optional stretch)

**Keyboard shortcuts (via `useKeyboardShortcuts.ts`):**

- `Ctrl+N` — new note
- `Ctrl+S` — force save (even though auto-save exists, users expect this)
- `Ctrl+B` — wrap selected text in `**`
- `Ctrl+I` — wrap selected text in `*`
- `Ctrl+K` — wrap selected text in `[](url)` link template
- `Ctrl+Shift+M` — wrap selected text in `$$` math block

**You're done when:** You can navigate the entire app without touching the mouse.

---

### Milestone 8 — Polish & Design

**Goal:** Make it look professional. Not "default Tailwind gray boxes" — actually designed.

**Requirements:**

- Dark theme as default (with optional light toggle)
- Monospace font in editor (JetBrains Mono or Fira Code via Google Fonts)
- Serif or clean sans-serif in preview (to differentiate writing vs reading)
- Smooth transitions when switching notes
- Proper scrolling in all panels (editor, preview, sidebar scroll independently)
- Mobile responsive: on small screens, toggle between editor and preview (not side-by-side)
- A subtle "saved" indicator (e.g., small checkmark that appears after auto-save)
- Syntax-style coloring in the editor textarea for headings/bold (stretch goal — this is hard in a textarea, look into `contenteditable` or a transparent overlay approach)

---

## Stretch Goals (if you finish everything above)

- **Export to .md file** — download the current note as a `.md` file
- **Import .md files** — drag and drop a `.md` file to create a new note
- **Code syntax highlighting** — use Prism.js or highlight.js inside code blocks
- **Table support** — parse and render Markdown tables (this is a real parsing challenge)
- **Undo/redo history** — maintain a stack of editor states
- **Note folders/tags** — organize notes into categories

---

## Rules of Engagement

1. **You write every line.** Don't paste code from AI into your editor. Type it. If you don't understand a line, you don't ship it.
2. **Ask me when you're stuck.** I'm your rubber duck. Describe the problem, what you tried, and what you expected. I'll give hints, not solutions.
3. **Commit after every milestone.** Init a git repo. Write real commit messages. This is portfolio work.
4. **No Markdown parsing libraries.** KaTeX for math is fine. Everything else is yours.
5. **Test as you go.** At minimum, write a few manual test cases for your tokenizer. Better yet, write actual unit tests with Vitest.

---

## Getting Started

```bash
npm create vite@latest mathdown -- --template react-ts
cd mathdown
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install katex
npm install -D @types/katex
git init
git add .
git commit -m "init: vite + react + ts + tailwind + katex"
```

Now open `src/App.tsx`, delete the boilerplate, and start Milestone 1.

**Send me a message when you finish each milestone. I'll review.**
