"use client";

import { useState } from "react";

const FALLBACK_HEADSHOT = "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";

export default function SearchBar({ players, onSelect, disabled, hasClues, filterStrict, setFilterStrict, theme }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const query = search.trim().toLowerCase();

  const possibleCount = players.filter((p) => p.isHighlighted).length;

  // Players whose name matches (everyone when the box is empty), with ones
  // that fit the clues listed first
  const nameMatches = players
    .filter((player) => player.name.toLowerCase().includes(query))
    .sort((a, b) => (hasClues && b.isHighlighted - a.isHighlighted) || (query ? 0 : a.name.localeCompare(b.name)));
  const visible = filterStrict ? nameMatches.filter((p) => p.isHighlighted) : nameMatches;
  const hiddenCount = nameMatches.length - visible.length;

  let filterHint;
  if (!hasClues) {
    filterHint = filterStrict
      ? "After your first guess, only players who fit your clues will show up"
      : "Turn on to hide players who can't be the answer";
  } else if (filterStrict) {
    filterHint = `Hiding players who don't fit your clues · ${possibleCount} possible`;
  } else {
    filterHint = `${possibleCount} players still fit your clues · turn on to hide the rest`;
  }

  return (
    <div className="relative w-full max-w-lg mx-auto mb-6">
      {/* Search Input Box */}
      <input
        type="text"
        disabled={disabled}
        className={`w-full px-5 py-3.5 ${theme.panel} text-slate-100 placeholder-slate-400 border ${theme.border} rounded-full shadow-inner focus:outline-none focus:ring-2 ${theme.ring} text-base disabled:opacity-50 disabled:cursor-not-allowed`}
        placeholder={disabled ? "Game finished!" : "Type a player name..."}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
      />

      {/* Results Dropdown */}
      {!disabled && isOpen && (
        <div
          // Keep focus in the input so clicking a player doesn't close the list first
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute z-30 w-full mt-2 bg-slate-900 border ${theme.border} rounded-2xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800`}
        >
          {visible.slice(0, 50).map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onSelect(player);
                setSearch("");
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                hasClues && player.isHighlighted
                  ? theme.highlightRow
                  : `bg-slate-900 hover:bg-slate-800 ${hasClues ? "text-slate-500" : "text-slate-300"}`
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={player.headshot}
                  alt=""
                  className={`w-8 h-8 rounded-full bg-slate-800 object-cover ${hasClues && !player.isHighlighted ? "opacity-50" : ""}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_HEADSHOT;
                  }}
                />
                <span className="font-medium">{player.name}</span>
              </div>
              {hasClues && player.isHighlighted && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${theme.badge}`}>Fits Clues</span>
              )}
            </button>
          ))}

          {visible.length === 0 && (
            <div className="px-4 py-4 text-sm text-slate-400 text-center">
              {hiddenCount > 0 ? (
                <>
                  No players named &ldquo;{search.trim()}&rdquo; fit your clues.{" "}
                  <button onClick={() => setFilterStrict(false)} className="underline font-semibold text-white">
                    Show them anyway
                  </button>
                </>
              ) : (
                "No players found"
              )}
            </div>
          )}

          {visible.length > 0 && hiddenCount > 0 && (
            <div className="px-4 py-2 text-xs text-slate-500 text-center">
              Smart Filter hid {hiddenCount} player{hiddenCount === 1 ? "" : "s"} that can&apos;t be the answer
            </div>
          )}
        </div>
      )}

      {/* Smart Filter toggle */}
      {!disabled && (
        <button
          type="button"
          role="switch"
          aria-checked={filterStrict}
          onClick={() => setFilterStrict(!filterStrict)}
          className={`w-full mt-3 flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${theme.border} ${theme.panel} text-left hover:bg-white/5 transition-colors`}
        >
          <span
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
              filterStrict ? theme.switchOn : "bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                filterStrict ? "translate-x-4" : ""
              }`}
            />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-bold text-white">
              Smart Filter <span className="opacity-70">{filterStrict ? "ON" : "OFF"}</span>
            </span>
            <span className={`block text-xs ${theme.mutedText}`}>{filterHint}</span>
          </span>
        </button>
      )}
    </div>
  );
}
