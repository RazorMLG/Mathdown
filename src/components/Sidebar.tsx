export default function Sidebar() {
  return (
    <aside className="w-[250px] flex-shrink-0 flex flex-col bg-zinc-950 border-r border-zinc-700">
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 border-b border-zinc-700">
        Notes
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-8 text-center text-zinc-600 text-sm italic">
          No notes yet
        </div>
      </div>
    </aside>
  );
}
