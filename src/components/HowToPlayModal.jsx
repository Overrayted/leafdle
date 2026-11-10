import { MAX_GUESSES, getTraits } from "../lib/game";

const INTROS = {
  leafs: "Guess today's mystery Toronto Maple Leafs player. Anyone who has ever played for the Leafs, past or present, can be the answer.",
  active: "Guess today's mystery NHL player. The answer can be anyone on a current NHL roster.",
};

// What each clue tile means. Some depend on the mode.
const TRAIT_HELP = {
  position: "C, L, R, D or G.",
  draftTeam: "The team that drafted them (N/A if undrafted).",
  draftYear: "↑ means the answer was drafted later, ↓ earlier.",
  currentTeam: {
    leafs: "Their current NHL team, or Retired / Inactive.",
    active: "Their current NHL team.",
  },
  division: "Green for the same division, yellow for a different division in the same conference.",
  isActive: "Whether they're still playing in the NHL.",
  jerseyNumber: "↑ means the answer's number is higher, ↓ lower.",
  nationality: "The country they're from.",
};

const COLORS = [
  { swatch: "bg-emerald-600", text: "Exact match" },
  { swatch: "bg-amber-600", text: "Close: follow the ↑ / ↓ arrow, or same conference" },
  { swatch: "bg-slate-700", text: "Not a match" },
];

export default function HowToPlayModal({ mode, theme, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className={`${theme.modal} border w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-extrabold tracking-tight">How to Play</h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none opacity-70 hover:opacity-100 px-1">
            ×
          </button>
        </div>

        <p className={`text-sm mb-4 ${theme.modalText}`}>
          {INTROS[mode]} You have <strong className="text-white">{MAX_GUESSES} guesses</strong>. Start typing a
          name and pick a player. Each guess reveals how close you are.
        </p>

        <h3 className={`text-xs uppercase font-bold tracking-wider mb-2 ${theme.accentText}`}>Tile colours</h3>
        <ul className="space-y-1.5 mb-4 text-sm">
          {COLORS.map(({ swatch, text }) => (
            <li key={swatch} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded shrink-0 ${swatch}`} />
              {text}
            </li>
          ))}
        </ul>

        <h3 className={`text-xs uppercase font-bold tracking-wider mb-2 ${theme.accentText}`}>The clues</h3>
        <ul className="space-y-1.5 mb-4 text-sm">
          {getTraits(mode).map(({ key, label }) => {
            const help = TRAIT_HELP[key];
            return (
              <li key={key}>
                <span className="font-bold">{label}:</span>{" "}
                <span className={theme.modalText}>{typeof help === "string" ? help : help[mode]}</span>
              </li>
            );
          })}
        </ul>

        <h3 className={`text-xs uppercase font-bold tracking-wider mb-2 ${theme.accentText}`}>Smart Filter</h3>
        <p className={`text-sm mb-4 ${theme.modalText}`}>
          Turn on Smart Filter under the search bar and it will hide every player who can&apos;t be the answer
          based on your clues so far, so you only see players who still fit.
        </p>

        <p className={`text-xs ${theme.modalText} opacity-80`}>
          A new player every day at midnight. Your progress is saved, and each mode has its own daily player.
        </p>
      </div>
    </div>
  );
}
