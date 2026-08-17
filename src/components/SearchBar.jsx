"use client";

import { useState } from "react";

export default function SearchBar({ players, onSelect, disabled, filterStrict, setFilterStrict }) {
  const [search, setSearch] = useState("");

  const filteredPlayers = search
    ? players
        .filter((player) => {
          const matchesName = player.name.toLowerCase().includes(search.toLowerCase());
          return filterStrict ? matchesName && player.isHighlighted : matchesName;
        })
        .slice(0, 8)
    : [];

  return (
    <div className="relative w-full max-w-lg mx-auto mb-6">
      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          className="w-full px-5 py-3.5 pr-12 bg-slate-900/90 text-slate-100 placeholder-slate-400 border border-blue-900/60 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={disabled ? "Game finished!" : "Type a player name..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Strict Filter Toggle Option */}
      <div className="flex items-center justify-between px-2 mt-2 text-xs text-blue-200">
        <span className="opacity-80">Filter out wrong traits:</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterStrict}
            onChange={(e) => setFilterStrict(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
          />
          <span className="font-semibold">{filterStrict ? "Strict Filter ON" : "Show All"}</span>
        </label>
      </div>

      {/* Results Dropdown */}
      {!disabled && filteredPlayers.length > 0 && (
        <div className="absolute z-30 w-full mt-2 bg-slate-900 border border-blue-900/60 rounded-2xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800">
          {filteredPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => {
                onSelect(player);
                setSearch("");
              }}
              className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                player.isHighlighted
                  ? "bg-blue-950/70 hover:bg-blue-900/80 text-white border-l-4 border-blue-400"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={player.headshot}
                  alt=""
                  className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";
                  }}
                />
                <span className="font-medium">{player.name}</span>
              </div>
              {player.isHighlighted && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-semibold">
                  Fits Clues
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}