import { compareGuess, getTraits } from "../lib/game";

const FALLBACK_HEADSHOT = "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";

const TILE_COLORS = {
  correct: "bg-emerald-600 text-white",
  close: "bg-amber-600 text-white",
  higher: "bg-amber-600 text-white",
  lower: "bg-amber-600 text-white",
  wrong: "bg-slate-700 text-slate-200",
};

// The NHL API uses 3-letter country codes; the flag CDN wants 2-letter ones
const FLAG_CODES = { CAN: "ca", USA: "us", SWE: "se", FIN: "fi", RUS: "ru", CZE: "cz", SVK: "sk", DEU: "de", CHE: "ch", AUT: "at", DNK: "dk", LVA: "lv", SVN: "si", FRA: "fr" };

function formatValue(key, value, status) {
  if (key === "isActive") return value ? "Active" : "Retired";
  if (value === null || value === undefined) return "N/A";

  const arrow = status === "higher" ? " ↑" : status === "lower" ? " ↓" : "";
  if (key === "jerseyNumber") return `#${value}${arrow}`;
  return `${value}${arrow}`;
}

export default function GuessCard({ player, answer, mode }) {
  const result = compareGuess(player, answer);
  const traits = getTraits(mode);
  const flag = FLAG_CODES[player.nationality] || player.nationality?.substring(0, 2).toLowerCase();

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={player.headshot}
          alt={player.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 bg-slate-800 shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_HEADSHOT;
          }}
        />
        <h3 className="text-2xl font-bold text-white tracking-wide">{player.name}</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {traits.map(({ key, label }, i) => (
          <div
            key={key}
            // Active mode has 7 tiles, so the last one stretches to fill its row
            className={`flex flex-col items-center justify-center p-2 rounded-xl text-center ${TILE_COLORS[result[key]]} ${
              i === traits.length - 1 && traits.length === 7 ? "col-span-2" : ""
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">{label}</span>
            <span className="flex items-center gap-1.5 text-sm sm:text-base font-extrabold">
              {key === "nationality" && flag && (
                <img src={`https://flagcdn.com/w40/${flag}.png`} alt="" className="w-5 h-3.5 rounded-sm object-cover" />
              )}
              {formatValue(key, player[key], result[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
