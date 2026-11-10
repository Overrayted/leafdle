import { MODES } from "../lib/game";

export default function ModeSelector({ mode, theme, onChange }) {
  return (
    <div className={`flex w-full p-1 mb-6 ${theme.panel} border ${theme.border} rounded-full`}>
      {Object.entries(MODES).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-colors ${
            mode === key ? theme.selected : theme.unselected
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
