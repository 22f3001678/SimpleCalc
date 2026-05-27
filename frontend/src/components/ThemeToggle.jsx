export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:text-cyan-300"
    >
      {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </button>
  );
}
