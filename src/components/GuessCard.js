import CompareGuess from "../lib/CompareGuess";

export default function GuessCard({ player, answer }) {
    const result = CompareGuess(player, answer);

    // Dynamic Tailwind background for Wordle feedback
    const getTileStyle = (status) => {
        if (status === "correct") {
            return "bg-emerald-600 text-white";
        }
        if (status === "higher" || status === "lower") {
            return "bg-amber-600 text-white";
        }
        return "bg-slate-700 text-slate-200";
    };

    const renderNumberText = (value, status) => {
        if (value === null || value === undefined) return "N/A";
        if (status === "higher") return `${value} ↑`;
        if (status === "lower") return `${value} ↓`;
        return value;
    };

    // Flag icon URL using standard ISO-2 codes (fallback to text if unavailable)
    const getFlagUrl = (countryCode) => {
        if (!countryCode || countryCode === "N/A") return null;
        // Map 3-letter IOC codes to 2-letter ISO codes for flag CDN
        const isoMap = { CAN: "ca", USA: "us", SWE: "se", FIN: "fi", RUS: "ru", CZE: "cz", SVK: "sk", DEU: "de", CHE: "ch", AUT: "at", DNK: "dk", LVA: "lv", SVN: "si", FRA: "fr" };
        const code = isoMap[countryCode] || countryCode.substring(0, 2).toLowerCase();
        return `https://flagcdn.com/w40/${code}.png`;
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl backdrop-blur-sm">
            {/* Player Header with Headshot Avatar */}
            <div className="flex items-center gap-4 mb-4">
            <img
                src={player.headshot}
                alt={player.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 bg-slate-800 shadow-md"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";
                }}
            />
                <h3 className="text-2xl font-bold text-white tracking-wide">
                    {player.name}
                </h3>
            </div>

            {/* Grid of Attribute Tiles */}
            <div className="grid grid-cols-3 gap-3">
                {/* Position */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.position)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Pos</span>
                    <span className="text-lg font-extrabold">{player.position}</span>
                </div>

                {/* Draft Team */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.draftTeam)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Draft Team</span>
                    <span className="text-lg font-extrabold">{player.draftTeam}</span>
                </div>

                {/* Draft Year */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.draftYear)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Draft Yr</span>
                    <span className="text-lg font-extrabold">{renderNumberText(player.draftYear, result.draftYear)}</span>
                </div>

                {/* Current Team */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.currentTeam)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Current Team</span>
                    <span className="text-lg font-extrabold">{player.currentTeam}</span>
                </div>

                {/* Status */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.isActive)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Status</span>
                    <span className="text-lg font-extrabold">{player.isActive ? "Active" : "Retired"}</span>
                </div>

                {/* Jersey Number */}
                <div className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.number)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Number</span>
                    <span className="text-lg font-extrabold">#{renderNumberText(player.jerseyNumber, result.number)}</span>
                </div>

                {/* Nationality (Centered on bottom row if 7 items) */}
                <div className={`col-span-3 flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${getTileStyle(result.nationality)}`}>
                    <span className="text-xs uppercase tracking-wider opacity-80 mb-0.5">Nation</span>
                    <div className="flex items-center gap-2">
                        {getFlagUrl(player.nationality) && (
                            <img
                                src={getFlagUrl(player.nationality)}
                                alt={player.nationality}
                                className="w-5 h-3.5 rounded-sm object-cover"
                            />
                        )}
                        <span className="text-lg font-extrabold">{player.nationality}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}