const FALLBACK_HEADSHOT = "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";

// Headshot + full details of a player, used to reveal the daily answer
export default function PlayerReveal({ player, theme }) {
  return (
    <div className="flex items-center gap-4 text-left">
      <img
        src={player.headshot}
        alt={player.name}
        className={`w-16 h-16 rounded-full object-cover border-2 ${theme.accentBorder} bg-slate-800 shrink-0`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_HEADSHOT;
        }}
      />
      <div>
        <div className="text-xl font-bold text-white">{player.name}</div>
        <div className="text-xs text-slate-300 leading-relaxed mt-1">
          #{player.jerseyNumber || "N/A"} • {player.position} • {player.nationality || "N/A"}
          <br />
          Drafted: {player.draftYear || "Undrafted"} ({player.draftTeam || "N/A"})
          <br />
          Team: {player.currentTeam}
          {player.division && ` (${player.division})`}
        </div>
      </div>
    </div>
  );
}
