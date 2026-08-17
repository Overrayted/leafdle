"use client";

import { useState } from "react";

export default function SearchBar({ players, onSelect }) {
    const [search, setSearch] = useState("");

    const filteredPlayers = search
        ? players
              .filter((player) =>
                  player.name.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 8)
        : [];

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <div className="relative">
                <input
                    type="text"
                    className="w-full px-5 py-3.5 pr-12 bg-slate-800/90 text-slate-100 placeholder-slate-400 border border-slate-700/80 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                    placeholder="Type a guess here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                    className="absolute right-4 top-4 h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Dropdown Results */}
            {filteredPlayers.length > 0 && (
                <div className="absolute z-30 w-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-800">
                    {filteredPlayers.map((player) => (
                        <button
                            key={player.id}
                            onClick={() => {
                                onSelect(player);
                                setSearch("");
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-150 ${
                                player.isHighlighted
                                    ? "bg-emerald-950/60 hover:bg-emerald-900/80 text-white border-l-4 border-emerald-500"
                                    : "bg-slate-900 hover:bg-slate-800 text-slate-200"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                            <img
                                src={player.headshot}
                                alt={player.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 bg-slate-800 shadow-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://assets.nhle.com/mrtc/images/player/headshots/current/160x160/skater.png";
                                }}
                            />
                                <span className="font-medium text-base">{player.name}</span>
                            </div>

                            {player.isHighlighted && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600 text-white font-semibold shadow-sm">
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