import { MODES } from "../lib/game";

export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="flex w-full p-1 mb-6 bg-slate-900/90 border border-blue-900/60 rounded-full">
      {Object.entries(MODES).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${
            mode === key ? "bg-white text-[#00205B]" : "text-blue-200 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
